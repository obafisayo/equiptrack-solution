'use client'

import type { WorkOrder } from '@/lib/mock-data'
import type { Role } from '@/lib/lifecycle'
import { STAGE_REVERSAL } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, URGENCY_CONFIG, fmtHours } from '@/config/sla'
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

  const slaHours = STAGE_SLA_HOURS[order.stage]
  const canReverse = !!STAGE_REVERSAL[order.stage]
  const canAssign = ['wh_sup', 'dsp_sup', 'qaqc'].includes(role)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[399]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-overlay z-[400] flex flex-col animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border-default shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-base font-bold text-brand-500">{order.id}</span>
              <TypeBadge type={order.requestType} />
            </div>
            <StagePill stage={order.stage} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors shrink-0 mt-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          {/* Request details grid */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Request Details</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <DetailRow label="Destination" value={order.destination} />
              <DetailRow label="Work Order" value={order.workOrderNumber} mono />
              <DetailRow label="Request Type" value={<TypeBadge type={order.requestType} />} />
              <DetailRow label="Urgency" value={<UrgencyPill level={order.urgency} />} />
              <DetailRow label="Requested By" value={order.requestedByName} />
              <DetailRow
                label="Created"
                value={new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              />
              <DetailRow
                label="Expected Delivery"
                value={order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'short', year: 'numeric',
                }) : '—'}
              />
              <DetailRow
                label="Total Time"
                value={<span className="font-semibold text-gray-800">{fmtHours(order.totalElapsedHours)}</span>}
              />
            </div>
          </section>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Items ({order.items.length})
              </h3>
              <div className="space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border-subtle last:border-0">
                    <span className="text-gray-700">{item.description}</span>
                    <span className="text-gray-500 font-medium shrink-0 ml-2">{item.qty} {item.unit}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Currently With */}
          <section className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Currently With</h3>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">
                  {order.assignedToName ?? 'Unassigned'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{order.stage}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{fmtHours(order.elapsedHours)}</p>
                <p className="text-xs text-gray-400">in current stage</p>
              </div>
            </div>
            {slaHours && (
              <div className="mt-3">
                <SLABar elapsedHours={order.elapsedHours} slaHours={slaHours} />
              </div>
            )}
          </section>

          {/* Notes */}
          {order.notes && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{order.notes}</p>
            </section>
          )}

          {/* Stage History */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Stage History
            </h3>
            <StageHistory history={order.stageHistory} currentStage={order.stage} />
          </section>
        </div>

        {/* Footer */}
        {(canAssign || canReverse) && (
          <div className="px-6 py-4 border-t border-border-default shrink-0 flex items-center gap-3">
            {canAssign && onAssign && (
              <button
                onClick={() => onAssign(order)}
                className="flex-1 h-9 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-button transition-colors duration-150"
              >
                {order.assignedTo ? 'Reassign' : 'Assign'}
              </button>
            )}
            {canReverse && canAssign && onReverse && (
              <button
                onClick={() => onReverse(order)}
                className="h-9 px-4 border border-border-default text-gray-700 text-sm font-medium rounded-button hover:bg-gray-50 transition-colors duration-150"
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
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}
export default DetailPanel
