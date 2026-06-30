'use client'

import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import type { StockItem } from './types'

interface IssueForm {
  qty: string
  workOrder: string
  note: string
}

interface IssueEquipmentPanelProps {
  item: StockItem
  form: IssueForm
  success: boolean
  onFormChange: (form: IssueForm) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function IssueEquipmentPanel({ item, form, success, onFormChange, onSubmit, onClose }: IssueEquipmentPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Issue Equipment</h2>
            <p className="text-xs text-neutral-500 mt-0.5 truncate">{item.name}</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-500"/>
            </div>
            <p className="text-base font-bold text-neutral-900">Equipment Issued</p>
            <p className="text-sm text-neutral-500">Stock level has been updated and movement recorded.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-neutral-50 rounded-xl p-4 border border-border-default">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Available stock</span>
                <span className="font-bold text-neutral-900">{item.qty} {item.unit}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-neutral-400">Location</span>
                <span className="text-neutral-600">{item.location}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Quantity to Issue <span className="text-status-critical">*</span></label>
              <Input type="number" min="1" max={item.qty} placeholder={`Max ${item.qty}`}
                value={form.qty} onChange={e => onFormChange({ ...form, qty: e.target.value })} required/>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Work Order / Reference</label>
              <Input placeholder="e.g. WO-0088, PO-2244…"
                value={form.workOrder} onChange={e => onFormChange({ ...form, workOrder: e.target.value })}/>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Note</label>
              <Textarea rows={2} placeholder="Destination, purpose, or instructions…"
                value={form.note} onChange={e => onFormChange({ ...form, note: e.target.value })}/>
            </div>
            <div className="pt-2 border-t border-border-default">
              <Button type="submit" variant="brand" fullWidth size="md">Confirm Issue</Button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
