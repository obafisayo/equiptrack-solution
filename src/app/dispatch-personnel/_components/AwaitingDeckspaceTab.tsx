'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { Card } from '@/components/ui/Card'
import type { WorkOrder } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'

interface AwaitingDeckspaceTabProps {
  orders: WorkOrder[]
}

export function AwaitingDeckspaceTab({ orders }: AwaitingDeckspaceTabProps) {
  return (
    <section>
      <SectionTitle title="Awaiting Vessel Assignment" count={orders.length} className="mb-3" />
      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">No orders awaiting deckspace.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                  {o.waybillNumber && (
                    <p className="text-xs text-gray-500 mt-1">Waybill: <span className="font-mono font-semibold text-gray-700">{o.waybillNumber}</span></p>
                  )}
                </div>
                <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  Awaiting vessel
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-400">{fmtHours(o.elapsedHours)} waiting</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
