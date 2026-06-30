'use client'

import { FileText } from 'lucide-react'
import { StagePill, TypeBadge } from '@/components/domain/Pills'
import { type WorkOrder } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'
import { type TRDocumentData } from '@/components/domain/TRDocument'
import { makeTRData } from './trDocument'

const TABLE_HEADERS = ['Delivery No.', 'Destination', 'Type', 'Stage', 'Assigned To', 'Elapsed', 'SLA Status', '']

interface OrdersTableProps {
  orders: WorkOrder[]
  selectedOrderId: string | null
  onSelectOrder: (id: string) => void
  onPreviewTR: (data: TRDocumentData) => void
}

export function OrdersTable({ orders, selectedOrderId, onSelectOrder, onPreviewTR }: OrdersTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-border-default">
            {TABLE_HEADERS.map(h => (
              <th
                key={h}
                className="text-left whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const sla = STAGE_SLA_HOURS[order.stage]
            const breached = sla != null && order.elapsedHours > sla
            const warning = sla != null && !breached && order.elapsedHours / sla >= 0.75
            return (
              <tr
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                className={`cursor-pointer border-b border-gray-100 transition-colors duration-150 ${
                  selectedOrderId === order.id ? 'bg-red-50/50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono text-xs font-semibold text-brand-500">{order.id}</span>
                </td>
                <td className="px-4 py-3 max-w-45 truncate text-gray-700">{order.destination}</td>
                <td className="px-4 py-3 whitespace-nowrap"><TypeBadge type={order.requestType} /></td>
                <td className="px-4 py-3 whitespace-nowrap"><StagePill stage={order.stage as Stage} /></td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{order.assignedToName ?? <span className="text-gray-400 italic">Unassigned</span>}</td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">{fmtHours(order.elapsedHours)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {!sla ? (
                    <span className="text-gray-400 text-xs">-</span>
                  ) : breached ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-critical bg-status-critical-bg px-2 py-0.5 rounded-full">
                      BREACHED +{fmtHours(order.elapsedHours - sla)}
                    </span>
                  ) : warning ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-medium bg-status-medium-bg px-2 py-0.5 rounded-full">
                      WARNING {fmtHours(order.elapsedHours)} / {fmtHours(sla)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-low bg-status-low-bg px-2 py-0.5 rounded-full">
                      ON TRACK {fmtHours(order.elapsedHours)} / {fmtHours(sla)}
                    </span>
                  )}
                </td>
                {/* TR document button */}
                <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  {order.requestType === 'TR' && (
                    <button type="button" onClick={() => onPreviewTR(makeTRData(order))}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-2 py-0.5 rounded transition-colors">
                      <FileText size={11}/> TR Doc
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {orders.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-12">No work orders match the current filters</p>
      )}
    </div>
  )
}
