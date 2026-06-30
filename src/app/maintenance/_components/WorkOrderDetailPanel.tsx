'use client'

import { X, Play, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Form'
import { PRI_CFG, STS_CFG } from './styleMaps'
import type { WorkOrder } from './types'

interface WorkOrderDetailPanelProps {
  workOrder: WorkOrder
  noteInput: string
  completing: string | null
  onNoteChange: (value: string) => void
  onStart: (id: string) => void
  onComplete: (id: string) => void
  onClose: () => void
}

export function WorkOrderDetailPanel({
  workOrder, noteInput, completing, onNoteChange, onStart, onComplete, onClose,
}: WorkOrderDetailPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <p className="font-mono text-xs font-bold text-brand-500 mb-1">{workOrder.id}</p>
            <h2 className="text-base font-bold text-neutral-900">{workOrder.task}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border capitalize ${PRI_CFG[workOrder.priority].badge}`}>{workOrder.priority}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${STS_CFG[workOrder.status].badge}`}>{STS_CFG[workOrder.status].label}</span>
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Equipment',  workOrder.equipment],
              ['Category',   workOrder.category],
              ['Type',       workOrder.type],
              ['Assigned To',workOrder.assignedTo],
              ['Due Date',   workOrder.dueDate],
              ['Est. Hours', `${workOrder.estimatedHours}h`],
              ['Started',    workOrder.startedAt ?? 'Not started'],
            ].map(([label, value]) => (
              <div key={label} className="bg-neutral-50 rounded-lg p-3 border border-border-default">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-neutral-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Tech notes editor */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">
              Technician Notes
            </label>
            <Textarea
              rows={3}
              value={noteInput}
              onChange={e => onNoteChange(e.target.value)}
              placeholder="Add findings, observations, or instructions…"
            />
          </div>

          {/* Action buttons */}
          {workOrder.status === 'pending' && (
            <Button variant="secondary" fullWidth size="md" icon={<Play size={14}/>}
              onClick={() => onStart(workOrder.id)}>
              Start Work Order
            </Button>
          )}
          {(workOrder.status === 'in_progress' || workOrder.status === 'overdue') && (
            <Button variant="brand" fullWidth size="md" icon={<CheckCheck size={14}/>}
              disabled={completing === workOrder.id}
              onClick={() => onComplete(workOrder.id)}>
              {completing === workOrder.id ? 'Completing…' : 'Mark Complete'}
            </Button>
          )}
        </div>
      </aside>
    </>
  )
}
