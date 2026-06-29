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

export function DetailPanel({ order, onClose, onAssign, onReverse, role }: DetailPanelProps) {
  if (!order) return null

  const slaHours  = STAGE_SLA_HOURS[order.stage]
  const canReverse = !!STAGE_REVERSAL[order.stage]
  const canAssign  = ['wh_sup', 'dsp_sup', 'qaqc'].includes(role)

  return (
    <>
      <div className="fixed inset-0 z-399 bg-black/45" onClick={onClose} />

      <div className="fixed right-0 top-0 bottom-0 bg-white z-400 flex flex-col animate-slide-in overflow-hidden w-full sm:w-120 border-l border-border-default shadow-[-4px_0_24px_rgba(0,0,0,0.08)]">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 shrink-0 px-6 py-5 border-b border-border-default">
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs font-semibold text-brand-500 tracking-wide">
              {order.id}
            </span>
            <p className="text-base font-semibold text-gray-900 truncate mt-1 mb-2">
              {order.destination}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <StagePill stage={order.stage} />
              <TypeBadge type={order.requestType} />
            </div>
          </div>
          <button
            type="button"
            title="Close panel"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-150 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Request details */}
          <section>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Request Details</p>
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
                value={<span className="font-semibold text-gray-900">{fmtHours(order.totalElapsedHours)}</span>}
              />
            </div>
          </section>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <section className="pt-5 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Items ({order.items.length})</p>
              <div>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between text-sm text-gray-700 py-2 ${
                      i < order.items!.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <span>{item.description}</span>
                    <span className="text-gray-500 font-medium ml-2 shrink-0">{item.qty} {item.unit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Currently With */}
          <section className="pt-5 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Currently With</p>
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.assignedToName ?? 'Unassigned'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.stage}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-gray-900">{fmtHours(order.elapsedHours)}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">in current stage</p>
                </div>
              </div>
              {slaHours && (
                <div className="mt-3">
                  <SLABar elapsedHours={order.elapsedHours} slaHours={slaHours} />
                </div>
              )}
            </div>
          </section>

          {/* Notes */}
          {order.notes && (
            <section className="pt-5 border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">{order.notes}</p>
            </section>
          )}

          {/* Stage History */}
          <section className="pt-5 border-t border-gray-100">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Stage History</p>
            <StageHistory history={order.stageHistory} currentStage={order.stage} />
          </section>
        </div>

        {/* Footer actions */}
        {(canAssign || canReverse) && (
          <div className="flex items-center gap-3 shrink-0 px-6 py-4 border-t border-border-default">
            {canAssign && onAssign && (
              <button
                type="button"
                onClick={() => onAssign(order)}
                className="flex-1 h-9 rounded-lg text-sm font-semibold bg-brand-500 text-white hover:bg-brand-600 transition-colors duration-150"
              >
                {order.assignedTo ? 'Reassign' : 'Assign'}
              </button>
            )}
            {canReverse && canAssign && onReverse && (
              <button
                type="button"
                onClick={() => onReverse(order)}
                className="h-9 px-4 rounded-lg text-sm font-medium bg-white text-gray-700 border border-border-default hover:bg-gray-50 transition-colors duration-150"
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
      <p className="text-[11px] font-medium text-gray-400 mb-1">{label}</p>
      <div className={`text-sm font-medium text-gray-700 ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  )
}

export default DetailPanel
