'use client'

import { DAYS_SHORT, EVT_CHIP, TODAY_ISO } from './constants'
import { toKey } from './helpers'
import type { VesselEvent } from './types'

interface Props {
  calCells: Date[]
  viewMonth: number
  eventsByDate: Map<string, VesselEvent[]>
  selectedId: string | null
  onSelectDate: (date: Date) => void
  onSelectEvent: (id: string) => void
}

export function MonthView({ calCells, viewMonth, eventsByDate, selectedId, onSelectDate, onSelectEvent }: Props) {
  return (
    <>
      <div className="grid grid-cols-7 border-b border-border-default">
        {DAYS_SHORT.map(d => (
          <div key={d} className="py-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wide">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {calCells.map((date, idx) => {
          const key = toKey(date)
          const isCurM = date.getMonth() === viewMonth
          const isToday = key === TODAY_ISO
          const evts = eventsByDate.get(key) ?? []
          return (
            <div
              key={idx}
              className={`border-b border-r border-border-default p-1.5 cursor-pointer ${!isCurM ? 'bg-neutral-50/60' : ''} ${isToday ? 'bg-brand-50/30' : ''}`}
              onClick={() => onSelectDate(date)}
            >
              <div className="mb-1">
                <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${isToday ? 'bg-brand-500 text-white' : isCurM ? 'text-neutral-700' : 'text-neutral-300'}`}>
                  {date.getDate()}
                </span>
              </div>
              <div className="space-y-0.5">
                {evts.slice(0, 3).map(evt => (
                  <button
                    key={evt.id} type="button"
                    onClick={e => { e.stopPropagation(); onSelectEvent(evt.id) }}
                    className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-colors ${selectedId === evt.id ? 'ring-1 ring-brand-500' : ''} ${EVT_CHIP[evt.type]}`}
                    title={`${evt.vesselName} - ${evt.time}`}
                  >
                    {evt.vesselId} {evt.time}
                  </button>
                ))}
                {evts.length > 3 && <p className="text-[9px] text-neutral-400 pl-1">+{evts.length - 3} more</p>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
