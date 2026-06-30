export interface SupervisorPerf {
  name: string
  team: string
  activeOrders: number
  avgStageTime: string
  slaCompliance: number
  trend: 'up' | 'down'
}

export interface TrendDatum {
  day: string
  submitted: number
  shipped: number
}

export type SortCol = 'id' | 'stage' | 'elapsed'
