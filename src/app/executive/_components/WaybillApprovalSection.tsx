'use client'

import { useState } from 'react'
import { FileText, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, AlertTriangle, Package } from 'lucide-react'
import { LIVE_ORDERS, approveWaybill, rejectWaybill } from '@/lib/workflow-store'
import type { WorkOrder } from '@/lib/mock-data'

const URGENCY_COLOR: Record<string, string> = {
  Urgent: 'text-red-600 bg-red-50 border-red-200',
  High:   'text-orange-600 bg-orange-50 border-orange-200',
  Medium: 'text-amber-600 bg-amber-50 border-amber-200',
  Low:    'text-green-600 bg-green-50 border-green-200',
}

function fmtElapsed(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export function WaybillApprovalSection() {
  const [pendingOrders, setPendingOrders] = useState<WorkOrder[]>(() =>
    LIVE_ORDERS.filter(o => o.stage === 'Waybill Pending Signature' && o.waybillNumber && o.waybillApproved === false)
  )
  const [collapsed,    setCollapsed]    = useState(false)
  const [rejectingId,  setRejectingId]  = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  function refresh() {
    setPendingOrders(
      LIVE_ORDERS.filter(o => o.stage === 'Waybill Pending Signature' && o.waybillNumber && o.waybillApproved === false)
    )
  }

  function handleApprove(id: string) {
    approveWaybill(id)
    refresh()
  }

  function handleReject(id: string) {
    if (!rejectReason.trim()) return
    rejectWaybill(id, rejectReason.trim())
    setRejectingId(null)
    setRejectReason('')
    refresh()
  }

  const count = pendingOrders.length

  return (
    <div className={`bg-white rounded-card border shadow-card mb-5 overflow-hidden ${count > 0 ? 'border-blue-300' : 'border-border-default'}`}>
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        className={`w-full flex items-center justify-between px-5 py-3.5 transition-colors ${
          count > 0 ? 'bg-blue-50 hover:bg-blue-100/60' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {count > 0
            ? <AlertTriangle size={15} className="text-blue-600 shrink-0" />
            : <CheckCircle   size={15} className="text-green-500 shrink-0" />
          }
          <span className="text-sm font-bold text-gray-900">Waybill Approvals</span>
          {count > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {count}
            </span>
          )}
          {count === 0 && (
            <span className="text-xs text-gray-500">No pending waybill approvals</span>
          )}
        </div>
        {collapsed ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronUp size={15} className="text-gray-400" />}
      </button>

      {!collapsed && count > 0 && (
        <div className="divide-y divide-border-default/60">
          {pendingOrders.map(order => (
            <div key={order.id} className="px-5 py-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-sm font-bold text-gray-900">{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${URGENCY_COLOR[order.urgency]}`}>
                      {order.urgency}
                    </span>
                    {order.entity && (
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-semibold">
                        {order.entity}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock size={10} />
                      {fmtElapsed(order.elapsedHours)} waiting
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-medium text-gray-700">{order.requestedByName}</span>
                    <span className="text-gray-300 mx-1.5">·</span>
                    <span>{order.destination}</span>
                    <span className="text-gray-300 mx-1.5">·</span>
                    <span className="font-mono text-gray-600">{order.waybillNumber}</span>
                  </p>

                  {order.containerId && (
                    <p className="text-xs text-gray-500 mb-2">
                      Container: <span className="font-mono font-semibold text-gray-700">{order.containerId}</span>
                    </p>
                  )}

                  <div className="space-y-0.5">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-[11px] text-gray-600 flex items-center gap-1.5">
                        <Package size={9} className="text-gray-300 shrink-0" />
                        <span className="font-medium">{item.qty} {item.unit}</span>
                        <span className="text-gray-400">—</span>
                        {item.description}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApprove(order.id)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-button bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-colors"
                  >
                    <CheckCircle size={12} />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRejectingId(order.id); setRejectReason('') }}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-button border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                  >
                    <XCircle size={12} />
                    Reject
                  </button>
                </div>
              </div>

              {rejectingId === order.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-bold text-red-700 mb-2">Rejection reason</p>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    rows={2}
                    placeholder="Explain why this waybill is being rejected…"
                    className="w-full text-xs border border-red-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-400/30"
                  />
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setRejectingId(null)} className="flex-1 h-8 rounded-button border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(order.id)}
                      disabled={!rejectReason.trim()}
                      className="flex-1 h-8 rounded-button bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
