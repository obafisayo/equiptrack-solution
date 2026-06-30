'use client'

import { X, Clock, Target, Hash, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { WORK_ORDERS } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours, getSlaStatus } from '@/config/sla'
import type { HeatmapCellData } from '@/components/domain/BottleneckHeatmap'

interface HeatmapDetailPanelProps {
  selectedCell: HeatmapCellData
  onClose: () => void
}

export function HeatmapDetailPanel({ selectedCell, onClose }: HeatmapDetailPanelProps) {
  const ratio = selectedCell.avgHours / Math.max(selectedCell.slaHours, 1)
  const pct = Math.min(ratio * 100, 100)
  const over = ratio > 1
  const warn = ratio > 0.75
  const barColor = over ? '#EF4444' : warn ? '#F59E0B' : '#22C55E'
  const statusLabel = over ? 'SLA Breached' : warn ? 'Near SLA Limit' : 'On Track'

  const stageOrders = WORK_ORDERS.filter(o => o.stage === selectedCell.stage)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />
      {/* Panel */}
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-overlay flex flex-col animate-slide-in">
        {/* Panel header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
              {selectedCell.department}
            </p>
            <h2 className="text-lg font-bold text-neutral-900 leading-tight">
              {selectedCell.stage}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: Clock,
                label: 'Avg Dwell',
                value: selectedCell.avgHours + 'h',
                sub: 'actual time in stage',
                color: selectedCell.avgHours > selectedCell.slaHours ? '#EF4444' : '#22C55E',
              },
              {
                icon: Target,
                label: 'SLA Target',
                value: selectedCell.slaHours + 'h',
                sub: 'maximum allowed',
                color: '#3B82F6',
              },
              {
                icon: Hash,
                label: 'Active Orders',
                value: String(selectedCell.count),
                sub: 'currently in stage',
                color: '#8B5CF6',
              },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="bg-neutral-50 rounded-lg p-3 flex flex-col gap-1 border border-border-default">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <Icon size={12} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
                </div>
                <span className="text-xl font-bold" style={{ color }}>{value}</span>
                <span className="text-[10px] text-neutral-400">{sub}</span>
              </div>
            ))}
          </div>

          {/* SLA gauge */}
          <div className="bg-white rounded-lg border border-border-default p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-neutral-700">SLA Consumption</span>
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ color: barColor, background: barColor + '18' }}
              >
                {statusLabel}
              </span>
            </div>
            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-neutral-500">
              <span>0h</span>
              <span className="font-semibold" style={{ color: barColor }}>
                {Math.round(ratio * 100)}% of SLA used
              </span>
              <span>{selectedCell.slaHours}h</span>
            </div>
            {over && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-100 rounded-md p-3">
                <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  Orders in this stage are averaging <strong>{selectedCell.avgHours - selectedCell.slaHours}h over</strong> the SLA target.
                  This is a bottleneck requiring immediate attention.
                </p>
              </div>
            )}
          </div>

          {/* Orders in this stage */}
          {!stageOrders.length ? (
            <div className="text-center py-6 text-neutral-400 text-sm">No active orders in this stage</div>
          ) : (
            <div>
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                Orders in This Stage ({stageOrders.length})
              </h3>
              <div className="space-y-2">
                {stageOrders.map(o => {
                  const sla = STAGE_SLA_HOURS[o.stage]
                  const status = getSlaStatus(o.elapsedHours, sla)
                  return (
                    <div key={o.id} className="flex items-center justify-between bg-neutral-50 rounded-lg px-3 py-2.5 border border-border-default">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-brand-500">{o.id}</span>
                        <span className="text-xs text-neutral-600 font-medium truncate max-w-[120px]">{o.destination}</span>
                      </div>
                      <span className={`text-xs font-bold ${status.breached ? 'text-red-600' : status.warning ? 'text-amber-600' : 'text-green-600'}`}>
                        {fmtHours(o.elapsedHours)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Panel footer */}
        <div className="px-6 py-4 border-t border-border-default shrink-0">
          <Link
            href="/executive/bottlenecks"
            className="block w-full text-center bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors no-underline"
          >
            View Full Bottleneck Analysis
          </Link>
        </div>
      </aside>
    </>
  )
}
