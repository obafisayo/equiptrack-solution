'use client'

import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { type WorkOrder } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours, type UrgencyLevel } from '@/config/sla'

const URGENCY_COLOR: Record<UrgencyLevel, { badge: string }> = {
  Low:    { badge: 'bg-green-50  text-green-700' },
  Medium: { badge: 'bg-amber-50  text-amber-700' },
  High:   { badge: 'bg-orange-50 text-orange-700' },
  Urgent: { badge: 'bg-red-50    text-red-700' },
}

export type TaskAction = 'process' | 'gi' | 'transfer'

interface TaskCardProps {
  order: WorkOrder
  isSelected: boolean
  onSelect: (id: string) => void
  onAction: (orderId: string, action: TaskAction) => void
}

export function TaskCard({ order, isSelected, onSelect, onAction }: TaskCardProps) {
  const sla = STAGE_SLA_HOURS[order.stage]
  const breached = sla != null && order.elapsedHours > sla
  const urgConfig = URGENCY_COLOR[order.urgency]

  return (
    <div
      className={`bg-white rounded-card border shadow-card relative overflow-hidden cursor-pointer transition-shadow duration-150 hover:shadow-raised ${
        breached ? 'border-red-200' : 'border-border-default'
      } ${isSelected ? 'ring-2 ring-brand-500' : ''}`}
      onClick={() => onSelect(order.id)}
    >
      {breached && (
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-status-critical rounded-t-card" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono-id text-brand-500 font-bold text-sm">{order.id}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgConfig.badge}`}>
              {order.urgency}
            </span>
          </div>
          <StagePill stage={order.stage as Stage} />
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400 shrink-0">
            <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5C2.5 7.25 6 11 6 11C6 11 9.5 7.25 9.5 4.5C9.5 2.57 7.93 1 6 1ZM6 6C5.17 6 4.5 5.33 4.5 4.5C4.5 3.67 5.17 3 6 3C6.83 3 7.5 3.67 7.5 4.5C7.5 5.33 6.83 6 6 6Z" fill="currentColor"/>
          </svg>
          <span className="text-sm font-medium text-gray-800">{order.destination}</span>
          <span className="text-xs text-gray-400 ml-1">· {order.items?.length ?? 1} item{(order.items?.length ?? 1) !== 1 ? 's' : ''}</span>
        </div>

        {sla && (
          <div className="mb-3">
            <SLABar elapsedHours={order.elapsedHours} slaHours={sla} />
          </div>
        )}

        <div className="flex gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
          {order.stage === 'Warehouse Assigned' && (
            <button
              type="button"
              onClick={() => onAction(order.id, 'process')}
              className="px-3 h-8 rounded-button bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Processing
            </button>
          )}
          {order.stage === 'Processing' && (
            <button
              type="button"
              onClick={() => onAction(order.id, 'gi')}
              className="px-3 h-8 rounded-button bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Create GI
            </button>
          )}
          {order.stage === 'GI Created' && (
            <button
              type="button"
              onClick={() => onAction(order.id, 'transfer')}
              className="px-3 h-8 rounded-button bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
            >
              Transfer to Dispatch
            </button>
          )}
          <span className="text-xs text-gray-400 self-center ml-auto">
            {fmtHours(order.elapsedHours)} in stage
          </span>
        </div>
      </div>
    </div>
  )
}
