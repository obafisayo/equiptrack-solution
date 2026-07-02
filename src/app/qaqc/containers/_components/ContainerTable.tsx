'use client'

import { Package, MapPin } from 'lucide-react'
import { type CCUContainer, STATUS_BADGE } from './types'
import { StatusDot } from './StatusDot'
import { ExpiryChip } from './ExpiryChip'

const COLUMNS = ['Serial Number', 'Type', 'Current Location', 'Footprint Area', 'Max Gross Weight', 'Inspection Expiry', 'Status', 'Available']

interface ContainerTableProps {
  containers: CCUContainer[]
  onSelect: (c: CCUContainer) => void
  onToggleAvailable: (sn: string) => void
}

export function ContainerTable({ containers, onSelect, onToggleAvailable }: ContainerTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
      <table className="w-full min-w-max text-sm">
        <thead className="bg-neutral-50 border-b border-border-default">
          <tr>
            <th className="w-10 px-4 py-3" />
            {COLUMNS.map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {containers.length === 0 ? (
            <tr><td colSpan={10} className="py-14 text-center text-neutral-400 text-sm">No CCUs match the current filters.</td></tr>
          ) : containers.map(c => (
            <tr key={c.serialNumber} className="hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => onSelect(c)}>
              <td className="px-4 py-3"><StatusDot c={c} /></td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-mono text-sm font-bold text-neutral-900">{c.serialNumber}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">{c.type}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  c.currentSite ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                }`}>
                  <MapPin size={9} />
                  {c.location ?? 'Unknown'}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">{c.footprintM2} m²</td>
              <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">
                <span className="flex items-center gap-1.5"><Package size={11} className="text-neutral-300 shrink-0" />{c.maxGrossWeightKg.toLocaleString()} kg</span>
              </td>
              <td className="px-4 py-3"><ExpiryChip expiry={c.inspectionExpiry} /></td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[c.status]}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                <button type="button" role="switch" aria-checked={c.available}
                  onClick={() => onToggleAvailable(c.serialNumber)}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${c.available ? 'bg-brand-500' : 'bg-neutral-200'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${c.available ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
