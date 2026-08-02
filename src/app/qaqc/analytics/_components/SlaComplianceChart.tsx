'use client'

import { ChartCard, TrendChart } from '@/components/domain/Charts'
import { getSlaComplianceWeekly } from './mock-analytics'

export function SlaComplianceChart() {
  const { labels, values } = getSlaComplianceWeekly()

  return (
    <ChartCard
      title="SLA Compliance Trend"
      subtitle="Weekly % of QAQC stages completed on time (target: 90%)"
    >
      {/* Target reference line label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-px bg-emerald-500" style={{ borderTop: '2px dashed #10B981' }} />
          <span className="text-[11px] text-gray-400">90% target</span>
        </div>
      </div>
      <TrendChart
        series={[{ label: 'On-Time %', values, color: '#10B981' }]}
        labels={labels}
        height={180}
      />
    </ChartCard>
  )
}
