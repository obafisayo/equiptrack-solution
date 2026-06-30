'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Card } from '@/components/ui/Card'
import { type WorkOrder, type Container } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

interface ContainerGroupCardProps {
  containerId: string
  groupOrders: WorkOrder[]
  container: Container | undefined
}

export function ContainerGroupCard({ containerId, groupOrders, container }: ContainerGroupCardProps) {
  const [expanded, setExpanded] = useState(false)
  const footArea = container ? (container.lengthFt * container.widthFt).toFixed(0) : null

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-gray-900">{containerId}</span>
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Packing</span>
          </div>
          {container && (
            <p className="text-xs text-gray-500">
              {container.size} &middot; {container.yard}
              {footArea && ` · ${container.lengthFt}ft × ${container.widthFt}ft (${footArea} sq ft)`}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">
            {groupOrders.length} work order{groupOrders.length !== 1 ? 's' : ''} &middot; Destination: {groupOrders[0]?.destination ?? '-'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border-default pt-3">
          {groupOrders.map(o => {
            const slaHrs = STAGE_SLA_HOURS[o.stage]
            return (
              <div key={o.id} className="bg-gray-50 rounded-md px-3 py-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-bold text-brand-500">{o.id}</span>
                  <StagePill stage={o.stage as Stage} />
                </div>
                <p className="text-xs text-gray-600">{o.items.length} item{o.items.length !== 1 ? 's' : ''} &middot; {o.requestType}</p>
                {slaHrs && (
                  <div className="mt-1">
                    <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} />
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1">{fmtHours(o.elapsedHours)} in stage &middot; Packed by {o.assignedToName ?? 'Unassigned'}</p>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
