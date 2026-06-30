'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { ContainerCard } from './ContainerCard'
import type { WorkOrder } from '@/lib/mock-data'

interface ContainerGroupsTabProps {
  title: string
  emptyLabel: string
  groups: Record<string, WorkOrder[]>
  onSubmitQAQC?: (orders: WorkOrder[]) => void
  onRequestDeckspace?: (order: WorkOrder) => void
}

export function ContainerGroupsTab({ title, emptyLabel, groups, onSubmitQAQC, onRequestDeckspace }: ContainerGroupsTabProps) {
  const entries = Object.entries(groups)
  return (
    <section>
      <SectionTitle title={title} count={entries.length} className="mb-3" />
      {entries.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, gOrders]) => (
            <ContainerCard
              key={key}
              containerId={gOrders[0].containerId ?? key}
              orders={gOrders}
              onSubmitQAQC={onSubmitQAQC ? () => onSubmitQAQC(gOrders) : undefined}
              onRequestDeckspace={onRequestDeckspace}
            />
          ))}
        </div>
      )}
    </section>
  )
}
