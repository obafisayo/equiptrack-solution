using System.Net.Mail;

namespace EquipTrack.Api.Leads;

public sealed record NewsletterRequest(string? Email);

public sealed record WaitlistRequest(
    string? CompanyName,
    string? Industry,
    string? Country,
    string? CompanySize,
    string? Website,
    string? ContactName,
    string? ContactEmail,
    string? ContactPhone,
    string? JobTitle,
    List<string>? UseCases,
    string? AdditionalInfo);

internal static class LeadValidation
{
    public const int ShortMax = 200;
    public const int LongMax = 4000;
    public const int MaxUseCases = 20;

    public static Dictionary<string, string[]> Validate(NewsletterRequest r)
    {
        var errors = new Dictionary<string, string[]>();
        ValidateEmail(errors, "email", r.Email);
        return errors;
    }

    public static Dictionary<string, string[]> Validate(WaitlistRequest r)
    {
        var errors = new Dictionary<string, string[]>();
        Required(errors, "companyName", r.CompanyName);
        Required(errors, "industry", r.Industry);
        Required(errors, "country", r.Country);
        Required(errors, "companySize", r.CompanySize);
        Required(errors, "contactName", r.ContactName);
        ValidateEmail(errors, "contactEmail", r.ContactEmail);

        Optional(errors, "website", r.Website);
        Optional(errors, "contactPhone", r.ContactPhone);
        Optional(errors, "jobTitle", r.JobTitle);

        if (r.AdditionalInfo is { Length: > LongMax })
            errors["additionalInfo"] = [$"Must be at most {LongMax} characters."];

        if (r.UseCases is null || r.UseCases.Count == 0)
            errors["useCases"] = ["Select at least one use case."];
        else if (r.UseCases.Count > MaxUseCases || r.UseCases.Any(u => string.IsNullOrWhiteSpace(u) || u.Length > ShortMax))
            errors["useCases"] = ["Invalid use cases."];

        return errors;
    }

    public static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    public static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static void Required(Dictionary<string, string[]> errors, string field, string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            errors[field] = ["Required."];
        else if (value.Length > ShortMax)
            errors[field] = [$"Must be at most {ShortMax} characters."];
    }

    private static void Optional(Dictionary<string, string[]> errors, string field, string? value)
    {
        if (value is { Length: > ShortMax })
            errors[field] = [$"Must be at most {ShortMax} characters."];
    }

    private static void ValidateEmail(Dictionary<string, string[]> errors, string field, string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors[field] = ["Required."];
            return;
        }

        var trimmed = value.Trim();
        if (trimmed.Length > 254 || !MailAddress.TryCreate(trimmed, out var parsed) || parsed.Address != trimmed
            || !parsed.Host.Contains('.'))
        {
            errors[field] = ["Enter a valid email address."];
        }
    }
}
