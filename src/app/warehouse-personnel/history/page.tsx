'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { StagePill } from '@/components/domain/Pills'
import { WORK_ORDERS, type WorkOrder } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'
import { type Stage, STAGE_DEPARTMENT, DEPARTMENT_COLOR } from '@/lib/lifecycle'

// Orders previously handled by WH1 (Emeka Okonkwo) â€” stages beyond Transferred to Dispatch
const HISTORY_STAGES: Stage[] = [
  'Transferred to Dispatch', 'Dispatch Queue', 'Dispatch Assigned',
  'Preload QAQC', 'Containerization', 'Post QAQC',
  'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace',
  'Shipped', 'Completed',
]

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function WarehousePersonnelHistoryPage() {
  const historyOrders = WORK_ORDERS.filter(
    o => HISTORY_STAGES.includes(o.stage as Stage) && o.stageHistory?.some(h => h.personId === 'WH1')
  )

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = historyOrders.filter(o => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return o.id.toLowerCase().includes(q) || o.destination.toLowerCase().includes(q)
  })

  const selectedOrder = historyOrders.find(o => o.id === selectedOrderId) ?? null

  function getMyDuration(order: WorkOrder): number {
    const myStages = order.stageHistory?.filter(h => h.personId === 'WH1') ?? []
    return myStages.reduce((sum, h) => sum + (h.durationHours ?? 0), 0)
  }

  function getHandedOffStage(order: WorkOrder): Stage {
    const myIdx = order.stageHistory?.findLastIndex(h => h.personId === 'WH1') ?? -1
    if (myIdx < 0) return order.stage as Stage
    const next = order.stageHistory?.[myIdx + 1]
    return (next?.stage ?? 'Transferred to Dispatch') as Stage
  }

  return (
    <AppShell role="wh_per" currentPath="/warehouse-personnel/history" title="My History">
      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search delivery number or destinationâ€¦"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 h-9 rounded-md border border-border-default text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <p className="text-xs text-gray-500 mb-4">{filtered.length} order{filtered.length !== 1 ? 's' : ''} previously handled</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No history found</div>
      ) : (
        <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-gray-50">
                {['Delivery No.', 'Destination', 'Handed Off At', 'My Time', 'Current Stage', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map(order => {
                const handedOff = getHandedOffStage(order)
                const myDuration = getMyDuration(order)
                const dept = STAGE_DEPARTMENT[order.stage as Stage]
                const deptColor = DEPARTMENT_COLOR[dept]

                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedOrderId === order.id ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono-id text-brand-500 font-semibold text-xs">{order.id}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{order.destination}</td>
                    <td className="px-4 py-3">
                      <StagePill stage={handedOff} />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{fmtHours(myDuration)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: `${deptColor}18`,
                          color: deptColor,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: deptColor }}
                        />
                        {order.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(order.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Read-only detail panel */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          role="wh_per"
        />
      )}
    </AppShell>
  )
}
