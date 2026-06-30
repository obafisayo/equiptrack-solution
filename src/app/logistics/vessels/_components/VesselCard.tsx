import { Ship, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { STATUS_CFG } from './mockData'
import { formatDate } from './helpers'
import { ProgressBar } from './ProgressBar'
import { CargoManifestTable } from './CargoManifestTable'
import type { Vessel } from './types'

interface Props {
  vessel: Vessel
  isOpen: boolean
  onToggle: () => void
}

export function VesselCard({ vessel, isOpen, onToggle }: Props) {
  const cfg = STATUS_CFG[vessel.status]

  const details = [
    { label: 'Type', value: vessel.type },
    { label: 'Flag', value: vessel.flag },
    { label: 'IMO', value: vessel.imo },
    { label: 'Captain', value: vessel.captain },
    { label: 'ETD', value: formatDate(vessel.etd) },
    { label: 'ETA', value: formatDate(vessel.eta) },
  ]

  return (
    <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden"
      style={vessel.priority === 'urgent' ? { borderTopWidth: 3, borderTopColor: '#DC2626' } : {}}>

      <button
        type="button"
        className="w-full text-left px-5 py-4 flex items-center gap-4"
        onClick={onToggle}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sidebar">
          <Ship size={18} className="text-white"/>
        </div>

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

        <span className="shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }}/>
          {vessel.status}
        </span>

        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
          className={`text-neutral-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {details.map(d => (
              <div key={d.label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{d.label}</p>
                <p className="text-sm font-semibold text-neutral-800">{d.value}</p>
              </div>
            ))}
          </div>

          <CargoManifestTable cargo={vessel.cargo}/>
        </div>
      )}
    </div>
  )
}
