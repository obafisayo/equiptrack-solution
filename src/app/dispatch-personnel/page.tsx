'use client'

import { useState } from 'react'
import { ClipboardCheck, ShieldCheck, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, type WorkOrder } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

// Simulated logged-in dispatch personnel
const MY_ID = 'DP1'
const MY_NAME = 'Biodun Adekunle'

interface WaybillDialogProps {
  order: WorkOrder
  onConfirm: () => void
  onClose: () => void
}

function WaybillDialog({ order, onConfirm, onClose }: WaybillDialogProps) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-md mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Generate Waybill</h2>
        <p className="text-xs text-gray-500 mb-4">Review details before generating the official waybill document.</p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery No.</span>
            <span className="font-mono font-semibold text-brand-500">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Destination</span>
            <span className="font-medium text-gray-900">{order.destination}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Container</span>
            <span className="font-mono font-semibold text-gray-700">{order.containerId ?? 'â€”'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Request Type</span>
            <span className="font-medium text-gray-900">{order.requestType}</span>
          </div>
        </div>

        {order.items.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-700">
                  <span className="truncate flex-1">{item.description}</span>
                  <span className="ml-2 text-gray-500">{item.qty} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={onConfirm}>Generate &amp; Print</Button>
        </div>
      </div>
    </div>
  )
}

export default function DispatchPersonnelTasksPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(
    WORK_ORDERS.filter(o =>
      o.assignedTo === MY_ID &&
      ['Dispatch Assigned', 'Containerization', 'Waybill Pending Signature', 'Waybill Done'].includes(o.stage)
    )
  )
  const [waybillOrder, setWaybillOrder] = useState<WorkOrder | null>(null)

  const assigned         = orders.filter(o => o.stage === 'Dispatch Assigned')
  const packing          = orders.filter(o => o.stage === 'Containerization')
  const waybillPending   = orders.filter(o => o.stage === 'Waybill Pending Signature')
  const waybillDone      = orders.filter(o => o.stage === 'Waybill Done')

  function advanceStage(orderId: string, nextStage: Stage) {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
            ...o,
            stage: nextStage,
            elapsedHours: 0,
            stageHistory: [
              ...o.stageHistory,
              { stage: o.stage, personId: MY_ID, personName: MY_NAME, startedAt: new Date(Date.now() - o.elapsedHours * 3600000).toISOString(), endedAt: new Date().toISOString(), durationHours: o.elapsedHours },
            ],
          }
        : o
    ))
  }

  function handleMoveToDeckspace(orderId: string) {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  return (
    <AppShell
      role="dsp_per"
      currentPath="/dispatch-personnel"
      title="My Tasks"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'My Tasks' }]}
      actionLabel="View History"
      actionHref="/dispatch-personnel/history"
    >
      {/* STAT ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="My Active Tasks"  value={assigned.length + packing.length} color="#8B5CF6" icon={ClipboardCheck} />
        <StatCard label="Awaiting QAQC"    value={packing.length}                   color="#F59E0B" icon={ShieldCheck} />
        <StatCard label="Waybills Pending" value={waybillPending.length}            color="#3B82F6" icon={FileText} />
      </div>

      {/* ASSIGNED TASKS */}
      <section className="mb-8">
        <SectionTitle title="Assigned Tasks" count={assigned.length} />
        {assigned.length === 0 && (
          <p className="text-sm text-gray-400 mt-3">No tasks assigned to you yet.</p>
        )}
        <div className="space-y-3 mt-3">
          {assigned.map(o => {
            const slaHrs = STAGE_SLA_HOURS[o.stage]
            const hasContainer = !!o.containerId
            return (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                      <StagePill stage={o.stage} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{o.destination}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.items.length} item{o.items.length !== 1 ? 's' : ''} Â· {o.requestType}</p>
                    {slaHrs && (
                      <div className="mt-2">
                        <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} showLabel />
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {hasContainer ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => advanceStage(o.id, 'Containerization')}
                      >
                        Start Packing
                      </Button>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-medium">
                        Awaiting Container
                      </span>
                    )}
                  </div>
                </div>
                {o.containerId && (
                  <p className="mt-2 text-xs text-gray-500">Container: <span className="font-mono font-semibold text-gray-700">{o.containerId}</span></p>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* PACKING IN PROGRESS */}
      <section className="mb-8">
        <SectionTitle title="Packing in Progress" count={packing.length} />
        <div className="space-y-3 mt-3">
          {packing.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Container: <span className="font-mono font-semibold text-gray-700">{o.containerId ?? 'â€”'}</span>
                    {' Â· '}Packing for {fmtHours(o.elapsedHours)}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => advanceStage(o.id, 'Post QAQC')}
                >
                  Submit for QAQC
                </Button>
              </div>
            </Card>
          ))}
          {packing.length === 0 && <p className="text-sm text-gray-400 mt-3">No containers being packed.</p>}
        </div>
      </section>

      {/* WAYBILL GENERATION */}
      <section className="mb-8">
        <SectionTitle title="Waybill Generation" count={waybillPending.length} />
        <div className="space-y-3 mt-3">
          {waybillPending.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Container: <span className="font-mono font-semibold text-gray-700">{o.containerId ?? 'â€”'}</span>
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setWaybillOrder(o)}
                >
                  Generate Waybill
                </Button>
              </div>
            </Card>
          ))}
          {waybillPending.length === 0 && <p className="text-sm text-gray-400 mt-3">No waybills pending.</p>}
        </div>
      </section>

      {/* AWAITING DECKSPACE */}
      <section className="mb-8">
        <SectionTitle title="Awaiting Deckspace" count={waybillDone.length} />
        <div className="space-y-3 mt-3">
          {waybillDone.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { advanceStage(o.id, 'Awaiting Deckspace'); handleMoveToDeckspace(o.id) }}
                >
                  Move to Deckspace
                </Button>
              </div>
            </Card>
          ))}
          {waybillDone.length === 0 && <p className="text-sm text-gray-400 mt-3">No orders awaiting deckspace.</p>}
        </div>
      </section>

      {/* WAYBILL DIALOG */}
      {waybillOrder && (
        <WaybillDialog
          order={waybillOrder}
          onClose={() => setWaybillOrder(null)}
          onConfirm={() => {
            advanceStage(waybillOrder.id, 'Waybill Done')
            setWaybillOrder(null)
          }}
        />
      )}
    </AppShell>
  )
}
