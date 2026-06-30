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
      <StatCard label="Pending Inspection"      value={preloadCount}          color="#F59E0B" icon={ShieldCheck} />
      <StatCard label="Containerization Active" value={containerizationCount} color="#8B5CF6" icon={Package} />
      <StatCard label="Post QAQC Pending"       value={postQaqcCount}         color="#3B82F6" icon={CheckCircle2} />
      <StatCard label="Containers Available"    value={availableContainerCount} color="#22C55E" icon={Archive} />
    </div>
  )
}
