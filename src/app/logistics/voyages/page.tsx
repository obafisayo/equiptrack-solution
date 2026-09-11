'use client'

import { useState, useMemo } from 'react'
import { Ship, AlertTriangle, CheckCircle2, BarChart3, Clock } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import {
  VOYAGES, ENTITY_COLOR, VOYAGE_ENTITIES,
  voyageBookedM2, voyageUtilizationPct,
  type Voyage, type VoyageEntity,
} from '@/lib/voyage-store'
import { ManifestPanel } from './_components/ManifestPanel'

type Filter = 'all' | 'upcoming' | 'past'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`
}
function fmtShort(iso: string) {
  const [, m, d] = iso.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]}`
}

const TODAY = new Date().toISOString().split('T')[0]

export default function VoyagesPage() {
  const [filter,   setFilter]   = useState<Filter>('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Voyage | null>(null)

  const filtered = useMemo(() => {
    return VOYAGES.filter(v => {
      if (filter === 'upcoming' && v.departureDate < TODAY) return false
      if (filter === 'past'     && v.departureDate >= TODAY) return false
      if (search && !v.vessel.toLowerCase().includes(search.toLowerCase()) &&
                    !v.transitTo.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => a.departureDate.localeCompare(b.departureDate))
  }, [filter, search])

  // KPIs across all voyages
  const upcoming = VOYAGES.filter(v => v.departureDate >= TODAY)
  const totalPending = VOYAGES.reduce((s, v) =>
    s + v.bookings.filter(b => b.lmtsDecision === 'pending').length, 0)
  const avgUtil = VOYAGES.length > 0
    ? VOYAGES.reduce((s, v) => s + voyageUtilizationPct(v), 0) / VOYAGES.length
    : 0
  const atCapacity = VOYAGES.filter(v => voyageUtilizationPct(v) >= 90).length

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics/voyages"
      title="Voyage Manifests"
      breadcrumb={[{ label: 'Logistics', href: '/logistics' }, { label: 'Voyage Manifests' }]}
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Upcoming Voyages"    value={upcoming.length}           color="#1A6FBF" icon={Ship}          />
        <StatCard label="CCUs Pending LMTS"   value={totalPending}              color="#D97706" icon={Clock}         />
        <StatCard label="Avg Deck Utilization" value={`${avgUtil.toFixed(0)}%`} color="#059669" icon={BarChart3}     />
        <StatCard label="At / Near Capacity"  value={atCapacity}                color="#EF4444" icon={AlertTriangle} />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex bg-white border border-border-default rounded-lg overflow-hidden shadow-card">
          {(['all', 'upcoming', 'past'] as Filter[]).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All Voyages' : f === 'upcoming' ? 'Upcoming' : 'Departed'}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search vessel or destination…"
          className="h-9 flex-1 max-w-xs border border-border-default rounded-lg px-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white shadow-card"
        />
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} voyage{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Voyage list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-card border border-border-default shadow-card py-16 text-center">
          <Ship size={28} className="mx-auto mb-2 text-gray-200" />
          <p className="text-sm text-gray-400">No voyages match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(voyage => (
            <VoyageCard
              key={voyage.id}
              voyage={voyage}
              onOpen={() => setSelected(voyage)}
            />
          ))}
        </div>
      )}

      {selected && (
        <ManifestPanel voyage={selected} onClose={() => setSelected(null)} />
      )}
    </AppShell>
  )
}

function VoyageCard({ voyage, onOpen }: { voyage: Voyage; onOpen: () => void }) {
  const usedM2   = voyageBookedM2(voyage)
  const pct      = voyageUtilizationPct(voyage)
  const clampPct = Math.min(pct, 100)

  const utilColor   = pct > 100 ? '#EF4444' : pct >= 85 ? '#F59E0B' : '#22C55E'
  const utilTextCls = pct > 100 ? 'text-red-600' : pct >= 85 ? 'text-amber-600' : 'text-green-600'

  const pendingCount   = voyage.bookings.filter(b => b.lmtsDecision === 'pending').length
  const loadedCount    = voyage.bookings.filter(b => b.loaded).length
  const isUpcoming     = voyage.departureDate >= TODAY
  const isPast         = voyage.departureDate < TODAY

  // Entity m² breakdown (validated only)
  const entityM2 = VOYAGE_ENTITIES.reduce<Record<VoyageEntity, number>>((acc, e) => {
    acc[e] = voyage.bookings
      .filter(b => b.entity === e && b.lmtsDecision !== 'cancelled' && b.lmtsDecision !== 'rejected')
      .reduce((s, b) => s + b.deckSpaceM2, 0)
    return acc
  }, { DRILL: 0, FOPS: 0, ECP: 0, PROJECT: 0, TECHLOG: 0 })

  return (
    <div className={`bg-white rounded-card border shadow-card p-5 transition-colors ${
      pct > 100 ? 'border-red-200' : 'border-border-default'
    }`}>
      <div className="flex items-start gap-5">
        {/* Left: vessel info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-bold text-gray-900">{voyage.vessel}</h3>
            <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{voyage.id}</span>
            {isPast && (
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Departed</span>
            )}
            {isUpcoming && pct > 100 && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle size={9} />
                Over capacity
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            <span className="font-medium text-gray-700">{voyage.transitTo}</span>
            <span className="text-gray-300 mx-1.5">·</span>
            <span>Departure {fmtDate(voyage.departureDate)}</span>
            <span className="text-gray-300 mx-1.5">·</span>
            <span>{voyage.vesselCapacityM2} m² capacity</span>
          </p>

          {/* Utilization bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-gray-500 font-mono">{usedM2.toFixed(1)} m² booked</span>
              <span className={`font-bold ${utilTextCls}`}>{pct.toFixed(1)}%</span>
              <span className="text-gray-400">{voyage.vesselCapacityM2} m²</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${clampPct}%`, backgroundColor: utilColor }}
                className="h-full rounded-full transition-all"
              />
            </div>
          </div>

          {/* Entity breakdown strip */}
          {usedM2 > 0 && (
            <div className="flex h-1.5 rounded-full overflow-hidden gap-px mb-1.5">
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
          )}
          <div className="flex flex-wrap gap-3">
            {VOYAGE_ENTITIES.map(e => {
              const m = entityM2[e]
              if (!m) return null
              return (
                <span key={e} className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span style={{ backgroundColor: ENTITY_COLOR[e] }} className="w-1.5 h-1.5 rounded-sm inline-block" />
                  {e} {m.toFixed(1)} m²
                </span>
              )
            })}
          </div>
        </div>

        {/* Right: stats + CTA */}
        <div className="shrink-0 flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="h-9 px-5 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
          >
            Open Manifest
          </button>
          <div className="flex flex-col items-end gap-1 text-[11px]">
            <span className="text-gray-500">{voyage.bookings.length} CCUs</span>
            {pendingCount > 0
              ? <span className="text-amber-600 font-semibold">{pendingCount} pending LMTS</span>
              : <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={10} />All validated</span>
            }
            <span className="text-gray-400">{loadedCount}/{voyage.bookings.length} loaded</span>
          </div>
        </div>
      </div>
    </div>
  )
}
