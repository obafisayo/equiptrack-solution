'use client'

import { Ship, CheckCircle, Wrench, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface FleetStatsProps {
  total: number
  active: number
  inDrydock: number
  docsExpiring: number
}

export function FleetStats({ total, active, inDrydock, docsExpiring }: FleetStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Fleet"       value={total}        color="#1A6FBF" icon={Ship}          />
      <StatCard label="Active at Sea"     value={active}       color="#16A34A" icon={CheckCircle}   />
      <StatCard label="Drydock / Maint."  value={inDrydock}    color={inDrydock > 0 ? '#D97706' : '#16A34A'} icon={Wrench} />
      <StatCard label="Docs Expiring (60d)" value={docsExpiring} color={docsExpiring > 0 ? '#DC2626' : '#16A34A'} icon={AlertTriangle} />
    </div>
  )
}
