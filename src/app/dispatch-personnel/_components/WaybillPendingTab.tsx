'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { WorkOrder } from '@/lib/mock-data'

interface WaybillPendingTabProps {
  orders: WorkOrder[]
  onGenerateWaybill: (order: WorkOrder) => void
}

export function WaybillPendingTab({ orders, onGenerateWaybill }: WaybillPendingTabProps) {
  return (
    <section>
      <SectionTitle title="Awaiting Waybill Generation" count={orders.length} className="mb-3" />
      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">No waybills pending.</p>
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
                  {o.containerId && (
                    <p className="text-xs text-gray-500 mt-1">Container: <span className="font-mono font-semibold text-gray-700">{o.containerId}</span></p>
                  )}
                </div>
                <Button variant="primary" size="sm" onClick={() => onGenerateWaybill(o)}>
                  Generate Waybill
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
