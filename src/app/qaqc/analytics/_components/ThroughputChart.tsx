'use client'

import { useState } from 'react'
import { ChartCard, TrendChart } from '@/components/domain/Charts'
import { getThroughputData } from './mock-analytics'

type Period = '7d' | '30d' | '90d'

const PERIODS: { value: Period; label: string }[] = [
  { value: '7d',  label: '7d'  },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
]

export function ThroughputChart() {
  const [period, setPeriod] = useState<Period>('30d')
  const { labels, values } = getThroughputData(period)

  return (
    <ChartCard
      title="Inspection Throughput"
      subtitle="Daily orders processed through QAQC stages"
    >
      <div className="flex items-center justify-end gap-1 mb-3">
        {PERIODS.map(p => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={[
              'px-2.5 py-1 rounded text-[11px] font-semibold transition-colors duration-150',
              period === p.value
                ? 'bg-brand-500 text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>
      <TrendChart
        series={[{ label: 'Inspections', values, color: '#F59E0B' }]}
        labels={labels}
        height={180}
      />
    </ChartCard>
  )
}
