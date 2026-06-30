'use client'

import { Timer, Package, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface KpiStripProps {
  avgCycleHours: number
  activeOrdersCount: number
  shippedThisWeek: number
  slaBreachRate: number
  breachedCount: number
  targetCycleHours: number
  fmtCycleTime: (h: number) => string
}

export function KpiStrip({
  avgCycleHours,
  activeOrdersCount,
  shippedThisWeek,
  slaBreachRate,
  breachedCount,
  targetCycleHours,
  fmtCycleTime,
}: KpiStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <StatCard
        label="Avg Cycle Time"
        value={fmtCycleTime(avgCycleHours)}
        color={avgCycleHours > targetCycleHours ? '#EF4444' : '#22C55E'}
        trend={{ direction: avgCycleHours > targetCycleHours ? 'up' : 'down', value: 'Target: ' + fmtCycleTime(targetCycleHours), positive: avgCycleHours <= targetCycleHours }}
        icon={Timer}
      />
      <StatCard label="Active Requests"   value={activeOrdersCount} color="#3B82F6" icon={Package} />
      <StatCard label="Shipped This Week" value={shippedThisWeek}    color="#10B981" icon={CheckCircle2} />
      <StatCard
        label="SLA Breach Rate"
        value={slaBreachRate + '%'}
        color={slaBreachRate > 10 ? '#EF4444' : '#22C55E'}
        trend={{ direction: slaBreachRate > 10 ? 'up' : 'down', value: breachedCount + ' orders', positive: slaBreachRate <= 10 }}
        icon={AlertTriangle}
      />
      <StatCard
        label="On-Time Delivery"
        value={(100 - slaBreachRate) + '%'}
        color={100 - slaBreachRate >= 90 ? '#22C55E' : '#F59E0B'}
        icon={TrendingUp}
      />
    </div>
  )
}
