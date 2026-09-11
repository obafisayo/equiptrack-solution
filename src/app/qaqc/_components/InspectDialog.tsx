'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { SlideOverPanel } from '@/components/ui/SlideOverPanel'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { type WorkOrder } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

interface InspectDialogProps {
  order: WorkOrder | null
  open: boolean
  onApprove: (notes: string) => void
  onReject: () => void
  onClose: () => void
}

export function InspectDialog({ order, open, onApprove, onReject, onClose }: InspectDialogProps) {
  const [notes, setNotes] = useState('')

  const slaHrs = order ? STAGE_SLA_HOURS[order.stage] : undefined

  return (
    <SlideOverPanel
      open={open}
      onClose={onClose}
      title="Post-QAQC Inspection"
      subtitle={order ? `${order.id} · Container ${order.containerId ?? '-'}` : undefined}
      size="wide"
      footer={
        <div className="flex items-center gap-2">
          <Button type="button" variant="danger" size="md" onClick={onReject}>
            Return to Containerization
          </Button>
          <div className="flex-1" />
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="success" size="md" onClick={() => { onApprove(notes); setNotes('') }}>
            Approve &amp; Advance
          </Button>
        </div>
      }
    >
      {order && (
        <div className="space-y-5">
          {/* Work order summary */}
          <div className="bg-slate-50 rounded-lg border border-border-default p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-brand-500 text-sm">{order.id}</span>
              <StagePill stage={order.stage as Stage} />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Destination</p>
                <p className="font-medium text-slate-900">{order.destination}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Container</p>
                <p className="font-mono font-semibold text-slate-900">{order.containerId ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Packed by</p>
                <p className="font-medium text-slate-900">{order.assignedToName ?? 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Time in stage</p>
                <p className="font-medium text-slate-900">{fmtHours(order.elapsedHours)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Items</p>
                <p className="font-medium text-slate-900">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Type</p>
                <p className="font-medium text-slate-900">{order.requestType}</p>
              </div>
            </div>
            {slaHrs && (
              <div>
                <p className="text-xs text-slate-500 mb-1.5">SLA Status</p>
                <SLABar elapsedHours={order.elapsedHours} slaHours={slaHrs} showLabel />
              </div>
            )}
          </div>

          {/* Inspection notes */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Inspection Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Record any observations from the post-QAQC inspection..."
            />
          </div>

          {/* Decision guide */}
          <div className="rounded-lg border border-border-default overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-border-default">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Decision Guide</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border-default">
              <div className="p-3">
                <p className="text-xs font-semibold text-green-700 mb-1">Approve &amp; Advance</p>
                <p className="text-xs text-slate-500">Container sealed, items verified, documentation complete, no visible damage.</p>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">Return to Containerization</p>
                <p className="text-xs text-slate-500">Discrepancy found, packing incomplete, or documentation missing.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SlideOverPanel>
  )
}
