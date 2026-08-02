'use client'

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { ChartCard } from '@/components/domain/Charts'
import { getStageTimingData } from './mock-analytics'

const STAGE_SHORT: Record<string, string> = {
  'Preload QAQC':    'Preload',
  'Containerization': 'Container.',
  'Post QAQC':       'Post QAQC',
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border-default rounded-lg shadow-overlay px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: <span className="font-bold">{p.value}h</span>
        </p>
      ))}
    </div>
  )
}

export function StageTimingSection() {
  const data = getStageTimingData()

  const chartData = data.map(d => ({
    name:    STAGE_SHORT[d.stage] ?? d.stage,
    Actual:  d.avgActual,
    Target:  d.slaTarget,
  }))

  return (
    <ChartCard
      title="Stage Duration vs SLA Target"
      subtitle="Average actual time (hours) compared to SLA target for each QAQC stage"
    >
      <div style={{ height: 180 }} className="mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
            <Legend
              iconType="square"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: '#6B7280', paddingTop: 8 }}
            />
            <Bar dataKey="Actual" name="Actual avg" fill="#F59E0B" radius={[4, 4, 0, 0]} animationDuration={600} />
            <Bar dataKey="Target" name="SLA target" fill="#E2E8F0" radius={[4, 4, 0, 0]} animationDuration={600} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="border border-border-default rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-border-default">
              <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Stage</th>
              <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Avg Actual</th>
              <th className="text-right px-4 py-2.5 font-semibold text-gray-600">SLA Target</th>
              <th className="text-right px-4 py-2.5 font-semibold text-gray-600">% of SLA</th>
              <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const isOver    = row.pctOfSla > 100
              const isWarning = row.pctOfSla > 80 && !isOver
              const statusLabel = isOver ? 'Over SLA' : isWarning ? 'At Risk' : 'On Target'
              const statusClass = isOver
                ? 'bg-red-50 text-red-700'
                : isWarning
                ? 'bg-amber-50 text-amber-700'
                : 'bg-green-50 text-green-700'
              return (
                <tr
                  key={row.stage}
                  className={i < data.length - 1 ? 'border-b border-border-default' : ''}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">{row.stage}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{row.avgActual}h</td>
                  <td className="px-4 py-3 text-right text-gray-500">{row.slaTarget}h</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">{row.pctOfSla}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}
