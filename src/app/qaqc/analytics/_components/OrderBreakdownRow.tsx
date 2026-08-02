'use client'

import { ChartCard, DonutChart } from '@/components/domain/Charts'
import { getOrdersByType, getOrdersByUrgency } from './mock-analytics'

export function OrderBreakdownRow() {
  const byType    = getOrdersByType()
  const byUrgency = getOrdersByUrgency()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartCard title="Orders by Request Type" subtitle="Distribution across all work order types">
        <DonutChart data={byType} size={140} />
      </ChartCard>
      <ChartCard title="Orders by Urgency" subtitle="Breakdown by urgency level">
        <DonutChart data={byUrgency} size={140} />
      </ChartCard>
    </div>
  )
}
