import { Clock } from 'lucide-react'
import { VESSELS, STATUS_CFG } from './mockData'
import type { VesselStatus } from './types'

const STATUSES: VesselStatus[] = ['In Transit', 'Docking', 'Loading', 'Awaiting Berth', 'Departed']

export function RouteOverviewStrip() {
  return (
    <div className="bg-sidebar rounded-card p-5 flex items-center gap-6 overflow-x-auto">
      <div className="shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Primary Route</p>
        <p className="text-sm font-bold text-white">Singapore &rarr; Rotterdam &rarr; Lagos Apapa</p>
      </div>
      <div className="h-8 w-px bg-white/10 shrink-0"/>
      <div className="flex items-center gap-4 shrink-0">
        {STATUSES.map(s => {
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
  )
}
