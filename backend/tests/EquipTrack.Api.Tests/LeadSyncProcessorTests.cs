using EquipTrack.Api.Data;
using EquipTrack.Api.Email;
using EquipTrack.Api.Leads;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Time.Testing;

namespace EquipTrack.Api.Tests;

public sealed class LeadSyncProcessorTests
{
    private readonly FakeTimeProvider _clock = new(new DateTimeOffset(2026, 11, 19, 9, 0, 0, TimeSpan.Zero));
    private readonly FakeBrevoClient _brevo = new();
    private readonly AppDbContext _db = new(new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase($"sync-{Guid.NewGuid()}").Options);

    private readonly BrevoOptions _brevoOptions = new()
    {
        ApiKey = "test",
        SenderEmail = "hello@equiptrack.example",
        TeamNotificationEmail = "sales@equiptrack.example",
        WaitlistListId = 3,
        NewsletterListId = 4,
    };

    private readonly LeadSyncOptions _syncOptions = new() { MaxAttempts = 3, BaseBackoffSeconds = 30, MaxBackoffSeconds = 600 };

    private LeadSyncProcessor CreateProcessor() => new(
        _db, _brevo, Options.Create(_brevoOptions), Options.Create(_syncOptions), _clock,
        NullLogger<LeadSyncProcessor>.Instance);

    private Lead AddWaitlistLead()
    {
        var lead = new Lead
        {
            Kind = LeadKind.Waitlist,
            CreatedAt = _clock.GetUtcNow(),
            Email = "ada@acme.example",
            ContactName = "Ada Obi",
            CompanyName = "Acme <Energy>",
            UseCases = ["Equipment lifecycle tracking"],
        };
        _db.Leads.Add(lead);
        _db.SaveChanges();
        return lead;
    }

    [Fact]
    public async Task Waitlist_lead_syncs_contact_and_sends_both_emails()
    {
        var lead = AddWaitlistLead();

        await CreateProcessor().ProcessBatchAsync(CancellationToken.None);

        Assert.Equal(LeadSyncStatus.Synced, lead.SyncStatus);
        var contact = Assert.Single(_brevo.Contacts);
        Assert.Equal(3, contact.ListId);
        Assert.Equal("Ada", contact.Attributes["FIRSTNAME"]);
        Assert.Equal("Obi", contact.Attributes["LASTNAME"]);

        Assert.Equal(2, _brevo.Emails.Count);
        Assert.Contains(_brevo.Emails, e => e.ToEmail == "ada@acme.example");
        var team = Assert.Single(_brevo.Emails, e => e.ToEmail == "sales@equiptrack.example");
        Assert.Contains("Acme &lt;Energy&gt;", team.HtmlContent); // HTML-encoded
    }

    [Fact]
    public async Task Newsletter_lead_goes_to_newsletter_list_without_team_email()
    {
        var lead = new Lead { Kind = LeadKind.Newsletter, CreatedAt = _clock.GetUtcNow(), Email = "n@acme.example" };
        _db.Leads.Add(lead);
        await _db.SaveChangesAsync();

        await CreateProcessor().ProcessBatchAsync(CancellationToken.None);

        Assert.Equal(LeadSyncStatus.Synced, lead.SyncStatus);
        Assert.Equal(4, Assert.Single(_brevo.Contacts).ListId);
        Assert.Equal("n@acme.example", Assert.Single(_brevo.Emails).ToEmail);
    }

    [Fact]
    public async Task Failure_schedules_retry_and_does_not_resend_completed_steps()
    {
        var lead = AddWaitlistLead();

        // First run: contact upsert succeeds, confirmation email fails.
        var flaky = new LeadSyncProcessor(_db, new SecondCallFailsBrevo(_brevo), Options.Create(_brevoOptions),
            Options.Create(_syncOptions), _clock, NullLogger<LeadSyncProcessor>.Instance);
        await flaky.ProcessBatchAsync(CancellationToken.None);

        Assert.Equal(LeadSyncStatus.Pending, lead.SyncStatus);
        Assert.True(lead.ContactSynced);
        Assert.False(lead.ConfirmationSent);
        Assert.Equal(_clock.GetUtcNow().AddSeconds(30), lead.NextSyncAttemptAt);

        var processor = CreateProcessor();

        // Not due yet → untouched.
        Assert.Equal(0, await processor.ProcessBatchAsync(CancellationToken.None));

        _clock.Advance(TimeSpan.FromSeconds(31));
        await processor.ProcessBatchAsync(CancellationToken.None);

        Assert.Equal(LeadSyncStatus.Synced, lead.SyncStatus);
        Assert.Single(_brevo.Contacts);        // contact not re-created
        Assert.Equal(2, _brevo.Emails.Count);  // each email exactly once
    }

    [Fact]
    public async Task Gives_up_after_max_attempts()
    {
        var lead = AddWaitlistLead();
        var processor = CreateProcessor();
        _brevo.FailNextCalls = int.MaxValue;

        for (var i = 0; i < _syncOptions.MaxAttempts; i++)
        {
            await processor.ProcessBatchAsync(CancellationToken.None);
            _clock.Advance(TimeSpan.FromHours(2));
        }

        Assert.Equal(LeadSyncStatus.Failed, lead.SyncStatus);
        Assert.Equal(_syncOptions.MaxAttempts, lead.SyncAttempts);
        Assert.NotNull(lead.LastSyncError);
        Assert.Null(lead.NextSyncAttemptAt);
    }

    [Fact]
    public void Backoff_is_exponential_and_capped()
    {
        var processor = CreateProcessor();
        Assert.Equal(TimeSpan.FromSeconds(30), processor.Backoff(1));
        Assert.Equal(TimeSpan.FromSeconds(60), processor.Backoff(2));
        Assert.Equal(TimeSpan.FromSeconds(120), processor.Backoff(3));
        Assert.Equal(TimeSpan.FromSeconds(600), processor.Backoff(20));
    }

    private sealed class SecondCallFailsBrevo(FakeBrevoClient inner) : IBrevoClient
    {
        private int _calls;

        public Task UpsertContactAsync(BrevoContact contact, CancellationToken ct) =>
            ++_calls == 2 ? throw new BrevoException("boom") : inner.UpsertContactAsync(contact, ct);

        public Task SendEmailAsync(BrevoEmail email, CancellationToken ct) =>
            ++_calls == 2 ? throw new BrevoException("boom") : inner.SendEmailAsync(email, ct);
    }
}
