using EquipTrack.Api.Email;
using Microsoft.Extensions.Options;

namespace EquipTrack.Api.Leads;

/// <summary>Background loop that drains the lead outbox into Brevo.</summary>
public sealed class LeadSyncWorker(
    IServiceScopeFactory scopes,
    IOptions<BrevoOptions> brevoOptions,
    IOptions<LeadSyncOptions> syncOptions,
    ILogger<LeadSyncWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!brevoOptions.Value.IsConfigured)
        {
            logger.LogWarning("Brevo is not configured (Brevo:ApiKey / Brevo:SenderEmail). " +
                              "Leads are stored but will not be synced or emailed until it is.");
            return;
        }

        var interval = TimeSpan.FromSeconds(Math.Max(1, syncOptions.Value.PollIntervalSeconds));
        using var timer = new PeriodicTimer(interval);

        do
        {
            try
            {
                using var scope = scopes.CreateScope();
                var processor = scope.ServiceProvider.GetRequiredService<LeadSyncProcessor>();
                // Keep draining while full batches come back.
                while (await processor.ProcessBatchAsync(stoppingToken) >= syncOptions.Value.BatchSize) { }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Lead sync batch failed");
            }
        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}
