'use client'

import { useState } from 'react'
import { X, Plus, Ship, Plug } from 'lucide-react'
import {
  ENTITY_COLOR, VOYAGE_ENTITIES,
  LMTS_LABEL, LMTS_STYLE,
  updateLMTSDecision, updateBookingField, addCCUBooking, VOYAGES,
  type Voyage, type CCUBooking, type LMTSDecision, type VoyageEntity,
} from '@/lib/voyage-store'
import { AddCCUModal } from './AddCCUModal'

interface Props {
  voyage: Voyage
  onClose: () => void
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function fmtDate(iso: string) {
  const [, m, d] = iso.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]}`
}

export function ManifestPanel({ voyage, onClose }: Props) {
  const [bookings,      setBookings]      = useState<CCUBooking[]>([...voyage.bookings])
  const [showAddModal,  setShowAddModal]  = useState(false)

  const usedM2 = bookings
    .filter(b => b.lmtsDecision !== 'cancelled' && b.lmtsDecision !== 'rejected')
    .reduce((s, b) => s + b.deckSpaceM2, 0)

  const pct         = (usedM2 / voyage.vesselCapacityM2) * 100
  const clampedPct  = Math.min(pct, 100)
  const utilColor   = pct > 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E'
  const utilTextCls = pct > 100 ? 'text-red-600' : pct >= 85 ? 'text-amber-600' : 'text-green-600'

  const pendingCount  = bookings.filter(b => b.lmtsDecision === 'pending').length
  const rejectedCount = bookings.filter(b => b.lmtsDecision === 'rejected').length
  const loadedCount   = bookings.filter(b => b.loaded).length

  // M² per entity (excluding cancelled/rejected)
  const entityM2 = VOYAGE_ENTITIES.reduce<Record<VoyageEntity, number>>((acc, e) => {
    acc[e] = bookings
      .filter(b => b.entity === e && b.lmtsDecision !== 'cancelled' && b.lmtsDecision !== 'rejected')
      .reduce((s, b) => s + b.deckSpaceM2, 0)
    return acc
  }, { DRILL: 0, FOPS: 0, ECP: 0, PROJECT: 0, TECHLOG: 0 })

  function handleLMTS(id: string, decision: LMTSDecision) {
    updateLMTSDecision(voyage.id, id, decision)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, lmtsDecision: decision } : b))
  }

  function handleToggle(id: string, field: 'loaded' | 't1FWB', value: boolean) {
    updateBookingField(voyage.id, id, field, value)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b))
  }

  function handleAddCCU(booking: Omit<CCUBooking, 'id' | 'sn'>) {
    addCCUBooking(voyage.id, booking)
    const updated = VOYAGES.find(v => v.id === voyage.id)
    if (updated) setBookings([...updated.bookings])
    setShowAddModal(false)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-[82vw] max-w-[1100px] bg-white flex flex-col shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border-default shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Ship size={15} className="text-brand-500" />
              <h2 className="text-base font-bold text-gray-900">{voyage.vessel}</h2>
              <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{voyage.id}</span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-3">
              <span>{voyage.transitTo}</span>
              <span className="text-gray-300">·</span>
              <span>Departure {fmtDate(voyage.departureDate)}</span>
              <span className="text-gray-300">·</span>
              <span>{voyage.vesselCapacityM2} m² capacity</span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1"><Plug size={11} />{voyage.vesselPlugs} plugs</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
            >
              <Plus size={12} />
              Add CCU
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Utilization strip ── */}
        <div className="px-6 py-4 border-b border-border-default shrink-0 bg-slate-50">
          {/* Main bar */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-gray-700 font-mono">{usedM2.toFixed(2)} m² booked</span>
            <span className={`font-bold text-sm ${utilTextCls}`}>{pct.toFixed(1)}% utilized</span>
            <span className="text-gray-400">{voyage.vesselCapacityM2} m² total</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              style={{ width: `${clampedPct}%`, backgroundColor: utilColor }}
              className="h-full rounded-full transition-all duration-300"
            />
          </div>
          {pct > 100 && (
            <p className="text-[10px] text-red-600 font-bold mb-2">
              {(usedM2 - voyage.vesselCapacityM2).toFixed(2)} m² over capacity — reduce bookings before departure
            </p>
          )}

          {/* Entity breakdown */}
          {usedM2 > 0 && (
            <>
              <div className="flex h-2 rounded-full overflow-hidden gap-px mb-1.5">
                {VOYAGE_ENTITIES.map(e => {
                  const m = entityM2[e]
                  if (!m) return null
                  return (
                    <div
                      key={e}
                      style={{ width: `${(m / usedM2) * 100}%`, backgroundColor: ENTITY_COLOR[e] }}
                      title={`${e}: ${m.toFixed(1)} m²`}
                    />
                  )
                })}
              </div>
              <div className="flex flex-wrap gap-3">
                {VOYAGE_ENTITIES.map(e => {
                  const m = entityM2[e]
                  if (!m) return null
                  return (
                    <span key={e} className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span style={{ backgroundColor: ENTITY_COLOR[e] }} className="w-2 h-2 rounded-sm inline-block shrink-0" />
                      <strong style={{ color: ENTITY_COLOR[e] }}>{e}</strong>
                      <span>{m.toFixed(1)} m²</span>
                    </span>
                  )
                })}
              </div>
            </>
          )}

          {/* Summary chips */}
          <div className="flex gap-4 mt-2 pt-2 border-t border-gray-200">
            <span className="text-[11px] text-gray-500">{bookings.length} CCUs total</span>
            {pendingCount > 0 && (
              <span className="text-[11px] font-semibold text-amber-600">{pendingCount} pending LMTS</span>
            )}
            {rejectedCount > 0 && (
              <span className="text-[11px] font-semibold text-red-600">{rejectedCount} rejected</span>
            )}
            <span className="text-[11px] font-medium text-green-600">{loadedCount}/{bookings.length} loaded</span>
          </div>
        </div>

        {/* ── Manifest table ── */}
        <div className="flex-1 overflow-y-auto">
          {bookings.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              No CCUs on this voyage yet. Click "Add CCU" to start the manifest.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-slate-100 border-b border-border-default z-10">
                  <tr>
                    {['#', 'Responsible', 'CCU ID', 'Type', 'Contractor', 'Entity', 'T (tons)', 'Deck m²', 'Destination', 'Priority', 'EDD', 'LMTS Decision', 'T1 FWB', 'Loaded'].map(col => (
                      <th key={col} className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr
                      key={b.id}
                      title={b.comments}
                      className={`border-b border-border-default/50 transition-colors ${
                        b.lmtsDecision === 'cancelled' ? 'opacity-35' :
                        b.lmtsDecision === 'rejected'  ? 'bg-red-50/40'  :
                        b.loaded                       ? 'bg-green-50/30' : 'hover:bg-brand-tint/40'
                      }`}
                    >
                      <td className="px-3 py-2 text-gray-400 tabular-nums">{b.sn}</td>
                      <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{b.responsible}</td>
                      <td className="px-3 py-2 font-mono text-gray-900 whitespace-nowrap">{b.ccuId}</td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{b.ccuType}</td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{b.contractor}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          style={{ color: ENTITY_COLOR[b.entity], borderColor: ENTITY_COLOR[b.entity] + '60' }}
                          className="text-[10px] font-bold border rounded px-1.5 py-0.5 bg-white"
                        >
                          {b.entity}
                        </span>
                      </td>
                      <td className="px-3 py-2 tabular-nums text-right text-gray-700 whitespace-nowrap">{b.weightTons}</td>
                      <td className="px-3 py-2 tabular-nums text-right text-gray-700 whitespace-nowrap font-mono">{b.deckSpaceM2.toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{b.destination}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          b.priority === 'High'   ? 'bg-red-50 text-red-600' :
                          b.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-green-50 text-green-600'
                        }`}>{b.priority}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-500 whitespace-nowrap font-mono">{fmtDate(b.eddOnSite)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <select
                          value={b.lmtsDecision}
                          onChange={e => handleLMTS(b.id, e.target.value as LMTSDecision)}
                          className={`text-[10px] font-semibold border rounded px-2 py-1 cursor-pointer ${LMTS_STYLE[b.lmtsDecision]}`}
                        >
                          {(['validated', 'pending', 'cancelled', 'rejected'] as LMTSDecision[]).map(d => (
                            <option key={d} value={d}>{LMTS_LABEL[d]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={b.t1FWB}
                          onChange={e => handleToggle(b.id, 't1FWB', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300"
                          style={{ accentColor: '#1A6FBF' }}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={b.loaded}
                          onChange={e => handleToggle(b.id, 'loaded', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300"
                          style={{ accentColor: '#16A34A' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals footer */}
                <tfoot className="sticky bottom-0 bg-slate-100 border-t-2 border-border-default">
                  <tr>
                    <td colSpan={6} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                      Totals ({bookings.filter(b => b.lmtsDecision !== 'cancelled' && b.lmtsDecision !== 'rejected').length} active CCUs)
                    </td>
                    <td className="px-3 py-2 tabular-nums text-right font-bold text-gray-700 whitespace-nowrap">
                      {bookings.filter(b => b.lmtsDecision !== 'cancelled' && b.lmtsDecision !== 'rejected').reduce((s, b) => s + b.weightTons, 0).toFixed(1)}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-right font-bold text-gray-700 whitespace-nowrap font-mono">
                      {usedM2.toFixed(2)}
                    </td>
                    <td colSpan={6} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddCCUModal voyage={voyage} onClose={() => setShowAddModal(false)} onAdd={handleAddCCU} />
      )}
    </>
  )
}
