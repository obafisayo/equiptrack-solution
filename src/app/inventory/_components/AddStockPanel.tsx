'use client'

import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Form'
import { Dropdown } from '@/components/ui/Dropdown'
import { CAT_OPTIONS, UNIT_OPTIONS } from './styleMaps'

export interface AddForm {
  name: string
  category: string
  qty: string
  reorderAt: string
  unit: string
  location: string
}

interface AddStockPanelProps {
  form: AddForm
  errors: Record<string, string>
  success: boolean
  onFormChange: (form: AddForm) => void
  onErrorsChange: (errors: Record<string, string>) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function AddStockPanel({ form, errors, success, onFormChange, onErrorsChange, onSubmit, onClose }: AddStockPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Add Stock Item</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Register new equipment in inventory</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-500"/>
            </div>
            <p className="text-base font-bold text-neutral-900">Stock Added</p>
            <p className="text-sm text-neutral-500">The item has been added to inventory.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Item Description <span className="text-status-critical">*</span></label>
              <Input placeholder="e.g. Drill Pipe 5in 19.5ppf" value={form.name}
                onChange={e => { onFormChange({ ...form, name: e.target.value }); onErrorsChange({ ...errors, name: '' }) }}
                error={!!errors.name}/>
              {errors.name && <p className="text-xs text-status-critical">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Category <span className="text-status-critical">*</span></label>
              <Dropdown options={CAT_OPTIONS} value={form.category}
                onChange={v => { onFormChange({ ...form, category: v }); onErrorsChange({ ...errors, category: '' }) }}
                placeholder="Select category…" error={!!errors.category}/>
              {errors.category && <p className="text-xs text-status-critical">{errors.category}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Initial Qty <span className="text-status-critical">*</span></label>
                <Input type="number" min="0" placeholder="0" value={form.qty}
                  onChange={e => { onFormChange({ ...form, qty: e.target.value }); onErrorsChange({ ...errors, qty: '' }) }}
                  error={!!errors.qty}/>
                {errors.qty && <p className="text-xs text-status-critical">{errors.qty}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Reorder At</label>
                <Input type="number" min="0" placeholder="Auto" value={form.reorderAt}
                  onChange={e => onFormChange({ ...form, reorderAt: e.target.value })}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Unit <span className="text-status-critical">*</span></label>
                <Dropdown options={UNIT_OPTIONS} value={form.unit}
                  onChange={v => { onFormChange({ ...form, unit: v }); onErrorsChange({ ...errors, unit: '' }) }}
                  placeholder="e.g. joints" error={!!errors.unit}/>
                {errors.unit && <p className="text-xs text-status-critical">{errors.unit}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Storage Location</label>
                <Input placeholder="Bay 1-A" value={form.location}
                  onChange={e => onFormChange({ ...form, location: e.target.value })}/>
              </div>
            </div>

            <div className="pt-2 border-t border-border-default">
              <Button type="submit" variant="brand" fullWidth size="md">Add to Inventory</Button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
