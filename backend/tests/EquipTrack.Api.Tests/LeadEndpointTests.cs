using System.Net;
using System.Net.Http.Json;
using EquipTrack.Api.Leads;
using Microsoft.EntityFrameworkCore;

namespace EquipTrack.Api.Tests;

public sealed class LeadEndpointTests : IClassFixture<ApiFactory>
{
    private readonly ApiFactory _factory;

    public LeadEndpointTests(ApiFactory factory) => _factory = factory;

    private static object ValidWaitlist(string email) => new
    {
        companyName = "Acme Energy Ltd",
        industry = "Oil & Gas",
        country = "Nigeria",
        companySize = "51–200",
        contactName = "Ada Obi",
        contactEmail = email,
        useCases = new[] { "Equipment lifecycle tracking" },
    };

    [Fact]
    public async Task Waitlist_valid_submission_is_persisted_as_pending()
    {
        var client = _factory.CreateClient();
        var email = $"ada-{Guid.NewGuid():N}@acme.example";

        var response = await client.PostAsJsonAsync("/api/leads/waitlist", ValidWaitlist(email.ToUpperInvariant()));

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var lead = await _factory.WithDbAsync(db => db.Leads.SingleAsync(l => l.Email == email));
        Assert.Equal(LeadKind.Waitlist, lead.Kind);
        Assert.Equal(LeadSyncStatus.Pending, lead.SyncStatus);
        Assert.Equal("Acme Energy Ltd", lead.CompanyName);
        Assert.Equal(["Equipment lifecycle tracking"], lead.UseCases);
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("")]
    [InlineData("a@localhost")]
    public async Task Waitlist_rejects_invalid_email(string email)
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/leads/waitlist", ValidWaitlist(email));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Waitlist_rejects_missing_required_fields()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/leads/waitlist", new { contactEmail = "x@acme.example" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("companyName", body);
        Assert.Contains("useCases", body);
    }

    [Fact]
    public async Task Newsletter_is_idempotent_per_address()
    {
        var client = _factory.CreateClient();
        var email = $"news-{Guid.NewGuid():N}@acme.example";

        var first = await client.PostAsJsonAsync("/api/leads/newsletter", new { email });
        var second = await client.PostAsJsonAsync("/api/leads/newsletter", new { email = $"  {email.ToUpperInvariant()} " });

        Assert.Equal(HttpStatusCode.Accepted, first.StatusCode);
        Assert.Equal(HttpStatusCode.Accepted, second.StatusCode);
        var count = await _factory.WithDbAsync(db => db.Leads.CountAsync(l => l.Email == email && l.Kind == LeadKind.Newsletter));
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task Health_endpoint_responds()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
