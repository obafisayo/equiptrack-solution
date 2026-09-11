'use client'

import { Ship, CheckCircle } from 'lucide-react'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { WorkOrder } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'

interface AwaitingDeckspaceTabProps {
  orders: WorkOrder[]
  onMarkShipped: (orderId: string) => void
}

export function AwaitingDeckspaceTab({ orders, onMarkShipped }: AwaitingDeckspaceTabProps) {
  return (
    <section>
      <SectionTitle title="Awaiting Vessel Assignment" count={orders.length} className="mb-3" />
      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">No orders awaiting deckspace.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => {
            const hasVessel = !!o.allocatedVessel
            return (
              <Card key={o.id} className={`p-4 ${hasVessel ? 'border-green-200' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                      <StagePill stage={o.stage} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                    {o.waybillNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        Waybill: <span className="font-mono font-semibold text-gray-700">{o.waybillNumber}</span>
                      </p>
                    )}
                    {hasVessel ? (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-green-700 font-semibold">
                        <Ship size={12} />
                        Vessel allocated: {o.allocatedVessel}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Awaiting vessel coordinator
                      </p>
                    )}
                  </div>
                  {hasVessel && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onMarkShipped(o.id)}
                    >
                      <CheckCircle size={13} className="mr-1" />
                      Mark Shipped
                    </Button>
                  )}
                  {!hasVessel && (
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 shrink-0">
                      Awaiting vessel
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-400">{fmtHours(o.elapsedHours)} waiting</p>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
