/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import { ClipboardCheck, ShieldCheck, FileText, Anchor, Package } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, VESSELS, type WorkOrder, type Vessel, sortNewestFirst } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

const MY_ID = 'DP1'
const MY_NAME = 'Biodun Adekunle'

type StageTab = 'Assigned' | 'Containerization' | 'Waybill Pending' | 'Waybill Done' | 'Awaiting Deckspace'

const STAGE_MAP: Record<StageTab, Stage[]> = {
  'Assigned':            ['Dispatch Assigned'],
  'Containerization':    ['Containerization'],
  'Waybill Pending':     ['Waybill Pending Signature'],
  'Waybill Done':        ['Waybill Done'],
  'Awaiting Deckspace':  ['Awaiting Deckspace'],
}

// ── Waybill dialog ────────────────────────────────────────────────────────────

interface WaybillDialogProps {
  order: WorkOrder
  onConfirm: () => void
  onClose: () => void
}

function WaybillDialog({ order, onConfirm, onClose }: WaybillDialogProps) {
  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
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
            <span className="font-mono font-semibold text-gray-700">{order.containerId ?? '—'}</span>
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

// ── Container pack dialog ─────────────────────────────────────────────────────

interface PackDialogProps {
  orders: WorkOrder[]
  onConfirm: (orderIds: string[]) => void
  onClose: () => void
}

function PackDialog({ orders, onConfirm, onClose }: PackDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  function toggle(id: string) {
    setError(null)
    const order = orders.find(o => o.id === id)!
    const newSet = new Set(selected)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      // Validate same destination
      if (newSet.size > 0) {
        const existingDest = orders.find(o => newSet.has(o.id))?.destination
        if (order.destination !== existingDest) {
          setError(`Cannot mix destinations — selected orders go to "${existingDest}". This order goes to "${order.destination}".`)
          return
        }
      }
      newSet.add(id)
    }
    setSelected(newSet)
  }

  function handleConfirm() {
    if (selected.size === 0) {
      setError('Select at least one order to pack.')
      return
    }
    onConfirm(Array.from(selected))
  }

  const destinations = [...new Set(orders.map(o => o.destination))]
  const selectedDest = selected.size > 0 ? orders.find(o => selected.has(o.id))?.destination : null

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
        <div className="px-6 py-5 border-b border-border-default">
          <h2 className="text-base font-semibold text-gray-900">Pack into Container</h2>
          <p className="text-xs text-gray-500 mt-0.5">Select orders going to the same destination to pack together.</p>
        </div>

        {destinations.length > 1 && (
          <div className="px-6 pt-4">
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              Orders are going to multiple destinations. Only orders with matching destinations can share a container.
            </p>
          </div>
        )}

        <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-2">
          {orders.map(o => {
            const isSelected = selected.has(o.id)
            const isDisabled = !isSelected && selectedDest != null && o.destination !== selectedDest

            return (
              <button
                key={o.id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggle(o.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md border transition-colors duration-150 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50'
                    : isDisabled
                    ? 'border-border-default bg-gray-50 opacity-40 cursor-not-allowed'
                    : 'border-border-default hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-900 text-sm">{o.id}</span>
                  <span className="text-xs text-gray-500">{o.requestType} · {o.urgency}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{o.destination} · {o.items.length} item{o.items.length !== 1 ? 's' : ''}</p>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="px-6 pb-2">
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          </div>
        )}

        {selectedDest && (
          <div className="px-6 pb-2">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">{selected.size}</span> order{selected.size !== 1 ? 's' : ''} selected &rarr; <span className="font-semibold text-gray-700">{selectedDest}</span>
            </p>
          </div>
        )}

        <div className="flex gap-3 px-6 py-4 border-t border-border-default">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={handleConfirm} disabled={selected.size === 0}>
            Pack {selected.size > 0 ? `${selected.size} Order${selected.size !== 1 ? 's' : ''}` : 'Orders'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Vessel request dialog ─────────────────────────────────────────────────────

interface VesselRequestDialogProps {
  order: WorkOrder
  onConfirm: (vesselId: string) => void
  onClose: () => void
}

const VESSEL_STATUS_STYLE: Record<string, { badge: string; label: string }> = {
  available:    { badge: 'bg-green-50 text-green-700 border border-green-200', label: 'Available' },
  loading:      { badge: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'Loading' },
  full:         { badge: 'bg-red-50   text-red-700   border border-red-200',   label: 'Full' },
  'in-transit': { badge: 'bg-gray-50  text-gray-600  border border-gray-200',  label: 'In Transit' },
  arrived:      { badge: 'bg-blue-50  text-blue-700  border border-blue-200',  label: 'Arrived' },
}

function VesselRequestDialog({ order, onConfirm, onClose }: VesselRequestDialogProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const eligible = VESSELS.filter(v =>
    (v.status === 'available' || v.status === 'loading') &&
    v.allocatedUnits < v.capacityUnits
  )

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
        <div className="px-6 py-5 border-b border-border-default">
          <h2 className="text-base font-semibold text-gray-900">Request Vessel Deckspace</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            <span className="font-mono font-semibold text-brand-500">{order.id}</span> &rarr; {order.destination}
          </p>
        </div>

        <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
          {eligible.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No vessels with available deckspace right now.</p>
          ) : (
            eligible.map(v => {
              const remaining = v.capacityUnits - v.allocatedUnits
              const pct = Math.round((v.allocatedUnits / v.capacityUnits) * 100)
              const st = VESSEL_STATUS_STYLE[v.status]
              const isSelected = selected === v.id

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelected(v.id)}
                  className={`w-full text-left px-4 py-3 rounded-md border transition-colors duration-150 ${
                    isSelected ? 'border-brand-500 bg-brand-50' : 'border-border-default hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-900 truncate">{v.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${st.badge}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{v.port} &rarr; {v.destination} &middot; Departs {v.departure}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                          <span>{v.allocatedUnits}/{v.capacityUnits} units</span>
                          <span className="font-semibold text-green-700">{remaining} remaining</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border-default">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={() => selected && onConfirm(selected)} disabled={!selected}>
            Request Deckspace
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Container card (packed orders view) ──────────────────────────────────────

interface ContainerCardProps {
  containerId: string
  orders: WorkOrder[]
  onSubmitQAQC?: () => void
  onGenerateWaybill?: (order: WorkOrder) => void
  onRequestDeckspace?: (order: WorkOrder) => void
}

function ContainerCard({ containerId, orders, onSubmitQAQC, onGenerateWaybill, onRequestDeckspace }: ContainerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const destination = orders[0]?.destination ?? '—'
  const stage = orders[0]?.stage

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-gray-500" />
          <span className="font-mono font-bold text-gray-900 text-sm">{containerId}</span>
          <span className="text-xs text-gray-500">·</span>
          <span className="text-xs font-medium text-gray-700">{destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 font-medium">
            {orders.length} WO{orders.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expanded ? 'Collapse' : 'Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="divide-y divide-border-default">
          {orders.map(o => (
            <div key={o.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs font-semibold text-brand-500">{o.id}</span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="text-xs text-gray-600">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                <span className="mx-2 text-gray-300">·</span>
                <span className="text-xs text-gray-500">{o.requestType}</span>
              </div>
              <StagePill stage={o.stage} />
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
        {stage && (
          <StagePill stage={stage} />
        )}
        <div className="ml-auto flex gap-2">
          {onSubmitQAQC && (
            <Button variant="secondary" size="sm" onClick={onSubmitQAQC}>
              Submit for QAQC
            </Button>
          )}
          {onGenerateWaybill && orders[0] && (
            <Button variant="primary" size="sm" onClick={() => onGenerateWaybill(orders[0])}>
              Generate Waybill
            </Button>
          )}
          {onRequestDeckspace && orders[0] && (
            <Button variant="primary" size="sm" onClick={() => onRequestDeckspace(orders[0])}>
              Request Deckspace
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function DispatchPersonnelTasksPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    sortNewestFirst(
      WORK_ORDERS.filter(o =>
        o.assignedTo === MY_ID &&
        ['Dispatch Assigned', 'Containerization', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace'].includes(o.stage)
      )
    )
  )
  const [activeTab, setActiveTab] = useState<StageTab>('Assigned')
  const [waybillOrder, setWaybillOrder] = useState<WorkOrder | null>(null)
  const [showPackDialog, setShowPackDialog] = useState(false)
  const [vesselOrder, setVesselOrder] = useState<WorkOrder | null>(null)

  // Per-tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<StageTab, number> = {
      'Assigned': 0, 'Containerization': 0, 'Waybill Pending': 0, 'Waybill Done': 0, 'Awaiting Deckspace': 0
    }
    for (const tab of Object.keys(STAGE_MAP) as StageTab[]) {
      counts[tab] = orders.filter(o => STAGE_MAP[tab].includes(o.stage as Stage)).length
    }
    return counts
  }, [orders])

  const tabOrders = useMemo(
    () => orders.filter(o => STAGE_MAP[activeTab].includes(o.stage as Stage)),
    [orders, activeTab]
  )

  function advanceStage(orderId: string, nextStage: Stage) {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, stage: nextStage, elapsedHours: 0 }
        : o
    ))
  }

  function advanceMultiple(orderIds: string[], nextStage: Stage) {
    setOrders(prev => prev.map(o =>
      orderIds.includes(o.id) ? { ...o, stage: nextStage, elapsedHours: 0 } : o
    ))
  }

  function handlePackOrders(orderIds: string[]) {
    const autoContainerId = `CNT-AUTO-${Date.now().toString(36).toUpperCase()}`
    setOrders(prev => prev.map(o =>
      orderIds.includes(o.id)
        ? { ...o, stage: 'Containerization' as Stage, containerId: autoContainerId, elapsedHours: 0 }
        : o
    ))
    setShowPackDialog(false)
    setActiveTab('Containerization')
  }

  function handleRequestDeckspace(orderId: string, vesselId: string) {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, stage: 'Awaiting Deckspace' as Stage, elapsedHours: 0 } : o
    ))
    setVesselOrder(null)
    setActiveTab('Awaiting Deckspace')
    void vesselId // allocated to vessel — would update vessel allocatedUnits in a real app
  }

  // Group Containerization orders by container
  const containerGroups = useMemo(() => {
    const groups: Record<string, WorkOrder[]> = {}
    for (const o of orders.filter(o => o.stage === 'Containerization')) {
      const key = o.containerId ?? 'no-container'
      if (!groups[key]) groups[key] = []
      groups[key].push(o)
    }
    return groups
  }, [orders])

  // Group Waybill Done orders by container for deckspace requests
  const waybillDoneGroups = useMemo(() => {
    const groups: Record<string, WorkOrder[]> = {}
    for (const o of orders.filter(o => o.stage === 'Waybill Done')) {
      const key = o.containerId ?? o.id
      if (!groups[key]) groups[key] = []
      groups[key].push(o)
    }
    return groups
  }, [orders])

  const assignedOrders = orders.filter(o => o.stage === 'Dispatch Assigned')
  const waybillPendingOrders = orders.filter(o => o.stage === 'Waybill Pending Signature')
  const awaitingOrders = orders.filter(o => o.stage === 'Awaiting Deckspace')

  const totalActive = assignedOrders.length + Object.keys(containerGroups).length
  const waybillPendingCount = waybillPendingOrders.length

  return (
    <AppShell
      role="dsp_per"
      currentPath="/dispatch-personnel"
      title="My Tasks"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'My Tasks' }]}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="My Active Tasks"   value={totalActive}          color="#8B5CF6" icon={ClipboardCheck} />
        <StatCard label="Waybills Pending"  value={waybillPendingCount}  color="#3B82F6" icon={FileText} />
        <StatCard label="Awaiting Deckspace" value={awaitingOrders.length} color="#10B981" icon={Anchor} />
      </div>

      {/* Stage filter tabs */}
      <div className="mb-5 border-b border-border-default">
        <div className="flex gap-0.5 overflow-x-auto">
          {(Object.keys(STAGE_MAP) as StageTab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Assigned tab ── */}
      {activeTab === 'Assigned' && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle title="Assigned Tasks" count={assignedOrders.length} />
            {assignedOrders.length >= 2 && (
              <Button variant="primary" size="sm" onClick={() => setShowPackDialog(true)}>
                <ShieldCheck size={13} className="mr-1" />
                Pack into Container
              </Button>
            )}
          </div>

          {assignedOrders.length === 0 ? (
            <p className="text-sm text-gray-400 mt-3">No tasks assigned to you yet.</p>
          ) : (
            <div className="space-y-3">
              {assignedOrders.map(o => {
                const slaHrs = STAGE_SLA_HOURS[o.stage]
                return (
                  <Card key={o.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                          <StagePill stage={o.stage} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">{o.destination}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.requestType}</p>
                        {slaHrs && (
                          <div className="mt-2">
                            <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} showLabel />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowPackDialog(true)}
                      >
                        Pack
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">{fmtHours(o.elapsedHours)} in stage</p>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Containerization tab ── */}
      {activeTab === 'Containerization' && (
        <section>
          <SectionTitle title="Containers Being Packed" count={Object.keys(containerGroups).length} className="mb-3" />
          {Object.keys(containerGroups).length === 0 ? (
            <p className="text-sm text-gray-400 mt-3">No containers currently being packed.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(containerGroups).map(([cid, cOrders]) => (
                <ContainerCard
                  key={cid}
                  containerId={cid}
                  orders={cOrders}
                  onSubmitQAQC={() => advanceMultiple(cOrders.map(o => o.id), 'Post QAQC')}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Waybill Pending tab ── */}
      {activeTab === 'Waybill Pending' && (
        <section>
          <SectionTitle title="Awaiting Waybill Generation" count={waybillPendingOrders.length} className="mb-3" />
          {waybillPendingOrders.length === 0 ? (
            <p className="text-sm text-gray-400 mt-3">No waybills pending.</p>
          ) : (
            <div className="space-y-3">
              {waybillPendingOrders.map(o => (
                <Card key={o.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                        <StagePill stage={o.stage} />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                      {o.containerId && (
                        <p className="text-xs text-gray-500 mt-1">Container: <span className="font-mono font-semibold text-gray-700">{o.containerId}</span></p>
                      )}
                    </div>
                    <Button variant="primary" size="sm" onClick={() => setWaybillOrder(o)}>
                      Generate Waybill
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Waybill Done tab ── */}
      {activeTab === 'Waybill Done' && (
        <section>
          <SectionTitle title="Ready to Request Deckspace" count={Object.keys(waybillDoneGroups).length} className="mb-3" />
          {Object.keys(waybillDoneGroups).length === 0 ? (
            <p className="text-sm text-gray-400 mt-3">No orders ready for deckspace request.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(waybillDoneGroups).map(([key, gOrders]) => (
                <ContainerCard
                  key={key}
                  containerId={gOrders[0].containerId ?? key}
                  orders={gOrders}
                  onRequestDeckspace={(o) => setVesselOrder(o)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Awaiting Deckspace tab ── */}
      {activeTab === 'Awaiting Deckspace' && (
        <section>
          <SectionTitle title="Awaiting Vessel Assignment" count={awaitingOrders.length} className="mb-3" />
          {awaitingOrders.length === 0 ? (
            <p className="text-sm text-gray-400 mt-3">No orders awaiting deckspace.</p>
          ) : (
            <div className="space-y-3">
              {awaitingOrders.map(o => (
                <Card key={o.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                        <StagePill stage={o.stage} />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                      {o.waybillNumber && (
                        <p className="text-xs text-gray-500 mt-1">Waybill: <span className="font-mono font-semibold text-gray-700">{o.waybillNumber}</span></p>
                      )}
                    </div>
                    <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                      Awaiting vessel
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">{fmtHours(o.elapsedHours)} waiting</p>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Pack dialog */}
      {showPackDialog && (
        <PackDialog
          orders={assignedOrders}
          onConfirm={handlePackOrders}
          onClose={() => setShowPackDialog(false)}
        />
      )}

      {/* Waybill dialog */}
      {waybillOrder && (
        <WaybillDialog
          order={waybillOrder}
          onClose={() => setWaybillOrder(null)}
          onConfirm={() => {
            advanceStage(waybillOrder.id, 'Waybill Done')
            setWaybillOrder(null)
            setActiveTab('Waybill Done')
          }}
        />
      )}

      {/* Vessel request dialog */}
      {vesselOrder && (
        <VesselRequestDialog
          order={vesselOrder}
          onConfirm={(vesselId) => handleRequestDeckspace(vesselOrder.id, vesselId)}
          onClose={() => setVesselOrder(null)}
        />
      )}
    </AppShell>
  )
}

