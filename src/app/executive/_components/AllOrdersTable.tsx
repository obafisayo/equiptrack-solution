'use client'

import { StagePill } from '@/components/domain/Pills'
import { STAGE_SLA_HOURS, fmtHours, getSlaStatus } from '@/config/sla'
import type { WorkOrder } from '@/lib/mock-data'
import type { SortCol } from './types'

interface AllOrdersTableProps {
  orders: WorkOrder[]
  isOpen: boolean
  onToggle: () => void
  sortCol: SortCol
  onSortColChange: (col: SortCol) => void
}

const COLUMNS: { key: SortCol | null; label: string }[] = [
  { key: 'id',      label: 'Delivery No.' },
  { key: 'stage',   label: 'Stage' },
  { key: 'elapsed', label: 'Elapsed' },
  { key: null,      label: 'Destination' },
  { key: null,      label: 'Urgency' },
  { key: null,      label: 'Responsible' },
]

export function AllOrdersTable({ orders, isOpen, onToggle, sortCol, onSortColChange }: AllOrdersTableProps) {
  return (
    <section>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 mb-3 text-sm font-semibold text-neutral-700 hover:text-neutral-900 focus:outline-none"
      >
        <span>All Active Orders ({orders.length})</span>
        <span className="text-neutral-400 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="bg-white border border-border-default rounded-card shadow-card overflow-x-auto animate-fade-in">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-border-default">
              <tr>
                {COLUMNS.map(col => (
                  <th
                    key={col.label}
                    onClick={() => col.key && onSortColChange(col.key)}
                    className={['text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3', col.key ? 'cursor-pointer hover:text-neutral-700' : ''].join(' ')}
                  >
                    {col.label}
                    {col.key && sortCol === col.key && <span className="ml-1 text-brand-500">&darr;</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {orders.map(o => {
                const sla = STAGE_SLA_HOURS[o.stage]
                const status = getSlaStatus(o.elapsedHours, sla)
                return (
                  <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-500 text-xs">{o.id}</td>
                    <td className="px-4 py-3"><StagePill stage={o.stage} /></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${status.breached ? 'text-red-600' : status.warning ? 'text-amber-600' : 'text-green-600'}`}>
                        {fmtHours(o.elapsedHours)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-700 text-xs truncate max-w-[140px] font-medium">{o.destination}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-badge">{o.urgency}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-xs font-medium">{o.assignedToName ?? 'Unassigned'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
