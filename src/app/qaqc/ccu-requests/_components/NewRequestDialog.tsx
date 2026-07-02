'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { CONTRACTORS } from '@/app/qaqc/ccu-invoicing/_components/types'
import type { CCUType } from '@/app/qaqc/containers/_components/types'
import { CCU_TYPES_OPT } from '@/app/qaqc/containers/_components/types'
import { composeContractorMessage, type ContainerRequest, type RequestLineItem } from './types'

interface Props {
  onConfirm: (req: Omit<ContainerRequest, 'id' | 'createdAt' | 'auditLog'>) => void
  onClose: () => void
}

interface LineItem { type: CCUType; quantity: number }

export function NewRequestDialog({ onConfirm, onClose }: Props) {
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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default shrink-0">
          <h2 className="text-[15px] font-bold text-gray-900">
            {step === 1 ? 'New Container Request' : 'Review Composed Message'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {step === 1 && (
            <>
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Contractor</label>
                <select
                  value={contractorId}
                  onChange={e => setContractorId(e.target.value)}
                  className="w-full px-3 py-2.5 text-[13px] border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  {CONTRACTORS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {contractor && (
                  <p className="text-[11px] text-gray-400 mt-1">{contractor.contactName} · {contractor.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[12px] font-semibold text-gray-700">CCU Types Requested</label>
                  <button onClick={addLine} className="flex items-center gap-1 text-[11px] font-semibold text-brand-500 hover:text-brand-600">
                    <Plus size={12} /> Add Type
                  </button>
                </div>
                <div className="space-y-2">
                  {lineItems.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select
                        value={item.type}
                        onChange={e => updateLine(i, 'type', e.target.value as CCUType)}
                        className="flex-1 px-3 py-2 text-[13px] border border-border-default rounded-lg focus:outline-none"
                      >
                        {CCU_TYPES_OPT.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={item.quantity}
                        onChange={e => updateLine(i, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-3 py-2 text-[13px] border border-border-default rounded-lg text-center focus:outline-none"
                      />
                      {lineItems.length > 1 && (
                        <button onClick={() => removeLine(i)} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-800">
                Once sent, the request is locked. Only contractor responses (serial numbers) can be entered afterwards. The composed message cannot be modified.
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-[12px] text-gray-500">This message will be sent to <strong>{contractor.name}</strong>. It cannot be edited.</p>
              <div className="bg-gray-50 border border-border-default rounded-xl p-4">
                <pre className="text-[12px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{message}</pre>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-[12px] text-amber-800">
                After sending, wait for the contractor to provide serial numbers. Then use "Record Response" to enter and accept/reject each one.
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6 shrink-0">
          {step === 1 ? (
            <>
              <button onClick={onClose} className="flex-1 py-2.5 text-[13px] font-semibold rounded-lg border border-border-default text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => setStep(2)} disabled={lineItems.length === 0} className="flex-1 py-2.5 text-[13px] font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors">
                Preview Message →
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 text-[13px] font-semibold rounded-lg border border-border-default text-gray-700 hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleSend} className="flex-1 py-2.5 text-[13px] font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors">
                Send Request
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
