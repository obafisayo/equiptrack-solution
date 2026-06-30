'use client'

import { Package } from 'lucide-react'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { type WorkOrder } from '@/lib/mock-data'

interface OrdersCardGridProps {
  orders: WorkOrder[]
  selectedOrderId: string | null
  onSelectOrder: (id: string) => void
}

export function OrdersCardGrid({ orders, selectedOrderId, onSelectOrder }: OrdersCardGridProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No work orders found"
        description="No orders match the current filters. Try adjusting your search or filter criteria."
        compact
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {orders.map(order => (
        <WorkOrderCard
          key={order.id}
          order={order}
          onClick={() => onSelectOrder(order.id)}
          isSelected={selectedOrderId === order.id}
          showActions={false}
        />
      ))}
    </div>
  )
}
