'use client'

import { useState, useMemo } from 'react'
import { ClipboardList, Truck, AlertCircle, CheckCircle2 } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import WorkOrderCard from '@/components/domain/WorkOrderCard'
import DetailPanel from '@/components/domain/DetailPanel'
import StatCard from '@/components/domain/StatCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { WORK_ORDERS } from '@/lib/mock-data'
import { getSlaStatus } from '@/config/sla'
import { STAGE_SLA_HOURS } from '@/config/sla'

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
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'My Requests' }]}
      search={{ placeholder: 'Search by delivery no. or destination…', value: search, onChange: setSearch }}
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Requests"      value={stats.active}    color="#3B82F6" icon={ClipboardList} />
        <StatCard label="Awaiting Dispatch"    value={stats.dispatch}  color="#8B5CF6" icon={Truck} />
        <StatCard label="SLA At Risk"          value={stats.atRisk}    color="#F97316" icon={AlertCircle} />
        <StatCard label="Completed This Month" value={stats.completed} color="#10B981" icon={CheckCircle2} />
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
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
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
