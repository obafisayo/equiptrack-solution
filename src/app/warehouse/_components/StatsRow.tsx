'use client'

import { Package, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface StatsRowProps {
  activeOrdersCount: number
  breachedOrdersCount: number
}

export function StatsRow({ activeOrdersCount, breachedOrdersCount }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <StatCard label="Total Active Orders" value={activeOrdersCount} color="#94A3B8" icon={Package} />
      <StatCard
        label="SLA Breaches"
        value={breachedOrdersCount}
        color={breachedOrdersCount > 0 ? '#DC2626' : '#16A34A'}
        icon={AlertTriangle}
      />
    </div>
  )
}
