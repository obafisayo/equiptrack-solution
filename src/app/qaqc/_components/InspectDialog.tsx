'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { type WorkOrder } from '@/lib/mock-data'

interface InspectDialogProps {
  order: WorkOrder
  onApprove: (notes: string) => void
  onReject: () => void
  onClose: () => void
}

export function InspectDialog({ order, onApprove, onReject, onClose }: InspectDialogProps) {
  const [notes, setNotes] = useState('')
  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-md mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Post-QAQC Inspection</h2>
        <p className="text-xs text-gray-500 mb-4">
          <span className="font-mono font-semibold text-brand-500">{order.id}</span> &middot; Container:{' '}
          <span className="font-mono font-semibold">{order.containerId ?? '-'}</span>
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Inspection Notes (optional)</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes about the inspection..."
          />
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="danger" size="md" onClick={onReject}>Return to Containerization</Button>
          <div className="flex-1" />
          <Button type="button" variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="primary" size="md" onClick={() => onApprove(notes)}>Approve</Button>
        </div>
      </div>
    </div>
  )
}
