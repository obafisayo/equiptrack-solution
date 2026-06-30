'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { type WorkOrder } from '@/lib/mock-data'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

interface PreloadQaqcSectionProps {
  orders: WorkOrder[]
  onAssignContainer: (order: WorkOrder) => void
}

export function PreloadQaqcSection({ orders, onAssignContainer }: PreloadQaqcSectionProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Preload QAQC Queue" count={orders.length} className="mb-3" />
      {orders.length === 0 && (
        <p className="text-sm text-gray-400">No orders awaiting container assignment.</p>
      )}
      <div className="space-y-3">
        {orders.map(o => {
          const slaHrs = STAGE_SLA_HOURS[o.stage]
          const breached = slaHrs != null && o.elapsedHours > slaHrs
          return (
            <Card key={o.id} className={`p-4 relative overflow-hidden ${breached ? 'border-red-200' : ''}`}>
              {breached && <div className="absolute top-0 left-0 right-0 h-0.75 bg-red-500" />}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage as Stage} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {o.items.length} item{o.items.length !== 1 ? 's' : ''} &middot; {o.requestType} &middot; Pending action by {o.assignedToName ?? 'Unassigned'}
                  </p>
                  {slaHrs && (
                    <div className="mt-2">
                      <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} showLabel />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => onAssignContainer(o)}
                >
                  Assign Container
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
