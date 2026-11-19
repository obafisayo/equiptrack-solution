namespace EquipTrack.Api.Leads;

public enum LeadKind
{
    Waitlist = 0,
    Newsletter = 1,
}

public enum LeadSyncStatus
{
    /// <summary>Stored; Brevo sync not yet complete (will be retried).</summary>
    Pending = 0,
    /// <summary>All Brevo steps completed.</summary>
    Synced = 1,
    /// <summary>Gave up after the maximum number of attempts. Needs manual attention.</summary>
    Failed = 2,
}

/// <summary>
/// A captured lead. Persisted BEFORE any third-party call so a Brevo outage
/// never loses a prospect. The Brevo steps are tracked individually so a retry
/// never re-sends an email that already went out.
/// </summary>
public class Lead
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public LeadKind Kind { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public required string Email { get; set; }

    // Waitlist-only details (null for newsletter sign-ups).
    public string? ContactName { get; set; }
    public string? ContactPhone { get; set; }
    public string? JobTitle { get; set; }
    public string? CompanyName { get; set; }
    public string? Industry { get; set; }
    public string? Country { get; set; }
    public string? CompanySize { get; set; }
    public string? Website { get; set; }
    public List<string> UseCases { get; set; } = [];
    public string? AdditionalInfo { get; set; }

    // Brevo sync state (outbox pattern).
    public LeadSyncStatus SyncStatus { get; set; } = LeadSyncStatus.Pending;
    public bool ContactSynced { get; set; }
    public bool ConfirmationSent { get; set; }
    public bool TeamNotified { get; set; }
    public int SyncAttempts { get; set; }
    public DateTimeOffset? NextSyncAttemptAt { get; set; }
    public string? LastSyncError { get; set; }
    public DateTimeOffset? SyncedAt { get; set; }
}
