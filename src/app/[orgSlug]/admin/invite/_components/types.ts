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
  { role: 'wh_sup',         label: 'WH Supervisor',        description: 'Manages warehouse operations',          department: 'Warehouse',  color: '#3B82F6' },
  { role: 'wh_per',          label: 'WH Personnel',         description: 'Executes warehouse tasks',              department: 'Warehouse',  color: '#3B82F6' },
  { role: 'dsp_sup',        label: 'DSP Supervisor',       description: 'Oversees dispatch scheduling',          department: 'Dispatch',   color: '#8B5CF6' },
  { role: 'dsp_per',         label: 'DSP Personnel',        description: 'Handles dispatch execution',            department: 'Dispatch',   color: '#8B5CF6' },
  { role: 'qaqc',          label: 'QAQC Officer',         description: 'Inspects and certifies containers',     department: 'QAQC',       color: '#F59E0B' },
  { role: 'exec',           label: 'Exec Viewer',          description: 'Read-only executive dashboard',         department: 'Executive',  color: '#10B981' },
  { role: 'safety',        label: 'Safety Officer',       description: 'Monitors safety compliance',            department: 'Safety',     color: '#EF4444' },
  { role: 'logistics', label: 'Logistics Coord.',     description: 'Coordinates logistics planning',        department: 'Logistics',  color: '#F97316' },
  { role: 'inventory',     label: 'Inventory Manager',    description: 'Manages inventory and stock',           department: 'Inventory',  color: '#06B6D4' },
  { role: 'maintenance',      label: 'Maintenance Tech',     description: 'Performs equipment maintenance',        department: 'Maintenance',color: '#10B981' },
  { role: 'org_admin',             label: 'Org Admin',            description: 'Full admin access to this portal',      department: 'Admin',      color: '#F04A4A' },
]

export type InviteMethod = 'email' | 'microsoft_sso'

export interface InviteRow { email: string; role: OrgRole }
