'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { ReturnOrder, DispositionAction } from '@/app/site-logistics/_components/types'
import { DISPOSITION_LABEL } from '@/app/site-logistics/_components/types'

const DISPOSITION_OPTIONS: { value: DispositionAction; description: string }[] = [
  { value: 'keep-at-base',      description: 'Store at base yard for future use' },
  { value: 'send-to-vendor',    description: 'Dispatch to vendor for repair or replacement' },
  { value: 'reintegrate-stock', description: 'Return to available stock inventory' },
  { value: 'scrap',             description: 'Mark as scrap — end of life, process for disposal' },
  { value: 'trash',             description: 'Discard immediately, no further processing needed' },
]

interface Props {
  order: ReturnOrder
  onClose: () => void
  onConfirm: (orderId: string, disposition: DispositionAction, notes: string) => void
}

export function DispositionDialog({ order, onClose, onConfirm }: Props) {
  const [disposition, setDisposition] = useState<DispositionAction | null>(null)
  const [notes, setNotes]             = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[480px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Assign Disposition</h2>
            <p className="font-mono text-[12px] text-gray-400">{order.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-[12px] text-gray-500 mb-4">Select the disposition action for the received items:</p>
          {DISPOSITION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDisposition(opt.value)}
              className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                disposition === opt.value
                  ? 'border-brand-500 bg-red-50'
                  : 'border-border-default hover:border-gray-300'
              }`}
            >
              <p className="text-[13px] font-bold text-gray-900">{DISPOSITION_LABEL[opt.value]}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{opt.description}</p>
            </button>
          ))}

          <div className="mt-4">
            <label className="text-[12px] font-semibold text-gray-600 block mb-1">Notes (optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any relevant notes for this disposition..."
              className="w-full border border-border-default rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-default">
          <button onClick={onClose} className="text-[13px] text-gray-500 hover:text-gray-700">Cancel</button>
          <button
            onClick={() => disposition && onConfirm(order.id, disposition, notes)}
            disabled={!disposition}
            className="px-5 py-2 bg-brand-500 text-white text-[13px] font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Disposition
          </button>
        </div>
      </div>
    </div>
  )
}
