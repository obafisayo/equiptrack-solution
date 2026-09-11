'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { type WorkOrder } from '@/lib/mock-data'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'
import { Package, CheckCircle2, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface PersonnelGroup {
  personnelId: string
  personnelName: string
  orders: WorkOrder[]
  assignedCCUSerial: string | undefined
}

interface PreloadQaqcSectionProps {
  orders: WorkOrder[]
  onAssignContainer: (personnelId: string, personnelName: string, destination: string) => void
}

function OrderDetailRow({ order }: { order: WorkOrder }) {
  const [expanded, setExpanded] = useState(false)
  const slaHrs  = STAGE_SLA_HOURS[order.stage]
  const breached = slaHrs != null && order.elapsedHours > slaHrs

  return (
    <div className={`border-b border-border-default/60 last:border-b-0 ${breached ? 'bg-red-50/40' : ''}`}>
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-gray-50/70 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono font-bold text-brand-500 text-xs">{order.id}</span>
            <StagePill stage={order.stage as Stage} />
          </div>
          <p className="text-xs text-gray-600 font-medium">{order.destination}</p>
          <p className="text-xs text-gray-500">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.requestType} · by {order.requestedByName ?? '—'}
          </p>
          {slaHrs && (
            <div className="mt-1.5">
              <SLABar elapsedHours={order.elapsedHours} slaHours={slaHrs} showLabel />
            </div>
          )}
        </div>
        {expanded ? <ChevronDown size={13} className="text-gray-400 mt-0.5 shrink-0" /> : <ChevronRight size={13} className="text-gray-400 mt-0.5 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-2 bg-gray-50/60">
          {/* Items */}
          <div className="space-y-0.5">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Package size={9} className="text-gray-300 shrink-0" />
                  {item.description}
                  {item.partNumber && <span className="font-mono text-gray-400"> · {item.partNumber}</span>}
                </span>
                <span className="text-gray-400 ml-2 shrink-0">{item.qty} {item.unit}</span>
              </div>
            ))}
          </div>
          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 pt-1 border-t border-border-default/40">
            {order.urgency && (
              <span>Urgency: <span className="font-semibold text-gray-700">{order.urgency}</span></span>
            )}
            {order.entity && (
              <span>Entity: <span className="font-semibold text-gray-700">{order.entity}</span></span>
            )}
            {order.expectedDeliveryDate && (
              <span>Required by: <span className="font-semibold text-gray-700">{new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</span></span>
            )}
          </div>
          {order.notes && (
            <p className="text-[11px] text-gray-500 italic border-t border-border-default/40 pt-1">{order.notes}</p>
          )}
        </div>
      )}
    </div>
  )
}

export function PreloadQaqcSection({ orders, onAssignContainer }: PreloadQaqcSectionProps) {
  // Group Dispatch Assigned orders by dispatch personnel
  const groups: PersonnelGroup[] = []
  const seen = new Set<string>()
  for (const o of orders) {
    const pid = o.assignedTo ?? '__unassigned__'
    if (!seen.has(pid)) {
      seen.add(pid)
      const personnelOrders = orders.filter(x => (x.assignedTo ?? '__unassigned__') === pid)
      groups.push({
        personnelId:   pid,
        personnelName: o.assignedToName ?? 'Unassigned',
        orders:        personnelOrders,
        assignedCCUSerial: personnelOrders.find(x => x.assignedCCUSerial)?.assignedCCUSerial,
      })
    }
  }

  if (groups.length === 0) {
    return (
      <section className="mb-8">
        <SectionTitle title="Pending Container Assignment" count={0} className="mb-3" />
        <p className="text-sm text-gray-400">No orders awaiting container assignment.</p>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <SectionTitle title="Pending Container Assignment" count={orders.length} className="mb-3" />
      <div className="space-y-4">
        {groups.map(group => {
          const destination = group.orders[0]?.destination ?? ''
          const isAssigned  = !!group.assignedCCUSerial

          return (
            <Card key={group.personnelId} className="p-0 overflow-hidden">
              {/* Group header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-border-default">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{group.personnelName}</p>
                  <p className="text-xs text-gray-500">
                    {group.orders.length} order{group.orders.length !== 1 ? 's' : ''} · {destination}
                  </p>
                </div>

                {isAssigned ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={11} />
                      Assigned
                    </span>
                    <button
                      type="button"
                      onClick={() => onAssignContainer(group.personnelId, group.personnelName, destination)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 px-2.5 py-1 rounded-full transition-colors"
                    >
                      <RefreshCw size={10} />
                      Reassign
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => onAssignContainer(group.personnelId, group.personnelName, destination)}
                  >
                    Assign Container
                  </Button>
                )}
              </div>

              {/* Assigned CCU strip */}
              {isAssigned && group.assignedCCUSerial && (
                <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex flex-wrap gap-2 items-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full">
                    <Package size={9} />
                    {group.assignedCCUSerial}
                  </span>
                  <span className="text-[11px] text-green-700">assigned to {group.personnelName}</span>
                </div>
              )}

              {/* Expandable order rows */}
              <div>
                {group.orders.map(o => <OrderDetailRow key={o.id} order={o} />)}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
