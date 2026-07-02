'use client'

import { PERSONNEL } from '@/lib/mock-data'
import type { ComparisonMode } from './helpers'

interface Props {
  mode: ComparisonMode
  deptFilter: string
}

const DEPT_LABEL: Record<string, string> = {
  warehouse: 'Warehouse',
  dispatch:  'Dispatch',
  qaqc:      'QAQC',
}

// Mock performance data derived from personnel capacity and active tasks
function getPersonnelStats(personId: string, mode: ComparisonMode) {
  const p = PERSONNEL.find(x => x.id === personId)
  if (!p) return { completed: 0, avgHours: 0, slaHitRate: 0 }

  // Simulate data based on capacity and current load
  const base = Math.round(p.active * (mode === 'daily' ? 0.4 : mode === 'weekly' ? 2.5 : mode === 'monthly' ? 10 : 120))
  const avgH = Math.round(8 + Math.random() * 16)
  const hitRate = Math.round(75 + Math.random() * 20)
  return { completed: base, avgHours: avgH, slaHitRate: hitRate }
}

export function IndividualPerformanceTable({ mode, deptFilter }: Props) {
  const filtered = deptFilter === 'All'
    ? PERSONNEL
    : PERSONNEL.filter(p => p.dept === deptFilter)

  return (
    <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-gray-800">Individual Performance</h3>
        <span className="text-[12px] text-gray-400 capitalize">{mode} view</span>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-border-default">
          <tr>
            {['Name', 'Dept', 'Orders Completed', 'Avg Hours / Order', 'SLA Hit Rate', 'Load'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {filtered.map(p => {
            const stats   = getPersonnelStats(p.id, mode)
            const loadPct = Math.round((p.active / p.capacity) * 100)
            const hitColor = stats.slaHitRate >= 90 ? 'text-green-600' : stats.slaHitRate >= 75 ? 'text-amber-600' : 'text-red-600'
            return (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-[13px] font-semibold text-gray-900">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.role}</p>
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-600 capitalize">{DEPT_LABEL[p.dept] ?? p.dept}</td>
                <td className="px-4 py-3 text-[14px] font-bold text-gray-900">{stats.completed}</td>
                <td className="px-4 py-3 text-[13px] text-gray-700">{stats.avgHours}h</td>
                <td className={`px-4 py-3 text-[13px] font-bold ${hitColor}`}>{stats.slaHitRate}%</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${loadPct > 90 ? 'bg-red-500' : loadPct > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: Math.min(loadPct, 100) + '%' }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 w-8">{loadPct}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
