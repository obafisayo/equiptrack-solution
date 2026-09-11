'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CONTRACTORS } from '@/app/qaqc/ccu-invoicing/_components/types'
import type { CCUType } from '@/app/qaqc/containers/_components/types'
import { CCU_TYPES_OPT } from '@/app/qaqc/containers/_components/types'
import { composeContractorMessage, type ContainerRequest, type RequestLineItem } from './types'
import { SlideOverPanel } from '@/components/ui/SlideOverPanel'
import { Button } from '@/components/ui/Button'

interface Props {
  open: boolean
  onConfirm: (req: Omit<ContainerRequest, 'id' | 'createdAt' | 'auditLog'>) => void
  onClose: () => void
}

interface LineItem { type: CCUType; quantity: number }

export function NewRequestDialog({ open, onConfirm, onClose }: Props) {
  const [contractorId, setContractorId] = useState(CONTRACTORS[0].id)
  const [lineItems, setLineItems]       = useState<LineItem[]>([{ type: 'Waste Skip', quantity: 1 }])
  const [step, setStep]                 = useState<1 | 2>(1)

  const contractor = CONTRACTORS.find(c => c.id === contractorId)!

  function addLine() {
    setLineItems(prev => [...prev, { type: 'Waste Skip', quantity: 1 }])
  }

  function removeLine(i: number) {
    setLineItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateLine(i: number, field: keyof LineItem, value: string | number) {
    setLineItems(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }

  const message = contractor
    ? composeContractorMessage(contractor.name, contractor.contactName, lineItems)
    : ''

  function handleSend() {
    const reqLineItems: RequestLineItem[] = lineItems.map(l => ({ type: l.type, quantity: l.quantity, responses: [] }))
    onConfirm({
      contractorId,
      contractorName: contractor.name,
      lineItems: reqLineItems,
      composedMessage: message,
      status: 'Sent',
      createdBy: 'Femi Emmanuel',
      sentAt: new Date().toISOString(),
    })
    setStep(1)
    setLineItems([{ type: 'Waste Skip', quantity: 1 }])
  }

  function handleClose() {
    setStep(1)
    onClose()
  }

  return (
    <SlideOverPanel
      open={open}
      onClose={handleClose}
      title={step === 1 ? 'New Container Request' : 'Review Composed Message'}
      subtitle={step === 2 ? `Sending to ${contractor?.name}` : undefined}
      footer={
        step === 1 ? (
          <div className="flex gap-3">
            <Button type="button" variant="ghost" size="md" fullWidth onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              disabled={lineItems.length === 0}
              onClick={() => setStep(2)}
            >
              Preview Message →
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button type="button" variant="ghost" size="md" fullWidth onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button type="button" variant="primary" size="md" fullWidth onClick={handleSend}>
              Send Request
            </Button>
          </div>
        )
      }
    >
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contractor</label>
            <select
              value={contractorId}
              onChange={e => setContractorId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/30 bg-white"
            >
              {CONTRACTORS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {contractor && (
              <p className="text-xs text-slate-400 mt-1">{contractor.contactName} · {contractor.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">CCU Types Requested</label>
              <button
                onClick={addLine}
                className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-brand-accent-hover"
              >
                <Plus size={12} /> Add Type
              </button>
            </div>
            <div className="space-y-2">
              {lineItems.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={item.type}
                    onChange={e => updateLine(i, 'type', e.target.value as CCUType)}
                    className="flex-1 px-3 py-2 text-sm border border-border-default rounded-lg focus:outline-none"
                  >
                    {CCU_TYPES_OPT.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={item.quantity}
                    onChange={e => updateLine(i, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-3 py-2 text-sm border border-border-default rounded-lg text-center focus:outline-none"
                  />
                  {lineItems.length > 1 && (
                    <button
                      onClick={() => removeLine(i)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            Once sent, the request is locked. Only contractor responses (serial numbers) can be entered afterwards. The composed message cannot be modified.
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            This message will be sent to <strong>{contractor.name}</strong>. It cannot be edited after sending.
          </p>
          <div className="bg-slate-50 border border-border-default rounded-xl p-4">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{message}</pre>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            After sending, wait for the contractor to provide serial numbers. Then use &quot;Record Response&quot; to enter and accept/reject each one.
          </div>
        </div>
      )}
    </SlideOverPanel>
  )
}
