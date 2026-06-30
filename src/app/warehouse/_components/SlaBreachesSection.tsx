'use client'

import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { type WorkOrder } from '@/lib/mock-data'

interface SlaBreachesSectionProps {
  breachedOrders: WorkOrder[]
  collapsed: boolean
  selectedOrderId: string | null
  onToggleCollapsed: () => void
  onSelectOrder: (id: string) => void
  onAssignOrder: (id: string) => void
  onReverseOrder: (id: string) => void
}

export function SlaBreachesSection({
  breachedOrders,
  collapsed,
  selectedOrderId,
  onToggleCollapsed,
  onSelectOrder,
  onAssignOrder,
  onReverseOrder,
}: SlaBreachesSectionProps) {
  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="w-full flex items-center justify-between px-4 py-3 rounded-card bg-red-50 border border-red-200/70 text-left mb-3 hover:bg-red-100 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-red-700 uppercase tracking-wider">SLA BREACHES</span>
          {breachedOrders.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-xs font-bold">
              {breachedOrders.length}
            </span>
          )}
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`text-red-600 transition-transform duration-150 ${collapsed ? '-rotate-90' : ''}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {!collapsed && (
        breachedOrders.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-card bg-green-50 border border-green-200/70 text-sm text-green-700 font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12 2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All SLAs on track
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {breachedOrders.map(order => (
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
        )
      )}
    </section>
  )
}
