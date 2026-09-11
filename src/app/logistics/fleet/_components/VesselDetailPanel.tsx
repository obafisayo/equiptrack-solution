'use client'

import { useState } from 'react'
import { X, MapPin, Ship, FileText, Navigation } from 'lucide-react'
import { type FleetVessel, STATUS_BADGE, TYPE_SHORT, getDocExpiryState, diffDays, TODAY } from './types'

type Tab = 'overview' | 'voyages' | 'documents'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',  label: 'Overview'       },
  { id: 'voyages',   label: 'Voyage History' },
  { id: 'documents', label: 'Documents'      },
]

const DOC_EXPIRY_STYLE = {
  expired:  'bg-red-50 text-red-700 border-red-200',
  critical: 'bg-orange-50 text-orange-700 border-orange-200',
  warning:  'bg-amber-50 text-amber-700 border-amber-200',
  ok:       'bg-green-50 text-green-700 border-green-200',
}

interface Props {
  vessel: FleetVessel
  onClose: () => void
}

export function VesselDetailPanel({ vessel, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[480px] bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border-default shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Ship size={16} className="text-blue-500 shrink-0" />
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{TYPE_SHORT[vessel.type]}</p>
            </div>
            <h2 className="text-lg font-bold text-neutral-900 leading-tight font-mono">{vessel.name}</h2>
            <p className="text-xs text-neutral-400 mt-0.5">IMO {vessel.imoNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 shrink-0 flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Status + location bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-border-default flex items-center gap-3 shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_BADGE[vessel.status]}`}>
            {vessel.status}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-600">
            <MapPin size={11} className="text-amber-500" />
            {vessel.currentLocation}
          </span>
          <span className="ml-auto text-xs text-neutral-500">
            {vessel.assignedOrders} active order{vessel.assignedOrders !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-default shrink-0">
          {TABS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === t.id
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Owner',          value: vessel.owner },
                  { label: 'Year Built',     value: vessel.yearBuilt.toString() },
                  { label: 'Gross Tonnage',  value: `${vessel.grossTonnageMT.toLocaleString()} MT` },
                  { label: 'Deck Area',      value: `${vessel.deckAreaM2} m²` },
                  { label: 'Crew Capacity',  value: `${vessel.crewCapacity} persons` },
                  { label: 'Type',           value: vessel.type },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-neutral-800">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Inspection Schedule</p>
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Last Inspection</span>
                    <span className="font-semibold text-neutral-800">{vessel.lastInspection}</span>
                  </div>
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-neutral-500">Next Due</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-800">{vessel.nextInspection}</span>
                      {(() => {
                        const state = getDocExpiryState(vessel.nextInspection)
                        const d = diffDays(TODAY, vessel.nextInspection)
                        const style = DOC_EXPIRY_STYLE[state]
                        return (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${style}`}>
                            {state === 'expired' ? 'Expired' : `${d}d`}
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VOYAGES */}
          {activeTab === 'voyages' && (
            <div className="space-y-3">
              {vessel.voyages.length === 0 ? (
                <p className="text-sm text-neutral-400 text-center py-8">No voyage records found.</p>
              ) : [...vessel.voyages].reverse().map(v => (
                <div key={v.voyageId} className="border border-border-default rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-neutral-600">{v.voyageId}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${v.arrival ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {v.arrival ? 'Completed' : 'Underway'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-700 mb-2">
                    <span className="font-semibold">{v.origin}</span>
                    <Navigation size={10} className="text-neutral-400 shrink-0" />
                    <span className="font-semibold">{v.destination}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-neutral-500">
                    <span>Departed: {v.departure}</span>
                    <span>Arrived: {v.arrival ?? '—'}</span>
                    <span>Cargo Ref: {v.cargoRef}</span>
                    <span>Captain: {v.captain}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-2">
              {vessel.documents.map(doc => {
                const state = getDocExpiryState(doc.expiryDate)
                const d = diffDays(TODAY, doc.expiryDate)
                return (
                  <div key={doc.docNumber} className="border border-border-default rounded-lg p-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FileText size={12} className="text-neutral-400 shrink-0" />
                        <p className="text-xs font-semibold text-neutral-800">{doc.name}</p>
                      </div>
                      <p className="text-[11px] text-neutral-400 font-mono">{doc.docNumber}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Issued: {doc.issuedDate} · Expires: {doc.expiryDate}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${DOC_EXPIRY_STYLE[state]}`}>
                      {state === 'expired' ? 'Expired' : state === 'ok' ? 'Valid' : `${d}d left`}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
