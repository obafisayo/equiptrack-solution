'use client'

import { X, Calendar as CalIcon, MapPin } from 'lucide-react'
import { VST_CFG, DEPT_CFG } from './constants'
import type { VesselEvent } from './types'

interface Props {
  event: VesselEvent
  onClose: () => void
}

export function EventDetailsPanel({ event, onClose }: Props) {
  const cfg = VST_CFG[event.status]
  const pct = event.capacitySqM > 0 ? Math.round((event.bookedSqM / event.capacitySqM) * 100) : 0
  const rem = event.capacitySqM - event.bookedSqM
  const tot = event.distribution.reduce((s,d) => s+d.units, 0)

  return (
    <div className="w-72 shrink-0 bg-white border-l border-border-default overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default sticky top-0 bg-white z-10">
        <p className="text-sm font-bold text-neutral-900">Event Details</p>
        <button type="button" aria-label="Close" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <X size={15}/>
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${event.type==='Departure'?'bg-amber-100 text-amber-800':'bg-blue-100 text-blue-800'}`}>
            {event.type}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900">{event.vesselName}</p>
          <p className="font-mono text-xs text-brand-500 mt-0.5">#{event.vesselId}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <CalIcon size={12} className="text-neutral-400"/>
            {event.date} at {event.time}
          </div>
          <div className="flex items-start gap-2 text-xs text-neutral-600">
            <MapPin size={12} className="text-neutral-400 mt-0.5"/>
            <span>
              {event.port}
              {event.type==='Departure' && (
                <><br/><span className="text-neutral-400">to</span> {event.destination}</>
              )}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-neutral-700">Deck Space</span>
            <span className="font-bold text-neutral-900">{event.bookedSqM}/{event.capacitySqM} m2</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full ${cfg.bar}`} style={{width:`${Math.min(100,pct)}%`}}/>
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>{pct}% booked</span>
            <span>{rem} m2 free</span>
          </div>
        </div>
        {event.distribution.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Distribution</p>
            <div className="space-y-2">
              {event.distribution.map(d => {
                const dc = DEPT_CFG[d.dept] ?? {bar:'bg-neutral-400', text:'text-neutral-600'}
                const p  = event.capacitySqM > 0 ? Math.round((d.units/event.capacitySqM)*100) : 0
                return (
                  <div key={d.dept}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className={`font-bold ${dc.text} flex items-center gap-1`}>
                        <span className={`w-2 h-2 rounded-sm ${dc.bar}`}/>
                        {d.dept}
                      </span>
                      <span className="text-neutral-500">{d.units} m2</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${dc.bar}`} style={{width:`${p}%`}}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        <div className="bg-neutral-50 border border-border-default rounded-lg px-3 py-2.5 grid grid-cols-2 gap-y-1.5 text-xs">
          <span className="text-neutral-500">Total loaded</span>
          <span className="font-bold text-right">{tot} m2</span>
          <span className="text-neutral-500">Remaining</span>
          <span className={`font-bold text-right ${rem>0?'text-green-700':'text-red-600'}`}>{rem} m2</span>
          <span className="text-neutral-500">PIC</span>
          <span className="font-bold text-right text-neutral-800">{event.pic}</span>
        </div>
        {event.notes && (
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-0.5">Notes</p>
            <p className="text-xs text-neutral-600 leading-relaxed">{event.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
