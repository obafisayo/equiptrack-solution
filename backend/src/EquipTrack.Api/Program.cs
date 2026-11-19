using System.Threading.RateLimiting;
using EquipTrack.Api.Data;
using EquipTrack.Api.Email;
using EquipTrack.Api.Leads;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// ── Configuration ──────────────────────────────────────────────────────────
builder.Services.AddOptions<BrevoOptions>().Bind(builder.Configuration.GetSection(BrevoOptions.SectionName));
builder.Services.AddOptions<LeadSyncOptions>().Bind(builder.Configuration.GetSection(LeadSyncOptions.SectionName));
builder.Services.AddSingleton(TimeProvider.System);

// ── Persistence ────────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")
                      ?? throw new InvalidOperationException("ConnectionStrings:Default is not configured.")));

builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>("database");

// ── Brevo (email + contact lists) ──────────────────────────────────────────
builder.Services.AddHttpClient<IBrevoClient, BrevoClient>((sp, http) =>
{
    var brevo = sp.GetRequiredService<IOptions<BrevoOptions>>().Value;
    http.BaseAddress = new Uri(brevo.BaseUrl.EndsWith('/') ? brevo.BaseUrl : brevo.BaseUrl + "/");
    http.Timeout = TimeSpan.FromSeconds(15);
    http.DefaultRequestHeaders.Add("api-key", brevo.ApiKey);
    http.DefaultRequestHeaders.Add("accept", "application/json");
});
builder.Services.AddScoped<LeadSyncProcessor>();
builder.Services.AddHostedService<LeadSyncWorker>();

// ── HTTP concerns ──────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins(allowedOrigins).WithMethods("POST", "GET").WithHeaders("Content-Type")));

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    var permitLimit = builder.Configuration.GetValue("RateLimiting:LeadsPerMinute", 10);
    options.AddPolicy(LeadEndpoints.RateLimitPolicy, http =>
        RateLimitPartition.GetFixedWindowLimiter(
            http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = permitLimit,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
            }));
});

builder.Services.AddProblemDetails();

var app = builder.Build();

if (app.Configuration.GetValue("Database:MigrateOnStartup", false))
{
    using var scope = app.Services.CreateScope();
    await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
}

app.UseExceptionHandler();
app.UseCors();
app.UseRateLimiter();

app.MapHealthChecks("/health");
app.MapLeadEndpoints();

app.Run();

/// <summary>Exposed for WebApplicationFactory in integration tests.</summary>
public partial class Program;
