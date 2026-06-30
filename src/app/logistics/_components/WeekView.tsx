'use client'

import { DAYS_SHORT, EVT_CHIP, TODAY_ISO } from './constants'
import { toKey } from './helpers'
import type { VesselEvent } from './types'

interface Props {
  weekDates: Date[]
  eventsByDate: Map<string, VesselEvent[]>
  selectedId: string | null
  onSelectDate: (date: Date) => void
  onSelectEvent: (id: string) => void
}

export function WeekView({ weekDates, eventsByDate, selectedId, onSelectDate, onSelectEvent }: Props) {
  return (
    <>
      <div className="grid grid-cols-7 border-b border-border-default">
        {weekDates.map((d, i) => {
          const isToday = toKey(d) === TODAY_ISO
          return (
            <div
              key={i}
              className={`py-2.5 text-center cursor-pointer hover:bg-neutral-50 transition-colors ${isToday ? 'bg-brand-50' : ''}`}
              onClick={() => onSelectDate(d)}
            >
              <p className="text-[10px] font-bold text-neutral-400 uppercase">{DAYS_SHORT[d.getDay()]}</p>
              <span className={`inline-flex items-center justify-center w-8 h-8 mt-0.5 text-sm font-bold rounded-full ${isToday ? 'bg-brand-500 text-white' : 'text-neutral-700'}`}>
                {d.getDate()}
              </span>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-7 min-h-[440px] divide-x divide-border-default">
        {weekDates.map((d, i) => {
          const key = toKey(d)
          const evts = eventsByDate.get(key) ?? []
          const isToday = key === TODAY_ISO
          return (
            <div key={i} className={`p-1.5 space-y-1 overflow-y-auto ${isToday ? 'bg-brand-50/20' : ''}`}>
              {evts.map(evt => (
                <button
                  key={evt.id} type="button"
                  onClick={() => onSelectEvent(evt.id)}
                  className={`w-full text-left p-2 rounded-md text-xs transition-all ${selectedId === evt.id ? 'ring-2 ring-brand-500' : ''} ${EVT_CHIP[evt.type]}`}
                >
                  <p className="font-bold truncate">{evt.time}</p>
                  <p className="font-medium truncate">{evt.vesselName}</p>
                  <p className="text-[10px] opacity-80">{evt.type}</p>
                </button>
              ))}
              {evts.length === 0 && <div className="h-full flex items-start justify-center pt-6 text-[10px] text-neutral-300">-</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}
