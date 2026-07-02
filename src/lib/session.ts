import type { Role } from '@/lib/lifecycle'

export const SESSION_ROLE_KEY = 'equiptrack_role'

// Maps login-page slugs (from roles.ts) → Role type (from lifecycle.ts)
export const SLUG_TO_ROLE: Record<string, Role> = {
  'requester':            'requester',
  'warehouse-supervisor': 'wh_sup',
  'warehouse-personnel':  'wh_per',
  'dispatch-supervisor':  'dsp_sup',
  'dispatch-personnel':   'dsp_per',
  'qaqc-officer':         'qaqc',
  'loadout-qaqc':         'loadout_qaqc',
  'site-logistics':       'site_logistics',
  'executive':            'exec',
  'safety':               'safety',
  'logistics':            'logistics',
  'inventory':            'inventory',
  'maintenance':          'maintenance',
  'sysadmin':             'sysadmin',
}

export function setSessionRole(slug: string): void {
  if (typeof window === 'undefined') return
  const role = SLUG_TO_ROLE[slug] ?? (slug as Role)
  localStorage.setItem(SESSION_ROLE_KEY, role)
}

export function getSessionRole(): Role | null {
  if (typeof window === 'undefined') return null
  return (localStorage.getItem(SESSION_ROLE_KEY) as Role) ?? null
}

export function clearSessionRole(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_ROLE_KEY)
}

// Which roles may access each route prefix (longest prefix wins)
// Used by AppShell for enforcement.
export const ROUTE_ACCESS: [prefix: string, roles: Role[]][] = [
  ['/requester',           ['requester']],
  ['/warehouse-personnel', ['wh_per']],
  ['/warehouse',           ['wh_sup']],
  ['/dispatch-personnel',  ['dsp_per']],
  ['/dispatch',            ['dsp_sup']],
  ['/qaqc',                ['qaqc', 'loadout_qaqc']],
  ['/site-logistics',      ['site_logistics']],
  ['/executive',           ['exec']],
  ['/safety',              ['safety']],
  ['/logistics',           ['logistics']],
  ['/inventory',           ['inventory']],
  ['/maintenance',         ['maintenance']],
  ['/sysadmin',            ['sysadmin']],
  // /messages is reachable by all authenticated roles
  ['/messages',            ['requester','wh_sup','wh_per','dsp_sup','dsp_per','qaqc','loadout_qaqc','site_logistics','exec','safety','logistics','inventory','maintenance','sysadmin']],
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
