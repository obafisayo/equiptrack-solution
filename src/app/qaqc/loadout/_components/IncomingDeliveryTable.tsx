'use client'

import { Package, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import type { IncomingDelivery } from './types'
import { DELIVERY_STATUS_BADGE } from './types'

interface Props {
  deliveries: IncomingDelivery[]
  selectedId: string | null
  onSelect: (d: IncomingDelivery) => void
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  Pending:     <Clock size={13} className="text-slate-500" />,
  Inspecting:  <AlertTriangle size={13} className="text-amber-500" />,
  Passed:      <CheckCircle2 size={13} className="text-green-600" />,
  Rejected:    <XCircle size={13} className="text-red-600" />,
  Quarantined: <AlertTriangle size={13} className="text-orange-500" />,
}

export function IncomingDeliveryTable({ deliveries, selectedId, onSelect }: Props) {
  return (
    <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-gray-50">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Serial / Type</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Contractor</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Expected</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Anomalies</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {deliveries.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                No incoming deliveries
              </td>
            </tr>
          )}
          {deliveries.map(d => (
            <tr
              key={d.id}
              onClick={() => onSelect(d)}
              className={[
                'cursor-pointer transition-colors duration-150',
                selectedId === d.id
                  ? 'bg-brand-500/5 border-l-2 border-l-brand-500'
                  : 'hover:bg-gray-50',
              ].join(' ')}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="font-mono text-[12px] font-semibold text-gray-900">{d.containerSerial}</p>
                    <p className="text-[11px] text-gray-500">{d.containerType}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">{d.contractorName}</td>
              <td className="px-4 py-3 text-gray-600 text-[12px]">{d.expectedArrival}</td>
              <td className="px-4 py-3">
                {d.anomalies.length === 0 ? (
                  <span className="text-gray-400 text-[12px]">—</span>
                ) : (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    d.anomalies.some(a => a.severity === 'Critical')
                      ? 'bg-red-50 text-red-700'
                      : d.anomalies.some(a => a.severity === 'Major')
                      ? 'bg-orange-50 text-orange-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <AlertTriangle size={10} />
                    {d.anomalies.length} {d.anomalies.length === 1 ? 'issue' : 'issues'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${DELIVERY_STATUS_BADGE[d.status]}`}>
                  {STATUS_ICON[d.status]}
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
