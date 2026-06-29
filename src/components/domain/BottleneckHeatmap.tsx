/* eslint-disable */
'use client'

import { Info } from 'lucide-react'
import type { Stage } from '@/lib/lifecycle'

export interface HeatmapCellData {
  stage: Stage
  department: string
  avgHours: number
  slaHours: number
  count: number
}

interface BottleneckHeatmapProps {
  data: HeatmapCellData[]
  onSelect?: (cell: HeatmapCellData) => void
  selectedStage?: Stage | null
}

export function BottleneckHeatmap({ data, onSelect, selectedStage }: BottleneckHeatmapProps) {
  function getSeverityColor(ratio: number) {
    if (ratio < 0.75) return '#22C55E'
    if (ratio <= 1.0) return '#F59E0B'
    if (ratio <= 1.5) return '#EF4444'
    return '#B91C1C'
  }

  const grouped = data.reduce((acc, curr) => {
    if (!acc[curr.department]) acc[curr.department] = []
    acc[curr.department].push(curr)
    return acc
  }, {} as Record<string, HeatmapCellData[]>)

  const departments = Object.keys(grouped)

  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm p-5">

      {/* ── Header & Legend ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-[15px] font-bold text-neutral-900 m-0 flex items-center gap-2">
            Department Dwell Time Heatmap
            <div className="group relative cursor-help">
              <Info size={14} className="text-neutral-400" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-neutral-900 text-white text-[11px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Visualizes average time equipment spends in each stage vs. the target SLA. Click any cell for details.
                <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-neutral-900" />
              </div>
            </div>
          </h3>
          <p className="text-xs text-neutral-500 mt-1 m-0">Click a cell to view details — avg actual hours vs target SLA hours per stage</p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-semibold text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#22C55E]"></span> On Track
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]"></span> Near SLA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]"></span> Breached
          </span>
        </div>
      </div>

      {/* ── Heatmap Grid ── */}
      <div className="space-y-6">
        {departments.map(dept => (
          <div key={dept}>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 pb-1 border-b border-neutral-100">
              {dept}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {grouped[dept].map(item => {
                const ratio = item.avgHours / Math.max(item.slaHours, 1)
                const color = getSeverityColor(ratio)
                const isSelected = selectedStage === item.stage

                return (
                  <button
                    type="button"
                    key={item.stage}
                    onClick={() => onSelect?.(item)}
                    className={[
                      'relative p-3 rounded-lg border flex flex-col justify-between overflow-hidden',
                      'transition-all duration-150 text-left w-full',
                      onSelect ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : 'cursor-default',
                      isSelected ? 'shadow-md scale-[1.02]' : '',
                    ].join(' ')}
                    style={{
                      borderColor: isSelected ? color : `${color}40`,
                      backgroundColor: `${color}${isSelected ? '14' : '08'}`,
                      outline: isSelected ? `2px solid ${color}` : 'none',
                      outlineOffset: '2px',
                    }}
                  >
                    {/* Top row: Stage name + count */}
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-neutral-800 leading-tight pr-2">
                        {item.stage}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-white border border-neutral-200 text-neutral-600 shadow-sm">
                        {item.count}
                      </span>
                    </div>

                    {/* Bottom row: Hours vs SLA */}
                    <div className="mt-auto">
                      <div className="flex items-end justify-between mb-1.5">
                        <span className="text-lg font-bold tracking-tight" style={{ color }}>
                          {item.avgHours}h
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-500 uppercase">
                          / {item.slaHours}h SLA
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden border border-[#00000010]">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(ratio * 100, 100)}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
