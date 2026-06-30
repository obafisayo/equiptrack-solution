export type MaintPriority = 'low' | 'medium' | 'high' | 'critical'
export type MaintStatus   = 'pending' | 'in_progress' | 'completed' | 'overdue'
export type MaintType     = 'Preventive' | 'Corrective' | 'Inspection' | 'Calibration' | 'Overhaul'

export interface WorkOrder {
  id: string; equipment: string; category: string
  task: string; type: MaintType; priority: MaintPriority; status: MaintStatus
  assignedTo: string; dueDate: string; startedAt?: string; completedAt?: string
  techNote?: string; estimatedHours: number; actualHours?: number
}

export interface ScheduleItem {
  date: string; wo: string; equipment: string; task: string
  priority: MaintPriority; assignedTo: string
}

export type Tab = 'orders' | 'schedule' | 'history'

export interface CreateForm {
  equipment: string
  category: string
  task: string
  type: MaintType
  priority: MaintPriority
  assignedTo: string
  dueDate: string
  estimatedHours: string
  note: string
}
