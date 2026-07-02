'use client'

import { useState } from 'react'
import { X, DollarSign } from 'lucide-react'
import type { Contractor } from './types'

interface Props {
  contractor: Contractor
  onConfirm: (amount: number, date: string, reference: string, notes: string) => void
  onClose: () => void
}

export function PaymentDialog({ contractor, onConfirm, onClose }: Props) {
  const [amount, setAmount]       = useState('')
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10))
  const [reference, setReference] = useState('')
  const [notes, setNotes]         = useState('')

  function handleSubmit() {
    const amt = parseFloat(amount)
    if (!amt || isNaN(amt) || !reference.trim()) return
    onConfirm(amt, date, reference.trim(), notes.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Record Payment</h2>
            <p className="text-[12px] text-gray-500">{contractor.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Amount (USD)</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 text-[14px] border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Payment Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 text-[14px] border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Reference Number</label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g. INV-APX-2026-003"
              className="w-full px-3 py-2.5 text-[14px] border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Q3 payment, covers containers 13162 and 13164"
              className="w-full px-3 py-2 text-[13px] border border-border-default rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-[13px] font-semibold rounded-lg border border-border-default text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || !reference}
            className="flex-1 py-2.5 text-[13px] font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  )
}
