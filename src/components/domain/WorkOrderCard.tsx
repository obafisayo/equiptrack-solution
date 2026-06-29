'use client'

import { STAGE_SLA_HOURS, getSlaStatus, fmtHours } from '@/config/sla'
import { STAGE_REVERSAL } from '@/lib/lifecycle'
import type { WorkOrder } from '@/lib/mock-data'
import { StagePill, UrgencyPill, TypeBadge, SLAChip } from './Pills'
import { SLABar } from './SLABar'

interface WorkOrderCardProps {
  order: WorkOrder
  onClick?: () => void
  onAssign?: () => void
  onReverse?: () => void
  isSelected?: boolean
  showActions?: boolean
  compact?: boolean
}

export function WorkOrderCard({
  order,
  onClick,
  onAssign,
  onReverse,
  isSelected = false,
  showActions = true,
  compact = false,
}: WorkOrderCardProps) {
  const slaHours   = STAGE_SLA_HOURS[order.stage]
  const status     = getSlaStatus(order.elapsedHours, slaHours)
  const canReverse = !!STAGE_REVERSAL[order.stage]
  const dest       = order.destination.length > 38
    ? order.destination.slice(0, 38) + '…'
    : order.destination

  // Card border & shadow variants — all expressed as Tailwind
  const cardClass = isSelected
    ? 'border-2 border-brand-500 shadow-[0_0_0_3px_rgba(240,74,74,0.12)]'
    : status.breached
    ? 'border border-red-200 shadow-[0_0_0_2px_rgba(239,68,68,0.08),0_1px_3px_rgba(0,0,0,0.06)]'
    : 'border border-border-default shadow-card'

  return (
    <div
      onClick={onClick}
      className={[
        'relative bg-white rounded-xl overflow-hidden transition-shadow duration-150 cursor-pointer',
        compact ? 'p-3' : 'p-4',
        isSelected ? 'bg-red-50/20' : '',
        cardClass,
      ].join(' ')}
    >
      {/* Top accent strip — breach / warning */}
      {(status.breached || status.warning) && (
        <div className={`absolute top-0 inset-x-0 h-0.75 ${status.breached ? 'bg-red-500' : 'bg-amber-500'}`} />
      )}

      {/* ROW 1: order ID + stage pill */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-xs font-semibold text-brand-500 tracking-wide shrink-0">
          {order.id}
        </span>
        <StagePill stage={order.stage} />
      </div>

      {/* ROW 2: destination */}
      <p className="text-sm font-medium text-gray-900 truncate mb-1.5">{dest}</p>

      {/* ROW 3: type · urgency · assignee */}
      <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-xs text-gray-500 mb-3">
        <TypeBadge type={order.requestType} />
        <span className="text-gray-200 select-none">·</span>
        <UrgencyPill level={order.urgency} />
        <span className="text-gray-200 select-none">·</span>
        <span className="font-medium text-gray-700">{order.assignedToName ?? 'Unassigned'}</span>
      </div>

      {/* ROW 4: SLA bar */}
      {slaHours && (
        <div>
          <SLABar elapsedHours={order.elapsedHours} slaHours={slaHours} showLabel={false} />
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-400">Stage time</span>
            <SLAChip elapsedHours={order.elapsedHours} slaHours={slaHours} />
          </div>
        </div>
      )}

      {/* Footer actions */}
      {showActions && (onAssign || (onReverse && canReverse)) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          {onAssign && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAssign() }}
              className="text-xs font-semibold text-brand-500 bg-red-50 px-3 py-1 rounded-md border border-red-200 hover:bg-red-100 transition-colors duration-150"
            >
              {order.assignedTo ? 'Reassign' : 'Assign'}
            </button>
          )}
          {onReverse && canReverse && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onReverse() }}
              className="text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-150"
            >
              ↩ Reverse
            </button>
          )}
          {order.totalElapsedHours != null && (
            <span className="ml-auto text-[10px] text-gray-400">
              Total: {fmtHours(order.totalElapsedHours)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkOrderCard
