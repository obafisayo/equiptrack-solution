'use client'

import { useState } from 'react'
import { X, ArrowRight, ArrowLeft, MapPin, Clock, DollarSign, ShieldCheck, Wifi, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { type CCUContainer, STATUS_BADGE, DG_CLASS_BADGE, getExpiryState } from './types'
import { StatusDot } from './StatusDot'
import { ExpiryChip } from './ExpiryChip'

type Tab = 'overview' | 'trips' | 'movements' | 'financials' | 'inspection'

interface Props {
  detail: CCUContainer
  onClose: () => void
  onToggleAvailable: (sn: string) => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',   label: 'Overview'    },
  { id: 'trips',      label: 'Trip History' },
  { id: 'movements',  label: 'Movement Log' },
  { id: 'financials', label: 'Financials'  },
  { id: 'inspection', label: 'Inspection'  },
]

const ACTION_LABELS: Record<string, string> = {
  dispatched:           'Dispatched to site',
  arrived:              'Arrived at location',
  returned:             'Returned to base',
  'sent-to-vendor':     'Sent to vendor',
  'returned-from-vendor': 'Returned from vendor',
  inspected:            'Inspection completed',
  quarantined:          'Placed in quarantine',
  'added-to-fleet':     'Added to fleet',
}

const ACTION_COLOR: Record<string, string> = {
  dispatched:           'text-amber-600',
  arrived:              'text-green-600',
  returned:             'text-green-600',
  'sent-to-vendor':     'text-orange-600',
  'returned-from-vendor': 'text-green-600',
  inspected:            'text-green-600',
  quarantined:          'text-red-600',
  'added-to-fleet':     'text-green-600',
}

export function ContainerDetailPanel({ detail, onClose, onToggleAvailable }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const expiryState = getExpiryState(detail.inspectionExpiry)
  const dgClass = detail.dangerousGoodsClass ?? 'normal'

  const totalDaysDeployed = detail.hiringStartDate
    ? Math.max(0, Math.round((new Date().getTime() - new Date(detail.hiringStartDate).getTime()) / 86_400_000))
    : 0
  const totalAccrued = detail.dailyRateUSD ? totalDaysDeployed * detail.dailyRateUSD : 0
  const totalPaid = detail.payments.reduce((s, p) => s + p.amountUSD, 0)
  const balance = totalAccrued - totalPaid

  const toSite  = detail.trips.filter(t => t.direction === 'to-site').length
  const toBase  = detail.trips.filter(t => t.direction === 'to-base').length

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusDot c={detail} />
              <span className="font-mono font-bold text-lg text-neutral-900">{detail.serialNumber}</span>
              {detail.gpsTrackerId && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <Wifi size={9} />
                  GPS
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500">{detail.type}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <ExpiryChip expiry={detail.inspectionExpiry} />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[detail.status]}`}>
                {detail.status}
              </span>
              {dgClass !== 'normal' && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${DG_CLASS_BADGE[dgClass].badge}`}>
                  {DG_CLASS_BADGE[dgClass].label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-500">
              <MapPin size={11} />
              <span className={detail.currentSite ? 'text-amber-600 font-semibold' : 'text-green-600 font-semibold'}>
                {detail.location ?? 'Unknown location'}
              </span>
              {detail.currentSite && <span className="text-gray-400">· At site</span>}
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
            <X size={17} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-default shrink-0 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={[
                'shrink-0 px-4 py-2.5 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap',
                activeTab === t.id
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {activeTab === 'overview' && (
            <>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Physical Specifications</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    ['Footprint', `${detail.footprintM2} m²`],
                    ['Length', `${detail.lengthM} m`],
                    ['Width', `${detail.widthM} m`],
                    ['Max Gross Wt', `${detail.maxGrossWeightKg.toLocaleString()} kg`],
                  ] as [string, string][]).map(([l, v]) => (
                    <div key={l} className="bg-neutral-50 rounded-lg border border-border-default p-3">
                      <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">{l}</p>
                      <p className="text-sm font-bold text-neutral-900">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Registration</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    ['Cert. No.', detail.certNo ?? '-'],
                    ['Owner', detail.owner ?? '-'],
                    ['Current Location', detail.location ?? '-'],
                    ['Insp. Expiry', detail.inspectionExpiry],
                    ['GPS Tracker', detail.gpsTrackerId ?? 'Not fitted'],
                    ['DG Class', DG_CLASS_BADGE[dgClass].label],
                  ] as [string, string][]).map(([l, v]) => (
                    <div key={l} className="bg-neutral-50 rounded-lg border border-border-default p-3">
                      <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">{l}</p>
                      <p className="text-xs font-semibold text-neutral-800">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-border-default space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-700">Available in pool</span>
                  <button type="button" role="switch" aria-checked={detail.available}
                    onClick={() => onToggleAvailable(detail.serialNumber)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${detail.available ? 'bg-brand-500' : 'bg-neutral-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${detail.available ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {(expiryState === 'expired' || expiryState === 'locked') && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                    Inspection overdue or critical. Schedule renewal before deploying.
                  </div>
                )}
                <Button variant="secondary" fullWidth size="sm">Schedule Inspection</Button>
                <Button variant="secondary" fullWidth size="sm">Update Location</Button>
              </div>
            </>
          )}

          {activeTab === 'trips' && (
            <>
              <div className="flex items-center gap-4 mb-2 text-[13px]">
                <span className="font-semibold text-gray-800">{detail.trips.length} trips total</span>
                <span className="text-gray-400">·</span>
                <span className="text-amber-600 font-medium">{toSite} to site</span>
                <span className="text-gray-400">·</span>
                <span className="text-green-600 font-medium">{toBase} returns</span>
              </div>
              {detail.trips.length === 0 ? (
                <p className="text-[13px] text-gray-400 italic">No trips recorded.</p>
              ) : (
                <div className="space-y-3">
                  {detail.trips.map((trip, i) => (
                    <div key={trip.tripId} className="border border-border-default rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-gray-400">Trip #{i + 1}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          trip.direction === 'to-site' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {trip.direction === 'to-site' ? <ArrowRight size={10} /> : <ArrowLeft size={10} />}
                          {trip.direction === 'to-site' ? 'To Site' : 'To Base'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        <div><p className="text-gray-400">Vessel</p><p className="font-semibold text-gray-800">{trip.vessel}</p></div>
                        <div><p className="text-gray-400">Destination</p><p className="font-semibold text-gray-800">{trip.destination}</p></div>
                        <div><p className="text-gray-400">Departure</p><p className="font-semibold text-gray-800">{trip.departureDate}</p></div>
                        <div><p className="text-gray-400">Arrival</p><p className="font-semibold text-gray-800">{trip.arrivalDate ?? '—'}</p></div>
                        <div><p className="text-gray-400">Sent by</p><p className="font-semibold text-gray-800">{trip.sentBy}</p></div>
                        <div><p className="text-gray-400">Received by</p><p className="font-semibold text-gray-800">{trip.receivedBy ?? '—'}</p></div>
                        <div><p className="text-gray-400">Manifest</p><p className="font-mono text-[11px] text-gray-700">{trip.manifestNumber}</p></div>
                        <div><p className="text-gray-400">Waybill</p><p className="font-mono text-[11px] text-gray-700">{trip.waybillNumber}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'movements' && (
            <>
              <p className="text-[12px] text-gray-500 mb-3">Complete audit trail of all container movements and actions.</p>
              {detail.movementLog.length === 0 ? (
                <p className="text-[13px] text-gray-400 italic">No movement log entries.</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border-default" />
                  <div className="space-y-4">
                    {[...detail.movementLog].reverse().map(log => (
                      <div key={log.id} className="flex gap-4 pl-8 relative">
                        <div className={`absolute left-2 top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-border-default ${
                          log.action === 'quarantined' ? 'bg-red-500' :
                          log.action === 'sent-to-vendor' ? 'bg-orange-400' :
                          log.action.includes('arrived') || log.action.includes('returned') || log.action.includes('added') ? 'bg-green-500' :
                          'bg-amber-400'
                        }`} />
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <span className={`text-[12px] font-semibold ${ACTION_COLOR[log.action] ?? 'text-gray-700'}`}>
                              {ACTION_LABELS[log.action] ?? log.action}
                            </span>
                            <span className="text-[10px] text-gray-400">{log.timestamp.slice(0, 10)}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{log.location} · {log.performedBy}</p>
                          {log.notes && <p className="text-[11px] text-gray-400 mt-0.5 italic">{log.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'financials' && (
            <>
              {!detail.hiringStartDate ? (
                <p className="text-[13px] text-gray-400 italic">No hiring details recorded.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ['Hiring Start', detail.hiringStartDate],
                      ['Daily Rate', `$${detail.dailyRateUSD ?? 0}/day`],
                      ['Days Deployed', `${totalDaysDeployed} days`],
                      ['Total Accrued', `$${totalAccrued.toLocaleString()}`],
                    ] as [string, string][]).map(([l, v]) => (
                      <div key={l} className="bg-neutral-50 rounded-lg border border-border-default p-3">
                        <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">{l}</p>
                        <p className="text-sm font-bold text-neutral-900">{v}</p>
                      </div>
                    ))}
                  </div>

                  <div className={`rounded-lg border p-4 ${balance > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                    <p className="text-[11px] font-semibold text-gray-500 mb-1">Outstanding Balance</p>
                    <p className={`text-[22px] font-bold ${balance > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                      ${balance.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">${totalPaid.toLocaleString()} paid of ${totalAccrued.toLocaleString()} accrued</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Payment History</p>
                    {detail.payments.length === 0 ? (
                      <p className="text-[12px] text-gray-400 italic">No payments recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {detail.payments.map(p => (
                          <div key={p.id} className="flex items-center justify-between text-[13px] py-2 border-b border-border-default last:border-0">
                            <div>
                              <p className="font-semibold text-gray-800">${p.amountUSD.toLocaleString()}</p>
                              <p className="text-[11px] text-gray-400">{p.date} · Ref: {p.reference}</p>
                            </div>
                            {p.notes && <p className="text-[11px] text-gray-500 text-right max-w-[140px]">{p.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'inspection' && (
            <>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-border-default mb-4">
                <ShieldCheck size={20} className={expiryState === 'ok' || expiryState === 'soon' ? 'text-green-600' : 'text-red-500'} />
                <div>
                  <p className="text-[12px] font-semibold text-gray-800">Next inspection due: {detail.inspectionExpiry}</p>
                  <p className="text-[11px] text-gray-500">Cert: {detail.certNo ?? 'Not available'}</p>
                </div>
                <ExpiryChip expiry={detail.inspectionExpiry} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Inspection History</p>
                {detail.inspectionHistory.length === 0 ? (
                  <p className="text-[12px] text-gray-400 italic">No inspection history.</p>
                ) : (
                  <div className="space-y-2">
                    {[...detail.inspectionHistory].reverse().map((h, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${h.result === 'Passed' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div>
                          <p className={`text-[12px] font-semibold ${h.result === 'Passed' ? 'text-green-700' : 'text-red-700'}`}>{h.result}</p>
                          <p className="text-[11px] text-gray-500">{h.date} · {h.inspector}</p>
                          {h.notes && <p className="text-[11px] text-gray-400 mt-0.5">{h.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="secondary" fullWidth size="sm" className="mt-2">Schedule Inspection</Button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
