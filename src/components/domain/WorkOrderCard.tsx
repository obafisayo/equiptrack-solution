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
  const status   = getSlaStatus(order.elapsedHours, slaHours)
  const canReverse = !!STAGE_REVERSAL[order.stage]
  const dest = order.destination.length > 38
    ? order.destination.slice(0, 38) + '…'
    : order.destination

  /* Derive top-strip color */
  const stripColor = status.breached ? '#EF4444' : status.warning ? '#F59E0B' : null

  /* Derive card border / shadow */
  let cardBorder: string
  let cardShadow: string
  if (isSelected) {
    cardBorder = '2px solid #F04A4A'
    cardShadow = '0 0 0 3px rgba(240,74,74,0.12)'
  } else if (status.breached) {
    cardBorder = '1px solid #FECACA'
    cardShadow = '0 0 0 2px rgba(239,68,68,0.10), 0 1px 3px rgba(0,0,0,0.06)'
  } else {
    cardBorder = '1px solid #E2E8F0'
    cardShadow = '0 1px 3px rgba(0,0,0,0.08)'
  }

  return (
    <div
      onClick={onClick}
      className={['relative bg-white overflow-hidden transition-shadow duration-150 cursor-pointer',
        compact ? 'p-3' : 'p-4',
        isSelected ? 'bg-red-50/20' : '',
      ].join(' ')}
      style={{ borderRadius: 10, border: cardBorder, boxShadow: cardShadow }}
    >
      {/* TOP ACCENT STRIP — breach / warning / none */}
      {stripColor && (
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: stripColor,
          }}
        />
      )}

      {/* ROW 1: order ID (left) + StagePill (right) */}
      <div className="flex items-center justify-between gap-2" style={{ marginBottom: 8 }}>
        <span
          className="font-mono-id shrink-0"
          style={{ fontSize: 12, fontWeight: 600, color: '#F04A4A', letterSpacing: '0.02em' }}
        >
          {order.id}
        </span>
        <StagePill stage={order.stage} />
      </div>

      {/* ROW 2: Equipment destination / name */}
      <p
        className="truncate"
        style={{ fontSize: 14, fontWeight: 500, color: '#111827', margin: '0 0 6px' }}
      >
        {dest}
      </p>

      {/* ROW 3: Sub-details — type · urgency · assignee */}
      <div
        className="flex items-center flex-wrap"
        style={{ fontSize: 12, color: '#6B7280', gap: '4px 6px', marginBottom: 12 }}
      >
        <TypeBadge type={order.requestType} />
        <span style={{ color: '#D1D5DB', userSelect: 'none' }}>·</span>
        <UrgencyPill level={order.urgency} />
        <span style={{ color: '#D1D5DB', userSelect: 'none' }}>·</span>
        <span style={{ fontWeight: 500 }}>
          {order.assignedToName ?? 'Unassigned'}
        </span>
      </div>

      {/* ROW 4: SLA bar */}
      {slaHours && (
        <div>
          <SLABar elapsedHours={order.elapsedHours} slaHours={slaHours} showLabel={false} />
          <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>Stage time</span>
            <SLAChip elapsedHours={order.elapsedHours} slaHours={slaHours} />
          </div>
        </div>
      )}

      {/* Footer actions */}
      {showActions && (onAssign || (onReverse && canReverse)) && (
        <div
          className="flex items-center gap-2"
          style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}
        >
          {onAssign && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAssign() }}
              style={{
                fontSize: 12, fontWeight: 600,
                color: '#F04A4A', background: '#FFF5F5',
                padding: '4px 12px', borderRadius: 6,
                border: '1px solid #FECACA',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FEE2E2')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#FFF5F5')}
            >
              {order.assignedTo ? 'Reassign' : 'Assign'}
            </button>
          )}
          {onReverse && canReverse && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onReverse() }}
              style={{
                fontSize: 12, fontWeight: 600,
                color: '#374151', background: '#F9FAFB',
                padding: '4px 12px', borderRadius: 6,
                border: '1px solid #E5E7EB',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F3F4F6')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
            >
              ↩ Reverse
            </button>
          )}
          {order.totalElapsedHours != null && (
            <span className="ml-auto" style={{ fontSize: 10, color: '#9CA3AF' }}>
              Total: {fmtHours(order.totalElapsedHours)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default WorkOrderCard
