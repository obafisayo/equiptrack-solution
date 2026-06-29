'use client'

import { useState, useMemo } from 'react'
import { Package, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { SearchInput, Select } from '@/components/ui/Form'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { StagePill, TypeBadge } from '@/components/domain/Pills'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import { TRDocumentModal, type TRDocumentData } from '@/components/domain/TRDocument'
import { WORK_ORDERS, type WorkOrder } from '@/lib/mock-data'
import { STAGE_DEPARTMENT, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours, type UrgencyLevel } from '@/config/sla'

type RequestType = 'All' | 'SAP' | 'TR' | 'VENDOR' | 'NON_STOCK'
type SortOption = 'oldest' | 'newest' | 'overdue'
type ViewMode = 'cards' | 'table'

const DEPT_GROUPS = [
  { label: 'All Stages', value: 'all' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Dispatch', value: 'dispatch' },
  { label: 'QAQC', value: 'qaqc' },
  { label: 'Final', value: 'final' },
  { label: 'Pending', value: 'pending' },
]

function getSlaOverage(order: WorkOrder): number {
  const sla = STAGE_SLA_HOURS[order.stage]
  if (!sla) return 0
  return Math.max(0, order.elapsedHours - sla)
}

function makeTRData(order: WorkOrder): TRDocumentData {
  return {
    trNumber: order.waybillNumber ?? order.id.replace('DEL-',''),
    destination: order.destination,
    requestedBy: order.requestedByName ?? 'Kenneth Nwosu',
    department: 'Vendor',
    date: new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }).replace(',',''),
    approvedBy: 'Kenneth Omireh',
    approverTitle: 'Approved by the Onne Base Logistics Coordinator',
    company: 'TotalEnergies',
    items: order.items.map(it => ({
      quantity: it.qty,
      description: it.description,
      prWoNumber: order.id,
    })),
  }
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
      {/* Filter bar */}
      <div className="bg-white border border-border-default rounded-card shadow-card p-4 mb-5 space-y-3">
        {/* Row 1: Search + View toggle + Sort */}
        <div className="flex flex-wrap gap-3 items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search delivery number, destination, assignee…"
            className="flex-1 min-w-50"
            size="sm"
          />
          <Select
            aria-label="Sort order"
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            size="sm"
            className="w-auto min-w-35"
          >
            <option value="oldest">Oldest First</option>
            <option value="newest">Newest First</option>
            <option value="overdue">Most Overdue</option>
          </Select>
          <div className="flex border border-border-default rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 h-9 text-sm transition-colors ${viewMode === 'cards' ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Card view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 h-9 text-sm transition-colors border-l border-border-default ${viewMode === 'table' ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Table view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Department + Type + Urgency pills */}
        <div className="flex flex-wrap gap-2">
          {DEPT_GROUPS.map(g => (
            <button
              key={g.value}
              onClick={() => setDeptFilter(g.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                deptFilter === g.value
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'bg-white border-border-default text-gray-600 hover:border-brand-300'
              }`}
            >
              {g.label}
            </button>
          ))}
          <div className="w-px bg-border-default mx-1" />
          {(['All', 'SAP', 'TR', 'VENDOR', 'NON_STOCK'] as RequestType[]).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                typeFilter === t
                  ? 'bg-neutral-800 border-neutral-800 text-white'
                  : 'bg-white border-border-default text-gray-600 hover:border-neutral-400'
              }`}
            >
              {t}
            </button>
          ))}
          <div className="w-px bg-border-default mx-1" />
          {(['All', 'Urgent', 'High', 'Medium', 'Low'] as Array<UrgencyLevel | 'All'>).map(u => (
            <button
              key={u}
              onClick={() => setUrgencyFilter(u)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                urgencyFilter === u
                  ? 'bg-neutral-800 border-neutral-800 text-white'
                  : 'bg-white border-border-default text-gray-600 hover:border-neutral-400'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center gap-3 mb-4">
        <SectionTitle title="Work Orders" count={filtered.length} />
        {slaBreachedCount > 0 && (
          <span className="text-xs font-semibold text-status-critical bg-status-critical-bg px-2 py-0.5 rounded-full">
            {slaBreachedCount} SLA breached
          </span>
        )}
      </div>

      {/* Card view */}
      {viewMode === 'cards' && (
        filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No work orders found"
            description="No orders match the current filters. Try adjusting your search or filter criteria."
            compact
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(order => (
              <WorkOrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrderId(order.id)}
                isSelected={selectedOrderId === order.id}
                showActions={false}
              />
            ))}
          </div>
        )
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-border-default">
                {['Delivery No.', 'Destination', 'Type', 'Stage', 'Assigned To', 'Elapsed', 'SLA Status', ''].map(h => (
                  <th
                    key={h}
                    className="text-left whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const sla = STAGE_SLA_HOURS[order.stage]
                const breached = sla != null && order.elapsedHours > sla
                const warning = sla != null && !breached && order.elapsedHours / sla >= 0.75
                return (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`cursor-pointer border-b border-gray-100 transition-colors duration-150 ${
                      selectedOrderId === order.id ? 'bg-red-50/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-brand-500">{order.id}</span>
                    </td>
                    <td className="px-4 py-3 max-w-45 truncate text-gray-700">{order.destination}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><TypeBadge type={order.requestType} /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><StagePill stage={order.stage as Stage} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{order.assignedToName ?? <span className="text-gray-400 italic">Unassigned</span>}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{fmtHours(order.elapsedHours)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {!sla ? (
                        <span className="text-gray-400 text-xs">—</span>
                      ) : breached ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-critical bg-status-critical-bg px-2 py-0.5 rounded-full">
                          BREACHED +{fmtHours(order.elapsedHours - sla)}
                        </span>
                      ) : warning ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-medium bg-status-medium-bg px-2 py-0.5 rounded-full">
                          WARNING {fmtHours(order.elapsedHours)} / {fmtHours(sla)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-low bg-status-low-bg px-2 py-0.5 rounded-full">
                          ON TRACK {fmtHours(order.elapsedHours)} / {fmtHours(sla)}
                        </span>
                      )}
                    </td>
                    {/* TR document button */}
                    <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      {order.requestType === 'TR' && (
                        <button type="button" onClick={() => setTrPreview(makeTRData(order))}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-2 py-0.5 rounded transition-colors">
                          <FileText size={11}/> TR Doc
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-12">No work orders match the current filters</p>
          )}
        </div>
      )}

      {/* Detail panel */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          role="wh_sup"
        />
      )}

      {/* TR Document modal */}
      {trPreview && (
        <TRDocumentModal data={trPreview} onClose={() => setTrPreview(null)}/>
      )}
    </AppShell>
  )
}
