'use client'

import { MapPin, User, Calendar } from 'lucide-react'
import { PTWS } from './mockData'
import { PTW_CLASS } from './styleMaps'

export function PTWTab() {
  return (
    <div className="space-y-3">
      {PTWS.map(ptw => {
        const pc = PTW_CLASS[ptw.status]
        const isActive = ptw.status === 'active'
        return (
          <div
            key={ptw.id}
            className={[
              'bg-white rounded-card border shadow-card p-5',
              isActive ? 'border-green-300 ring-1 ring-green-200' : 'border-border-default',
            ].join(' ')}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-brand-500">{ptw.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${pc.badge}`}>
                    {pc.label}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900">{ptw.type}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{ptw.description}</p>
              </div>
              {isActive && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                  LIVE
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1"><MapPin size={11}/>{ptw.location}</span>
              <span className="flex items-center gap-1"><User size={11}/> Supervisor: <strong className="text-neutral-700 ml-0.5">{ptw.supervisor}</strong></span>
              <span className="flex items-center gap-1"><Calendar size={11}/> Valid: {ptw.validFrom} {ptw.validFrom !== ptw.validTo ? `- ${ptw.validTo}` : ''}</span>
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Crew: <span className="text-neutral-700 font-medium">{ptw.crew}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
