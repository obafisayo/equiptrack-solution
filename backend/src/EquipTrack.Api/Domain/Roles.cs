namespace EquipTrack.Api.Domain;

/// <summary>
/// Canonical role codes. MUST match <c>ROLES</c> in <c>src/lib/domain/roles.ts</c>
/// (a unit test enforces this). Server-side authorisation will use these codes.
/// </summary>
public static class Roles
{
    public const string Sysadmin = "sysadmin";
    public const string OrgAdmin = "org_admin";
    public const string Requester = "requester";
    public const string WarehouseSupervisor = "wh_sup";
    public const string WarehousePersonnel = "wh_per";
    public const string DispatchSupervisor = "dsp_sup";
    public const string DispatchPersonnel = "dsp_per";
    public const string Qaqc = "qaqc";
    public const string SiteLogistics = "site_logistics";
    public const string SiteReturn = "site_return";
    public const string Executive = "exec";
    public const string Safety = "safety";
    public const string Logistics = "logistics";
    public const string Inventory = "inventory";
    public const string Maintenance = "maintenance";

    public static readonly IReadOnlyList<string> All =
    [
        Sysadmin, OrgAdmin, Requester,
        WarehouseSupervisor, WarehousePersonnel,
        DispatchSupervisor, DispatchPersonnel,
        Qaqc, SiteLogistics, SiteReturn, Executive,
        Safety, Logistics, Inventory, Maintenance,
    ];

    public static bool IsValid(string? role) => role is not null && All.Contains(role);
}
