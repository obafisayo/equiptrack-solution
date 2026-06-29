/* eslint-disable */
'use client'

import { useState } from 'react'
import { Ship, MapPin, Clock, Package, Anchor, ArrowRight, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'

type VesselStatus = 'In Transit' | 'Docking' | 'Loading' | 'Awaiting Berth' | 'Departed'

interface CargoItem { description: string; qty: number; unit: string; ref: string }

interface Vessel {
  id: string; name: string; type: string; flag: string
  status: VesselStatus; origin: string; destination: string
  etd: string; eta: string; progress: number
  captain: string; imo: string
  cargo: CargoItem[]
  priority: 'normal' | 'urgent'
}

const VESSELS: Vessel[] = [
  {
    id: 'VSL-001', name: 'Ocean Star', type: 'PSV', flag: 'Malta',
    status: 'In Transit', origin: 'Singapore Port', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-22', eta: '2026-07-01', progress: 65,
    captain: 'Capt. Erik Lindstrom', imo: 'IMO 9876543',
    priority: 'normal',
    cargo: [
      { description: 'Drill Pipe — 5" 19.5ppf', qty: 48, unit: 'joints', ref: 'PO-2241' },
      { description: 'BOP Gasket Kit — 13.5"',  qty: 12, unit: 'kits',   ref: 'PO-2241' },
      { description: 'Mud Pump Liner — 6.5"',   qty: 20, unit: 'pieces', ref: 'PO-2238' },
    ],
  },
  {
    id: 'VSL-002', name: 'Nordic Sea', type: 'AHTS', flag: 'Norway',
    status: 'Docking', origin: 'Rotterdam Port', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-24', eta: '2026-06-29', progress: 98,
    captain: 'Capt. Lars Bjornsen', imo: 'IMO 9123456',
    priority: 'urgent',
    cargo: [
      { description: 'Choke Manifold — 5000 PSI', qty: 2, unit: 'units', ref: 'PO-2244' },
      { description: 'Safety Valve — 4.5"',        qty: 8, unit: 'units', ref: 'PO-2244' },
    ],
  },
  {
    id: 'VSL-003', name: 'Seplat Pride', type: 'PSV', flag: 'Nigeria',
    status: 'Loading', origin: 'Lagos Apapa Terminal', destination: 'Bonga FPSO Field',
    etd: '2026-07-02', eta: '2026-07-03', progress: 10,
    captain: 'Capt. Emeka Obi', imo: 'IMO 9654321',
    priority: 'normal',
    cargo: [
      { description: 'Drill Bit — 12.25" PDC', qty: 4, unit: 'pieces', ref: 'WO-0087' },
      { description: 'Flex Hose — 3" x 20ft',  qty: 15, unit: 'lengths', ref: 'WO-0087' },
      { description: 'Chemical — Barite Sacks', qty: 80, unit: 'sacks',  ref: 'WO-0087' },
    ],
  },
  {
    id: 'VSL-004', name: 'Gulf Carrier', type: 'RORC', flag: 'Liberia',
    status: 'Awaiting Berth', origin: 'Port Harcourt', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-28', eta: '2026-06-30', progress: 85,
    captain: 'Capt. James Adeyemi', imo: 'IMO 9234567',
    priority: 'normal',
    cargo: [
      { description: 'Generator — 250 KVA',       qty: 1, unit: 'unit',   ref: 'PO-2246' },
      { description: 'BOP Accumulator Unit',       qty: 2, unit: 'units',  ref: 'PO-2246' },
    ],
  },
  {
    id: 'VSL-005', name: 'Delta Express', type: 'PSV', flag: 'Nigeria',
    status: 'Departed', origin: 'Bonny Terminal', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-27', eta: '2026-06-28', progress: 100,
    captain: 'Capt. Fatima Yusuf', imo: 'IMO 9345678',
    priority: 'normal',
    cargo: [
      { description: 'Drill Pipe — 5" 19.5ppf', qty: 24, unit: 'joints', ref: 'PO-2240' },
    ],
  },
]

const STATUS_CFG: Record<VesselStatus, { color: string; bg: string; dot: string }> = {
  'In Transit':    { color: '#3B82F6', bg: '#EFF6FF', dot: '#3B82F6' },
  'Docking':       { color: '#16A34A', bg: '#F0FDF4', dot: '#16A34A' },
  'Loading':       { color: '#D97706', bg: '#FFFBEB', dot: '#D97706' },
  'Awaiting Berth':{ color: '#7C3AED', bg: '#F5F3FF', dot: '#7C3AED' },
  'Departed':      { color: '#64748B', bg: '#F8FAFC', dot: '#94A3B8' },
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }}/>
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function VesselSchedulePage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<VesselStatus | 'all'>('all')

  const shown = statusFilter === 'all' ? VESSELS : VESSELS.filter(v => v.status === statusFilter)

  const inTransit = VESSELS.filter(v => v.status === 'In Transit').length
  const docking   = VESSELS.filter(v => v.status === 'Docking').length
  const loading   = VESSELS.filter(v => v.status === 'Loading').length
  const urgent    = VESSELS.filter(v => v.priority === 'urgent').length

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics/vessels"
      title="Vessel Schedule"
      breadcrumb={[
        { label: 'Logistics', href: '/logistics' },
        { label: 'Vessel Schedule' },
      ]}
    >
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { label: 'Total Vessels',  value: VESSELS.length,  color: '#3B82F6', icon: <Ship size={16}/> },
            { label: 'In Transit',     value: inTransit,        color: '#3B82F6', icon: <ArrowRight size={16}/> },
            { label: 'At Port',        value: docking + loading,color: '#16A34A', icon: <Anchor size={16}/> },
            { label: 'Urgent Cargo',   value: urgent,           color: '#DC2626', icon: <AlertTriangle size={16}/> },
          ] as { label: string; value: string | number; color: string; icon: React.ReactNode }[]).map(k => (
            <div key={k.label} className="bg-white border border-border-default rounded-card shadow-card p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${k.color}14`, color: k.color }}>
                {k.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 leading-none mb-0.5">{k.value}</p>
                <p className="text-xs text-neutral-500">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Route overview strip */}
        <div className="bg-sidebar rounded-card p-5 flex items-center gap-6 overflow-x-auto">
          <div className="shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Primary Route</p>
            <p className="text-sm font-bold text-white">Singapore &rarr; Rotterdam &rarr; Lagos Apapa</p>
          </div>
          <div className="h-8 w-px bg-white/10 shrink-0"/>
          <div className="flex items-center gap-4 shrink-0">
            {(['In Transit', 'Docking', 'Loading', 'Awaiting Berth', 'Departed'] as VesselStatus[]).map(s => {
              const n = VESSELS.filter(v => v.status === s).length
              const cfg = STATUS_CFG[s]
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.dot }}/>
                  <span className="text-xs text-white/60">{s}</span>
                  <span className="text-xs font-bold text-white">{n}</span>
                </div>
              )
            })}
          </div>
          <div className="ml-auto shrink-0 text-xs text-white/30 flex items-center gap-1.5">
            <Clock size={12}/>
            Last updated 14:32 WAT
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${statusFilter === 'all' ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
            All Vessels
          </button>
          {(['In Transit', 'Docking', 'Loading', 'Awaiting Berth', 'Departed'] as VesselStatus[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${statusFilter === s ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
              {s}
            </button>
          ))}
          <span className="ml-auto text-xs text-neutral-400">{shown.length} vessels</span>
        </div>

        {/* Vessel cards */}
        <div className="space-y-3">
          {shown.map(vessel => {
            const cfg = STATUS_CFG[vessel.status]
            const isOpen = expanded === vessel.id
            return (
              <div key={vessel.id} className="bg-white border border-border-default rounded-card shadow-card overflow-hidden"
                style={vessel.priority === 'urgent' ? { borderTopWidth: 3, borderTopColor: '#DC2626' } : {}}>

                {/* Header row */}
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                  onClick={() => setExpanded(isOpen ? null : vessel.id)}
                >
                  {/* Vessel icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sidebar">
                    <Ship size={18} className="text-white"/>
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-neutral-900 text-sm">{vessel.name}</span>
                      <code className="font-mono text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">{vessel.id}</code>
                      {vessel.priority === 'urgent' && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Urgent</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <MapPin size={11}/>
                      <span>{vessel.origin}</span>
                      <ArrowRight size={11}/>
                      <span>{vessel.destination}</span>
                    </div>
                  </div>

                  {/* Progress + ETA */}
                  <div className="hidden md:flex flex-col items-end gap-1 w-48 shrink-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-neutral-400">Route progress</span>
                      <span className="text-[11px] font-bold" style={{ color: cfg.color }}>{vessel.progress}%</span>
                    </div>
                    <div className="w-full">
                      <ProgressBar pct={vessel.progress} color={cfg.color}/>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                      <Calendar size={11}/>
                      ETA {formatDate(vessel.eta)}
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }}/>
                    {vessel.status}
                  </span>

                  {/* Expand chevron */}
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
                    className={`text-neutral-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {/* Expanded cargo */}
                {isOpen && (
                  <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50 space-y-4">
                    {/* Vessel details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {([
                        { label: 'Type',    value: vessel.type },
                        { label: 'Flag',    value: vessel.flag },
                        { label: 'IMO',     value: vessel.imo },
                        { label: 'Captain', value: vessel.captain },
                        { label: 'ETD',     value: formatDate(vessel.etd) },
                        { label: 'ETA',     value: formatDate(vessel.eta) },
                      ]).map(d => (
                        <div key={d.label}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{d.label}</p>
                          <p className="text-sm font-semibold text-neutral-800">{d.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Cargo manifest */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                        <Package size={12}/>
                        Cargo Manifest
                      </p>
                      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50">
                              <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Item</th>
                              <th className="text-right px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Qty</th>
                              <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Unit</th>
                              <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">PO / Ref</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-50">
                            {vessel.cargo.map((c, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2 text-xs font-medium text-neutral-800">{c.description}</td>
                                <td className="px-3 py-2 text-xs font-bold text-neutral-900 text-right">{c.qty}</td>
                                <td className="px-3 py-2 text-xs text-neutral-500">{c.unit}</td>
                                <td className="px-3 py-2">
                                  <code className="font-mono text-[11px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{c.ref}</code>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
