'use client'

import type { ReturnOrder } from './types'
import { STATUS_BADGE } from './types'

interface Props {
  returns: ReturnOrder[]
}

export function ReturnList({ returns }: Props) {
  if (returns.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-[13px]">No return orders yet.</div>
    )
  }

  return (
    <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-border-default">
          <tr>
            {['Return ID', 'Origin', 'Cargo Class', 'Items', 'Manifest', 'Status', 'Initiated'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {returns.map(r => {
            const badge = STATUS_BADGE[r.status]
            return (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-[12px] text-brand-500 font-semibold">{r.id}</td>
                <td className="px-4 py-3 text-[13px] text-gray-800">
                  <p className="capitalize">{r.origin === 'site' ? r.siteName : 'Vendor'}</p>
                  <p className="text-[11px] text-gray-400 capitalize">{r.origin}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                    r.cargoClass === 'normal' ? 'bg-gray-100 text-gray-600'
                    : r.cargoClass === 'explosive' || r.cargoClass === 'radioactive' ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.cargoClass}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-gray-700">{r.items.length} item{r.items.length !== 1 ? 's' : ''}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-gray-600">{r.manifestNumber}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-[11px] font-semibold ${badge.cls}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-500">
                  <p>{new Date(r.initiatedAt).toLocaleDateString()}</p>
                  <p className="text-[11px] text-gray-400">{r.initiatedBy}</p>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
