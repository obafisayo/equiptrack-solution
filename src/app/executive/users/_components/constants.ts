export const ROLE_TABS = [
  { key: 'all',                  label: 'All Users' },
  { key: 'Executive',            label: 'Executive' },
  { key: 'Warehouse Supervisor', label: 'WH Supervisor' },
  { key: 'Warehouse Personnel',  label: 'WH Personnel' },
  { key: 'Dispatch Supervisor',  label: 'DSP Supervisor' },
  { key: 'Dispatch Personnel',   label: 'DSP Personnel' },
  { key: 'QAQC Officer',         label: 'QAQC' },
  { key: 'Logistics Coordinator',label: 'Logistics' },
  { key: 'Requester',            label: 'Requester' },
] as const

export type RoleKey = typeof ROLE_TABS[number]['key']

export const ALL_ROLES = ROLE_TABS.filter(r => r.key !== 'all').map(r => r.key)

export const STATUS_CLASS = {
  active:    'bg-green-50 text-green-700 border border-green-200',
  invited:   'bg-amber-50 text-amber-700 border border-amber-200',
  suspended: 'bg-red-50 text-red-700 border border-red-200',
}
