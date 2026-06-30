'use client'

import { PRI_CFG } from './styleMaps'
import type { WorkOrder } from './types'

interface HistoryTabProps {
  history: WorkOrder[]
}

export function HistoryTab({ history }: HistoryTabProps) {
  return (
    <div className="space-y-3">
      {history.map(wo=>(
        <div key={wo.id} className="bg-white border border-border-default rounded-card shadow-card p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs font-bold text-brand-500">{wo.id}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${PRI_CFG[wo.priority].badge}`}>{wo.priority}</span>
                <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded-full">{wo.type}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border bg-green-50 text-green-700 border-green-200">Completed</span>
              </div>
              <p className="text-sm font-bold text-neutral-900">{wo.task}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{wo.equipment} · {wo.category}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-neutral-700">{wo.assignedTo.split(' ')[0]}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{wo.completedAt}</p>
              {wo.actualHours && (
                <p className="text-xs font-bold text-neutral-600 mt-0.5">{wo.actualHours}h actual</p>
              )}
            </div>
          </div>
          {wo.techNote && (
            <p className="text-xs text-neutral-600 bg-neutral-50 border border-border-default rounded-lg px-3 py-2.5 leading-relaxed">
              {wo.techNote}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
            <span>Est: {wo.estimatedHours}h</span>
            {wo.actualHours && <span className={wo.actualHours>wo.estimatedHours?'text-red-500':'text-green-600'}>Actual: {wo.actualHours}h</span>}
            <span>Due: {wo.dueDate}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
