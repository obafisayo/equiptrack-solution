'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import {
  CCU_TYPES, CCU_TYPE_M2, VOYAGE_DESTINATIONS, VOYAGE_ENTITIES,
  ENTITY_COLOR,
  type Voyage, type CCUBooking, type VoyageEntity, type VoyagePriority,
} from '@/lib/voyage-store'

interface Props {
  voyage: Voyage
  onClose: () => void
  onAdd: (booking: Omit<CCUBooking, 'id' | 'sn'>) => void
}

const CONTRACTORS = ['TOTALENERGIES', 'SLB', 'HALDEN', 'COURDEAU', 'WHASSAN', 'S J ABED', 'TOTAL', 'AfrikDelta Marine Ltd.', 'Other']

export function AddCCUModal({ voyage, onClose, onAdd }: Props) {
  const [ccuId,       setCcuId]       = useState('')
  const [ccuType,     setCcuType]     = useState('')
  const [deckM2,      setDeckM2]      = useState('')
  const [contractor,  setContractor]  = useState('')
  const [responsible, setResponsible] = useState('')
  const [entity,      setEntity]      = useState<VoyageEntity | ''>('')
  const [weight,      setWeight]      = useState('')
  const [destination, setDestination] = useState('')
  const [priority,    setPriority]    = useState<VoyagePriority | ''>('')
  const [edd,         setEdd]         = useState('')
  const [comments,    setComments]    = useState('')

  function handleTypeChange(label: string) {
    setCcuType(label)
    setDeckM2(String(CCU_TYPE_M2[label] ?? ''))
  }

  const canSubmit = ccuId && ccuType && deckM2 && contractor && responsible && entity && weight && destination && priority && edd

  function handleSubmit() {
    if (!canSubmit) return
    onAdd({
      ccuId, ccuType, contractor, responsible,
      entity:        entity as VoyageEntity,
      weightTons:    parseFloat(weight),
      deckSpaceM2:   parseFloat(deckM2),
      destination, priority: priority as VoyagePriority, eddOnSite: edd,
      lmtsDecision:  'pending',
      t1FWB: false, loaded: false,
      comments: comments || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-card shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Add CCU to Manifest</p>
            <p className="text-sm font-bold text-gray-900">{voyage.vessel} — {voyage.transitTo}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="CCU ID">
              <input
                value={ccuId}
                onChange={e => setCcuId(e.target.value)}
                placeholder="e.g. AGL/C/002"
                className="input-base font-mono"
              />
            </Field>
            <Field label="CCU Type">
              <select value={ccuType} onChange={e => handleTypeChange(e.target.value)} className="input-base">
                <option value="">Select type…</option>
                {CCU_TYPES.map(t => (
                  <option key={t.label} value={t.label}>{t.label} ({t.m2} m²)</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Deck Space (m²)" hint="Auto-filled from type — adjust if custom size">
              <input
                type="number" step="0.01" min="0"
                value={deckM2}
                onChange={e => setDeckM2(e.target.value)}
                placeholder="0.00"
                className="input-base font-mono"
              />
            </Field>
            <Field label="Weight (Tons)">
              <input
                type="number" step="0.1" min="0"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="0.0"
                className="input-base"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Responsible Person">
              <input
                value={responsible}
                onChange={e => setResponsible(e.target.value)}
                placeholder="Full name"
                className="input-base"
              />
            </Field>
            <Field label="Contractor">
              <select value={contractor} onChange={e => setContractor(e.target.value)} className="input-base">
                <option value="">Select contractor…</option>
                {CONTRACTORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Entity">
              <select value={entity} onChange={e => setEntity(e.target.value as VoyageEntity)} className="input-base">
                <option value="">Entity…</option>
                {VOYAGE_ENTITIES.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select value={priority} onChange={e => setPriority(e.target.value as VoyagePriority)} className="input-base">
                <option value="">Priority…</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </Field>
            <Field label="EDD on Site">
              <input type="date" value={edd} onChange={e => setEdd(e.target.value)} className="input-base" />
            </Field>
          </div>

          <Field label="Destination">
            <select value={destination} onChange={e => setDestination(e.target.value)} className="input-base">
              <option value="">Select destination…</option>
              {VOYAGE_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>

          <Field label="Comments (optional)">
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              rows={2}
              placeholder="Any notes about this CCU booking…"
              className="input-base resize-none"
            />
          </Field>

          {/* M² impact preview */}
          {deckM2 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-xs">
              <span className="text-blue-600 font-semibold">Deck impact: </span>
              <span className="text-blue-700">+{parseFloat(deckM2).toFixed(2)} m² </span>
              <span className="text-blue-500">
                (vessel at {voyage.vesselCapacityM2} m² capacity)
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border-default shrink-0 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 h-10 rounded-button border border-border-default text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 h-10 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add to Manifest
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">{label}</label>
      {hint && <p className="text-[10px] text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  )
}
