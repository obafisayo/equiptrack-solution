'use client'

import { Package, CheckCircle, Lock, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface ContainerStatsProps {
  total: number
  available: number
  locked: number
  expired: number
}

export function ContainerStats({ total, available, locked, expired }: ContainerStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total CCUs" value={total}     color="#1A6FBF" icon={Package} />
      <StatCard label="Available"  value={available} color="#16A34A" icon={CheckCircle} />
      <StatCard label="Locked"     value={locked}     color={locked > 0 ? '#F97316' : '#16A34A'} icon={Lock} />
      <StatCard label="Expired"    value={expired}    color={expired > 0 ? '#DC2626' : '#16A34A'} icon={AlertTriangle} />
    </div>
  )
}
