export const LIFECYCLE = [
  'Pending Base Coordinator Approval',
  'New Request',
  'Warehouse Assigned',
  'Picking',
  'GI Created',
  'Transferred to Dispatch',
  'Dispatch Queue',
  'Dispatch Assigned',
  'Preload QAQC',
  'Containerization',
  'Post QAQC',
  'Waybill Pending Signature',
  'Waybill Done',
  'Awaiting Deckspace',
  'Shipped',
  'Completed',
] as const

export type Stage = typeof LIFECYCLE[number]

export type Department = 'pending' | 'warehouse' | 'dispatch' | 'qaqc' | 'final'

export const STAGE_DEPARTMENT: Record<Stage, Department> = {
  'Pending Base Coordinator Approval': 'pending',
  'New Request': 'warehouse',
  'Warehouse Assigned': 'warehouse',
  'Picking': 'warehouse',
  'GI Created': 'warehouse',
  'Transferred to Dispatch': 'warehouse',
  'Dispatch Queue': 'dispatch',
  'Dispatch Assigned': 'dispatch',
  'Preload QAQC': 'qaqc',
  'Containerization': 'qaqc',
  'Post QAQC': 'qaqc',
  'Waybill Pending Signature': 'final',
  'Waybill Done': 'final',
  'Awaiting Deckspace': 'final',
  'Shipped': 'final',
  'Completed': 'final',
}

export const DEPARTMENT_COLOR: Record<Department, string> = {
  pending:   '#94A3B8',
  warehouse: '#3B82F6',
  dispatch:  '#8B5CF6',
  qaqc:      '#F59E0B',
  final:     '#22C55E',
}

export const STAGE_COLOR: Record<Stage, string> = Object.fromEntries(
  LIFECYCLE.map(s => [s, DEPARTMENT_COLOR[STAGE_DEPARTMENT[s]]])
) as Record<Stage, string>

// Role model lives in src/lib/domain/roles.ts — re-exported here for convenience.
import type { WorkspaceRole } from '@/lib/domain/roles'
export { ROLE_LABEL, ROLE_ROUTE } from '@/lib/domain/roles'
export type { WorkspaceRole } from '@/lib/domain/roles'

export const ROLE_STAGES: Record<WorkspaceRole, Stage[]> = {
  requester:     [...LIFECYCLE],
  wh_sup:        [...LIFECYCLE],
  wh_per:        ['New Request', 'Warehouse Assigned', 'Picking', 'GI Created'],
  dsp_sup:       ['Dispatch Queue', 'Dispatch Assigned', 'Preload QAQC', 'Containerization', 'Post QAQC', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace'],
  dsp_per:       ['Dispatch Assigned', 'Containerization', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace'],
  qaqc:          ['Preload QAQC', 'Containerization', 'Post QAQC'],
  site_logistics: [],
  site_return:   ['Completed'],
  exec:          [...LIFECYCLE],
  safety:        [...LIFECYCLE],
  logistics:     ['Dispatch Queue', 'Dispatch Assigned', 'Awaiting Deckspace', 'Shipped'],
  inventory:     [...LIFECYCLE],
  maintenance:   ['New Request', 'Warehouse Assigned', 'Picking'],
  sysadmin:      [],
}

export const STAGE_REVERSAL: Partial<Record<Stage, Stage>> = {
  'Warehouse Assigned':        'New Request',
  'Picking':                'Warehouse Assigned',
  'GI Created':                'Picking',
  'Transferred to Dispatch':   'GI Created',
  'Dispatch Assigned':         'Dispatch Queue',
  'Preload QAQC':              'Dispatch Assigned',
  'Containerization':          'Preload QAQC',
  'Post QAQC':                 'Containerization',
  'Waybill Pending Signature': 'Post QAQC',
}

export const STAGE_INDEX: Record<Stage, number> = Object.fromEntries(
  LIFECYCLE.map((s, i) => [s, i])
) as Record<Stage, number>

export function nextStage(stage: Stage): Stage | null {
  const idx = STAGE_INDEX[stage]
  return idx < LIFECYCLE.length - 1 ? LIFECYCLE[idx + 1] : null
}
