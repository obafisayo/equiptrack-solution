'use client'

import { Calendar as CalIcon, MapPin } from 'lucide-react'
import { VST_CFG } from './constants'
import { fmtDate, toKey } from './helpers'
import type { VesselEvent } from './types'

interface Props {
  focusDate: Date
  eventsByDate: Map<string, VesselEvent[]>
  todayIso: string
  selectedId: string | null
  onSelectEvent: (id: string) => void
  onNewAgenda: () => void
}

export function DayView({ focusDate, eventsByDate, todayIso, selectedId, onSelectEvent, onNewAgenda }: Props) {
  const dayKey = toKey(focusDate)
  const dayEvts = eventsByDate.get(dayKey) ?? []
  const isToday = dayKey === todayIso

  return (
    <div className="p-6">
      <div className={`inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-bold ${isToday ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-neutral-50 text-neutral-600 border border-neutral-200'}`}>
        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"/>}
        {isToday ? 'Today' : fmtDate(dayKey)}
      </div>

      {dayEvts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-300">
          <CalIcon size={40} strokeWidth={1}/>
          <p className="text-sm mt-3 font-medium">No events scheduled</p>
          <button type="button" onClick={onNewAgenda}
            className="mt-3 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors">
            + Add new agenda
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvts.map(evt => {
            const cfg = VST_CFG[evt.status]
            return (
              <button
                key={evt.id} type="button"
                onClick={() => onSelectEvent(evt.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${selectedId === evt.id ? 'border-brand-500 bg-brand-50' : 'border-border-default bg-white hover:border-neutral-300'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${evt.type === 'Departure' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>{evt.type}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{evt.vesselName}</p>
                    <p className="font-mono text-xs text-brand-500">#{evt.vesselId}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-neutral-900">{evt.time}</p>
                    <p className="text-xs text-neutral-400">{evt.port}</p>
                  </div>
                </div>
                {evt.destination !== evt.port && (
                  <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                    <MapPin size={11}/> {evt.port} &rarr; {evt.destination}
                  </p>
                )}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-500">Deck utilisation</span>
                    <span className="font-bold">{evt.bookedSqM}/{evt.capacitySqM} m2</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${evt.capacitySqM > 0 ? Math.min(100, Math.round((evt.bookedSqM / evt.capacitySqM) * 100)) : 0}%` }}/>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
