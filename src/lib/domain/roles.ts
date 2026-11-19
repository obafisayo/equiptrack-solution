/**
 * Canonical role model — the ONLY place role codes are defined.
 *
 * Every other module (lifecycle, session, permissions, org admin, the
 * ASP.NET backend's Domain/Roles.cs in the equiptrack-backend repo) must use these codes. Do not introduce
 * aliases such as `wh_supervisor` or URL slugs as role identifiers.
 *
 * Changing this list? Update equiptrack-backend in the same change; its
 * RoleContractTests compare the two lists and fail CI on drift.
 */

export const ROLES = [
  'sysadmin',
  'org_admin',
  'requester',
  'wh_sup',
  'wh_per',
  'dsp_sup',
  'dsp_per',
  'qaqc',
  'site_logistics',
  'site_return',
  'exec',
  'safety',
  'logistics',
  'inventory',
  'maintenance',
] as const

export type Role = (typeof ROLES)[number]

/** Platform-level role (not scoped to an organisation). */
export type SystemRole = 'sysadmin'

/** Roles that can be held inside an organisation (assignable via invite). */
export type OrgRole = Exclude<Role, SystemRole>

/** Roles that have their own operational workspace / dashboard. */
export type WorkspaceRole = Exclude<Role, 'org_admin'>

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

export const ROLE_LABEL: Record<Role, string> = {
  sysadmin:       'System Administrator',
  org_admin:      'Organisation Admin',
  requester:      'Requester',
  wh_sup:         'Warehouse Supervisor',
  wh_per:         'Warehouse Personnel',
  dsp_sup:        'Dispatch Supervisor',
  dsp_per:        'Dispatch Personnel',
  qaqc:           'QAQC Officer',
  site_logistics: 'Site Logistics',
  site_return:    'Site Return',
  exec:           'Executive',
  safety:         'Safety Officer',
  logistics:      'Vessel Coordinator',
  inventory:      'Inventory Manager',
  maintenance:    'Maintenance Technician',
}

/** Dashboard route for each role. Org admins land on their org's admin portal. */
export const ROLE_ROUTE: Record<WorkspaceRole, string> = {
  sysadmin:       '/sysadmin',
  requester:      '/requester',
  wh_sup:         '/warehouse',
  wh_per:         '/warehouse-personnel',
  dsp_sup:        '/dispatch',
  dsp_per:        '/dispatch-personnel',
  qaqc:           '/qaqc',
  site_logistics: '/site-logistics',
  site_return:    '/site-return',
  exec:           '/executive',
  safety:         '/safety',
  logistics:      '/logistics',
  inventory:      '/inventory',
  maintenance:    '/maintenance',
}

/**
 * Roles that make up the pilot's core lifecycle
 * (requester → warehouse → dispatch → QAQC → shipped).
 */
export const CORE_ROLES: readonly WorkspaceRole[] = [
  'requester', 'wh_sup', 'wh_per', 'dsp_sup', 'dsp_per', 'qaqc', 'exec',
]

/** Compact labels for dense tables (team lists, audit logs). */
export const ROLE_SHORT_LABEL: Record<Role, string> = {
  sysadmin:       'Sysadmin',
  org_admin:      'Org Admin',
  requester:      'Requester',
  wh_sup:         'WH Supervisor',
  wh_per:         'WH Personnel',
  dsp_sup:        'DSP Supervisor',
  dsp_per:        'DSP Personnel',
  qaqc:           'QAQC Officer',
  site_logistics: 'Site Logistics',
  site_return:    'Site Return',
  exec:           'Executive',
  safety:         'Safety Officer',
  logistics:      'Vessel Coord.',
  inventory:      'Inventory Mgr',
  maintenance:    'Maintenance Tech',
}
