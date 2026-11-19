using System.Collections.Concurrent;
using EquipTrack.Api.Data;
using EquipTrack.Api.Email;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

namespace EquipTrack.Api.Tests;

/// <summary>Records Brevo calls; can be told to fail the next N calls.</summary>
public sealed class FakeBrevoClient : IBrevoClient
{
    public ConcurrentQueue<BrevoContact> Contacts { get; } = new();
    public ConcurrentQueue<BrevoEmail> Emails { get; } = new();
    public int FailNextCalls { get; set; }

    public Task UpsertContactAsync(BrevoContact contact, CancellationToken ct)
    {
        MaybeFail();
        Contacts.Enqueue(contact);
        return Task.CompletedTask;
    }

    public Task SendEmailAsync(BrevoEmail email, CancellationToken ct)
    {
        MaybeFail();
        Emails.Enqueue(email);
        return Task.CompletedTask;
    }

    private void MaybeFail()
    {
        if (FailNextCalls <= 0) return;
        FailNextCalls--;
        throw new BrevoException("simulated Brevo outage");
    }
}

public sealed class ApiFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"equiptrack-tests-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:Default", "Host=unused");
        builder.UseSetting("Database:MigrateOnStartup", "false");
        builder.UseSetting("RateLimiting:LeadsPerMinute", "1000");
        builder.UseSetting("Brevo:ApiKey", "");

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<AppDbContext>>();
            services.RemoveAll<DbContextOptions>();
            services.AddDbContext<AppDbContext>(o => o.UseInMemoryDatabase(_dbName));

            // The worker is exercised directly through LeadSyncProcessor in tests.
            services.RemoveAll<IHostedService>();
        });
    }

    public async Task<T> WithDbAsync<T>(Func<AppDbContext, Task<T>> action)
    {
        using var scope = Services.CreateScope();
        return await action(scope.ServiceProvider.GetRequiredService<AppDbContext>());
    }
}
