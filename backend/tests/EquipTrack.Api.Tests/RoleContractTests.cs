using System.Text.RegularExpressions;
using EquipTrack.Api.Domain;

namespace EquipTrack.Api.Tests;

/// <summary>
/// Guards against the frontend and backend role models drifting apart
/// (the bug that produced both `wh_sup` and `wh_supervisor`).
/// </summary>
public sealed partial class RoleContractTests
{
    [Fact]
    public void Backend_roles_match_frontend_canonical_roles()
    {
        var rolesTs = Path.Combine(FindRepoRoot(), "src", "lib", "domain", "roles.ts");
        var source = File.ReadAllText(rolesTs);

        var block = RolesArray().Match(source);
        Assert.True(block.Success, "Could not find `export const ROLES = [...] as const` in roles.ts");

        var frontend = QuotedValue().Matches(block.Groups[1].Value).Select(m => m.Groups[1].Value).ToList();

        Assert.Equal(frontend, Roles.All);
    }

    private static string FindRepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !File.Exists(Path.Combine(dir.FullName, "package.json")))
            dir = dir.Parent;
        return dir?.FullName ?? throw new InvalidOperationException("Repository root (package.json) not found.");
    }

    [GeneratedRegex(@"export const ROLES = \[(.*?)\] as const", RegexOptions.Singleline)]
    private static partial Regex RolesArray();

    [GeneratedRegex(@"'([a-z_]+)'")]
    private static partial Regex QuotedValue();
}
