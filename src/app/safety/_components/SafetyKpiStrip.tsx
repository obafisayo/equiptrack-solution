'use client'

import { AlertTriangle, ShieldCheck, CheckCircle2, Flag } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface SafetyKpiStripProps {
  openCount: number
  highCount: number
  closedCount: number
  escalated: number
  activeInspFail: number
}

export function SafetyKpiStrip({ openCount, highCount, closedCount, escalated, activeInspFail }: SafetyKpiStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard label="Open Incidents"     value={openCount}      icon={AlertTriangle} color={openCount > 0 ? '#DC2626' : '#16A34A'} />
      <StatCard label="High / Critical"    value={highCount}      icon={Flag}          color={highCount > 0 ? '#F97316' : '#16A34A'} />
      <StatCard label="Closed This Month"  value={closedCount}    icon={CheckCircle2}  color="#16A34A" />
      <StatCard label="Escalated"          value={escalated}      icon={ShieldCheck}   color={escalated > 0 ? '#8B5CF6' : '#16A34A'} />
      <StatCard label="Failed Inspections" value={activeInspFail} icon={AlertTriangle} color={activeInspFail > 0 ? '#D97706' : '#16A34A'} />
    </div>
  )
}
