'use client'

import { Navigation, Package, Anchor, Calendar as CalIcon } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface Props {
  totalEvents: number
  awaitingCount: number
  loadingCount: number
  inTransitCount: number
}

export function KpiRow({ totalEvents, awaitingCount, loadingCount, inTransitCount }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      <StatCard label="Total Events" value={totalEvents} color="#1A6FBF" icon={CalIcon} />
      <StatCard label="Vessels Available" value={awaitingCount} color="#16A34A" icon={Navigation} />
      <StatCard label="Currently Loading" value={loadingCount} color="#D97706" icon={Package} />
      <StatCard label="In Transit" value={inTransitCount} color="#8B5CF6" icon={Anchor} />
    </div>
  )
}
