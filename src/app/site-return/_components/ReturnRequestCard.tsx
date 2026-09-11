'use client'

import { Package, Clock, Ship, XCircle } from 'lucide-react'
import {
  type ReturnRequest,
  STATUS_LABEL, STATUS_STYLE,
  DISPOSITION_LABEL, CATEGORY_LABEL, CATEGORY_COLOR, DISPOSITION_COLOR,
} from '@/lib/return-store'

interface Props {
  request: ReturnRequest
}

export function ReturnRequestCard({ request }: Props) {
  const statusStyle = STATUS_STYLE[request.status]
  const statusLabel = STATUS_LABEL[request.status]

  return (
    <div className="bg-white rounded-card border border-border-default shadow-card p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-gray-900">{request.id}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500">{request.orderId}</span>
          </div>
          <p className="text-xs text-gray-400">
            Submitted {new Date(request.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>

      {/* Items summary */}
      <div className="space-y-2 mb-3">
        {request.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <Package size={11} className="text-gray-300 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 font-medium leading-tight">{item.description}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.qty} {item.unit}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${CATEGORY_COLOR[item.category]}`}>
                {CATEGORY_LABEL[item.category]}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${DISPOSITION_COLOR[item.disposition]}`}>
                {DISPOSITION_LABEL[item.disposition]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {request.notes && (
        <p className="text-[11px] text-gray-500 italic border-t border-border-default pt-2 mb-3">
          "{request.notes}"
        </p>
      )}

      {/* Vessel Coordinator response */}
      {request.status === 'approved' && request.vessel && (
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 text-xs text-teal-700">
          <Ship size={12} className="shrink-0" />
          <span className="font-semibold">{request.vessel}</span>
          <span className="text-teal-500">·</span>
          <span>Allocated {request.allocatedDate}</span>
        </div>
      )}

      {request.status === 'rejected' && request.rejectionReason && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
          <XCircle size={12} className="shrink-0 mt-0.5" />
          <span>{request.rejectionReason}</span>
        </div>
      )}

      {request.status === 'deckspace_requested' && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
          <Clock size={12} className="shrink-0" />
          <span>Awaiting deckspace allocation from Vessel Coordinator</span>
        </div>
      )}
    </div>
  )
}
