'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Package } from 'lucide-react'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { type WorkOrder } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

interface PostQaqcSectionProps {
  orders: WorkOrder[]
  onInspect: (order: WorkOrder) => void
}

function PostQaqcCard({ order, onInspect }: { order: WorkOrder; onInspect: (o: WorkOrder) => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-brand-500 text-sm">{order.id}</span>
            <StagePill stage={order.stage as Stage} />
            {expanded
              ? <ChevronDown size={12} className="text-gray-400 ml-1" />
              : <ChevronRight size={12} className="text-gray-400 ml-1" />
            }
          </div>
          <p className="text-sm font-medium text-gray-900">{order.destination}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Container: <span className="font-mono font-semibold text-gray-700">{order.containerId ?? '-'}</span>
            {' · '}Packed by {order.assignedToName ?? 'Unassigned'}
            {' · '}{fmtHours(order.elapsedHours)} elapsed
          </p>
        </button>
        <Button
          type="button"
          variant="success"
          size="sm"
          onClick={() => onInspect(order)}
        >
          Inspect &amp; Approve
        </Button>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-border-default/60 bg-gray-50/60 px-4 py-3 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Request Details</p>

          <div className="flex flex-wrap gap-3 text-[11px] text-gray-600 mb-2">
            <span>Requester: <span className="font-semibold text-gray-800">{order.requestedByName ?? '—'}</span></span>
            {order.entity && <span>Entity: <span className="font-semibold text-gray-800">{order.entity}</span></span>}
            <span>Type: <span className="font-semibold text-gray-800">{order.requestType}</span></span>
            <span>Urgency: <span className="font-semibold text-gray-800">{order.urgency}</span></span>
            {order.cargoClass && order.cargoClass !== 'normal' && (
              <span>Cargo: <span className="font-semibold text-orange-700 uppercase">{order.cargoClass}</span></span>
            )}
            {order.expectedDeliveryDate && (
              <span>Required: <span className="font-semibold text-gray-800">{new Date(order.expectedDeliveryDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</span></span>
            )}
          </div>

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

          {order.notes && (
            <p className="text-[11px] text-gray-500 italic border-t border-border-default/40 pt-2">{order.notes}</p>
          )}
        </div>
      )}
    </Card>
  )
}

export function PostQaqcSection({ orders, onInspect }: PostQaqcSectionProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Post-QAQC Inspection" count={orders.length} className="mb-3" />
      {orders.length === 0 && (
        <p className="text-sm text-gray-400">No containers ready for inspection.</p>
      )}
      <div className="space-y-3">
        {orders.map(o => (
          <PostQaqcCard key={o.id} order={o} onInspect={onInspect} />
        ))}
      </div>
    </section>
  )
}
