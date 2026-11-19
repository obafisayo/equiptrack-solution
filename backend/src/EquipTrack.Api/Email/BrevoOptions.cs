namespace EquipTrack.Api.Email;

/// <summary>
/// Brevo (formerly Sendinblue) configuration. Bound from the "Brevo" section.
/// Set secrets via environment variables, e.g. <c>Brevo__ApiKey</c>, never in appsettings.json.
/// </summary>
public sealed class BrevoOptions
{
    public const string SectionName = "Brevo";

    /// <summary>Brevo v3 API key. When empty, Brevo sync is disabled and leads stay Pending.</summary>
    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://api.brevo.com/v3/";

    /// <summary>Verified sender address in Brevo.</summary>
    public string SenderEmail { get; set; } = string.Empty;
    public string SenderName { get; set; } = "EquipTrack";

    /// <summary>Internal inbox notified about every new waitlist application.</summary>
    public string TeamNotificationEmail { get; set; } = string.Empty;

    /// <summary>Brevo contact list IDs. 0 = do not add to a list.</summary>
    public long WaitlistListId { get; set; }
    public long NewsletterListId { get; set; }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(ApiKey) && !string.IsNullOrWhiteSpace(SenderEmail);
}

/// <summary>Retry policy for the lead → Brevo sync worker.</summary>
public sealed class LeadSyncOptions
{
    public const string SectionName = "LeadSync";

    public int PollIntervalSeconds { get; set; } = 15;
    public int BatchSize { get; set; } = 20;
    public int MaxAttempts { get; set; } = 8;
    /// <summary>Base delay for exponential backoff (attempt n waits base * 2^(n-1)).</summary>
    public int BaseBackoffSeconds { get; set; } = 30;
    public int MaxBackoffSeconds { get; set; } = 3600;
}
