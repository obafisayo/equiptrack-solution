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
  return (
    <section className="mb-6">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 rounded-card bg-red-50 border border-red-200/70 text-left mb-3 hover:bg-red-100 transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-red-700 uppercase tracking-wider">SLA BREACHES</span>
          {slaBreaches.length > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-xs font-bold">
              {slaBreaches.length}
            </span>
          )}
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`text-red-600 transition-transform duration-150 ${slaOpen ? '' : '-rotate-90'}`}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {slaOpen && (
        slaBreaches.length === 0 ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-card bg-green-50 border border-green-200/70 text-sm text-green-700 font-medium">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12 2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All SLAs on track
          </div>
        ) : (
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
        )
      )}
    </section>
  )
}
