'use client'

import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { type WorkOrder } from '@/lib/mock-data'
import { type UrgencyLevel } from '@/config/sla'

const STAGE_FILTER_OPTIONS = [
  'All',
  'New Request',
  'Warehouse Assigned',
  'Processing',
  'GI Created',
  'Transferred to Dispatch',
  'Near SLA',
]

const URGENCY_OPTIONS: Array<UrgencyLevel | 'All'> = ['All', 'Urgent', 'High', 'Medium', 'Low']

// One consistent filter-pill row style, reused for both stage and urgency
// filters so the two sections below don't read as two different UI patterns.
function FilterRow({ label, options, active, onSelect, getCount }: {
  label: string
  options: string[]
  active: string
  onSelect: (value: string) => void
  getCount?: (value: string) => number
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 shrink-0">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
              active === opt
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-border-default text-gray-600 hover:border-gray-300'
            }`}
          >
            {opt}
            {getCount && opt !== 'All' && <span className="ml-1 opacity-60">({getCount(opt)})</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

interface OverviewTabProps {
  incomingOrders: WorkOrder[]
  filteredIncoming: WorkOrder[]
  filteredActive: WorkOrder[]
  incomingTab: UrgencyLevel | 'All'
  stageFilter: string
  urgencyFilter: UrgencyLevel | 'All'
  selectedOrderId: string | null
  onSetIncomingTab: (tab: UrgencyLevel | 'All') => void
  onSetStageFilter: (f: string) => void
  onSetUrgencyFilter: (u: UrgencyLevel | 'All') => void
  onSelectOrder: (id: string) => void
  onAssignOrder: (id: string) => void
  onReverseOrder: (id: string) => void
}

export function OverviewTab({
  incomingOrders,
  filteredIncoming,
  filteredActive,
  incomingTab,
  stageFilter,
  urgencyFilter,
  selectedOrderId,
  onSetIncomingTab,
  onSetStageFilter,
  onSetUrgencyFilter,
  onSelectOrder,
  onAssignOrder,
  onReverseOrder,
}: OverviewTabProps) {
  return (
    <>
      {/* PENDING INCOMING QUEUE */}
      <section className="mb-8">
        <SectionTitle title="Pending Incoming Queue" count={incomingOrders.length} className="mb-3" />
        <div className="mb-4">
          <FilterRow
            label="Urgency"
            options={URGENCY_OPTIONS}
            active={incomingTab}
            onSelect={v => onSetIncomingTab(v as UrgencyLevel | 'All')}
            getCount={v => incomingOrders.filter(o => o.urgency === v).length}
          />
        </div>
        {filteredIncoming.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No incoming requests at this priority</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredIncoming.map(order => (
              <WorkOrderCard
                key={order.id}
                order={order}
                onClick={() => onSelectOrder(order.id)}
                onAssign={() => onAssignOrder(order.id)}
                isSelected={selectedOrderId === order.id}
                showActions
              />
            ))}
          </div>
        )}
      </section>

      {/* ALL ACTIVE ORDERS */}
      <section>
        <SectionTitle title="All Active Orders" count={filteredActive.length} className="mb-3" />
        <div className="flex flex-col gap-2 mb-4">
          <FilterRow label="Stage" options={STAGE_FILTER_OPTIONS} active={stageFilter} onSelect={onSetStageFilter} />
          <FilterRow
            label="Urgency"
            options={URGENCY_OPTIONS}
            active={urgencyFilter}
            onSelect={v => onSetUrgencyFilter(v as UrgencyLevel | 'All')}
          />
        </div>
        {filteredActive.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No orders match this filter</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredActive.map(order => (
              <WorkOrderCard
                key={order.id}
                order={order}
                onClick={() => onSelectOrder(order.id)}
                onAssign={() => onAssignOrder(order.id)}
                onReverse={() => onReverseOrder(order.id)}
                isSelected={selectedOrderId === order.id}
                showActions
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
