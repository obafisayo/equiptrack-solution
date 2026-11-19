import { isRole, type WorkspaceRole as Role } from '@/lib/domain/roles'

/**
 * DEMO-ONLY client session. The role is a browser value and is NOT a security
 * boundary — real authorisation is enforced by the EquipTrack API (see
 * the equiptrack-backend repo). Do not rely on this for anything beyond prototype navigation.
 */
export const SESSION_ROLE_KEY = 'equiptrack_role'

export function setSessionRole(role: Role): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_ROLE_KEY, role)
}

export function getSessionRole(): Role | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(SESSION_ROLE_KEY)
  // Reject unknown / legacy values (e.g. old URL slugs) instead of trusting them.
  return isRole(stored) && stored !== 'org_admin' ? stored : null
}

export function clearSessionRole(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_ROLE_KEY)
}

// Which roles may access each route prefix (longest prefix wins)
// Used by AppShell for enforcement.
// IMPORTANT: more-specific prefixes must appear BEFORE their parents so
// the sort-by-length logic in getAllowedRolesForPath finds the right match.
export const ROUTE_ACCESS: [prefix: string, roles: Role[]][] = [
  ['/requester',                    ['requester']],
  ['/warehouse-personnel',          ['wh_per']],
  ['/warehouse/messages',           ['wh_sup']],
  ['/warehouse',                    ['wh_sup']],
  ['/dispatch-personnel',           ['dsp_per']],
  ['/dispatch/messages',            ['dsp_sup']],
  ['/dispatch',                     ['dsp_sup']],
  ['/qaqc/analytics',               ['qaqc']],
  ['/qaqc/messages',                ['qaqc']],
  ['/qaqc',                         ['qaqc']],
  ['/site-logistics',               ['site_logistics']],
  ['/site-return',                  ['site_return']],
  ['/executive/messages',           ['exec']],
  ['/executive',                    ['exec']],
  ['/safety',                       ['safety']],
  ['/logistics',                    ['logistics']],
  ['/inventory',                    ['inventory']],
  ['/maintenance',                  ['maintenance']],
  ['/sysadmin',                     ['sysadmin']],
  // /messages is now a redirect — allow all authenticated roles through
  ['/messages',                     ['requester','wh_sup','wh_per','dsp_sup','dsp_per','qaqc','site_logistics','site_return','exec','safety','logistics','inventory','maintenance','sysadmin']],
]

/** Return the allowed roles for the given path, or null if unrestricted */
export function getAllowedRolesForPath(path: string): Role[] | null {
  // Sort by prefix length descending so most-specific match wins
  const sorted = [...ROUTE_ACCESS].sort((a, b) => b[0].length - a[0].length)
  for (const [prefix, roles] of sorted) {
    if (path === prefix || path.startsWith(prefix + '/')) return roles
  }
  return null
}
