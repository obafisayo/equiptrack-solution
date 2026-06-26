import type { WorkOrder } from '@/lib/mock-data'
import type { Role } from '@/lib/lifecycle'
import { WorkOrderCard } from './WorkOrderCard'

export function SectionTitle({ title, count, action, className = '' }: { title: string; count?: number; action?: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {count != null && (
          <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold bg-brand-500 text-white">
            {count}
          </span>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

interface OrderGridProps {
  orders: WorkOrder[]
  title?: string
  emptyMessage?: string
  onSelectOrder: (order: WorkOrder) => void
  selectedOrderId?: string
  onAssign?: (order: WorkOrder) => void
  onReverse?: (order: WorkOrder) => void
  showActions?: boolean
  role: Role
  compact?: boolean
}

export function OrderGrid({
  orders,
  title,
  emptyMessage = 'No work orders found.',
  onSelectOrder,
  selectedOrderId,
  onAssign,
  onReverse,
  showActions = true,
  role,
  compact = false,
}: OrderGridProps) {
  return (
    <div>
      {title && <SectionTitle title={title} count={orders.length} />}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-50">
            <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 12h10M11 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {orders.map(order => (
            <WorkOrderCard
              key={order.id}
              order={order}
              onClick={() => onSelectOrder(order)}
              onAssign={onAssign ? () => onAssign(order) : undefined}
              onReverse={onReverse ? () => onReverse(order) : undefined}
              isSelected={order.id === selectedOrderId}
              showActions={showActions}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  )
}
