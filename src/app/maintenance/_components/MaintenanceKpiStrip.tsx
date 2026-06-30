'use client'

import { Wrench, Clock, AlertTriangle, CheckCheck } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface MaintenanceKpiStripProps {
  inProgress: number
  pending: number
  overdue: number
  completedCt: number
}

export function MaintenanceKpiStrip({ inProgress, pending, overdue, completedCt }: MaintenanceKpiStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="In Progress"  value={inProgress}  icon={Wrench}       color="#3B82F6" />
      <StatCard label="Pending"      value={pending}     icon={Clock}        color="#F59E0B" />
      <StatCard label="Overdue"      value={overdue}     icon={AlertTriangle} color={overdue>0?'#EF4444':'#22C55E'} />
      <StatCard label="Completed"    value={completedCt} icon={CheckCheck}   color="#10B981" />
    </div>
  )
}
