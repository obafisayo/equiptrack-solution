'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import WorkOrderCard from '@/components/domain/WorkOrderCard'
import DetailPanel from '@/components/domain/DetailPanel'
import StatCard from '@/components/domain/StatCard'
import { WORK_ORDERS } from '@/lib/mock-data'
import { getSlaStatus } from '@/config/sla'
import { STAGE_SLA_HOURS } from '@/config/sla'
import Link from 'next/link'

type Tab = 'all' | 'active' | 'completed'

const DISPATCH_SIDE = ['Dispatch Queue','Dispatch Assigned','Preload QAQC','Containerization','Post QAQC','Waybill Pending Signature','Waybill Done','Awaiting Deckspace']

export default function RequesterPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // In a real app this would be the authenticated user's orders
  const myOrders = useMemo(() => WORK_ORDERS.filter(o => o.requestedBy === 'REQ1'), [])

  const stats = useMemo(() => {
    const active    = myOrders.filter(o => o.stage !== 'Completed' && o.stage !== 'Shipped')
    const dispatch  = myOrders.filter(o => DISPATCH_SIDE.includes(o.stage))
    const atRisk    = myOrders.filter(o => {
      const slaH = STAGE_SLA_HOURS[o.stage]
      if (!slaH) return false
      const { pct } = getSlaStatus(o.elapsedHours, slaH)
      return pct >= 75 && o.stage !== 'Completed'
    })
    const completed = myOrders.filter(o => o.stage === 'Completed')
    return { active: active.length, dispatch: dispatch.length, atRisk: atRisk.length, completed: completed.length }
  }, [myOrders])

  const filteredOrders = useMemo(() => {
    let list = myOrders
    if (tab === 'active')    list = list.filter(o => o.stage !== 'Completed' && o.stage !== 'Shipped')
    if (tab === 'completed') list = list.filter(o => o.stage === 'Completed' || o.stage === 'Shipped')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.destination.toLowerCase().includes(q)
      )
    }
    return list
  }, [myOrders, tab, search])

  const selectedOrder = useMemo(() => myOrders.find(o => o.id === selectedId) ?? null, [myOrders, selectedId])

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'active',    label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ]

  return (
    <AppShell
      role="requester"
      currentPath="/requester"
      title="My Requests"
      search={{ placeholder: 'Search by delivery no. or destination…', value: search, onChange: setSearch }}
      actions={
        <Link
          href="/requester/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-button transition-colors duration-150"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Request
        </Link>
      }
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Requests"     value={stats.active}    color="#3B82F6" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>} />
        <StatCard label="Awaiting Dispatch"   value={stats.dispatch}  color="#8B5CF6" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>} />
        <StatCard label="SLA At Risk"         value={stats.atRisk}    color="#F97316" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4M12 16h.01"/></svg>} />
        <StatCard label="Completed This Month" value={stats.completed} color="#10B981" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><polyline points="20 6 9 17 4 12"/></svg>} />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-5 border-b border-border-default">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px ${
              tab === t.key
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} className="mb-4 opacity-40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
          </svg>
          <p className="text-sm font-medium">No requests found</p>
          <p className="text-xs mt-1 text-gray-400">
            {tab !== 'all' ? 'Try switching tabs or' : ''} <Link href="/requester/new" className="text-brand-500 hover:underline">create a new request</Link>
          </p>
        </div>
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
      )}

      {/* Detail Panel */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          role="requester"
        />
      )}
    </AppShell>
  )
}
