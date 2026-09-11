'use client'

import { useState } from 'react'
import { FileText, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { LIVE_ORDERS, approveOrder, rejectOrder } from '@/lib/workflow-store'
import type { WorkOrder } from '@/lib/mock-data'
import { TRDocument } from './TRDocument'
import { CoordinatorSettings } from './CoordinatorSettings'

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

export function TRApprovalSection() {
  const [pendingOrders, setPendingOrders] = useState<WorkOrder[]>(() =>
    LIVE_ORDERS.filter(o => o.stage === 'Pending Base Coordinator Approval' && o.status !== 'rejected')
  )
  const [collapsed,    setCollapsed]    = useState(false)
  const [rejectingId,  setRejectingId]  = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [viewingTR,    setViewingTR]    = useState<WorkOrder | null>(null)

  function refresh() {
    setPendingOrders(LIVE_ORDERS.filter(o =>
      o.stage === 'Pending Base Coordinator Approval' && o.status !== 'rejected'
    ))
  }

  function handleApprove(id: string) {
    approveOrder(id)
    refresh()
  }

  function handleReject(id: string) {
    if (!rejectReason.trim()) return
    rejectOrder(id, rejectReason.trim())
    setRejectingId(null)
    setRejectReason('')
    refresh()
  }

  const count = pendingOrders.length

  return (
    <>
      {/* Section header — always shown */}
      <div className={`bg-white rounded-card border shadow-card mb-5 overflow-hidden ${count > 0 ? 'border-amber-300' : 'border-border-default'}`}>
        <div className={`flex items-center justify-between px-5 py-3.5 transition-colors ${count > 0 ? 'bg-amber-50' : ''}`}>
          {/* Left: click to toggle collapse */}
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            className="flex items-center gap-2.5 flex-1 text-left"
          >
            {count > 0
              ? <AlertTriangle size={15} className="text-amber-600 shrink-0" />
              : <CheckCircle   size={15} className="text-green-500 shrink-0" />
            }
            <span className="text-sm font-bold text-gray-900">TR Approvals</span>
            {count > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                {count}
              </span>
            )}
            {count === 0 && (
              <span className="text-xs text-gray-500">No pending Temporary Requisitions</span>
            )}
          </button>
          {/* Right: settings + chevron — siblings, no nesting */}
          <div className="flex items-center gap-2">
            <CoordinatorSettings />
            <button
              type="button"
              onClick={() => setCollapsed(c => !c)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            </button>
          </div>
        </div>

        {!collapsed && count > 0 && (
          <div className="divide-y divide-border-default/60">
            {pendingOrders.map(order => (
              <div key={order.id} className="px-5 py-4">
                <div className="flex items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-sm font-bold text-gray-900">{order.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${URGENCY_COLOR[order.urgency]}`}>
                        {order.urgency}
                      </span>
                      {order.trDepartment && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {order.trDepartment}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Clock size={10} />
                        {fmtElapsed(order.elapsedHours)} waiting
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-medium text-gray-700">{order.requestedByName}</span>
                      <span className="text-gray-300 mx-1.5">·</span>
                      <span>{order.destination}</span>
                      <span className="text-gray-300 mx-1.5">·</span>
                      <span>{order.workOrderNumber}</span>
                    </p>

                    {/* Items summary */}
                    <div className="space-y-0.5">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-[11px] text-gray-600">
                          <span className="font-medium">{item.qty} {item.unit}</span>
                          <span className="text-gray-400 mx-1">—</span>
                          {item.description}
                          {item.plant && <span className="text-gray-400 ml-1">[{item.plant}{item.binLoc ? `/${item.binLoc}` : ''}]</span>}
                        </p>
                      ))}
                    </div>

                    {order.notes && (
                      <p className="text-[11px] text-gray-400 italic mt-1.5">"{order.notes}"</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewingTR(order)}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-button border border-brand-300 text-brand-600 text-xs font-semibold hover:bg-brand-tint transition-colors"
                    >
                      <FileText size={12} />
                      View TR Doc
                    </button>
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

                {/* Inline rejection reason */}
                {rejectingId === order.id && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs font-bold text-red-700 mb-2">Rejection reason</p>
                    <textarea
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      rows={2}
                      placeholder="Explain why this TR is being rejected…"
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

      {viewingTR && (
        <TRDocument order={viewingTR} onClose={() => setViewingTR(null)} />
      )}
    </>
  )
}
