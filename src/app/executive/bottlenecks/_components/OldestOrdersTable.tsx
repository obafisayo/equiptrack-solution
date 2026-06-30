'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { fmtHours } from '@/config/sla'
import type { WorkOrder } from '@/lib/mock-data'

interface OldestOrdersTableProps {
  orders: WorkOrder[]
}

export function OldestOrdersTable({ orders }: OldestOrdersTableProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Top 10 Oldest Active Orders" />
      <div className="mt-3 bg-white border border-border-default rounded-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border-default">
            <tr>
              {['Delivery No.', 'Destination', 'Current Stage', 'Total Time', 'Responsible', 'Urgency'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {orders.map((o, i) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                    <span className="font-mono font-semibold text-brand-500 text-xs">{o.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700 text-xs truncate max-w-[120px]">{o.destination}</td>
                <td className="px-4 py-3"><StagePill stage={o.stage} /></td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold text-red-600">{fmtHours(o.totalElapsedHours)}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{o.assignedToName ?? 'Unassigned'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${
                    o.urgency === 'Urgent' ? 'text-red-600' :
                    o.urgency === 'High'   ? 'text-orange-500' :
                    o.urgency === 'Medium' ? 'text-amber-500' : 'text-green-600'
                  }`}>{o.urgency}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
