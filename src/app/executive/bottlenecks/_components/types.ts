export interface StageStat {
  stage: string
  avgHours: number
  slaHours: number
  count: number
  ratio: number
  dept: string
}

export interface PersonStat {
  id: string
  name: string
  dept: string
  avgDuration: number
  totalStages: number
}
