'use client'

import { ShieldCheck, Package, CheckCircle2, Archive } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface QaqcStatsProps {
  preloadCount: number
  containerizationCount: number
  postQaqcCount: number
  availableContainerCount: number
}

export function QaqcStats({ preloadCount, containerizationCount, postQaqcCount, availableContainerCount }: QaqcStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Pending Inspection"      value={preloadCount}          color="#D97706" icon={ShieldCheck} />
      <StatCard label="Containerization Active" value={containerizationCount} color="#1A6FBF" icon={Package} />
      <StatCard label="Post QAQC Pending"       value={postQaqcCount}         color="#2563EB" icon={CheckCircle2} />
      <StatCard label="Containers Available"    value={availableContainerCount} color="#16A34A" icon={Archive} />
    </div>
  )
}
