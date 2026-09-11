'use client'

import { useState } from 'react'
import { DollarSign } from 'lucide-react'
import type { Contractor } from './types'
import { SlideOverPanel } from '@/components/ui/SlideOverPanel'
import { Button } from '@/components/ui/Button'

interface Props {
  contractor: Contractor | null
  open: boolean
  onConfirm: (amount: number, date: string, reference: string, notes: string) => void
  onClose: () => void
}

export function PaymentDialog({ contractor, open, onConfirm, onClose }: Props) {
  const [amount, setAmount]       = useState('')
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10))
  const [reference, setReference] = useState('')
  const [notes, setNotes]         = useState('')

  function handleSubmit() {
    const amt = parseFloat(amount)
    if (!amt || isNaN(amt) || !reference.trim()) return
    onConfirm(amt, date, reference.trim(), notes.trim())
    setAmount('')
    setReference('')
    setNotes('')
  }

  return (
    <SlideOverPanel
      open={open}
      onClose={onClose}
      title="Record Payment"
      subtitle={contractor?.name}
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            disabled={!amount || !reference}
            onClick={handleSubmit}
          >
            Confirm Payment
          </Button>
        </div>
      }
    >
      {contractor && (
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Amount (USD)</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 text-[14px] border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Payment Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 text-[14px] border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Reference Number</label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g. INV-APX-2026-003"
              className="w-full px-3 py-2.5 text-[14px] border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Q3 payment, covers containers 13162 and 13164"
              className="w-full px-3 py-2 text-[13px] border border-border-default rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>
        </div>
      )}
    </SlideOverPanel>
  )
}
