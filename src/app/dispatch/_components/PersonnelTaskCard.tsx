'use client'

import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Card } from '@/components/ui/Card'
import { type WorkOrder } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'

interface PersonnelTaskCardProps {
  order: WorkOrder
  onAdvanceStage: (orderId: string, nextStage: Stage) => void
  onView: (orderId: string) => void
}

export function PersonnelTaskCard({ order: o, onAdvanceStage, onView }: PersonnelTaskCardProps) {
  const slaHrs = STAGE_SLA_HOURS[o.stage]
  const breached = slaHrs != null && o.elapsedHours > slaHrs

  return (
    <Card className={`p-3 relative overflow-hidden ${breached ? 'border-red-200' : ''}`}>
      {breached && <div className="absolute top-0 left-0 right-0 h-0.75 bg-red-500" />}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-brand-500">{o.id}</span>
            <StagePill stage={o.stage} />
          </div>
          <p className="text-xs text-gray-700 font-medium truncate">{o.destination}</p>
          <p className="text-xs text-gray-500 mt-0.5">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.requestType}</p>
          {slaHrs && (
            <div className="mt-1.5">
              <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          {o.stage === 'Dispatch Assigned' && (
            <button
              type="button"
              onClick={() => onAdvanceStage(o.id, 'Containerization')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              Start Packing
            </button>
          )}
          {o.stage === 'Containerization' && (
            <button
              type="button"
              onClick={() => onAdvanceStage(o.id, 'Post QAQC')}
              className="text-[11px] font-semibold px-2.5 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              Submit QAQC
            </button>
          )}
          <button
            type="button"
            onClick={() => onView(o.id)}
            className="text-[11px] font-medium px-2.5 py-1 rounded border border-border-default text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View
          </button>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-1.5">{fmtHours(o.elapsedHours)} in stage</p>
    </Card>
  )
}
