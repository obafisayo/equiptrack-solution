using System.Net;
using EquipTrack.Api.Leads;

namespace EquipTrack.Api.Email;

/// <summary>Email content for lead capture. Plain, no emoji, named next steps.</summary>
internal static class LeadEmails
{
    public static BrevoEmail WaitlistConfirmation(Lead lead)
    {
        var name = lead.ContactName ?? "there";
        var company = lead.CompanyName ?? "your organisation";
        const string subject = "We have received your EquipTrack waitlist application";

        var text =
            $"Hi {name},\n\n" +
            $"Thank you for applying to EquipTrack on behalf of {company}.\n\n" +
            "What happens next:\n" +
            "1. Our team reviews your application.\n" +
            "2. We contact you to schedule an onboarding call.\n" +
            "3. Your organisation goes live on EquipTrack.\n\n" +
            "If you have any questions, reply to this email.\n\n" +
            "The EquipTrack team";

        var html =
            $"<p>Hi {E(name)},</p>" +
            $"<p>Thank you for applying to EquipTrack on behalf of <strong>{E(company)}</strong>.</p>" +
            "<p>What happens next:</p>" +
            "<ol><li>Our team reviews your application.</li>" +
            "<li>We contact you to schedule an onboarding call.</li>" +
            "<li>Your organisation goes live on EquipTrack.</li></ol>" +
            "<p>If you have any questions, reply to this email.</p>" +
            "<p>The EquipTrack team</p>";

        return new BrevoEmail(lead.Email, lead.ContactName, subject, html, text);
    }

    public static BrevoEmail NewsletterConfirmation(Lead lead)
    {
        const string subject = "You are subscribed to EquipTrack updates";
        const string text =
            "Thank you for subscribing to EquipTrack product updates.\n\n" +
            "You can unsubscribe at any time using the link in any of our emails.\n\n" +
            "The EquipTrack team";
        const string html =
            "<p>Thank you for subscribing to EquipTrack product updates.</p>" +
            "<p>You can unsubscribe at any time using the link in any of our emails.</p>" +
            "<p>The EquipTrack team</p>";
        return new BrevoEmail(lead.Email, null, subject, html, text);
    }

    public static BrevoEmail TeamNotification(Lead lead, string teamEmail)
    {
        var subject = $"New waitlist application: {lead.CompanyName}";
        var rows = new (string Label, string? Value)[]
        {
            ("Company", lead.CompanyName),
            ("Industry", lead.Industry),
            ("Country", lead.Country),
            ("Company size", lead.CompanySize),
            ("Website", lead.Website),
            ("Contact", lead.ContactName),
            ("Email", lead.Email),
            ("Phone", lead.ContactPhone),
            ("Job title", lead.JobTitle),
            ("Use cases", string.Join(", ", lead.UseCases)),
            ("Additional info", lead.AdditionalInfo),
            ("Submitted", lead.CreatedAt.ToString("u")),
            ("Lead ID", lead.Id.ToString()),
        };

        var text = string.Join("\n", rows.Select(r => $"{r.Label}: {r.Value ?? "-"}"));
        var html = "<table cellpadding=\"4\">" +
                   string.Concat(rows.Select(r => $"<tr><td><strong>{E(r.Label)}</strong></td><td>{E(r.Value ?? "-")}</td></tr>")) +
                   "</table>";

        return new BrevoEmail(teamEmail, "EquipTrack team", subject, html, text);
    }

    private static string E(string value) => WebUtility.HtmlEncode(value);
}
