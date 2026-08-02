'use client'

import { MapPin } from 'lucide-react'
import { getTopDestinations } from './mock-analytics'

export function TopDestinationsCard() {
  const destinations = getTopDestinations()

  return (
    <div className="bg-white rounded-card border border-border-default shadow-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={15} className="text-brand-500 shrink-0" />
        <h3 className="text-sm font-semibold text-gray-900">Top Destinations</h3>
        <span className="text-xs text-gray-400 ml-auto">by order volume</span>
      </div>
      <div className="space-y-3">
        {destinations.map((d, i) => (
          <div key={d.destination}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-semibold text-gray-400 tabular-nums w-4 shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs font-medium text-gray-800 truncate">{d.destination}</span>
              </div>
              <span className="text-xs font-semibold text-gray-600 shrink-0 ml-3 tabular-nums">
                {d.count} orders
              </span>
            </div>
            <div className="ml-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-500"
                style={{ width: `${d.sharePct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
