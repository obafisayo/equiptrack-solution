'use client'

import { useState } from 'react'
import { X, Ship } from 'lucide-react'
import { type ReturnRequest } from '@/lib/return-store'
import { FLEET_VESSELS } from '@/app/logistics/fleet/_components/types'
import { Select } from '@/components/ui/Form'

const ACTIVE_VESSELS = FLEET_VESSELS.filter(v => v.status === 'Active' || v.status === 'Standby')

interface Props {
  request: ReturnRequest
  onClose: () => void
  onApprove: (id: string, vessel: string, date: string) => void
  onReject: (id: string, reason: string) => void
}

type Mode = 'approve' | 'reject'

export function ApproveModal({ request, onClose, onApprove, onReject }: Props) {
  const [mode, setMode] = useState<Mode>('approve')
  const [vessel, setVessel] = useState('')
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')

  const canApprove = vessel !== '' && date !== ''
  const canReject  = reason.trim().length > 0

  function handleConfirm() {
    if (mode === 'approve' && canApprove) {
      onApprove(request.id, vessel, date)
    } else if (mode === 'reject' && canReject) {
      onReject(request.id, reason.trim())
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-card shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-0.5">Deckspace Allocation</p>
            <p className="text-sm font-bold text-gray-900 font-mono">{request.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-border-default">
          {(['approve', 'reject'] as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-colors capitalize ${
                mode === m
                  ? m === 'approve'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'approve' ? 'Approve & Allocate' : 'Reject Request'}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* Request summary */}
          <div className="bg-slate-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Site</span>
              <span className="font-semibold">{request.site}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Items</span>
              <span className="font-semibold">{request.items.length} line item{request.items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Submitted by</span>
              <span className="font-semibold">{request.submittedBy}</span>
            </div>
          </div>

          {mode === 'approve' ? (
            <>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
                  Assign Vessel
                </label>
                <Select
                  aria-label="Select vessel"
                  value={vessel}
                  onChange={e => setVessel(e.target.value)}
                  size="sm"
                  className="w-full"
                >
                  <option value="">Select an active vessel...</option>
                  {ACTIVE_VESSELS.map(v => (
                    <option key={v.id} value={v.name}>
                      {v.name} — {v.currentLocation}
                    </option>
                  ))}
                </Select>
                {vessel && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-700">
                    <Ship size={11} />
                    <span className="font-semibold">{vessel}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
                  Allocated Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-9 text-sm border border-border-default rounded-lg px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
                Rejection Reason
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain why the request is being rejected..."
                rows={3}
                className="w-full text-sm border border-border-default rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 resize-none"
              />
            </div>
          )}
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-button border border-border-default text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={mode === 'approve' ? !canApprove : !canReject}
            className={`flex-1 h-10 rounded-button text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
              mode === 'approve' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {mode === 'approve' ? 'Confirm Allocation' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  )
}
