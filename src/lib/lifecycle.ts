export const LIFECYCLE = [
  'Pending Base Coordinator Approval',
  'New Request',
  'Warehouse Assigned',
  'Processing',
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
  'Processing': 'warehouse',
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
  warehouse: '#10B981',
  dispatch:  '#8B5CF6',
  qaqc:      '#F59E0B',
  final:     '#22C55E',
}

export const STAGE_COLOR: Record<Stage, string> = Object.fromEntries(
  LIFECYCLE.map(s => [s, DEPARTMENT_COLOR[STAGE_DEPARTMENT[s]]])
) as Record<Stage, string>

export type Role = 'requester' | 'wh_sup' | 'wh_per' | 'dsp_sup' | 'dsp_per' | 'qaqc' | 'loadout_qaqc' | 'site_logistics' | 'exec' | 'safety' | 'logistics' | 'inventory' | 'maintenance' | 'sysadmin'

export const ROLE_LABEL: Record<Role, string> = {
  requester:     'Requester',
  wh_sup:        'Warehouse Supervisor',
  wh_per:        'Warehouse Personnel',
  dsp_sup:       'Dispatch Supervisor',
  dsp_per:       'Dispatch Personnel',
  qaqc:          'Yard QAQC Officer',
  loadout_qaqc:  'Loadout QAQC Officer',
  site_logistics: 'Site Logistics',
  exec:          'Executive',
  safety:        'Safety Officer',
  logistics:     'Logistics Coordinator',
  inventory:     'Inventory Manager',
  maintenance:   'Maintenance Technician',
  sysadmin:      'Sysadmin',
}

export const ROLE_ROUTE: Record<Role, string> = {
  requester:     '/requester',
  wh_sup:        '/warehouse',
  wh_per:        '/warehouse-personnel',
  dsp_sup:       '/dispatch',
  dsp_per:       '/dispatch-personnel',
  qaqc:          '/qaqc',
  loadout_qaqc:  '/qaqc/loadout',
  site_logistics: '/site-logistics',
  exec:          '/executive',
  safety:        '/safety',
  logistics:     '/logistics',
  inventory:     '/inventory',
  maintenance:   '/maintenance',
  sysadmin:      '/sysadmin',
}

export const ROLE_STAGES: Record<Role, Stage[]> = {
  requester:     [...LIFECYCLE],
  wh_sup:        [...LIFECYCLE],
  wh_per:        ['New Request', 'Warehouse Assigned', 'Processing', 'GI Created'],
  dsp_sup:       ['Dispatch Queue', 'Dispatch Assigned', 'Preload QAQC', 'Containerization', 'Post QAQC', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace'],
  dsp_per:       ['Dispatch Assigned', 'Containerization', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace'],
  qaqc:          ['Preload QAQC', 'Containerization', 'Post QAQC'],
  loadout_qaqc:  [],
  site_logistics: [],
  exec:          [...LIFECYCLE],
  safety:        [...LIFECYCLE],
  logistics:     ['Dispatch Queue', 'Dispatch Assigned', 'Awaiting Deckspace', 'Shipped'],
  inventory:     [...LIFECYCLE],
  maintenance:   ['New Request', 'Warehouse Assigned', 'Processing'],
  sysadmin:      [],
}

export const STAGE_REVERSAL: Partial<Record<Stage, Stage>> = {
  'Warehouse Assigned':        'New Request',
  'Processing':                'Warehouse Assigned',
  'GI Created':                'Processing',
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
