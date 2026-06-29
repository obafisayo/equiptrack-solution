/* eslint-disable */
'use client'

import { useState } from 'react'
import { X, Anchor, Package, AlertTriangle, Navigation } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard }   from '@/components/domain/StatCard'
import { Card }       from '@/components/ui/Card'
import { Button }     from '@/components/ui/Button'
import { StagePill }  from '@/components/domain/Pills'
import { WORK_ORDERS, VESSELS, type WorkOrder, type Vessel, type VesselStatus, sortNewestFirst } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'

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
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Allocate Deck Space</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Assign a vessel for <span className="font-mono font-bold text-brand-500">{order.id}</span> → {order.destination}
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
            <X size={17}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Order info */}
          <div className="bg-neutral-50 border border-border-default rounded-xl p-4 mb-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Request Summary</p>
            <div className="grid grid-cols-2 gap-y-1.5 text-xs">
              <span className="text-neutral-500">Order</span><span className="font-mono font-bold text-brand-500">{order.id}</span>
              <span className="text-neutral-500">Destination</span><span className="font-semibold text-neutral-800">{order.destination}</span>
              <span className="text-neutral-500">Items</span><span className="font-semibold text-neutral-800">{order.items.length} item{order.items.length!==1?'s':''}</span>
              <span className="text-neutral-500">Urgency</span><span className="font-semibold capitalize text-neutral-800">{order.urgency}</span>
            </div>
          </div>

          {/* Vessel list */}
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
                  <button
                    key={v.id} type="button"
                    onClick={() => setSelected(v.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${selected===v.id?'border-brand-500 bg-brand-50':'border-border-default hover:border-neutral-300'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-neutral-900">{v.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">{v.port} → {v.destination} · Departs {v.departure}</p>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full ${cfg.bar}`} style={{width:`${pct}%`}}/>
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

export default function VesselRequests() {
  const [vessels, setVessels]       = useState<Vessel[]>(VESSELS)
  const [requests, setRequests]     = useState<WorkOrder[]>(() =>
    sortNewestFirst(WORK_ORDERS.filter(o => o.stage === 'Awaiting Deckspace'))
  )
  const [allocating, setAllocating] = useState<WorkOrder | null>(null)

  function handleAllocate(orderId: string, vesselId: string) {
    setRequests(prev => prev.filter(o => o.id !== orderId))
    setVessels(prev => prev.map(v =>
      v.id === vesselId
        ? { ...v, allocatedUnits: v.allocatedUnits + 1, status: v.status === 'available' ? 'loading' : v.status }
        : v
    ))
    setAllocating(null)
  }

  const awaitingCount  = requests.length
  const availableCount = vessels.filter(v => v.status === 'available').length
  const loadingCount   = vessels.filter(v => v.status === 'loading').length
  const inTransit      = vessels.filter(v => v.status === 'in-transit').length

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics/requests"
      title="Vessel Requests"
      breadcrumb={[{label:'Home',href:'/'},{label:'Logistics'},{label:'Vessel Requests'}]}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Awaiting Allocation" value={awaitingCount}  color={awaitingCount>0?'#F97316':'#22C55E'} icon={AlertTriangle}/>
        <StatCard label="Vessels Available"   value={availableCount} color="#22C55E" icon={Navigation}/>
        <StatCard label="Currently Loading"   value={loadingCount}   color="#F59E0B" icon={Package}/>
        <StatCard label="In Transit"          value={inTransit}      color="#3B82F6" icon={Anchor}/>
      </div>

      {/* Requests */}
      <div className="space-y-3">
        {requests.length === 0 ? (
          <div className="bg-white rounded-card border border-border-default shadow-card py-16 text-center">
            <Anchor size={36} className="mx-auto text-neutral-200 mb-3" strokeWidth={1.5}/>
            <p className="text-sm font-semibold text-neutral-400">All requests have been allocated</p>
          </div>
        ) : (
          requests.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage as Stage}/>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">{o.destination}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {o.items.length} item{o.items.length!==1?'s':''} · {o.requestType} · {o.urgency} urgency
                    {o.waybillNumber && ` · Waybill ${o.waybillNumber}`}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">Pending action by {o.assignedToName ?? 'Logistics'}</p>
                </div>
                <Button variant="brand" size="sm" onClick={() => setAllocating(o)}>
                  Allocate Vessel
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {allocating && (
        <AllocatePanel
          order={allocating} vessels={vessels}
          onAllocate={handleAllocate} onClose={() => setAllocating(null)}
        />
      )}
    </AppShell>
  )
}
