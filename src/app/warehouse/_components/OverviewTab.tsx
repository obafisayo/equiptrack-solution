'use client'

import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { Select } from '@/components/ui/Form'
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
      <section className="mb-6">
        <SectionTitle title="Pending Incoming Queue" count={incomingOrders.length} className="mb-3" />
        <div className="flex gap-2 flex-wrap mb-3">
          {URGENCY_OPTIONS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => onSetIncomingTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${
                incomingTab === tab
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'bg-white border-border-default text-gray-600 hover:border-gray-300'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1.5 opacity-75">
                  ({incomingOrders.filter(o => o.urgency === tab).length})
                </span>
              )}
            </button>
          ))}
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
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <SectionTitle title="All Active Orders" count={filteredActive.length} />
          <div className="flex gap-1.5 flex-wrap ml-auto">
            {STAGE_FILTER_OPTIONS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => onSetStageFilter(f)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                  stageFilter === f
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-white border-border-default text-gray-600 hover:border-gray-300'
                }`}
              >
                {f}
              </button>
            ))}
            <Select
              title="Filter by urgency"
              value={urgencyFilter}
              onChange={e => onSetUrgencyFilter(e.target.value as UrgencyLevel | 'All')}
              size="sm"
              className="ml-2 w-auto min-w-28"
            >
              {URGENCY_OPTIONS.map(u => (
                <option key={u} value={u}>{u === 'All' ? 'All Urgency' : u}</option>
              ))}
            </Select>
          </div>
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
