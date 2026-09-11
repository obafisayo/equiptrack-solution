'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { type WorkOrder, type OrderItem } from '@/lib/mock-data'
import {
  type ReturnDisposition, type ReturnItemCategory, type ReturnLineItem,
  DISPOSITION_LABEL, CATEGORY_LABEL, CATEGORY_COLOR, DISPOSITION_COLOR,
} from '@/lib/return-store'
import { Select } from '@/components/ui/Form'

const DISPOSITIONS: ReturnDisposition[] = ['send_to_base', 'send_to_vendor', 'reintegrate', 'scrap', 'trash']
const CATEGORIES: ReturnItemCategory[] = ['normal', 'dangerous', 'refrigerated', 'radioactive', 'hazardous']

interface LineItemState {
  disposition: ReturnDisposition | ''
  category: ReturnItemCategory | ''
}

interface Props {
  order: WorkOrder
  onClose: () => void
  onSubmit: (orderId: string, items: ReturnLineItem[], notes: string) => void
}

export function ReturnWorkflowPanel({ order, onClose, onSubmit }: Props) {
  const [itemStates, setItemStates] = useState<LineItemState[]>(
    order.items.map(() => ({ disposition: '', category: '' }))
  )
  const [notes, setNotes] = useState('')

  const allComplete = itemStates.every(s => s.disposition !== '' && s.category !== '')

  function setDisposition(idx: number, value: ReturnDisposition) {
    setItemStates(prev => prev.map((s, i) => i === idx ? { ...s, disposition: value } : s))
  }

  function setCategory(idx: number, value: ReturnItemCategory) {
    setItemStates(prev => prev.map((s, i) => i === idx ? { ...s, category: value } : s))
  }

  function handleSubmit() {
    if (!allComplete) return
    const returnItems: ReturnLineItem[] = order.items.map((item, i) => ({
      description: item.description,
      qty: item.qty,
      unit: item.unit,
      partNumber: item.partNumber,
      disposition: itemStates[i].disposition as ReturnDisposition,
      category: itemStates[i].category as ReturnItemCategory,
    }))
    onSubmit(order.id, returnItems, notes)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[560px] bg-white shadow-2xl flex flex-col h-full">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border-default shrink-0">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-teal-600 uppercase tracking-wide mb-1">Process Return</p>
            <h2 className="text-base font-bold text-gray-900 font-mono">{order.id}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{order.workOrderNumber} · {order.requestType} · Egina</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 shrink-0 flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Instructions */}
        <div className="px-5 py-3 bg-teal-50 border-b border-teal-100 shrink-0">
          <p className="text-xs text-teal-700 font-medium">
            Set a <strong>disposition</strong> and <strong>item category</strong> for each line item below, then submit a deckspace request.
          </p>
        </div>

        {/* Line items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {order.items.map((item: OrderItem, idx) => {
            const state = itemStates[idx]
            const hasDisp = state.disposition !== ''
            const hasCat  = state.category !== ''

            return (
              <div key={idx} className="border border-border-default rounded-card p-4 space-y-3">
                {/* Item header */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-gray-500">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty: <span className="font-mono font-semibold text-gray-700">{item.qty} {item.unit}</span>
                      {item.partNumber && <span className="ml-3 font-mono">{item.partNumber}</span>}
                    </p>
                  </div>
                  {(!hasDisp || !hasCat) && (
                    <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-1" />
                  )}
                </div>

                {/* Disposition + Category selects */}
                <div className="grid grid-cols-2 gap-3 ml-9">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
                      What to do
                    </label>
                    <Select
                      aria-label="Disposition"
                      value={state.disposition}
                      onChange={e => setDisposition(idx, e.target.value as ReturnDisposition)}
                      size="sm"
                      className="w-full"
                    >
                      <option value="">Select disposition...</option>
                      {DISPOSITIONS.map(d => (
                        <option key={d} value={d}>{DISPOSITION_LABEL[d]}</option>
                      ))}
                    </Select>
                    {hasDisp && (
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${DISPOSITION_COLOR[state.disposition as ReturnDisposition]}`}>
                        {DISPOSITION_LABEL[state.disposition as ReturnDisposition]}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
                      Item category
                    </label>
                    <Select
                      aria-label="Item category"
                      value={state.category}
                      onChange={e => setCategory(idx, e.target.value as ReturnItemCategory)}
                      size="sm"
                      className="w-full"
                    >
                      <option value="">Select category...</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                      ))}
                    </Select>
                    {hasCat && (
                      <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CATEGORY_COLOR[state.category as ReturnItemCategory]}`}>
                        {CATEGORY_LABEL[state.category as ReturnItemCategory]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any notes for the Vessel Coordinator..."
              rows={3}
              className="w-full text-sm border border-border-default rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-default bg-slate-50 shrink-0">
          {!allComplete && (
            <p className="text-xs text-amber-600 font-medium mb-3 flex items-center gap-1.5">
              <AlertTriangle size={12} />
              All items need a disposition and category before submitting.
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-button border border-border-default text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allComplete}
              className="flex-1 h-10 rounded-button bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Submit Deckspace Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
