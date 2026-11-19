using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EquipTrack.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialLeads : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "leads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Kind = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Email = table.Column<string>(type: "character varying(254)", maxLength: 254, nullable: false),
                    ContactName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ContactPhone = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    JobTitle = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CompanyName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Industry = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Country = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CompanySize = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Website = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    UseCases = table.Column<string>(type: "text", nullable: false),
                    AdditionalInfo = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    SyncStatus = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ContactSynced = table.Column<bool>(type: "boolean", nullable: false),
                    ConfirmationSent = table.Column<bool>(type: "boolean", nullable: false),
                    TeamNotified = table.Column<bool>(type: "boolean", nullable: false),
                    SyncAttempts = table.Column<int>(type: "integer", nullable: false),
                    NextSyncAttemptAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastSyncError = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    SyncedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_leads", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_leads_Kind_Email",
                table: "leads",
                columns: new[] { "Kind", "Email" });

            migrationBuilder.CreateIndex(
                name: "IX_leads_SyncStatus_NextSyncAttemptAt",
                table: "leads",
                columns: new[] { "SyncStatus", "NextSyncAttemptAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "leads");
        }
    }
}
