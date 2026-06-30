'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { TRDocumentModal, type TRDocumentData } from '@/components/domain/TRDocument'
import { WORK_ORDERS, type WorkOrder } from '@/lib/mock-data'
import { STAGE_DEPARTMENT, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, type UrgencyLevel } from '@/config/sla'
import { FilterBar, type RequestType, type SortOption, type ViewMode } from './_components/FilterBar'
import { OrdersCardGrid } from './_components/OrdersCardGrid'
import { OrdersTable } from './_components/OrdersTable'

function getSlaOverage(order: WorkOrder): number {
  const sla = STAGE_SLA_HOURS[order.stage]
  if (!sla) return 0
  return Math.max(0, order.elapsedHours - sla)
}

export default function AllOrdersPage() {
  const [orders] = useState<WorkOrder[]>(WORK_ORDERS)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<RequestType>('All')
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'All'>('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('oldest')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [trPreview, setTrPreview] = useState<TRDocumentData | null>(null)

  const filtered = useMemo(() => {
    let list = [...orders]

    if (deptFilter !== 'all') {
      list = list.filter(o => STAGE_DEPARTMENT[o.stage as Stage] === deptFilter)
    }
    if (typeFilter !== 'All') {
      list = list.filter(o => o.requestType === typeFilter)
    }
    if (urgencyFilter !== 'All') {
      list = list.filter(o => o.urgency === urgencyFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.destination.toLowerCase().includes(q) ||
          (o.assignedToName ?? '').toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => {
      if (sort === 'overdue') return getSlaOverage(b) - getSlaOverage(a)
      if (sort === 'newest') return b.totalElapsedHours - a.totalElapsedHours
      return a.totalElapsedHours - b.totalElapsedHours
    })

    return list
  }, [orders, deptFilter, typeFilter, urgencyFilter, search, sort])

  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null

  const slaBreachedCount = filtered.filter(o => {
    const sla = STAGE_SLA_HOURS[o.stage]
    return sla != null && o.elapsedHours > sla
  }).length

  return (
    <AppShell
      role="wh_sup"
      currentPath="/warehouse/orders"
      title="All Work Orders"
      breadcrumb={[{ label: 'Dashboard', href: '/warehouse' }]}
    >
      <FilterBar
        search={search}
        sort={sort}
        viewMode={viewMode}
        deptFilter={deptFilter}
        typeFilter={typeFilter}
        urgencyFilter={urgencyFilter}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onViewModeChange={setViewMode}
        onDeptFilterChange={setDeptFilter}
        onTypeFilterChange={setTypeFilter}
        onUrgencyFilterChange={setUrgencyFilter}
      />

      {/* Results header */}
      <div className="flex items-center gap-3 mb-4">
        <SectionTitle title="Work Orders" count={filtered.length} />
        {slaBreachedCount > 0 && (
          <span className="text-xs font-semibold text-status-critical bg-status-critical-bg px-2 py-0.5 rounded-full">
            {slaBreachedCount} SLA breached
          </span>
        )}
      </div>

      {viewMode === 'cards' && (
        <OrdersCardGrid orders={filtered} selectedOrderId={selectedOrderId} onSelectOrder={setSelectedOrderId} />
      )}

      {viewMode === 'table' && (
        <OrdersTable
          orders={filtered}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
          onPreviewTR={setTrPreview}
        />
      )}

      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          role="wh_sup"
        />
      )}

      {trPreview && (
        <TRDocumentModal data={trPreview} onClose={() => setTrPreview(null)}/>
      )}
    </AppShell>
  )
}
