import type { UserRole, OrgRole, Permission, User } from './types'
import { ROLE_LABEL } from '@/lib/domain/roles'

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
  wh_sup:         ['workorders:read', 'workorders:write', 'workorders:approve', 'users:read'],
  wh_per:          ['workorders:read', 'workorders:write'],
  dsp_sup:        ['workorders:read', 'workorders:write', 'workorders:approve', 'users:read'],
  dsp_per:         ['workorders:read', 'workorders:write'],
  qaqc:          ['workorders:read', 'workorders:write', 'workorders:approve'],
  exec:           ['workorders:read', 'reports:read', 'reports:export'],
  safety:        ['workorders:read', 'reports:read'],
  logistics: ['workorders:read', 'workorders:write'],
  inventory:     ['workorders:read', 'workorders:write'],
  maintenance:      ['workorders:read', 'workorders:write'],
  site_logistics:   ['workorders:read', 'workorders:write'],
  site_return:      ['workorders:read', 'workorders:write'],
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


export function getRoleLabel(role: UserRole): string {
  return ROLE_LABEL[role] ?? role
}

const ALL_ORG_ROLES: OrgRole[] = [
  'org_admin', 'requester', 'wh_sup', 'wh_per',
  'dsp_sup', 'dsp_per', 'qaqc', 'exec',
  'safety', 'logistics', 'inventory',
  'maintenance', 'site_logistics', 'site_return',
]

export function getInvitableRoles(actorRole: UserRole): OrgRole[] {
  if (actorRole === 'sysadmin') return ALL_ORG_ROLES
  if (actorRole === 'org_admin') return ALL_ORG_ROLES.filter(r => r !== 'org_admin')
  return []
}
