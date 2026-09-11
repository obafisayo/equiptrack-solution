'use client'

import { useState } from 'react'
import { Truck, Package, Ship, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { LIVE_ORDERS } from '@/lib/workflow-store'
import { fmtHours } from '@/config/sla'

const MY_ID   = 'DP4'
const MY_NAME = 'Tunde Bello'

const SHIPPED_STAGES = ['Shipped', 'Completed']

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DispatchPersonnelHistoryPage() {
  const [search, setSearch] = useState('')

  // Orders this personnel handled that are now Shipped or Completed
  const history = LIVE_ORDERS.filter(o =>
    SHIPPED_STAGES.includes(o.stage) &&
    (o.assignedTo === MY_ID || o.stageHistory.some(h => h.personId === MY_ID))
  )

  const filtered = history.filter(o => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      o.id.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q) ||
      (o.waybillNumber ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <AppShell
      role="dsp_per"
      currentPath="/dispatch-personnel/history"
      title="My History"
      breadcrumb={[{ label: 'My Tasks', href: '/dispatch-personnel' }, { label: 'History' }]}
      search={{ placeholder: 'Search by delivery no., destination or waybill…', value: search, onChange: setSearch }}
    >
      <SectionTitle title="Shipped Orders" count={filtered.length} className="mb-4" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No shipped orders yet"
          description="Orders you have shipped will appear here once they leave the base."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(o => {
            const myStages = o.stageHistory.filter(h => h.personId === MY_ID)
            const isCompleted = o.stage === 'Completed'
            return (
              <Card key={o.id} className={`p-0 overflow-hidden ${isCompleted ? 'border-green-200' : 'border-purple-200'}`}>
                {/* Header */}
                <div className={`px-4 py-3 flex items-start justify-between gap-3 ${isCompleted ? 'bg-green-50' : 'bg-purple-50'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                      <StagePill stage={o.stage} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{o.destination}</p>
                    <p className="text-xs text-gray-500">{o.requestType} · {o.urgency} · {fmtDate(o.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0 text-xs text-gray-500">
                    <p className="font-semibold text-gray-700">{fmtHours(o.totalElapsedHours)} total</p>
                    {o.allocatedVessel && (
                      <p className="flex items-center gap-1 justify-end mt-1 text-green-700 font-semibold">
                        <Ship size={11} />
                        {o.allocatedVessel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Container + Waybill row */}
                {(o.containerId || o.waybillNumber) && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-b border-border-default/60 flex items-center gap-4 text-xs">
                    {o.containerId && (
                      <span className="flex items-center gap-1 text-gray-700 font-mono font-semibold">
                        <Package size={11} className="text-gray-400" />
                        {o.containerId}
                      </span>
                    )}
                    {o.waybillNumber && (
                      <span className="flex items-center gap-1 text-gray-700 font-mono">
                        <FileText size={11} className="text-gray-400" />
                        {o.waybillNumber}
                      </span>
                    )}
                    {o.requestedByName && (
                      <span className="text-gray-500 ml-auto">Req by <span className="font-semibold text-gray-700">{o.requestedByName}</span></span>
                    )}
                  </div>
                )}

                {/* Line items */}
                <div className="px-4 py-2 space-y-0.5">
                  {o.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Package size={9} className="text-gray-300 shrink-0" />
                        {item.description}
                      </span>
                      <span className="text-gray-400 ml-2 shrink-0">{item.qty} {item.unit}</span>
                    </div>
                  ))}
                </div>

                {/* My stages */}
                {myStages.length > 0 && (
                  <div className="px-4 py-2 border-t border-border-default/60 bg-gray-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">My Involvement</p>
                    <div className="flex flex-wrap gap-2">
                      {myStages.map((h, i) => (
                        <span key={i} className="text-[11px] bg-white border border-border-default rounded px-2 py-0.5 text-gray-600">
                          {h.stage}
                          {h.durationHours != null ? ` · ${fmtHours(h.durationHours)}` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
