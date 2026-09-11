'use client'

import { useState, useMemo } from 'react'
import { RotateCcw, Package, Clock, CheckCircle, AlertTriangle, Mail, Calendar, Ship } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { type WorkOrder, ORG_USERS } from '@/lib/mock-data'
import { LIVE_ORDERS } from '@/lib/workflow-store'
import {
  RETURN_REQUESTS, submitReturnRequest,
  type ReturnLineItem, type ReturnRequest,
} from '@/lib/return-store'
import { ReturnWorkflowPanel } from './_components/ReturnWorkflowPanel'
import { ReturnRequestCard } from './_components/ReturnRequestCard'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysUntil(iso: string): number {
  const now  = new Date(); now.setHours(0, 0, 0, 0)
  const then = new Date(iso); then.setHours(0, 0, 0, 0)
  return Math.round((then.getTime() - now.getTime()) / 86400000)
}

function requesterEmail(name?: string): string | null {
  if (!name) return null
  const user = ORG_USERS.find(u => u.name.toLowerCase() === name.toLowerCase())
  return user?.email ?? null
}

function returnUrgencyClass(days: number): string {
  if (days < 0)  return 'bg-red-100 text-red-800 border-red-300'
  if (days <= 3) return 'bg-orange-100 text-orange-800 border-orange-300'
  if (days <= 7) return 'bg-amber-100 text-amber-800 border-amber-300'
  return 'bg-green-100 text-green-800 border-green-300'
}

export default function SiteReturnDashboard() {
  const [processingOrder, setProcessingOrder] = useState<WorkOrder | null>(null)
  const [returnRequests, setReturnRequests]   = useState<ReturnRequest[]>(RETURN_REQUESTS)

  const completedOrders    = LIVE_ORDERS.filter(o => o.stage === 'Completed')
  const submittedOrderIds  = new Set(returnRequests.map(r => r.orderId))
  const pendingOrders      = useMemo(
    () => completedOrders.filter(o => !submittedOrderIds.has(o.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [returnRequests]
  )

  const awaitingCount = returnRequests.filter(r => r.status === 'deckspace_requested').length
  const approvedCount = returnRequests.filter(r => r.status === 'approved').length

  function handleSubmit(orderId: string, items: ReturnLineItem[], notes: string) {
    const order = completedOrders.find(o => o.id === orderId)
    if (!order) return
    submitReturnRequest({
      orderId,
      workOrderNumber: order.workOrderNumber,
      site: order.destination,
      submittedAt: new Date().toISOString(),
      submittedBy: 'Tunde Oghenekaro',
      status: 'deckspace_requested',
      items,
      notes,
      vessel: null,
      allocatedDate: null,
      rejectionReason: null,
    })
    setReturnRequests([...RETURN_REQUESTS])
    setProcessingOrder(null)
  }

  return (
    <AppShell
      role="site_return"
      currentPath="/site-return"
      title="Returns Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Returns Dashboard' }]}
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Completed Orders"   value={completedOrders.length} color="#14B8A6" icon={Package}       />
        <StatCard label="Pending Return"     value={pendingOrders.length}   color="#D97706" icon={AlertTriangle} />
        <StatCard label="Awaiting Deckspace" value={awaitingCount}          color="#F59E0B" icon={Clock}         />
        <StatCard label="Deckspace Approved" value={approvedCount}          color="#16A34A" icon={CheckCircle}   />
      </div>

      {/* Completed orders pending return */}
      <section className="mb-8">
        <SectionTitle title="Completed Orders — Pending Return" count={pendingOrders.length} className="mb-4" />

        {pendingOrders.length === 0 ? (
          <div className="bg-white rounded-card border border-border-default shadow-card px-5 py-10 text-center">
            <RotateCcw size={28} className="mx-auto mb-2 text-teal-300" />
            <p className="text-sm font-semibold text-gray-500">All completed orders have been submitted for return.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingOrders.map(order => {
              const email     = requesterEmail(order.requestedByName)
              const retDate   = order.returnDate
              const days      = retDate ? daysUntil(retDate) : null
              const overdue   = days !== null && days < 0
              const urgClass  = retDate ? returnUrgencyClass(days!) : ''

              const subject   = encodeURIComponent(`Equipment Return Reminder — ${order.id}`)
              const body      = encodeURIComponent(
                `Dear ${order.requestedByName ?? 'Team'},\n\nThis is a reminder that the equipment from delivery ${order.id} (${order.destination}) is due for return${retDate ? ` by ${fmtDate(retDate)}` : ''}.\n\nPlease arrange for the return of the following items:\n${order.items.map(i => `- ${i.qty} ${i.unit} ${i.description}`).join('\n')}\n\nKindly confirm receipt of this message.\n\nRegards,\nEquipTrack Returns`
              )
              const mailtoHref = email ? `mailto:${email}?subject=${subject}&body=${body}` : null

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-card border shadow-card flex flex-col overflow-hidden ${overdue ? 'border-red-300' : 'border-border-default'}`}
                >
                  {/* Overdue banner */}
                  {overdue && (
                    <div className="bg-red-500 px-4 py-1.5 flex items-center gap-2">
                      <AlertTriangle size={12} className="text-white" />
                      <span className="text-xs font-bold text-white">OVERDUE — Return was due {Math.abs(days!)} day{Math.abs(days!) !== 1 ? 's' : ''} ago</span>
                    </div>
                  )}

                  {/* Card header */}
                  <div className="px-4 pt-4 pb-3 border-b border-border-default/60">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-mono text-sm font-bold text-brand-500">{order.id}</span>
                        <span className="ml-2 text-xs text-gray-400">{order.workOrderNumber}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.urgency === 'Urgent' ? 'bg-red-100 text-red-700' :
                        order.urgency === 'High'   ? 'bg-orange-100 text-orange-700' :
                        order.urgency === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                     'bg-green-100 text-green-700'
                      }`}>{order.urgency}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{order.destination}</p>
                    <p className="text-xs text-gray-500">{order.requestType} · {order.entity ?? '—'}</p>
                  </div>

                  {/* Expected return date — prominent */}
                  {retDate ? (
                    <div className={`px-4 py-2.5 flex items-center justify-between border-b border-border-default/60 ${urgClass} border-l-4`}>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Expected Return Date</p>
                          <p className="text-sm font-bold">{fmtDate(retDate)}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs font-semibold">
                        {days === 0 ? 'Due today' :
                         days! < 0  ? `${Math.abs(days!)}d overdue` :
                                      `${days}d remaining`}
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-border-default/60 flex items-center gap-1.5">
                      <Calendar size={12} />
                      No return date specified
                    </div>
                  )}

                  {/* Requester + email */}
                  <div className="px-4 py-2.5 border-b border-border-default/60 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Requester</p>
                      <p className="text-sm font-semibold text-gray-900">{order.requestedByName ?? '—'}</p>
                      {email && <p className="text-xs text-gray-500 font-mono">{email}</p>}
                    </div>
                    {mailtoHref && (
                      <a
                        href={mailtoHref}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-button bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shrink-0"
                        title={`Send return reminder to ${email}`}
                      >
                        <Mail size={12} />
                        Send Reminder
                      </a>
                    )}
                  </div>

                  {/* Container + vessel */}
                  {(order.containerId || order.allocatedVessel || order.waybillNumber) && (
                    <div className="px-4 py-2 border-b border-border-default/60 flex flex-wrap gap-3 text-xs">
                      {order.containerId && (
                        <span className="flex items-center gap-1 font-mono font-semibold text-gray-700">
                          <Package size={11} className="text-gray-400" />
                          {order.containerId}
                        </span>
                      )}
                      {order.allocatedVessel && (
                        <span className="flex items-center gap-1 text-gray-600">
                          <Ship size={11} className="text-gray-400" />
                          {order.allocatedVessel}
                        </span>
                      )}
                      {order.waybillNumber && (
                        <span className="font-mono text-gray-400">{order.waybillNumber}</span>
                      )}
                    </div>
                  )}

                  {/* Items */}
                  <div className="px-4 py-2 flex-1 space-y-0.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Package size={9} className="text-gray-300 shrink-0" />
                          {item.description}
                        </span>
                        <span className="text-gray-400 ml-2 shrink-0">{item.qty} {item.unit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="px-4 py-3 border-t border-border-default flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">{order.waybillNumber ?? ''}</span>
                    <button
                      type="button"
                      onClick={() => setProcessingOrder(order)}
                      className="h-8 px-4 rounded-button bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Process Return
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Submitted return requests */}
      <section>
        <SectionTitle title="Return Requests" count={returnRequests.length} className="mb-4" />
        {returnRequests.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No return requests submitted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...returnRequests].reverse().map(req => (
              <ReturnRequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </section>

      {processingOrder && (
        <ReturnWorkflowPanel
          order={processingOrder}
          onClose={() => setProcessingOrder(null)}
          onSubmit={handleSubmit}
        />
      )}
    </AppShell>
  )
}
