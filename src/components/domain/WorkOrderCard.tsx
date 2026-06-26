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
  const slaHours = STAGE_SLA_HOURS[order.stage]
  const status = getSlaStatus(order.elapsedHours, slaHours)
  const canReverse = !!STAGE_REVERSAL[order.stage]
  const dest = order.destination.length > 32
    ? order.destination.slice(0, 32) + '…'
    : order.destination

  return (
    <div
      onClick={onClick}
      className={[
        'relative bg-white rounded-card transition-all duration-150 cursor-pointer',
        compact ? 'p-3' : 'p-4',
        isSelected
          ? 'border-2 border-brand-500 shadow-raised bg-red-50/20'
          : status.breached
          ? 'border border-red-200 shadow-[0_0_0_2px_rgb(239_68_68/0.15)]'
          : 'border border-border-default shadow-card hover:shadow-raised',
      ].join(' ')}
    >
      {/* SLA breach top strip */}
      {status.breached && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-status-critical rounded-t-card" />
      )}

      {/* Row 1: ID + type + urgency */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-sm font-bold text-brand-500 tracking-wide shrink-0">
            {order.id}
          </span>
          <TypeBadge type={order.requestType} />
        </div>
        <UrgencyPill level={order.urgency} />
      </div>

      {/* Row 2: Destination */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-gray-400">
          <path
            d="M6 1C4.07 1 2.5 2.57 2.5 4.5C2.5 7.25 6 11 6 11C6 11 9.5 7.25 9.5 4.5C9.5 2.57 7.93 1 6 1ZM6 6C5.17 6 4.5 5.33 4.5 4.5C4.5 3.67 5.17 3 6 3C6.83 3 7.5 3.67 7.5 4.5C7.5 5.33 6.83 6 6 6Z"
            fill="currentColor"
          />
        </svg>
        <span className="text-sm font-medium text-gray-800 truncate">{dest}</span>
      </div>

      {/* Row 3: Stage + assigned person */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <StagePill stage={order.stage} />
        <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="text-gray-400">
            <circle cx="5.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2" />
            <path d="M1.5 10C1.5 7.79 3.29 6 5.5 6C7.71 6 9.5 7.79 9.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="font-medium">
            {order.assignedToName ?? 'Unassigned'}
          </span>
        </div>
      </div>

      {/* Row 4: SLA bar */}
      {slaHours && (
        <div className="mb-1">
          <SLABar elapsedHours={order.elapsedHours} slaHours={slaHours} showLabel={false} />
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-400">Stage time</span>
            <SLAChip elapsedHours={order.elapsedHours} slaHours={slaHours} />
          </div>
        </div>
      )}

      {/* Footer actions */}
      {showActions && (onAssign || (onReverse && canReverse)) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle">
          {onAssign && (
            <button
              onClick={(e) => { e.stopPropagation(); onAssign() }}
              className="text-xs font-semibold text-brand-500 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded border border-brand-200 transition-colors duration-150"
            >
              {order.assignedTo ? 'Reassign' : 'Assign'}
            </button>
          )}
          {onReverse && canReverse && (
            <button
              onClick={(e) => { e.stopPropagation(); onReverse() }}
              className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded border border-gray-200 transition-colors duration-150"
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
