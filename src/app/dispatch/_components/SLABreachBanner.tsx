'use client'

import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { type WorkOrder } from '@/lib/mock-data'

interface SLABreachBannerProps {
  slaBreaches: WorkOrder[]
  slaOpen: boolean
  onToggle: () => void
  selectedOrderId: string | null
  onSelectOrder: (id: string) => void
  onAssignOrder: (order: WorkOrder) => void
  onReverseOrder: (order: WorkOrder) => void
}

export function SLABreachBanner({
  slaBreaches,
  slaOpen,
  onToggle,
  selectedOrderId,
  onSelectOrder,
  onAssignOrder,
  onReverseOrder,
}: SLABreachBannerProps) {
  if (slaBreaches.length === 0) return null

  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 w-full mb-3"
      >
        <span className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-700 tracking-wider uppercase">
            SLA BREACHED {slaBreaches.length} order{slaBreaches.length !== 1 ? 's' : ''}
          </span>
        </span>
        <span className="text-xs text-gray-400">{slaOpen ? '▲ collapse' : '▼ expand'}</span>
      </button>
      {slaOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {slaBreaches.map(o => (
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
    </section>
  )
}
