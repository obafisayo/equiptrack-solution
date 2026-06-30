'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { Card } from '@/components/ui/Card'
import { type WorkOrder, type Container } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'
import { ContainerGroupCard } from './ContainerGroupCard'

interface ContainerizationSectionProps {
  orders: WorkOrder[]
  containerGroups: Map<string, WorkOrder[]>
  containers: Container[]
}

export function ContainerizationSection({ orders, containerGroups, containers }: ContainerizationSectionProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Containerization in Progress" count={orders.length} className="mb-3" />
      {orders.length === 0 && (
        <p className="text-sm text-gray-400">No active packing.</p>
      )}
      <div className="space-y-3">
        {/* Orders without a container */}
        {(containerGroups.get('__none__') ?? []).map(o => (
          <Card key={o.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                  <StagePill stage={o.stage as Stage} />
                </div>
                <p className="text-sm text-gray-900">{o.destination}</p>
                <p className="text-xs text-gray-500 mt-0.5">No container assigned &middot; {fmtHours(o.elapsedHours)} elapsed</p>
              </div>
              <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">Awaiting container</span>
            </div>
          </Card>
        ))}
        {/* Orders grouped by container */}
        {Array.from(containerGroups.entries())
          .filter(([key]) => key !== '__none__')
          .map(([cid, grpOrders]) => (
            <ContainerGroupCard
              key={cid}
              containerId={cid}
              groupOrders={grpOrders}
              container={containers.find(c => c.id === cid)}
            />
          ))
        }
      </div>
    </section>
  )
}
