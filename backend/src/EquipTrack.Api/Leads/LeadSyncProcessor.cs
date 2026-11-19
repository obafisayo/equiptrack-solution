using EquipTrack.Api.Data;
using EquipTrack.Api.Email;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace EquipTrack.Api.Leads;

/// <summary>
/// Pushes pending leads to Brevo. Each step (contact, confirmation email, team
/// notification) is recorded as it succeeds, so a retry only repeats the steps
/// that failed — nobody receives a duplicate email.
/// </summary>
public sealed class LeadSyncProcessor(
    AppDbContext db,
    IBrevoClient brevo,
    IOptions<BrevoOptions> brevoOptions,
    IOptions<LeadSyncOptions> syncOptions,
    TimeProvider clock,
    ILogger<LeadSyncProcessor> logger)
{
    private readonly BrevoOptions _brevo = brevoOptions.Value;
    private readonly LeadSyncOptions _sync = syncOptions.Value;

    /// <returns>Number of leads processed in this batch.</returns>
    public async Task<int> ProcessBatchAsync(CancellationToken ct)
    {
        var now = clock.GetUtcNow();

        var leads = await db.Leads
            .Where(l => l.SyncStatus == LeadSyncStatus.Pending
                        && (l.NextSyncAttemptAt == null || l.NextSyncAttemptAt <= now))
            .OrderBy(l => l.CreatedAt)
            .Take(_sync.BatchSize)
            .ToListAsync(ct);

        foreach (var lead in leads)
        {
            await SyncOneAsync(lead, ct);
            await db.SaveChangesAsync(ct);
        }

        return leads.Count;
    }

    private async Task SyncOneAsync(Lead lead, CancellationToken ct)
    {
        lead.SyncAttempts++;
        try
        {
            if (!lead.ContactSynced)
            {
                var listId = lead.Kind == LeadKind.Waitlist ? _brevo.WaitlistListId : _brevo.NewsletterListId;
                await brevo.UpsertContactAsync(new BrevoContact(lead.Email, ContactAttributes(lead), listId), ct);
                lead.ContactSynced = true;
            }

            if (!lead.ConfirmationSent)
            {
                var email = lead.Kind == LeadKind.Waitlist
                    ? LeadEmails.WaitlistConfirmation(lead)
                    : LeadEmails.NewsletterConfirmation(lead);
                await brevo.SendEmailAsync(email, ct);
                lead.ConfirmationSent = true;
            }

            if (!lead.TeamNotified)
            {
                if (lead.Kind == LeadKind.Waitlist && !string.IsNullOrWhiteSpace(_brevo.TeamNotificationEmail))
                    await brevo.SendEmailAsync(LeadEmails.TeamNotification(lead, _brevo.TeamNotificationEmail), ct);
                lead.TeamNotified = true;
            }

            lead.SyncStatus = LeadSyncStatus.Synced;
            lead.SyncedAt = clock.GetUtcNow();
            lead.NextSyncAttemptAt = null;
            lead.LastSyncError = null;
        }
        catch (Exception ex) when (ex is not OperationCanceledException || !ct.IsCancellationRequested)
        {
            lead.LastSyncError = ex.Message.Length > 2000 ? ex.Message[..2000] : ex.Message;

            if (lead.SyncAttempts >= _sync.MaxAttempts)
            {
                lead.SyncStatus = LeadSyncStatus.Failed;
                lead.NextSyncAttemptAt = null;
                logger.LogError(ex, "Lead {LeadId} failed Brevo sync permanently after {Attempts} attempts", lead.Id, lead.SyncAttempts);
            }
            else
            {
                lead.NextSyncAttemptAt = clock.GetUtcNow() + Backoff(lead.SyncAttempts);
                logger.LogWarning(ex, "Lead {LeadId} Brevo sync attempt {Attempt} failed; retrying at {NextAttempt}",
                    lead.Id, lead.SyncAttempts, lead.NextSyncAttemptAt);
            }
        }
    }

    internal TimeSpan Backoff(int attempt)
    {
        var seconds = _sync.BaseBackoffSeconds * Math.Pow(2, Math.Max(0, attempt - 1));
        return TimeSpan.FromSeconds(Math.Min(seconds, _sync.MaxBackoffSeconds));
    }

    private static Dictionary<string, string> ContactAttributes(Lead lead)
    {
        // FIRSTNAME / LASTNAME are Brevo's built-in attributes, so they always exist.
        var attrs = new Dictionary<string, string>();
        if (!string.IsNullOrWhiteSpace(lead.ContactName))
        {
            var parts = lead.ContactName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            attrs["FIRSTNAME"] = parts[0];
            if (parts.Length > 1) attrs["LASTNAME"] = parts[1];
        }
        return attrs;
    }
}
