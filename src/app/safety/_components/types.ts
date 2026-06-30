export type Severity = 'low' | 'medium' | 'high' | 'critical'
export type IncStatus = 'open' | 'under_review' | 'closed' | 'escalated'
export type IncType =
  | 'Near Miss' | 'First Aid' | 'Equipment Damage'
  | 'Slip / Trip' | 'Chemical Spill' | 'Fire / Explosion'
  | 'Struck By Object' | 'Electrical Hazard' | 'Working at Height' | 'Other'

export interface Incident {
  id: string
  type: IncType
  location: string
  severity: Severity
  reportedBy: string
  date: string
  time: string
  status: IncStatus
  description: string
  immediateAction: string
  investigator?: string
  witnesses?: string
  equipment?: string
  daysOpen: number
}

export type InspStatus = 'passed' | 'failed' | 'pending' | 'overdue'
export interface Inspection {
  id: string
  equipment: string
  category: string
  inspector: string
  lastDate: string
  nextDate: string
  status: InspStatus
  findings?: string
}

export type PTWType = 'Hot Work' | 'Cold Work' | 'Confined Space' | 'Electrical' | 'Lifting' | 'Working at Height'
export type PTWStatus = 'pending' | 'active' | 'closed' | 'suspended'
export interface PTW {
  id: string
  type: PTWType
  location: string
  crew: string
  supervisor: string
  validFrom: string
  validTo: string
  status: PTWStatus
  description: string
}

export type Tab = 'incidents' | 'inspections' | 'ptw'
