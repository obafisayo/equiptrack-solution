import type { MaintPriority, MaintStatus, MaintType } from './types'

export const PRI_CFG: Record<MaintPriority, { badge: string; bar: string }> = {
  low:      { badge:'bg-green-50  text-green-700  border-green-200',  bar:'bg-green-500'  },
  medium:   { badge:'bg-amber-50  text-amber-700  border-amber-200',  bar:'bg-amber-500'  },
  high:     { badge:'bg-orange-50 text-orange-700 border-orange-200', bar:'bg-orange-500' },
  critical: { badge:'bg-red-50    text-red-700    border-red-200',    bar:'bg-red-500'    },
}

export const STS_CFG: Record<MaintStatus, { badge: string; label: string }> = {
  pending:     { badge:'bg-neutral-50 text-neutral-500 border-neutral-200', label:'Pending'     },
  in_progress: { badge:'bg-blue-50   text-blue-700   border-blue-200',     label:'In Progress' },
  completed:   { badge:'bg-green-50  text-green-700  border-green-200',    label:'Completed'   },
  overdue:     { badge:'bg-red-50    text-red-700    border-red-200',      label:'Overdue'     },
}

export const TYPE_OPTIONS: MaintType[] = ['Preventive','Corrective','Inspection','Calibration','Overhaul']
export const PRI_OPTIONS:  MaintPriority[] = ['low','medium','high','critical']

export const EQUIPMENT_OPTIONS = [
  'Mud Pump #1','Mud Pump #2','Mud Pump #3','Generator Set A','Generator Set B',
  'BOP Stack — 13.5"','Choke Manifold','Crane #1','Crane #2','Separator Unit',
  'Drill Rig #4','Forklift FL-01','Forklift FL-03',
].map(v=>({value:v,label:v}))

export const TECH_OPTIONS = [
  'Segun Folarin','Kenneth Nwosu','Danjuma Yusuf','Biodun Adekunle','Tunde Bello',
].map(v=>({value:v,label:v}))

export const CAT_OPTIONS = [
  'Drilling','Well Control','Power','Lifting','Process','Safety','Mechanical',
].map(v=>({value:v,label:v}))
