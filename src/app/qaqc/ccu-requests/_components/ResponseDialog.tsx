'use client'

import { useState } from 'react'
import { Check, XCircle, Plus, AlertTriangle } from 'lucide-react'
import type { ContainerRequest } from './types'
import { SlideOverPanel } from '@/components/ui/SlideOverPanel'
import { Button } from '@/components/ui/Button'

interface Props {
  request: ContainerRequest | null
  open: boolean
  onConfirm: (updatedRequest: ContainerRequest) => void
  onClose: () => void
}

export function ResponseDialog({ request, open, onConfirm, onClose }: Props) {
  const [lineItems, setLineItems] = useState(
    request
      ? request.lineItems.map(li => ({
          ...li,
          responses: li.responses.length > 0
            ? [...li.responses]
            : Array.from({ length: li.quantity }, () => ({ serial: '', accepted: null as boolean | null })),
        }))
      : []
  )

  const allSerialsEntered = lineItems.every(li => li.responses.every(r => r.serial.trim() !== ''))

  function setSerial(lineIdx: number, respIdx: number, value: string) {
    setLineItems(prev => prev.map((li, i) =>
      i !== lineIdx ? li : {
        ...li,
        responses: li.responses.map((r, j) => j !== respIdx ? r : { ...r, serial: value }),
      }
    ))
  }

  function setAccepted(lineIdx: number, respIdx: number, value: boolean) {
    setLineItems(prev => prev.map((li, i) =>
      i !== lineIdx ? li : {
        ...li,
        responses: li.responses.map((r, j) => j !== respIdx ? r : { ...r, accepted: value }),
      }
    ))
  }

  function addResponse(lineIdx: number) {
    setLineItems(prev => prev.map((li, i) =>
      i !== lineIdx ? li : {
        ...li,
        responses: [...li.responses, { serial: '', accepted: null }],
      }
    ))
  }

  const allSerials = lineItems.flatMap(li => li.responses.map(r => r.serial.trim())).filter(Boolean)
  const hasDuplicates = new Set(allSerials).size !== allSerials.length

  function handleConfirm() {
    if (!request || !allSerialsEntered || hasDuplicates) return
    const accepted = lineItems.flatMap(li => li.responses.filter(r => r.accepted)).length
    const newStatus: ContainerRequest['status'] =
      accepted === 0 ? 'Rejected' :
      accepted < allSerials.length ? 'Partially Accepted' : 'Completed'

    const updated: ContainerRequest = {
      ...request,
      lineItems,
      status: newStatus,
      responseRecordedAt: new Date().toISOString(),
      auditLog: [
        ...request.auditLog,
        { timestamp: new Date().toISOString(), action: 'Contractor response recorded', performedBy: 'Femi Emmanuel' },
        ...lineItems.flatMap(li =>
          li.responses.map(r => ({
            timestamp: new Date().toISOString(),
            action: r.accepted
              ? `Serial ${r.serial} accepted — added to fleet as Pending Inspection`
              : `Serial ${r.serial} rejected`,
            performedBy: 'Femi Emmanuel',
          }))
        ),
      ],
    }
    onConfirm(updated)
  }

  return (
    <SlideOverPanel
      open={open}
      onClose={onClose}
      title="Record Contractor Response"
      subtitle={request ? `${request.contractorName} · ${request.id}` : undefined}
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
            disabled={!allSerialsEntered || hasDuplicates}
            onClick={handleConfirm}
          >
            Confirm Response
          </Button>
        </div>
      }
    >
      {request && (
        <div className="space-y-5">
          {hasDuplicates && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertTriangle size={13} />
              Duplicate serial numbers detected. Each CCU must have a unique serial.
            </div>
          )}

          <p className="text-sm text-slate-500">
            Enter the serial numbers provided by the contractor. Accept or reject each one individually.
          </p>

          {lineItems.map((li, lineIdx) => (
            <div key={lineIdx} className="border border-border-default rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-800">{li.quantity}× {li.type}</p>
                <button
                  onClick={() => addResponse(lineIdx)}
                  className="text-xs text-brand-accent hover:text-brand-accent-hover flex items-center gap-1"
                >
                  <Plus size={11} /> Add serial
                </button>
              </div>
              <div className="space-y-2">
                {li.responses.map((resp, respIdx) => (
                  <div key={respIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={resp.serial}
                      onChange={e => setSerial(lineIdx, respIdx, e.target.value)}
                      placeholder="Serial number"
                      className="flex-1 px-3 py-2 text-sm font-mono border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                    />
                    <button
                      onClick={() => setAccepted(lineIdx, respIdx, true)}
                      disabled={!resp.serial.trim()}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        resp.accepted === true
                          ? 'bg-green-600 text-white'
                          : 'border border-border-default text-slate-400 hover:border-green-500 hover:text-green-600 disabled:opacity-30'
                      }`}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setAccepted(lineIdx, respIdx, false)}
                      disabled={!resp.serial.trim()}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        resp.accepted === false
                          ? 'bg-red-600 text-white'
                          : 'border border-border-default text-slate-400 hover:border-red-500 hover:text-red-600 disabled:opacity-30'
                      }`}
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            Accepted containers will be added to the fleet with status &quot;Pending Inspection&quot;. Billing starts only after Loadout QAQC passes the container.
          </div>
        </div>
      )}
    </SlideOverPanel>
  )
}
