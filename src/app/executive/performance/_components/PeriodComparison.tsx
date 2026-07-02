'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { deltaLabel } from './helpers'

interface Metrics {
  shipped: number
  avgCycleHours: number
  slaPerformance: number
  breached: number
}

interface Props {
  current: Metrics
  previous: Metrics
  currentLabel: string
  previousLabel: string
}

function MetricCell({
  label,
  currentVal,
  previousVal,
  format,
  lowerIsBetter,
}: {
  label: string
  currentVal: number
  previousVal: number
  format?: (v: number) => string
  lowerIsBetter?: boolean
}) {
  const fmt   = format ?? ((v: number) => String(v))
  const delta = deltaLabel(currentVal, previousVal, lowerIsBetter)

  const DeltaIcon = delta.direction === 'up' ? TrendingUp : delta.direction === 'down' ? TrendingDown : Minus
  const deltaColor = delta.positive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-3">
        <div>
          <p className="text-[26px] font-bold text-gray-900 leading-none">{fmt(currentVal)}</p>
          <p className="text-[12px] text-gray-400 mt-1">{fmt(previousVal)} prior</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold mb-1 ${deltaColor}`}>
          <DeltaIcon size={11} />
          {delta.text}
        </span>
      </div>
    </div>
  )
}

function fmtHrs(h: number) {
  const d = Math.floor(h / 24)
  const hr = h % 24
  return d > 0 ? `${d}d ${hr}h` : `${h}h`
}

export function PeriodComparison({ current, previous, currentLabel, previousLabel }: Props) {
  return (
    <div className="bg-white border border-border-default rounded-card shadow-card p-5 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="px-2.5 py-1 text-[12px] font-bold bg-gray-900 text-white rounded-lg">{currentLabel}</span>
        <span className="text-gray-300">vs</span>
        <span className="px-2.5 py-1 text-[12px] font-semibold border border-border-default text-gray-500 rounded-lg">{previousLabel}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-border-default">
        <MetricCell
          label="Orders Shipped"
          currentVal={current.shipped}
          previousVal={previous.shipped}
        />
        <div className="pl-6">
          <MetricCell
            label="Avg Cycle Time"
            currentVal={current.avgCycleHours}
            previousVal={previous.avgCycleHours}
            format={fmtHrs}
            lowerIsBetter
          />
        </div>
        <div className="pl-6">
          <MetricCell
            label="SLA Performance"
            currentVal={current.slaPerformance}
            previousVal={previous.slaPerformance}
            format={v => v + '%'}
          />
        </div>
        <div className="pl-6">
          <MetricCell
            label="Orders Breached"
            currentVal={current.breached}
            previousVal={previous.breached}
            lowerIsBetter
          />
        </div>
      </div>
    </div>
  )
}
