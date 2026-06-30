'use client'

import { Wrench, User, Calendar, Clock, Play, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PRI_CFG, STS_CFG } from './styleMaps'
import type { WorkOrder } from './types'

interface WorkOrdersTabProps {
  orders: WorkOrder[]
  completing: string | null
  onSelectOrder: (wo: WorkOrder) => void
  onStart: (id: string) => void
  onComplete: (id: string) => void
}

export function WorkOrdersTab({ orders, completing, onSelectOrder, onStart, onComplete }: WorkOrdersTabProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-card border border-border-default shadow-card py-16 text-center">
        <Wrench size={40} className="mx-auto text-neutral-200 mb-3" strokeWidth={1.5}/>
        <p className="text-sm font-semibold text-neutral-400">No open work orders</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map(wo => {
        const pc = PRI_CFG[wo.priority]
        const sc = STS_CFG[wo.status]
        const isOverdue = wo.status === 'overdue'
        return (
          <div
            key={wo.id}
            className={`bg-white rounded-card border shadow-card p-5 cursor-pointer hover:shadow-md transition-all ${isOverdue?'border-red-200 ring-1 ring-red-100':'border-border-default'}`}
            onClick={() => onSelectOrder(wo)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs font-bold text-brand-500">{wo.id}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${pc.badge}`}>{wo.priority}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>{sc.label}</span>
                  <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded-full">{wo.type}</span>
                </div>
                <p className="text-sm font-bold text-neutral-900">{wo.task}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{wo.equipment} · {wo.category}</p>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><User size={11}/>{wo.assignedTo}</span>
                  <span className="flex items-center gap-1"><Calendar size={11}/>Due {wo.dueDate}</span>
                  <span className="flex items-center gap-1"><Clock size={11}/>Est. {wo.estimatedHours}h</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                {wo.status==='pending' && (
                  <Button variant="secondary" size="sm" icon={<Play size={11}/>}
                    onClick={() => onStart(wo.id)}>
                    Start
                  </Button>
                )}
                {wo.status==='in_progress' && (
                  <Button variant="brand" size="sm" icon={<CheckCheck size={11}/>}
                    disabled={completing===wo.id}
                    onClick={() => onComplete(wo.id)}>
                    {completing===wo.id?'Saving…':'Complete'}
                  </Button>
                )}
                {wo.status==='overdue' && (
                  <Button variant="danger" size="sm" icon={<Play size={11}/>}
                    onClick={() => onStart(wo.id)}>
                    Start Now
                  </Button>
                )}
              </div>
            </div>
            {wo.techNote && (
              <p className="mt-3 text-xs text-neutral-500 bg-neutral-50 rounded-lg px-3 py-2 border border-border-default">
                {wo.techNote}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
