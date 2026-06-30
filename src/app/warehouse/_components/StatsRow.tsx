'use client'

import { Package, AlertTriangle, Clock, Timer } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface StatsRowProps {
  activeOrdersCount: number
  breachedOrdersCount: number
  processingToday: number
}

export function StatsRow({ activeOrdersCount, breachedOrdersCount, processingToday }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Active Orders" value={activeOrdersCount} icon={Package} />
      <StatCard
        label="SLA Breaches"
        value={breachedOrdersCount}
        color={breachedOrdersCount > 0 ? '#EF4444' : '#22C55E'}
        icon={AlertTriangle}
      />
      <StatCard label="Processing Today" value={processingToday} icon={Clock} />
      <StatCard label="Avg Cycle Time" value="4h 12m" icon={Timer} />
    </div>
  )
}
