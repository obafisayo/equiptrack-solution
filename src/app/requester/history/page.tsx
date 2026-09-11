'use client'

import { useState } from 'react'
import { History, Package, Ship, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { LIVE_ORDERS } from '@/lib/workflow-store'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function RequesterHistoryPage() {
  const [search, setSearch] = useState('')

  const completed = LIVE_ORDERS.filter(
    o => o.stage === 'Completed' && (o.requestedBy === 'REQ1' || o.requestedByName === 'Kenneth Nwosu')
  )

  const filtered = search.trim()
    ? completed.filter(o => {
        const q = search.toLowerCase()
        return (
          o.id.toLowerCase().includes(q) ||
          o.destination.toLowerCase().includes(q) ||
          (o.waybillNumber ?? '').toLowerCase().includes(q)
        )
      })
    : completed

  return (
    <AppShell
      role="requester"
      currentPath="/requester/history"
      title="Request History"
      breadcrumb={[{ label: 'My Requests', href: '/requester' }, { label: 'History' }]}
      search={{ placeholder: 'Search by delivery no., destination or waybill…', value: search, onChange: setSearch }}
    >
      {filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No completed requests yet"
          description="Requests you have received and marked complete will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <Card key={o.id} className="p-0 overflow-hidden border-green-200">
              {/* Header */}
              <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                      Completed
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      o.urgency === 'Urgent' ? 'bg-red-100 text-red-700' :
                      o.urgency === 'High'   ? 'bg-orange-100 text-orange-700' :
                      o.urgency === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                               'bg-green-100 text-green-700'
                    }`}>{o.urgency}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500">{o.requestType} · submitted {fmtDate(o.createdAt)}</p>
                </div>
              </div>

              {/* Container / vessel / waybill */}
              {(o.containerId || o.allocatedVessel || o.waybillNumber) && (
                <div className="px-4 py-2 border-b border-border-default/60 bg-gray-50 flex flex-wrap gap-3 text-xs">
                  {o.containerId && (
                    <span className="flex items-center gap-1 font-mono font-semibold text-gray-700">
                      <Package size={11} className="text-gray-400" />
                      {o.containerId}
                    </span>
                  )}
                  {o.allocatedVessel && (
                    <span className="flex items-center gap-1 text-green-700 font-semibold">
                      <Ship size={11} />
                      {o.allocatedVessel}
                    </span>
                  )}
                  {o.waybillNumber && (
                    <span className="flex items-center gap-1 font-mono text-gray-500">
                      <FileText size={11} className="text-gray-400" />
                      {o.waybillNumber}
                    </span>
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

              {/* Journey strip */}
              {o.stageHistory.length > 0 && (
                <div className="px-4 py-2 border-t border-border-default/60 bg-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Journey</p>
                  <div className="flex flex-wrap gap-1.5">
                    {o.stageHistory.map((h, i) => (
                      <span key={i} className="text-[10px] bg-white border border-border-default rounded px-1.5 py-0.5 text-gray-500">
                        {h.stage}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  )
}
