'use client'

import { X } from 'lucide-react'
import type { WorkOrder } from '@/lib/mock-data'
import type { Role } from '@/lib/lifecycle'
import { STAGE_REVERSAL } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'
import { StagePill, UrgencyPill, TypeBadge } from './Pills'
import { SLABar } from './SLABar'
import { StageHistory } from './StageTimeline'

interface DetailPanelProps {
  order: WorkOrder | null
  onClose: () => void
  onAssign?: (order: WorkOrder) => void
  onReverse?: (order: WorkOrder) => void
  role: Role
}

/* Shared section label style */
const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#9CA3AF',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 12,
}

export function DetailPanel({ order, onClose, onAssign, onReverse, role }: DetailPanelProps) {
  if (!order) return null

  const slaHours  = STAGE_SLA_HOURS[order.stage]
  const canReverse = !!STAGE_REVERSAL[order.stage]
  const canAssign  = ['wh_sup', 'dsp_sup', 'qaqc'].includes(role)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[399]"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 bg-white z-[400] flex flex-col animate-slide-in overflow-hidden w-full sm:w-[480px]"
        style={{
          borderLeft: '1px solid #E2E8F0',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.10)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-start justify-between gap-4 shrink-0"
          style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}
        >
          <div className="min-w-0 flex-1">
            {/* Order ID — mono */}
            <span
              className="font-mono-id"
              style={{ fontSize: 13, fontWeight: 600, color: '#F04A4A', letterSpacing: '0.02em' }}
            >
              {order.id}
            </span>

            {/* Title — destination */}
            <p
              className="truncate"
              style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '4px 0 8px' }}
            >
              {order.destination}
            </p>

            {/* Pills row */}
            <div className="flex items-center gap-2 flex-wrap">
              <StagePill stage={order.stage} />
              <TypeBadge type={order.requestType} />
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors duration-150 shrink-0"
            style={{
              width: 32, height: 32,
              color: '#6B7280',
              background: 'transparent',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F3F4F6')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>

          {/* Request details */}
          <section>
            <p style={sectionLabelStyle}>Request Details</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <DetailRow label="Destination"       value={order.destination} />
              <DetailRow label="Work Order"        value={order.workOrderNumber} mono />
              <DetailRow label="Request Type"      value={<TypeBadge type={order.requestType} />} />
              <DetailRow label="Urgency"           value={<UrgencyPill level={order.urgency} />} />
              <DetailRow label="Requested By"      value={order.requestedByName} />
              <DetailRow
                label="Created"
                value={new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              />
              <DetailRow
                label="Expected Delivery"
                value={order.expectedDeliveryDate
                  ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })
                  : '—'}
              />
              <DetailRow
                label="Total Time"
                value={
                  <span style={{ fontWeight: 600, color: '#111827' }}>
                    {fmtHours(order.totalElapsedHours)}
                  </span>
                }
              />
            </div>
          </section>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <section style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
              <p style={sectionLabelStyle}>Items ({order.items.length})</p>
              <div>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                    style={{
                      fontSize: 13, color: '#374151',
                      padding: '8px 0',
                      borderBottom: i < order.items!.length - 1 ? '1px solid #F3F4F6' : undefined,
                    }}
                  >
                    <span>{item.description}</span>
                    <span style={{ color: '#6B7280', fontWeight: 500, marginLeft: 8, flexShrink: 0 }}>
                      {item.qty} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Currently With */}
          <section style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
            <p style={sectionLabelStyle}>Currently With</p>
            <div
              className="rounded-lg"
              style={{ background: '#F9FAFB', padding: 16, border: '1px solid #F3F4F6' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>
                    {order.assignedToName ?? 'Unassigned'}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{order.stage}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
                    {fmtHours(order.elapsedHours)}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>in current stage</p>
                </div>
              </div>
              {slaHours && (
                <div style={{ marginTop: 12 }}>
                  <SLABar elapsedHours={order.elapsedHours} slaHours={slaHours} />
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          {order.notes && (
            <section style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
              <p style={sectionLabelStyle}>Notes</p>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {order.notes}
              </p>
            </section>
          )}

          {/* Stage History */}
          <section style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
            <p style={sectionLabelStyle}>Stage History</p>
            <StageHistory history={order.stageHistory} currentStage={order.stage} />
          </section>
        </div>

        {/* ── Footer actions ── */}
        {(canAssign || canReverse) && (
          <div
            className="flex items-center gap-3 shrink-0"
            style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0' }}
          >
            {canAssign && onAssign && (
              <button
                type="button"
                onClick={() => onAssign(order)}
                className="flex-1 font-semibold transition-colors duration-150"
                style={{
                  height: 36, borderRadius: 8, fontSize: 13,
                  background: '#F04A4A', color: '#fff', border: 'none', cursor: 'pointer',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E02828')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#F04A4A')}
              >
                {order.assignedTo ? 'Reassign' : 'Assign'}
              </button>
            )}
            {canReverse && canAssign && onReverse && (
              <button
                type="button"
                onClick={() => onReverse(order)}
                className="font-medium transition-colors duration-150"
                style={{
                  height: 36, padding: '0 16px', borderRadius: 8, fontSize: 13,
                  background: '#fff', color: '#374151',
                  border: '1px solid #E2E8F0', cursor: 'pointer',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
              >
                ↩ Reverse Stage
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 3px', fontWeight: 500 }}>{label}</p>
      <div
        style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}
        className={mono ? 'font-mono-id' : ''}
      >
        {value}
      </div>
    </div>
  )
}

export default DetailPanel
