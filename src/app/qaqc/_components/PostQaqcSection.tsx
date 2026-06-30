'use client'

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

export function PostQaqcSection({ orders, onInspect }: PostQaqcSectionProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Post-QAQC Inspection" count={orders.length} className="mb-3" />
      {orders.length === 0 && (
        <p className="text-sm text-gray-400">No containers ready for inspection.</p>
      )}
      <div className="space-y-3">
        {orders.map(o => (
          <Card key={o.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                  <StagePill stage={o.stage as Stage} />
                </div>
                <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Container: <span className="font-mono font-semibold text-gray-700">{o.containerId ?? '-'}</span>
                  {' · '}Packed by {o.assignedToName ?? 'Unassigned'}
                  {' · '}{fmtHours(o.elapsedHours)} elapsed
                </p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onInspect(o)}
              >
                Inspect &amp; Approve
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
