'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { VESSELS } from '@/lib/mock-data'
import type { WorkOrder } from '@/lib/mock-data'

interface VesselRequestDialogProps {
  order: WorkOrder
  onConfirm: (vesselId: string) => void
  onClose: () => void
}

export const VESSEL_STATUS_STYLE: Record<string, { badge: string; label: string }> = {
  available:    { badge: 'bg-green-50 text-green-700 border border-green-200', label: 'Available' },
  loading:      { badge: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Loading' },
  full:         { badge: 'bg-red-50   text-red-700   border border-red-200',   label: 'Full' },
  'in-transit': { badge: 'bg-gray-50  text-gray-600  border border-gray-200',  label: 'In Transit' },
  arrived:      { badge: 'bg-blue-50  text-blue-700  border border-blue-200',  label: 'Arrived' },
}

export function VesselRequestDialog({ order, onConfirm, onClose }: VesselRequestDialogProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const eligible = VESSELS.filter(v =>
    (v.status === 'available' || v.status === 'loading') &&
    v.allocatedUnits < v.capacityUnits
  )

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
        <div className="px-6 py-5 border-b border-border-default">
          <h2 className="text-base font-semibold text-gray-900">Request Vessel Deckspace</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            <span className="font-mono font-semibold text-brand-500">{order.id}</span> &rarr; {order.destination}
          </p>
        </div>

        <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
          {eligible.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No vessels with available deckspace right now.</p>
          ) : (
            eligible.map(v => {
              const remaining = v.capacityUnits - v.allocatedUnits
              const pct = Math.round((v.allocatedUnits / v.capacityUnits) * 100)
              const st = VESSEL_STATUS_STYLE[v.status]
              const isSelected = selected === v.id

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelected(v.id)}
                  className={`w-full text-left px-4 py-3 rounded-md border transition-colors duration-150 ${
                    isSelected ? 'border-brand-500 bg-brand-50' : 'border-border-default hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-900 truncate">{v.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${st.badge}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{v.port} &rarr; {v.destination} &middot; Departs {v.departure}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                          <span>{v.allocatedUnits}/{v.capacityUnits} units</span>
                          <span className="font-semibold text-green-700">{remaining} remaining</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border-default">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={() => selected && onConfirm(selected)} disabled={!selected}>
            Request Deckspace
          </Button>
        </div>
      </div>
    </div>
  )
}
