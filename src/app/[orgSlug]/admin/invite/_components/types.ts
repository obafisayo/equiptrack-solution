import type { OrgRole } from '@/lib/types'

export interface RoleOption {
  role: OrgRole
  label: string
  description: string
  department: string
  color: string
}

export const ROLE_OPTIONS: RoleOption[] = [
  { role: 'requester',             label: 'Requester',            description: 'Creates work order requests',           department: 'Field',      color: '#3B82F6' },
  { role: 'wh_supervisor',         label: 'WH Supervisor',        description: 'Manages warehouse operations',          department: 'Warehouse',  color: '#3B82F6' },
  { role: 'wh_personnel',          label: 'WH Personnel',         description: 'Executes warehouse tasks',              department: 'Warehouse',  color: '#3B82F6' },
  { role: 'dsp_supervisor',        label: 'DSP Supervisor',       description: 'Oversees dispatch scheduling',          department: 'Dispatch',   color: '#8B5CF6' },
  { role: 'dsp_personnel',         label: 'DSP Personnel',        description: 'Handles dispatch execution',            department: 'Dispatch',   color: '#8B5CF6' },
  { role: 'qaqc_officer',          label: 'QAQC Officer',         description: 'Inspects and certifies containers',     department: 'QAQC',       color: '#F59E0B' },
  { role: 'exec_viewer',           label: 'Exec Viewer',          description: 'Read-only executive dashboard',         department: 'Executive',  color: '#10B981' },
  { role: 'safety_officer',        label: 'Safety Officer',       description: 'Monitors safety compliance',            department: 'Safety',     color: '#EF4444' },
  { role: 'logistics_coordinator', label: 'Logistics Coord.',     description: 'Coordinates logistics planning',        department: 'Logistics',  color: '#F97316' },
  { role: 'inventory_manager',     label: 'Inventory Manager',    description: 'Manages inventory and stock',           department: 'Inventory',  color: '#06B6D4' },
  { role: 'rig_manager',           label: 'Rig Manager',          description: 'Oversees rig-site operations',          department: 'Field',      color: '#8B5CF6' },
  { role: 'crane_operator',        label: 'Crane Operator',       description: 'Operates crane lifting equipment',      department: 'Field',      color: '#64748B' },
  { role: 'maintenance_tech',      label: 'Maintenance Tech',     description: 'Performs equipment maintenance',        department: 'Maintenance',color: '#10B981' },
  { role: 'org_admin',             label: 'Org Admin',            description: 'Full admin access to this portal',      department: 'Admin',      color: '#F04A4A' },
]

export type InviteMethod = 'email' | 'microsoft_sso'

export interface InviteRow { email: string; role: OrgRole }
