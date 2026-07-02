'use client'

import { ChartCard, TrendChart, BarChart, LoadBars, DonutChart } from '@/components/domain/Charts'
import type { TrendDatum } from './types'

interface DonutDatum {
  label: string
  value: number
  color: string
}

interface BarDatum {
  label: string
  value: number
}

interface LoadBarDatum {
  label: string
  value: number
  max: number
}

interface AnalyticsChartsProps {
  trendData: TrendDatum[]
  donutData: DonutDatum[]
  barData: BarDatum[]
  loadBarsData: LoadBarDatum[]
}

export function AnalyticsCharts({ trendData, donutData, barData, loadBarsData }: AnalyticsChartsProps) {
  return (
    <>
      <h2 className="text-[15px] font-bold text-neutral-900 mb-4">Analytics</h2>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Requests Submitted vs Shipped" subtitle="Last 7 days">
          <TrendChart
            series={[
              { label: 'Submitted', values: trendData.map(d => d.submitted), color: '#F04A4A' },
              { label: 'Shipped',   values: trendData.map(d => d.shipped),   color: '#10B981' },
            ]}
            labels={trendData.map(d => d.day)}
            height={160}
          />
        </ChartCard>
        <ChartCard title="Orders by Department" subtitle="Current active requests">
          <DonutChart data={donutData} size={160} />
        </ChartCard>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ChartCard title="Weekly Volume" subtitle="Requests processed per day">
          <BarChart data={barData} height={220} color="#8B5CF6" />
        </ChartCard>
        <ChartCard title="Team Load" subtitle="Active orders vs capacity">
          <div className="max-h-[220px] overflow-y-auto pr-1">
            <LoadBars data={loadBarsData} />
          </div>
        </ChartCard>
      </div>
    </>
  )
}
