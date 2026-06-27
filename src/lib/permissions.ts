import type { UserRole, OrgRole, Permission, User } from './types'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  sysadmin: [
    'org:read', 'org:write', 'org:delete',
    'users:invite', 'users:suspend', 'users:read',
    'workorders:read', 'workorders:write', 'workorders:approve', 'workorders:close',
    'sla:configure',
    'reports:read', 'reports:export',
    'billing:read', 'billing:write',
    'audit:read',
    'sso:configure',
    'platform:read', 'platform:write',
  ],
  org_admin: [
    'org:read', 'org:write',
    'users:invite', 'users:suspend', 'users:read',
    'workorders:read', 'workorders:write', 'workorders:approve', 'workorders:close',
    'sla:configure',
    'reports:read', 'reports:export',
    'billing:read', 'billing:write',
    'audit:read',
    'sso:configure',
  ],
  requester:             ['workorders:read', 'workorders:write'],
  wh_supervisor:         ['workorders:read', 'workorders:write', 'workorders:approve', 'users:read'],
  wh_personnel:          ['workorders:read', 'workorders:write'],
  dsp_supervisor:        ['workorders:read', 'workorders:write', 'workorders:approve', 'users:read'],
  dsp_personnel:         ['workorders:read', 'workorders:write'],
  qaqc_officer:          ['workorders:read', 'workorders:write', 'workorders:approve'],
  exec_viewer:           ['workorders:read', 'reports:read', 'reports:export'],
  safety_officer:        ['workorders:read', 'reports:read'],
  logistics_coordinator: ['workorders:read', 'workorders:write'],
  inventory_manager:     ['workorders:read', 'workorders:write'],
  rig_manager:           ['workorders:read', 'workorders:approve'],
  crane_operator:        ['workorders:read', 'workorders:write'],
  maintenance_tech:      ['workorders:read', 'workorders:write'],
}

export function getDefaultPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(user: User, permission: Permission): boolean {
  return user.permissions.includes(permission)
}

export function canManageRole(actor: UserRole, target: OrgRole): boolean {
  if (actor === 'sysadmin') return true
  if (actor === 'org_admin') return target !== 'org_admin'
  return false
}

const ROLE_LABELS: Record<UserRole, string> = {
  sysadmin:              'System Administrator',
  org_admin:             'Organisation Admin',
  requester:             'Requester',
  wh_supervisor:         'Warehouse Supervisor',
  wh_personnel:          'Warehouse Personnel',
  dsp_supervisor:        'Dispatch Supervisor',
  dsp_personnel:         'Dispatch Personnel',
  qaqc_officer:          'QA/QC Officer',
  exec_viewer:           'Executive Viewer',
  safety_officer:        'Safety Officer',
  logistics_coordinator: 'Logistics Coordinator',
  inventory_manager:     'Inventory Manager',
  rig_manager:           'Rig Manager',
  crane_operator:        'Crane Operator',
  maintenance_tech:      'Maintenance Technician',
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role
}

const ALL_ORG_ROLES: OrgRole[] = [
  'org_admin', 'requester', 'wh_supervisor', 'wh_personnel',
  'dsp_supervisor', 'dsp_personnel', 'qaqc_officer', 'exec_viewer',
  'safety_officer', 'logistics_coordinator', 'inventory_manager',
  'rig_manager', 'crane_operator', 'maintenance_tech',
]

export function getInvitableRoles(actorRole: UserRole): OrgRole[] {
  if (actorRole === 'sysadmin') return ALL_ORG_ROLES
  if (actorRole === 'org_admin') return ALL_ORG_ROLES.filter(r => r !== 'org_admin')
  return []
}
