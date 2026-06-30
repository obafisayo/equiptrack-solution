'use client'

import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import { Dropdown } from '@/components/ui/Dropdown'
import { DatePicker } from '@/components/ui/DatePicker'
import { TYPE_OPTIONS, PRI_OPTIONS, EQUIPMENT_OPTIONS, TECH_OPTIONS, CAT_OPTIONS, PRI_CFG } from './styleMaps'
import type { CreateForm } from './types'

interface CreateWorkOrderPanelProps {
  form: CreateForm
  errors: Record<string, string>
  success: boolean
  onFormChange: (form: CreateForm) => void
  onErrorsChange: (errors: Record<string, string>) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function CreateWorkOrderPanel({ form, errors, success, onFormChange, onErrorsChange, onSubmit, onClose }: CreateWorkOrderPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Create Work Order</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Schedule new maintenance task</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-500"/>
            </div>
            <p className="text-base font-bold text-neutral-900">Work Order Created</p>
            <p className="text-sm text-neutral-500">The work order has been added to the queue.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Equipment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Equipment <span className="text-status-critical">*</span></label>
              <Dropdown options={EQUIPMENT_OPTIONS} value={form.equipment}
                onChange={v=>{onFormChange({...form,equipment:v});onErrorsChange({...errors,equipment:''})}}
                placeholder="Select equipment…" error={!!errors.equipment} searchable/>
              {errors.equipment && <p className="text-xs text-status-critical">{errors.equipment}</p>}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Category</label>
              <Dropdown options={CAT_OPTIONS} value={form.category}
                onChange={v=>onFormChange({...form,category:v})} placeholder="Select category…"/>
            </div>

            {/* Task description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Task Description <span className="text-status-critical">*</span></label>
              <Input placeholder="Describe the maintenance task…" value={form.task}
                onChange={e=>{onFormChange({...form,task:e.target.value});onErrorsChange({...errors,task:''})}}
                error={!!errors.task}/>
              {errors.task && <p className="text-xs text-status-critical">{errors.task}</p>}
            </div>

            {/* Type + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Type</label>
                <div className="space-y-1.5">
                  {TYPE_OPTIONS.map(t=>(
                    <button key={t} type="button"
                      onClick={()=>onFormChange({...form,type:t})}
                      className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg border-2 text-left transition-all ${form.type===t?'border-brand-500 bg-brand-50 text-brand-700':'border-border-default text-neutral-500 hover:bg-neutral-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Priority</label>
                <div className="space-y-1.5">
                  {PRI_OPTIONS.map(p=>(
                    <button key={p} type="button"
                      onClick={()=>onFormChange({...form,priority:p})}
                      className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg border-2 capitalize text-left transition-all ${form.priority===p?PRI_CFG[p].badge+' border-current':'border-border-default text-neutral-500 hover:bg-neutral-50'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Assigned To */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Assign To <span className="text-status-critical">*</span></label>
              <Dropdown options={TECH_OPTIONS} value={form.assignedTo}
                onChange={v=>{onFormChange({...form,assignedTo:v});onErrorsChange({...errors,assignedTo:''})}}
                placeholder="Select technician…" error={!!errors.assignedTo}/>
              {errors.assignedTo && <p className="text-xs text-status-critical">{errors.assignedTo}</p>}
            </div>

            {/* Due Date + Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Due Date <span className="text-status-critical">*</span></label>
                <DatePicker value={form.dueDate}
                  onChange={v=>{onFormChange({...form,dueDate:v});onErrorsChange({...errors,dueDate:''})}}
                  error={!!errors.dueDate}/>
                {errors.dueDate && <p className="text-xs text-status-critical">{errors.dueDate}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Est. Hours</label>
                <Input type="number" min="0.5" step="0.5" placeholder="e.g. 4"
                  value={form.estimatedHours} onChange={e=>onFormChange({...form,estimatedHours:e.target.value})}/>
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Notes / Instructions</label>
              <Textarea rows={2} placeholder="Any initial notes, parts required, or safety precautions…"
                value={form.note} onChange={e=>onFormChange({...form,note:e.target.value})}/>
            </div>

            <div className="pt-2 border-t border-border-default">
              <Button type="submit" variant="brand" fullWidth size="md">Create Work Order</Button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
