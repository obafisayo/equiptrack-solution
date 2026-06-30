'use client'

import { X } from 'lucide-react'
import type { VesselStatus } from '@/lib/mock-data'
import { VST_CFG } from './constants'
import type { EventType } from './types'

interface Props {
  activeTypes: Set<EventType>
  activeStatuses: Set<VesselStatus>
  onToggleType: (t: EventType) => void
  onToggleStatus: (s: VesselStatus) => void
  onClose: () => void
}

export function FilterPanel({ activeTypes, activeStatuses, onToggleType, onToggleStatus, onClose }: Props) {
  return (
    <div className="w-52 shrink-0 bg-white border-r border-border-default overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default sticky top-0 bg-white z-10">
        <p className="text-sm font-bold text-neutral-900">Filter</p>
        <button type="button" aria-label="Close filter" onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
          <X size={15}/>
        </button>
      </div>
      <div className="p-4 space-y-5">
        <div>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Event Type</p>
          {(['Departure', 'Arrival'] as EventType[]).map(t => (
            <label key={t} className="flex items-center gap-2.5 cursor-pointer mb-2">
              <input type="checkbox" checked={activeTypes.has(t)} onChange={() => onToggleType(t)} className="w-4 h-4 accent-brand-500"/>
              <span className="text-sm text-neutral-700">{t}</span>
            </label>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Status</p>
          {(['available', 'loading', 'full', 'in-transit', 'arrived'] as VesselStatus[]).map(s => {
            const cfg = VST_CFG[s]
            return (
              <label key={s} className="flex items-center gap-2.5 cursor-pointer mb-2">
                <input type="checkbox" checked={activeStatuses.has(s)} onChange={() => onToggleStatus(s)} className="w-4 h-4 accent-brand-500"/>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
