'use client'

import { Timer, Package, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface KpiStripProps {
  avgCycleHours: number
  activeOrdersCount: number
  shippedThisWeek: number
  slaPerformance: number
  breachedCount: number
  targetCycleHours: number
  fmtCycleTime: (h: number) => string
}

export function KpiStrip({
  avgCycleHours,
  activeOrdersCount,
  shippedThisWeek,
  slaPerformance,
  breachedCount,
  targetCycleHours,
  fmtCycleTime,
}: KpiStripProps) {
  const cycleOverTarget = avgCycleHours > targetCycleHours

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

      {/* Avg Cycle Time: lower = better → down arrow green when improving */}
      <StatCard
        label="Avg Cycle Time"
        value={fmtCycleTime(avgCycleHours)}
        color={cycleOverTarget ? '#EF4444' : '#10B981'}
        trend={{
          direction: cycleOverTarget ? 'up' : 'down',
          value: 'Target: ' + fmtCycleTime(targetCycleHours),
          positive: !cycleOverTarget,
        }}
        icon={Timer}
      />

      {/* Active Requests: neutral count, no trend arrow */}
      <StatCard
        label="Active Requests"
        value={activeOrdersCount}
        color="#10B981"
        icon={Package}
      />

      {/* Shipped This Week: higher = better → up arrow green */}
      <StatCard
        label="Shipped This Week"
        value={shippedThisWeek}
        color="#22C55E"
        trend={{ direction: 'up', value: 'this week', positive: true }}
        icon={CheckCircle2}
      />

      {/* SLA Performance: higher % = better → up arrow green */}
      <StatCard
        label="SLA Performance"
        value={slaPerformance + '%'}
        color={slaPerformance >= 90 ? '#22C55E' : slaPerformance >= 70 ? '#F59E0B' : '#EF4444'}
        trend={{
          direction: slaPerformance >= 90 ? 'up' : 'down',
          value: breachedCount + ' at risk',
          positive: slaPerformance >= 90,
        }}
        icon={TrendingUp}
      />

      {/* Orders at Risk: lower = better → down arrow green when fewer breaches */}
      <StatCard
        label="Orders at Risk"
        value={breachedCount}
        color={breachedCount === 0 ? '#22C55E' : breachedCount <= 3 ? '#F59E0B' : '#EF4444'}
        trend={{
          direction: breachedCount === 0 ? 'down' : 'up',
          value: breachedCount === 0 ? 'all on track' : 'SLA exceeded',
          positive: breachedCount === 0,
        }}
        icon={AlertCircle}
      />

    </div>
  )
}
