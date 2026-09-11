'use client'

import { MapPin } from 'lucide-react'
import { type FleetVessel, STATUS_BADGE, TYPE_SHORT, getDocExpiryState, diffDays, TODAY } from './types'

function DocExpiryChip({ expiry }: { expiry: string }) {
  const state = getDocExpiryState(expiry)
  const d = diffDays(TODAY, expiry)
  const styles = {
    expired:  'bg-red-50 text-red-700 border-red-200',
    critical: 'bg-orange-50 text-orange-700 border-orange-200',
    warning:  'bg-amber-50 text-amber-700 border-amber-200',
    ok:       'bg-green-50 text-green-700 border-green-200',
  }
  const label = state === 'expired' ? 'Expired' : state === 'critical' ? `${d}d` : state === 'warning' ? `${d}d` : 'Valid'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[state]}`}>
      {label}
    </span>
  )
}

const COLUMNS = ['Vessel Name', 'Type', 'M² Cargo Max', 'Current Location', 'Owner', 'Next Inspection', 'Status', 'Orders']

interface VesselTableProps {
  vessels: FleetVessel[]
  onSelect: (v: FleetVessel) => void
}

export function VesselTable({ vessels, onSelect }: VesselTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead className="bg-slate-50 border-b border-border-default">
          <tr>
            {COLUMNS.map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {vessels.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="py-14 text-center text-neutral-400 text-sm">
                No vessels match the current filters.
              </td>
            </tr>
          ) : vessels.map(v => (
            <tr
              key={v.id}
              className="hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onSelect(v)}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-mono text-sm font-bold text-neutral-900">{v.name}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-xs text-neutral-500 font-medium">{TYPE_SHORT[v.type]}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs font-mono font-semibold text-neutral-700">{v.deckAreaM2} m²</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  v.currentLocation === 'Onne Base'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  <MapPin size={9} />
                  {v.currentLocation}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-600">{v.owner}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <DocExpiryChip expiry={v.nextInspection} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[v.status]}`}>
                  {v.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm font-mono font-semibold text-neutral-700">{v.assignedOrders}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
