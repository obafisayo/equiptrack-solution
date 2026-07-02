'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Camera, AlertTriangle, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react'
import type { IncomingDelivery, AnomalyRecord, AnomalyType, AnomalySeverity } from './types'
import { ANOMALY_TYPES, DELIVERY_STATUS_BADGE } from './types'

interface Props {
  delivery: IncomingDelivery
  onClose: () => void
  onPass: (id: string) => void
  onReject: (id: string, reason: string) => void
  onQuarantine: (id: string, reason: string) => void
  onAddAnomaly: (deliveryId: string, anomaly: Omit<AnomalyRecord, 'id' | 'recordedAt' | 'recordedBy'>) => void
}

const SEVERITY_BADGE: Record<AnomalySeverity, string> = {
  Minor:    'bg-amber-50 text-amber-700 border border-amber-200',
  Major:    'bg-orange-50 text-orange-700 border border-orange-200',
  Critical: 'bg-red-50 text-red-700 border border-red-200',
}

export function AnomalyPanel({ delivery, onClose, onPass, onReject, onQuarantine, onAddAnomaly }: Props) {
  const [newType, setNewType]           = useState<AnomalyType>('Dent')
  const [newSeverity, setNewSeverity]   = useState<AnomalySeverity>('Minor')
  const [newDesc, setNewDesc]           = useState('')
  const [actionNote, setActionNote]     = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectAction, setRejectAction]     = useState<'Rejected' | 'Quarantined'>('Rejected')

  const isLocked = delivery.status === 'Passed' || delivery.status === 'Rejected'

  function handleAddAnomaly() {
    if (!newDesc.trim()) return
    onAddAnomaly(delivery.id, { type: newType, severity: newSeverity, description: newDesc.trim() })
    setNewDesc('')
    setNewType('Dent')
    setNewSeverity('Minor')
  }

  function handleAction() {
    if (rejectAction === 'Rejected') onReject(delivery.id, actionNote)
    else onQuarantine(delivery.id, actionNote)
    setShowRejectForm(false)
    setActionNote('')
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[480px] bg-white border-l border-border-default shadow-xl flex flex-col transition-transform duration-[250ms] ease">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-default shrink-0">
        <div>
          <p className="font-mono text-[13px] font-semibold text-gray-900">{delivery.containerSerial}</p>
          <p className="text-[11px] text-gray-500">{delivery.containerType} — {delivery.contractorName}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${DELIVERY_STATUS_BADGE[delivery.status]}`}>
            {delivery.status}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Container details */}
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">Delivery Details</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Expected Arrival', delivery.expectedArrival],
              ['Actual Arrival', delivery.actualArrival ?? '—'],
              ['Contractor', delivery.contractorName],
              ['Request Ref', delivery.linkedRequestId ?? '—'],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                <p className="text-[13px] font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Anomaly list */}
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Anomalies Recorded ({delivery.anomalies.length})
          </h3>
          {delivery.anomalies.length === 0 ? (
            <p className="text-[12px] text-gray-400 italic">No anomalies recorded.</p>
          ) : (
            <div className="space-y-2">
              {delivery.anomalies.map(a => (
                <div key={a.id} className="border border-border-default rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-gray-800">{a.type}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SEVERITY_BADGE[a.severity]}`}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-600">{a.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{a.recordedBy} · {a.recordedAt.slice(0, 10)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add anomaly form */}
        {!isLocked && (
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">Record Anomaly</h3>
            <div className="space-y-3 border border-border-default rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as AnomalyType)}
                    className="w-full text-[13px] border border-border-default rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    {ANOMALY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value as AnomalySeverity)}
                    className="w-full text-[13px] border border-border-default rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  >
                    {(['Minor', 'Major', 'Critical'] as AnomalySeverity[]).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the anomaly in detail..."
                  className="w-full text-[13px] border border-border-default rounded-lg px-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddAnomaly}
                  disabled={!newDesc.trim()}
                  className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40 transition-colors"
                >
                  <Plus size={13} />
                  Add Anomaly
                </button>
                <button className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border-default text-gray-500 hover:bg-gray-100 transition-colors opacity-50 cursor-not-allowed" disabled>
                  <Camera size={13} />
                  Attach Photo (coming soon)
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Reject / quarantine form */}
        {showRejectForm && (
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">Reason for {rejectAction}</h3>
            <div className="space-y-3 border border-red-200 rounded-lg p-4 bg-red-50">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Action</label>
                <select
                  value={rejectAction}
                  onChange={e => setRejectAction(e.target.value as 'Rejected' | 'Quarantined')}
                  className="w-full text-[13px] border border-border-default rounded-lg px-3 py-2 bg-white focus:outline-none"
                >
                  <option value="Rejected">Reject — send back to contractor</option>
                  <option value="Quarantined">Quarantine — hold for re-inspection</option>
                </select>
              </div>
              <textarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                rows={3}
                placeholder="State the reason..."
                className="w-full text-[13px] border border-border-default rounded-lg px-3 py-2 bg-white resize-none focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAction}
                  disabled={!actionNote.trim()}
                  className="flex-1 text-[12px] font-semibold py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
                >
                  Confirm {rejectAction}
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="text-[12px] font-medium px-4 py-2 rounded-lg border border-border-default text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Action footer */}
      {!isLocked && !showRejectForm && (
        <div className="shrink-0 px-5 py-4 border-t border-border-default bg-gray-50 flex gap-3">
          <button
            onClick={() => onPass(delivery.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold transition-colors"
          >
            <CheckCircle2 size={15} />
            Pass — Add to Fleet
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition-colors"
          >
            <XCircle size={15} />
            Reject / Quarantine
          </button>
        </div>
      )}

      {isLocked && (
        <div className={`shrink-0 px-5 py-4 border-t border-border-default text-center text-[12px] font-medium ${delivery.status === 'Passed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {delivery.status === 'Passed'
            ? `Passed by ${delivery.inspectedBy} on ${delivery.inspectedAt?.slice(0, 10)}`
            : `${delivery.status} by ${delivery.inspectedBy} on ${delivery.inspectedAt?.slice(0, 10)}`}
        </div>
      )}
    </div>
  )
}
