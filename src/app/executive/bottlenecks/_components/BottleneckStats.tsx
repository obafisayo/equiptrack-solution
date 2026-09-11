'use client'

import { AlertTriangle, Clock, BarChart2, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'
import type { StageStat } from './types'

interface BottleneckStatsProps {
  bottleneckCount: number
  totalBreached: number
  avgRatio: number
  worstStage: StageStat | undefined
}

export function BottleneckStats({ bottleneckCount, totalBreached, avgRatio, worstStage }: BottleneckStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Active Bottleneck Stages" value={bottleneckCount} color="#DC2626" icon={AlertTriangle} />
      <StatCard label="Orders Breaching SLA"      value={totalBreached}  color="#F97316" icon={Clock} />
      <StatCard label="Avg SLA Ratio"             value={`${Math.round(avgRatio * 100)}%`} color="#D97706" icon={BarChart2} />
      <StatCard
        label="Worst Stage"
        value={worstStage?.stage.split(' ').slice(0, 2).join(' ') ?? '-'}
        color="#DC2626"
        icon={TrendingDown}
      />
    </div>
  )
}
