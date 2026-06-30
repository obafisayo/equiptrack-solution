'use client'

import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { type WorkOrder } from '@/lib/mock-data'
import { QUEUE_SUBTABS, QUEUE_STAGE_MAP, type QueueSubTab } from './constants'

interface QueueViewProps {
  orders: WorkOrder[]
  subTabOrders: WorkOrder[]
  queueSubTab: QueueSubTab
  onSelectSubTab: (tab: QueueSubTab) => void
  selectedOrderId: string | null
  onSelectOrder: (id: string) => void
  onAssignOrder: (order: WorkOrder) => void
  onReverseOrder: (order: WorkOrder) => void
}

export function QueueView({
  orders,
  subTabOrders,
  queueSubTab,
  onSelectSubTab,
  selectedOrderId,
  onSelectOrder,
  onAssignOrder,
  onReverseOrder,
}: QueueViewProps) {
  return (
    <>
      <div className="mb-4 border-b border-border-default">
        <div className="flex gap-0.5 overflow-x-auto">
          {QUEUE_SUBTABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => onSelectSubTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150 ${
                queueSubTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                queueSubTab === tab ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {orders.filter(o => QUEUE_STAGE_MAP[tab].includes(o.stage)).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <SectionTitle title={queueSubTab} count={subTabOrders.length} className="mb-3" />

      {subTabOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No orders in this stage.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {subTabOrders.map(o => (
            <WorkOrderCard
              key={o.id}
              order={o}
              onClick={() => onSelectOrder(o.id)}
              onAssign={() => onAssignOrder(o)}
              onReverse={() => onReverseOrder(o)}
              isSelected={selectedOrderId === o.id}
              showActions
            />
          ))}
        </div>
      )}
    </>
  )
}
