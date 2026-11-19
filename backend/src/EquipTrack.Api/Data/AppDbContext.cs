using System.Text.Json;
using EquipTrack.Api.Leads;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace EquipTrack.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Lead> Leads => Set<Lead>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var lead = modelBuilder.Entity<Lead>();
        lead.ToTable("leads");
        lead.HasKey(l => l.Id);

        lead.Property(l => l.Kind).HasConversion<string>().HasMaxLength(20);
        lead.Property(l => l.SyncStatus).HasConversion<string>().HasMaxLength(20);
        lead.Property(l => l.Email).HasMaxLength(254).IsRequired();

        foreach (var name in new[]
                 {
                     nameof(Lead.ContactName), nameof(Lead.ContactPhone), nameof(Lead.JobTitle),
                     nameof(Lead.CompanyName), nameof(Lead.Industry), nameof(Lead.Country),
                     nameof(Lead.CompanySize), nameof(Lead.Website),
                 })
        {
            lead.Property(name).HasMaxLength(LeadValidation.ShortMax);
        }

        lead.Property(l => l.AdditionalInfo).HasMaxLength(LeadValidation.LongMax);
        lead.Property(l => l.LastSyncError).HasMaxLength(2000);

        // Stored as a JSON string so the model stays portable across providers.
        lead.Property(l => l.UseCases)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
            .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                (a, b) => (a ?? new List<string>()).SequenceEqual(b ?? new List<string>()),
                v => v.Aggregate(0, (h, s) => HashCode.Combine(h, s.GetHashCode())),
                v => v.ToList()));

        // One newsletter subscription per address; waitlist applications may repeat.
        lead.HasIndex(l => new { l.Kind, l.Email });
        lead.HasIndex(l => new { l.SyncStatus, l.NextSyncAttemptAt });
    }
}
