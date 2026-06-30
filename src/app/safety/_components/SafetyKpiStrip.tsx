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
      <StatCard label="Open Incidents"     value={openCount}      icon={AlertTriangle} color={openCount > 0 ? '#EF4444' : '#22C55E'} />
      <StatCard label="High / Critical"    value={highCount}      icon={Flag}          color={highCount > 0 ? '#F97316' : '#22C55E'} />
      <StatCard label="Closed This Month"  value={closedCount}    icon={CheckCircle2}  color="#10B981" />
      <StatCard label="Escalated"          value={escalated}      icon={ShieldCheck}   color={escalated > 0 ? '#8B5CF6' : '#22C55E'} />
      <StatCard label="Failed Inspections" value={activeInspFail} icon={AlertTriangle} color={activeInspFail > 0 ? '#F59E0B' : '#22C55E'} />
    </div>
  )
}
