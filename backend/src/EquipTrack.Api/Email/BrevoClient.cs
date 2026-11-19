using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace EquipTrack.Api.Email;

public sealed record BrevoContact(string Email, IReadOnlyDictionary<string, string> Attributes, long ListId);

public sealed record BrevoEmail(string ToEmail, string? ToName, string Subject, string HtmlContent, string TextContent);

public interface IBrevoClient
{
    /// <summary>Creates or updates a contact and adds it to a list.</summary>
    Task UpsertContactAsync(BrevoContact contact, CancellationToken ct);

    /// <summary>Sends a transactional email.</summary>
    Task SendEmailAsync(BrevoEmail email, CancellationToken ct);
}

public sealed class BrevoException(string message, HttpStatusCode? status = null) : Exception(message)
{
    public HttpStatusCode? Status { get; } = status;
}

/// <summary>Thin typed client over the Brevo v3 REST API.</summary>
public sealed class BrevoClient(HttpClient http, IOptions<BrevoOptions> options) : IBrevoClient
{
    private readonly BrevoOptions _options = options.Value;

    public async Task UpsertContactAsync(BrevoContact contact, CancellationToken ct)
    {
        var body = new CreateContactBody
        {
            Email = contact.Email,
            Attributes = contact.Attributes.Count > 0 ? contact.Attributes : null,
            ListIds = contact.ListId > 0 ? [contact.ListId] : null,
            UpdateEnabled = true,
        };

        using var response = await http.PostAsJsonAsync("contacts", body, ct);
        // 201 Created (new) or 204 No Content (updated, because updateEnabled=true).
        if (response.IsSuccessStatusCode) return;
        throw await ToExceptionAsync("create contact", response, ct);
    }

    public async Task SendEmailAsync(BrevoEmail email, CancellationToken ct)
    {
        var body = new SendEmailBody
        {
            Sender = new Party { Email = _options.SenderEmail, Name = _options.SenderName },
            To = [new Party { Email = email.ToEmail, Name = email.ToName }],
            Subject = email.Subject,
            HtmlContent = email.HtmlContent,
            TextContent = email.TextContent,
        };

        using var response = await http.PostAsJsonAsync("smtp/email", body, ct);
        if (response.IsSuccessStatusCode) return;
        throw await ToExceptionAsync("send email", response, ct);
    }

    private static async Task<BrevoException> ToExceptionAsync(string action, HttpResponseMessage response, CancellationToken ct)
    {
        var detail = await response.Content.ReadAsStringAsync(ct);
        if (detail.Length > 500) detail = detail[..500];
        return new BrevoException($"Brevo {action} failed ({(int)response.StatusCode}): {detail}", response.StatusCode);
    }

    private sealed class CreateContactBody
    {
        [JsonPropertyName("email")] public required string Email { get; init; }

        [JsonPropertyName("attributes")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public IReadOnlyDictionary<string, string>? Attributes { get; init; }

        [JsonPropertyName("listIds")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public long[]? ListIds { get; init; }

        [JsonPropertyName("updateEnabled")] public bool UpdateEnabled { get; init; }
    }

    private sealed class SendEmailBody
    {
        [JsonPropertyName("sender")] public required Party Sender { get; init; }
        [JsonPropertyName("to")] public required Party[] To { get; init; }
        [JsonPropertyName("subject")] public required string Subject { get; init; }
        [JsonPropertyName("htmlContent")] public required string HtmlContent { get; init; }
        [JsonPropertyName("textContent")] public required string TextContent { get; init; }
    }

    private sealed class Party
    {
        [JsonPropertyName("email")] public required string Email { get; init; }

        [JsonPropertyName("name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Name { get; init; }
    }
}
