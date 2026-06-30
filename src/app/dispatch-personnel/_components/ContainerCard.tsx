'use client'

import { useState } from 'react'
import { Package } from 'lucide-react'
import { StagePill } from '@/components/domain/Pills'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { WorkOrder } from '@/lib/mock-data'

interface ContainerCardProps {
  containerId: string
  orders: WorkOrder[]
  onSubmitQAQC?: () => void
  onGenerateWaybill?: (order: WorkOrder) => void
  onRequestDeckspace?: (order: WorkOrder) => void
}

export function ContainerCard({ containerId, orders, onSubmitQAQC, onGenerateWaybill, onRequestDeckspace }: ContainerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const destination = orders[0]?.destination ?? '-'
  const stage = orders[0]?.stage

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-gray-500" />
          <span className="font-mono font-bold text-gray-900 text-sm">{containerId}</span>
          <span className="text-xs text-gray-500">·</span>
          <span className="text-xs font-medium text-gray-700">{destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 font-medium">
            {orders.length} WO{orders.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? 'Collapse' : 'Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-border-default">
          {orders.map(o => (
            <div key={o.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs font-semibold text-brand-500">{o.id}</span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="text-xs text-gray-600">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="text-xs text-gray-500">{o.requestType}</span>
              </div>
              <StagePill stage={o.stage} />
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
        {stage && (
          <StagePill stage={stage} />
        )}
        <div className="ml-auto flex gap-2">
          {onSubmitQAQC && (
            <Button variant="secondary" size="sm" onClick={onSubmitQAQC}>
              Submit for QAQC
            </Button>
          )}
          {onGenerateWaybill && orders[0] && (
            <Button variant="primary" size="sm" onClick={() => onGenerateWaybill(orders[0])}>
              Generate Waybill
            </Button>
          )}
          {onRequestDeckspace && orders[0] && (
            <Button variant="primary" size="sm" onClick={() => onRequestDeckspace(orders[0])}>
              Request Deckspace
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
