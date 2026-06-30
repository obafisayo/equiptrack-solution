export type VesselStatus = 'In Transit' | 'Docking' | 'Loading' | 'Awaiting Berth' | 'Departed'

export interface CargoItem {
  description: string
  qty: number
  unit: string
  ref: string
}

export interface Vessel {
  id: string
  name: string
  type: string
  flag: string
  status: VesselStatus
  origin: string
  destination: string
  etd: string
  eta: string
  progress: number
  captain: string
  imo: string
  cargo: CargoItem[]
  priority: 'normal' | 'urgent'
}
