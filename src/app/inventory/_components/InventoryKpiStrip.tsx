'use client'

import { Package, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'

interface InventoryKpiStripProps {
  okCount: number
  reorderCount: number
  criticalCount: number
  containerCount: number
}

export function InventoryKpiStrip({ okCount, reorderCount, criticalCount, containerCount }: InventoryKpiStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="In Stock"             value={okCount}        icon={CheckCircle}    color="#16A34A" />
      <StatCard label="Reorder Required"     value={reorderCount}   icon={TrendingDown}   color={reorderCount>0?'#D97706':'#16A34A'} />
      <StatCard label="Critical Low"         value={criticalCount}  icon={AlertTriangle}  color={criticalCount>0?'#DC2626':'#16A34A'} />
      <StatCard label="Containers Available" value={containerCount} icon={Package}        color="#1A6FBF" />
    </div>
  )
}
