'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { WORK_ORDERS, type WorkOrder } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, type UrgencyLevel } from '@/config/sla'
import { DISPATCH_STAGES } from '@/app/dispatch/_components/constants'
import { FilterBar, type RequestType, type SortOption, type ViewMode } from './_components/FilterBar'
import { OrdersCardGrid } from '@/app/warehouse/orders/_components/OrdersCardGrid'
import { OrdersTable } from '@/app/warehouse/orders/_components/OrdersTable'
import { TRDocumentModal, type TRDocumentData } from '@/components/domain/TRDocument'
import { type Stage } from '@/lib/lifecycle'

function getSlaOverage(order: WorkOrder): number {
  const sla = STAGE_SLA_HOURS[order.stage]
  if (!sla) return 0
  return Math.max(0, order.elapsedHours - sla)
}

export default function DispatchAllOrdersPage() {
  const [orders] = useState<WorkOrder[]>(
    WORK_ORDERS.filter(o => DISPATCH_STAGES.includes(o.stage as Stage))
  )
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [stageFilter, setStageFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter] = useState<RequestType>('All')
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'All'>('All')
  const [monthFilter, setMonthFilter] = useState<string>('')
  const [yearFilter, setYearFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('oldest')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [trPreview, setTrPreview] = useState<TRDocumentData | null>(null)

  const filtered = useMemo(() => {
    let list = [...orders]

    if (stageFilter !== 'All') {
      list = list.filter(o => o.stage === stageFilter)
    }
    if (typeFilter !== 'All') {
      list = list.filter(o => o.requestType === typeFilter)
    }
    if (urgencyFilter !== 'All') {
      list = list.filter(o => o.urgency === urgencyFilter)
    }
    if (monthFilter || yearFilter) {
      list = list.filter(o => {
        const d = new Date(o.createdAt)
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const y = String(d.getFullYear())
        if (monthFilter && m !== monthFilter) return false
        if (yearFilter && y !== yearFilter) return false
        return true
      })
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
  }, [orders, stageFilter, typeFilter, urgencyFilter, monthFilter, yearFilter, search, sort])

  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null

  const slaBreachedCount = filtered.filter(o => {
    const sla = STAGE_SLA_HOURS[o.stage]
    return sla != null && o.elapsedHours > sla
  }).length

  return (
    <AppShell
      role="dsp_sup"
      currentPath="/dispatch/orders"
      title="All Work Orders"
      breadcrumb={[{ label: 'Dashboard', href: '/dispatch' }]}
    >
      <FilterBar
        search={search}
        sort={sort}
        viewMode={viewMode}
        stageFilter={stageFilter}
        typeFilter={typeFilter}
        urgencyFilter={urgencyFilter}
        monthFilter={monthFilter}
        yearFilter={yearFilter}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onViewModeChange={setViewMode}
        onStageFilterChange={setStageFilter}
        onTypeFilterChange={setTypeFilter}
        onUrgencyFilterChange={setUrgencyFilter}
        onMonthFilterChange={setMonthFilter}
        onYearFilterChange={setYearFilter}
      />

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
          role="dsp_sup"
        />
      )}

      {trPreview && (
        <TRDocumentModal data={trPreview} onClose={() => setTrPreview(null)} />
      )}
    </AppShell>
  )
}
