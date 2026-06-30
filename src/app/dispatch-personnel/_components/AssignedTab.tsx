'use client'

import { ShieldCheck } from 'lucide-react'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { WorkOrder } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'

interface AssignedTabProps {
  orders: WorkOrder[]
  onPack: () => void
}

export function AssignedTab({ orders, onPack }: AssignedTabProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <SectionTitle title="Assigned Tasks" count={orders.length} />
        {orders.length >= 2 && (
          <Button variant="primary" size="sm" onClick={onPack}>
            <ShieldCheck size={13} className="mr-1" />
            Pack into Container
          </Button>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">No tasks assigned to you yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => {
            const slaHrs = STAGE_SLA_HOURS[o.stage]
            return (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                      <StagePill stage={o.stage} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{o.destination}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.requestType}</p>
                    {slaHrs && (
                      <div className="mt-2">
                        <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} showLabel />
                      </div>
                    )}
                  </div>
                  <Button variant="secondary" size="sm" onClick={onPack}>
                    Pack
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-400">{fmtHours(o.elapsedHours)} in stage</p>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}
