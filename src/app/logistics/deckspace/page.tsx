'use client'

import { useState } from 'react'
import { Anchor, Package, Clock, CheckCircle, XCircle, Navigation, AlertTriangle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StagePill } from '@/components/domain/Pills'
import { type Stage } from '@/lib/lifecycle'
import { VESSELS, type WorkOrder, type Vessel, type VesselStatus, sortNewestFirst } from '@/lib/mock-data'
import { LIVE_ORDERS, allocateDeckspace } from '@/lib/workflow-store'
import {
  RETURN_REQUESTS, updateReturnRequest,
  STATUS_LABEL, STATUS_STYLE,
  DISPOSITION_LABEL, CATEGORY_LABEL, CATEGORY_COLOR, DISPOSITION_COLOR,
  type ReturnRequest,
} from '@/lib/return-store'
import { ApproveModal } from './_components/ApproveModal'

// ── Vessel allocate panel (outbound) ──────────────────────────────────────────

const VST_CFG: Record<VesselStatus, { label: string; badge: string; bar: string }> = {
  available:    { label: 'Available',  badge: 'bg-green-50 text-green-700 border border-green-200', bar: 'bg-green-500' },
  loading:      { label: 'Loading',    badge: 'bg-amber-50 text-amber-700 border border-amber-200', bar: 'bg-amber-500' },
  full:         { label: 'Full',       badge: 'bg-red-50 text-red-700 border border-red-200',       bar: 'bg-red-500'   },
  'in-transit': { label: 'In Transit', badge: 'bg-blue-50 text-blue-700 border border-blue-200',    bar: 'bg-blue-500'  },
  arrived:      { label: 'Arrived',    badge: 'bg-gray-50 text-gray-600 border border-gray-200',    bar: 'bg-gray-400'  },
}

function AllocatePanel({ order, vessels, onAllocate, onClose }: {
  order: WorkOrder; vessels: Vessel[]
  onAllocate: (orderId: string, vesselId: string) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const eligible = vessels.filter(v => v.status === 'available' || v.status === 'loading')

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-110 bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Allocate Deck Space</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Assign a vessel for <span className="font-mono font-bold text-brand-500">{order.id}</span> → {order.destination}
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
            <XCircle size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-neutral-50 border border-border-default rounded-xl p-4 mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Request Summary</p>
            <div className="grid grid-cols-2 gap-y-1.5 text-xs">
              <span className="text-neutral-500">Order</span><span className="font-mono font-bold text-brand-500">{order.id}</span>
              <span className="text-neutral-500">Destination</span><span className="font-semibold text-neutral-800">{order.destination}</span>
              <span className="text-neutral-500">Items</span><span className="font-semibold text-neutral-800">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
              <span className="text-neutral-500">Urgency</span><span className="font-semibold capitalize text-neutral-800">{order.urgency}</span>
            </div>
          </div>

          <p className="text-sm font-bold text-neutral-700 mb-3">Available Vessels ({eligible.length})</p>
          {eligible.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-sm">No vessels available for allocation.</div>
          ) : (
            <div className="space-y-2">
              {eligible.map(v => {
                const cfg = VST_CFG[v.status]
                const pct = v.capacityUnits > 0 ? Math.round((v.allocatedUnits / v.capacityUnits) * 100) : 0
                const rem = v.capacityUnits - v.allocatedUnits
                return (
                  <button key={v.id} type="button" onClick={() => setSelected(v.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${selected === v.id ? 'border-brand-500 bg-brand-50' : 'border-border-default hover:border-neutral-300'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-neutral-900">{v.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">{v.port} → {v.destination} · Departs {v.departure}</p>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-neutral-400">{rem} of {v.capacityUnits} units remaining · {pct}% utilised</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-default flex gap-3 shrink-0">
          <Button variant="secondary" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="brand" size="md" fullWidth disabled={!selected}
            onClick={() => selected && onAllocate(order.id, selected)}>
            Confirm Allocation
          </Button>
        </div>
      </aside>
    </>
  )
}

// ── Outbound tab ──────────────────────────────────────────────────────────────

function OutboundTab() {
  const [vessels, setVessels]     = useState<Vessel[]>(VESSELS)
  const [requests, setRequests]   = useState<WorkOrder[]>(() =>
    sortNewestFirst(LIVE_ORDERS.filter(o => o.stage === 'Awaiting Deckspace'))
  )
  const [allocating, setAllocating] = useState<WorkOrder | null>(null)

  function handleAllocate(orderId: string, vesselId: string) {
    const vessel = vessels.find(v => v.id === vesselId)
    if (!vessel) return
    allocateDeckspace(orderId, vessel.name)
    setRequests(prev => prev.map(o => o.id === orderId ? { ...o, allocatedVessel: vessel.name } : o))
    setVessels(prev => prev.map(v =>
      v.id === vesselId
        ? { ...v, allocatedUnits: v.allocatedUnits + 1, status: v.status === 'available' ? 'loading' : v.status }
        : v
    ))
    setAllocating(null)
  }

  return (
    <>
      {requests.length === 0 ? (
        <div className="bg-white rounded-card border border-border-default shadow-card py-16 text-center">
          <Anchor size={36} className="mx-auto text-neutral-200 mb-3" strokeWidth={1.5} />
          <p className="text-sm font-semibold text-neutral-400">All outbound orders have been allocated</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage as Stage} />
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">{o.destination}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.requestType} · {o.urgency} urgency
                    {o.waybillNumber && ` · Waybill ${o.waybillNumber}`}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">Pending action by {o.assignedToName ?? 'Logistics'}</p>
                </div>
                {o.allocatedVessel ? (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1 shrink-0">{o.allocatedVessel}</span>
                ) : (
                  <Button variant="brand" size="sm" onClick={() => setAllocating(o)}>
                    Allocate Space
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {allocating && (
        <AllocatePanel
          order={allocating} vessels={vessels}
          onAllocate={handleAllocate} onClose={() => setAllocating(null)}
        />
      )}
    </>
  )
}

// ── Returns tab ───────────────────────────────────────────────────────────────

function ReturnsTab() {
  const [requests, setRequests] = useState<ReturnRequest[]>([...RETURN_REQUESTS])
  const [selected, setSelected] = useState<ReturnRequest | null>(null)

  const pending  = requests.filter(r => r.status === 'deckspace_requested')
  const resolved = requests.filter(r => r.status !== 'deckspace_requested')

  function handleApprove(id: string, vessel: string, date: string) {
    updateReturnRequest(id, { status: 'approved', vessel, allocatedDate: date })
    setRequests([...RETURN_REQUESTS])
    setSelected(null)
  }

  function handleReject(id: string, reason: string) {
    updateReturnRequest(id, { status: 'rejected', rejectionReason: reason })
    setRequests([...RETURN_REQUESTS])
    setSelected(null)
  }

  return (
    <>
      <section className="mb-8">
        <SectionTitle title="Awaiting Allocation" count={pending.length} className="mb-4" />
        {pending.length === 0 ? (
          <div className="bg-white rounded-card border border-border-default shadow-card px-5 py-10 text-center">
            <CheckCircle size={28} className="mx-auto mb-2 text-green-300" />
            <p className="text-sm font-semibold text-gray-500">No pending return requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(req => (
              <ReturnRow key={req.id} request={req} onAction={() => setSelected(req)} />
            ))}
          </div>
        )}
      </section>

      {resolved.length > 0 && (
        <section>
          <SectionTitle title="Resolved" count={resolved.length} className="mb-4" />
          <div className="space-y-3">
            {[...resolved].reverse().map(req => (
              <ReturnRow key={req.id} request={req} onAction={null} />
            ))}
          </div>
        </section>
      )}

      {selected && (
        <ApproveModal
          request={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  )
}

function ReturnRow({ request, onAction }: { request: ReturnRequest; onAction: (() => void) | null }) {
  const statusStyle = STATUS_STYLE[request.status]
  const statusLabel = STATUS_LABEL[request.status]
  const isPending   = request.status === 'deckspace_requested'

  return (
    <div className={`bg-white rounded-card border shadow-card p-4 ${isPending ? 'border-amber-200' : 'border-border-default'}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-gray-900">{request.id}</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-500">{request.orderId}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {request.site} · Submitted {new Date(request.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} by {request.submittedBy}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle}`}>
            {statusLabel}
          </span>
          {onAction && (
            <button type="button" onClick={onAction}
              className="h-8 px-4 rounded-button bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors">
              Action
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {request.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 bg-slate-50 rounded-lg px-3 py-2">
            <Package size={11} className="text-gray-300 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 font-medium leading-tight truncate">{item.description}</p>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.qty} {item.unit}</p>
            </div>
            <div className="flex flex-col gap-0.5 shrink-0 items-end">
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
        <p className="text-[11px] text-gray-500 italic mb-3">"{request.notes}"</p>
      )}

      {request.status === 'approved' && request.vessel && (
        <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
          <CheckCircle size={12} className="shrink-0" />
          <span>Allocated to <strong>{request.vessel}</strong> on {request.allocatedDate}</span>
        </div>
      )}

      {request.status === 'rejected' && request.rejectionReason && (
        <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <XCircle size={12} className="shrink-0 mt-0.5" />
          <span>{request.rejectionReason}</span>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Tab = 'outbound' | 'returns'

export default function DeckSpacePage() {
  const [tab, setTab] = useState<Tab>('outbound')

  const outboundCount = LIVE_ORDERS.filter(o => o.stage === 'Awaiting Deckspace').length
  const returnCount   = RETURN_REQUESTS.filter(r => r.status === 'deckspace_requested').length
  const vessels       = VESSELS
  const availableCount = vessels.filter(v => v.status === 'available').length
  const loadingCount   = vessels.filter(v => v.status === 'loading').length

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics/deckspace"
      title="Deck Space"
      breadcrumb={[{ label: 'Logistics', href: '/logistics' }, { label: 'Deck Space' }]}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Outbound Awaiting"  value={outboundCount}  color={outboundCount > 0 ? '#D97706' : '#16A34A'} icon={AlertTriangle} />
        <StatCard label="Return Requests"    value={returnCount}    color={returnCount > 0 ? '#D97706' : '#16A34A'}   icon={Package}       />
        <StatCard label="Vessels Available"  value={availableCount} color="#16A34A"                                   icon={Navigation}    />
        <StatCard label="Currently Loading"  value={loadingCount}   color="#1A6FBF"                                   icon={Anchor}        />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-5 bg-white border border-border-default rounded-card p-1 w-fit shadow-card">
        {([
          { key: 'outbound', label: 'Outbound', count: outboundCount },
          { key: 'returns',  label: 'Returns',  count: returnCount   },
        ] as { key: Tab; label: string; count: number }[]).map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 h-8 px-4 rounded-lg text-xs font-semibold transition-colors ${
              tab === t.key
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ${
                tab === t.key ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'outbound' && <OutboundTab />}
      {tab === 'returns'  && <ReturnsTab />}
    </AppShell>
  )
}
