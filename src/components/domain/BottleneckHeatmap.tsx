'use client'

import { DEPARTMENT_COLOR } from '@/lib/lifecycle'
import { fmtHours } from '@/config/sla'

interface HeatmapCell {
  stage: string
  department: 'pending' | 'warehouse' | 'dispatch' | 'qaqc' | 'final'
  avgHours: number
  slaHours: number
  count: number
}

const STATUS_CONFIG = {
  CRITICAL: { bg: '#FEE2E2', border: '#EF4444', text: '#DC2626', bar: '#EF4444' },
  BREACHED: { bg: '#FEE2E2', border: '#F87171', text: '#EF4444', bar: '#F87171' },
  WARNING:  { bg: '#FEF3C7', border: '#F59E0B', text: '#D97706', bar: '#F59E0B' },
  OK:       { bg: '#DCFCE7', border: '#4ADE80', text: '#16A34A', bar: '#22C55E' },
  EMPTY:    { bg: '#F1F5F9', border: '#CBD5E1', text: '#94A3B8', bar: '#CBD5E1' },
}

export function BottleneckHeatmap({ data }: { data: HeatmapCell[] }) {
  if (!data.length) {
    return <p className="text-sm text-gray-400 text-center py-8">No data available.</p>
  }

  return (
    <div className="bg-white border border-border-default rounded-card shadow-card p-4">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {[
          { label: 'Critical (>1.5× SLA)', color: '#DC2626', bg: '#FEE2E2' },
          { label: 'Breached (>SLA)',       color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Warning (>75% SLA)',    color: '#D97706', bg: '#FEF3C7' },
          { label: 'On Track',              color: '#16A34A', bg: '#DCFCE7' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm border"
              style={{ background: item.bg, borderColor: item.color + '80' }}
            />
            <span className="text-[10px] text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {data.map((cell) => {
          const ratio = cell.slaHours > 0 ? cell.avgHours / cell.slaHours : 0
          const deptColor = DEPARTMENT_COLOR[cell.department]

          const statusKey =
            cell.count === 0
              ? 'EMPTY'
              : ratio >= 1.5
              ? 'CRITICAL'
              : ratio >= 1
              ? 'BREACHED'
              : ratio >= 0.75
              ? 'WARNING'
              : 'OK'

          const cfg = STATUS_CONFIG[statusKey]

          return (
            <div
              key={cell.stage}
              className="rounded-lg p-3 border transition-all"
              style={{
                background: cfg.bg,
                borderColor: cfg.border + '60',
                borderLeftWidth: '3px',
                borderLeftColor: deptColor,
              }}
            >
              <p className="text-[11px] font-semibold text-gray-700 leading-tight mb-2 line-clamp-2" style={{ minHeight: '2rem' }}>
                {cell.stage}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-base font-bold" style={{ color: cfg.text }}>
                    {cell.count === 0 ? '—' : fmtHours(cell.avgHours)}
                  </p>
                  <p className="text-[10px] text-gray-400">avg dwell</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: cfg.text }}>
                    {statusKey}
                  </p>
                  <p className="text-[10px] text-gray-400">{cell.count} orders</p>
                </div>
              </div>
              {cell.count > 0 && (
                <div className="mt-2 w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(ratio * 100, 100)}%`,
                      background: cfg.bar,
                    }}
                  />
                </div>
              )}
              <p className="text-[9px] text-gray-400 mt-1">SLA: {fmtHours(cell.slaHours)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
