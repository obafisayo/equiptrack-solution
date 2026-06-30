'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { DEPARTMENT_COLOR } from '@/lib/lifecycle'
import { fmtHours } from '@/config/sla'
import type { StageStat } from './types'

interface StageDwellSectionProps {
  stageStats: StageStat[]
}

function BarComparison({ label, actual, sla, dept }: { label: string; actual: number; sla: number; dept: string }) {
  const maxHours = Math.max(actual, sla) * 1.2 || 1
  const actualPct = (actual / maxHours) * 100
  const slaPct    = (sla / maxHours) * 100
  const color     = DEPARTMENT_COLOR[dept as keyof typeof DEPARTMENT_COLOR] ?? '#94A3B8'
  const breached  = actual > sla

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700 truncate flex-1 mr-2">{label}</span>
        <span className={`text-xs font-semibold flex-shrink-0 ${breached ? 'text-red-600' : 'text-gray-500'}`}>
          {fmtHours(actual)} / {fmtHours(sla)}
        </span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        {/* SLA marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
          style={{ left: `${slaPct}%` }}
        />
        {/* Actual bar */}
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${actualPct}%`,
            background: breached ? '#EF4444' : color,
          }}
        />
      </div>
    </div>
  )
}

export function StageDwellSection({ stageStats }: StageDwellSectionProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Stage Dwell Time vs SLA" />
      <div className="mt-3 bg-white border border-border-default rounded-card shadow-card p-4">
        <p className="text-xs text-gray-500 mb-4">
          Gray marker = SLA limit. Red bar = SLA breached. Sorted by worst ratio first.
        </p>
        <div className="divide-y divide-border-default">
          {stageStats.map(s => (
            <BarComparison
              key={s.stage}
              label={s.stage}
              actual={s.avgHours}
              sla={s.slaHours}
              dept={s.dept}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
