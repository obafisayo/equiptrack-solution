'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClipboardList, CheckCircle2, Plus, Ship, Package } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import WorkOrderCard from '@/components/domain/WorkOrderCard'
import DetailPanel from '@/components/domain/DetailPanel'
import StatCard from '@/components/domain/StatCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { LIVE_ORDERS, markReceived } from '@/lib/workflow-store'
import type { WorkOrder } from '@/lib/mock-data'

type Tab = 'all' | 'active' | 'shipped' | 'completed'

export default function RequesterPage() {
  const [search,     setSearch]     = useState('')
  const [tab,        setTab]        = useState<Tab>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [orders,     setOrders]     = useState<WorkOrder[]>(
    () => LIVE_ORDERS.filter(o => o.requestedBy === 'REQ1' || o.requestedByName === 'Kenneth Nwosu')
  )

  function refresh() {
    setOrders(LIVE_ORDERS.filter(o => o.requestedBy === 'REQ1' || o.requestedByName === 'Kenneth Nwosu'))
  }

  function handleMarkReceived(id: string) {
    markReceived(id)
    refresh()
  }

  const activeCount    = orders.filter(o => o.stage !== 'Completed' && o.stage !== 'Shipped').length
  const shippedCount   = orders.filter(o => o.stage === 'Shipped').length
  const completedCount = orders.filter(o => o.stage === 'Completed').length

  let filteredOrders = orders
  if (tab === 'active')    filteredOrders = filteredOrders.filter(o => o.stage !== 'Completed' && o.stage !== 'Shipped')
  if (tab === 'shipped')   filteredOrders = filteredOrders.filter(o => o.stage === 'Shipped')
  if (tab === 'completed') filteredOrders = filteredOrders.filter(o => o.stage === 'Completed')

  if (search.trim()) {
    const q = search.toLowerCase()
    filteredOrders = filteredOrders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q)
    )
  }

  const selectedOrder = orders.find(o => o.id === selectedId) ?? null

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'all',       label: 'All' },
    { key: 'active',    label: 'Active',    count: activeCount },
    { key: 'shipped',   label: 'Shipped',   count: shippedCount },
    { key: 'completed', label: 'Completed', count: completedCount },
  ]

  return (
    <AppShell
      role="requester"
      currentPath="/requester"
      title="My Requests"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'My Requests' }]}
      search={{ placeholder: 'Search by delivery no. or destination…', value: search, onChange: setSearch }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Requests"  value={activeCount}    color="#1A6FBF" icon={ClipboardList} />
        <StatCard label="En Route"         value={shippedCount}   color="#8B5CF6" icon={Ship}         />
        <StatCard label="Completed"        value={completedCount} color="#16A34A" icon={CheckCircle2} />
      </div>

      <div className="flex items-center gap-1 mb-5 border-b border-border-default">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
              tab === t.key
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Shipped orders — show Mark Received card */}
      {tab === 'shipped' && filteredOrders.length > 0 && (
        <div className="space-y-3">
          {filteredOrders.map(o => (
            <Card key={o.id} className="p-4 border-purple-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Shipped
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.urgency} urgency</p>
                  {o.allocatedVessel && (
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Ship size={10} className="text-gray-400" />
                      {o.allocatedVessel}
                    </p>
                  )}
                  <div className="mt-2 space-y-0.5">
                    {o.items.map((item, i) => (
                      <p key={i} className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <Package size={9} className="text-gray-300 shrink-0" />
                        {item.qty} {item.unit} — {item.description}
                      </p>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleMarkReceived(o.id)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-button bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors shrink-0"
                >
                  <CheckCircle2 size={12} />
                  Mark Received
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* All other tabs — use WorkOrderCard grid */}
      {tab !== 'shipped' && (
        filteredOrders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No requests here"
            description="Your equipment requests will appear here once you submit them."
            action={{ label: 'Create your first request', href: '/requester/new' }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map(order => (
              <WorkOrderCard
                key={order.id}
                order={order}
                isSelected={order.id === selectedId}
                showActions={false}
                onClick={() => setSelectedId(order.id === selectedId ? null : order.id)}
              />
            ))}
          </div>
        )
      )}

      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          role="requester"
        />
      )}

      <Link
        href="/requester/new"
        aria-label="Create new request"
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-brand-500 text-white shadow-lg hover:bg-brand-600 transition-colors duration-150"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Link>
    </AppShell>
  )
}
