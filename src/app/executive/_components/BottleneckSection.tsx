'use client'

import Link from 'next/link'
import { BottleneckHeatmap, type HeatmapCellData } from '@/components/domain/BottleneckHeatmap'
import type { Stage } from '@/lib/lifecycle'

interface BottleneckSectionProps {
  heatmapData: HeatmapCellData[]
  selectedStage: Stage | null
  onSelect: (cell: HeatmapCellData) => void
}

export function BottleneckSection({ heatmapData, selectedStage, onSelect }: BottleneckSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 tracking-wide m-0">Department Dwell Time</h2>
          <p className="text-xs text-neutral-500 mt-0.5 m-0">Avg hours per stage vs SLA target - color indicates breach severity</p>
        </div>
        <Link href="/executive/bottlenecks" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline transition-colors">
          View detailed analysis &rarr;
        </Link>
      </div>
      <BottleneckHeatmap
        data={heatmapData}
        onSelect={onSelect}
        selectedStage={selectedStage}
      />
    </section>
  )
}
