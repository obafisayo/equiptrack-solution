import { WORK_ORDERS, PERSONNEL } from '@/lib/mock-data'
import { STAGE_DEPARTMENT } from '@/lib/lifecycle'
import type { SupervisorPerf, TrendDatum } from './types'

export const allOrders = WORK_ORDERS
export const activeOrders = allOrders.filter(o => !['Shipped', 'Completed'].includes(o.stage))

export const shippedThisWeek = allOrders.filter(o =>
  o.stage === 'Shipped' || o.stage === 'Completed'
).length

// ── Trend data (mocked 7-day) ───────────────────────────────────────────────
export const TREND_DATA: TrendDatum[] = [
  { day: 'Mon', submitted: 8,  shipped: 5  },
  { day: 'Tue', submitted: 12, shipped: 9  },
  { day: 'Wed', submitted: 7,  shipped: 11 },
  { day: 'Thu', submitted: 15, shipped: 8  },
  { day: 'Fri', submitted: 10, shipped: 13 },
  { day: 'Sat', submitted: 6,  shipped: 7  },
  { day: 'Sun', submitted: 9,  shipped: 6  },
]

export const BAR_DATA = TREND_DATA.map(d => ({
  label: d.day,
  value: d.submitted,
}))

// ── Personnel load data ──────────────────────────────────────────────────────
export const ALL_PERSONNEL = [
  ...PERSONNEL.filter(p => p.dept === 'warehouse'),
  ...PERSONNEL.filter(p => p.dept === 'dispatch'),
  ...PERSONNEL.filter(p => p.dept === 'qaqc'),
]

// ── Supervisor performance ──────────────────────────────────────────────────
export const SUPERVISOR_PERF: SupervisorPerf[] = [
  {
    name: 'Yinka Adeyemi',
    team: 'Warehouse',
    activeOrders: allOrders.filter(o => ['warehouse'].includes(STAGE_DEPARTMENT[o.stage])).length,
    avgStageTime: '3h 45m',
    slaCompliance: 87,
    trend: 'up',
  },
  {
    name: 'Chika Obi',
    team: 'Dispatch',
    activeOrders: allOrders.filter(o => STAGE_DEPARTMENT[o.stage] === 'dispatch').length,
    avgStageTime: '2h 20m',
    slaCompliance: 94,
    trend: 'up',
  },
  {
    name: 'Femi Emmanuel',
    team: 'QAQC',
    activeOrders: allOrders.filter(o => STAGE_DEPARTMENT[o.stage] === 'qaqc').length,
    avgStageTime: '4h 10m',
    slaCompliance: 72,
    trend: 'down',
  },
]
