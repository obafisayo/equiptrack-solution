'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import type { SupervisorPerf } from './types'

interface SupervisorPerformanceTableProps {
  data: SupervisorPerf[]
}

function SlaComplianceBadge({ pct }: { pct: number }) {
  const isGood = pct >= 90
  const isWarn = pct >= 75 && pct < 90
  const className = isGood ? 'bg-status-success-bg text-status-success' : isWarn ? 'bg-status-medium-bg text-status-medium' : 'bg-status-critical-bg text-status-critical'
  return (
    <span className={['text-xs font-bold px-2.5 py-0.5 rounded-badge', className].join(' ')}>
      {pct}%
    </span>
  )
}

function TrendArrow({ direction }: { direction: 'up' | 'down' }) {
  return direction === 'up'
    ? <span className="text-status-success font-bold text-lg">&uarr;</span>
    : <span className="text-status-critical font-bold text-lg">&darr;</span>
}

export function SupervisorPerformanceTable({ data }: SupervisorPerformanceTableProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Performance by Supervisor" count={data.length} />
      <div className="mt-3 bg-white border border-border-default rounded-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              {['Supervisor', 'Team', 'Active Orders', 'Avg Stage Time', 'SLA Compliance', 'Trend'].map(col => (
                <th key={col} className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {data.map(sup => (
              <tr key={sup.name} className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-neutral-900">{sup.name}</td>
                <td className="px-4 py-3 text-neutral-600 font-medium">{sup.team}</td>
                <td className="px-4 py-3 font-bold text-neutral-900">{sup.activeOrders}</td>
                <td className="px-4 py-3 text-neutral-600 font-medium">{sup.avgStageTime}</td>
                <td className="px-4 py-3"><SlaComplianceBadge pct={sup.slaCompliance} /></td>
                <td className="px-4 py-3"><TrendArrow direction={sup.trend} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
