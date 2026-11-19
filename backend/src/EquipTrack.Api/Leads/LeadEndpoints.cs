using EquipTrack.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace EquipTrack.Api.Leads;

public static class LeadEndpoints
{
    public const string RateLimitPolicy = "leads";

    public static IEndpointRouteBuilder MapLeadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/leads")
            .WithTags("Leads")
            .RequireRateLimiting(RateLimitPolicy);

        group.MapPost("/waitlist", SubmitWaitlist)
            .Produces(StatusCodes.Status202Accepted)
            .ProducesValidationProblem();

        group.MapPost("/newsletter", SubscribeNewsletter)
            .Produces(StatusCodes.Status202Accepted)
            .ProducesValidationProblem();

        return app;
    }

    internal static async Task<IResult> SubmitWaitlist(
        WaitlistRequest request, AppDbContext db, TimeProvider clock, CancellationToken ct)
    {
        var errors = LeadValidation.Validate(request);
        if (errors.Count > 0) return Results.ValidationProblem(errors);

        var lead = new Lead
        {
            Kind = LeadKind.Waitlist,
            CreatedAt = clock.GetUtcNow(),
            Email = LeadValidation.NormalizeEmail(request.ContactEmail!),
            ContactName = LeadValidation.Clean(request.ContactName),
            ContactPhone = LeadValidation.Clean(request.ContactPhone),
            JobTitle = LeadValidation.Clean(request.JobTitle),
            CompanyName = LeadValidation.Clean(request.CompanyName),
            Industry = LeadValidation.Clean(request.Industry),
            Country = LeadValidation.Clean(request.Country),
            CompanySize = LeadValidation.Clean(request.CompanySize),
            Website = LeadValidation.Clean(request.Website),
            UseCases = request.UseCases!.Select(u => u.Trim()).Distinct().ToList(),
            AdditionalInfo = LeadValidation.Clean(request.AdditionalInfo),
        };

        db.Leads.Add(lead);
        await db.SaveChangesAsync(ct);

        // 202: stored durably; Brevo sync happens asynchronously with retries.
        return Results.Accepted(value: new { id = lead.Id });
    }

    internal static async Task<IResult> SubscribeNewsletter(
        NewsletterRequest request, AppDbContext db, TimeProvider clock, CancellationToken ct)
    {
        var errors = LeadValidation.Validate(request);
        if (errors.Count > 0) return Results.ValidationProblem(errors);

        var email = LeadValidation.NormalizeEmail(request.Email!);

        // Idempotent: same response whether or not the address already exists,
        // so the endpoint cannot be used to discover who is subscribed.
        var exists = await db.Leads.AnyAsync(l => l.Kind == LeadKind.Newsletter && l.Email == email, ct);
        if (!exists)
        {
            db.Leads.Add(new Lead { Kind = LeadKind.Newsletter, CreatedAt = clock.GetUtcNow(), Email = email });
            await db.SaveChangesAsync(ct);
        }

        return Results.Accepted();
    }
}
