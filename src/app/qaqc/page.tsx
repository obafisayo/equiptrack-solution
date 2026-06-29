'use client'

import { useState, useMemo } from 'react'
import { ShieldCheck, Package, CheckCircle2, Archive, ChevronDown, ChevronUp } from 'lucide-react'
import { Textarea } from '@/components/ui/Form'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, CONTAINERS, type WorkOrder, type Container, sortNewestFirst } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

const QAQC_OFFICER = 'QA1'
const QAQC_OFFICER_NAME = 'Femi Emmanuel'

// ── Container Assignment Modal ──────────────────────────────────────────────

interface ContainerModalProps {
  order: WorkOrder
  containers: Container[]
  allOrders: WorkOrder[]
  onAssign: (containerId: string) => void
  onClose: () => void
}

function ContainerModal({ order, containers, allOrders, onAssign, onClose }: ContainerModalProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Eligible containers: available OR in-use at the same destination
  const eligibleContainers = containers.filter(c => {
    if (c.status === 'inspection' || c.status === 'maintenance') return false
    if (c.status === 'available') return true
    // in-use: only if same destination
    if (c.status === 'in-use') return c.destination === order.destination
    return false
  })

  function getContainerOrders(cid: string) {
    return allOrders.filter(o => o.containerId === cid)
  }

  function handleSelect(cid: string) {
    const c = containers.find(x => x.id === cid)
    if (!c) return
    if (c.status === 'in-use' && c.destination && c.destination !== order.destination) {
      setLocationError(`Container is locked to ${c.destination}, but this order is going to ${order.destination}.`)
      setSelected(null)
      return
    }
    setLocationError(null)
    setSelected(cid)
  }

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-md mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Assign Container</h2>
        <p className="text-xs text-gray-500 mb-4">
          Assigning to <span className="font-mono font-semibold text-brand-500">{order.id}</span> &mdash; {order.destination}
        </p>

        {locationError && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
            {locationError}
          </div>
        )}

        {eligibleContainers.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No containers available for this destination.</p>
        ) : (
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {eligibleContainers.map(c => {
              const existingOrders = getContainerOrders(c.id)
              const isSelected = selected === c.id
              const isInUse = c.status === 'in-use'
              const footArea = (c.lengthFt * c.widthFt).toFixed(0)

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md border transition-colors duration-150 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border-default hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-gray-900 text-sm">{c.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{c.size}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isInUse ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {isInUse ? 'In Use' : 'Available'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{c.yard} &middot; {c.lengthFt}ft &times; {c.widthFt}ft &middot; {footArea} sq ft</p>
                  {isInUse && existingOrders.length > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        Contains {existingOrders.length} order{existingOrders.length !== 1 ? 's' : ''} &rarr; {c.destination}
                      </p>
                      {existingOrders.map(eo => (
                        <p key={eo.id} className="text-[10px] font-mono text-brand-500">{eo.id}</p>
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            disabled={!selected}
            onClick={() => selected && onAssign(selected)}
          >
            Assign Container
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Post-QAQC Inspect Dialog ────────────────────────────────────────────────

interface InspectDialogProps {
  order: WorkOrder
  onApprove: (notes: string) => void
  onReject: () => void
  onClose: () => void
}

function InspectDialog({ order, onApprove, onReject, onClose }: InspectDialogProps) {
  const [notes, setNotes] = useState('')
  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-md mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Post-QAQC Inspection</h2>
        <p className="text-xs text-gray-500 mb-4">
          <span className="font-mono font-semibold text-brand-500">{order.id}</span> &middot; Container:{' '}
          <span className="font-mono font-semibold">{order.containerId ?? '—'}</span>
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Inspection Notes (optional)</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes about the inspection..."
          />
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="danger" size="md" onClick={onReject}>Return to Containerization</Button>
          <div className="flex-1" />
          <Button type="button" variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="primary" size="md" onClick={() => onApprove(notes)}>Approve</Button>
        </div>
      </div>
    </div>
  )
}

// ── Container Group Card (Containerization view) ─────────────────────────────

interface ContainerGroupProps {
  containerId: string
  groupOrders: WorkOrder[]
  container: Container | undefined
}

function ContainerGroupCard({ containerId, groupOrders, container }: ContainerGroupProps) {
  const [expanded, setExpanded] = useState(false)
  const footArea = container ? (container.lengthFt * container.widthFt).toFixed(0) : null

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-gray-900">{containerId}</span>
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Packing</span>
          </div>
          {container && (
            <p className="text-xs text-gray-500">
              {container.size} &middot; {container.yard}
              {footArea && ` · ${container.lengthFt}ft × ${container.widthFt}ft (${footArea} sq ft)`}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-0.5">
            {groupOrders.length} work order{groupOrders.length !== 1 ? 's' : ''} &middot; Destination: {groupOrders[0]?.destination ?? '—'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border-default pt-3">
          {groupOrders.map(o => {
            const slaHrs = STAGE_SLA_HOURS[o.stage]
            return (
              <div key={o.id} className="bg-gray-50 rounded-md px-3 py-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-bold text-brand-500">{o.id}</span>
                  <StagePill stage={o.stage as Stage} />
                </div>
                <p className="text-xs text-gray-600">{o.items.length} item{o.items.length !== 1 ? 's' : ''} &middot; {o.requestType}</p>
                {slaHrs && (
                  <div className="mt-1">
                    <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} />
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1">{fmtHours(o.elapsedHours)} in stage &middot; Packed by {o.assignedToName ?? 'Unassigned'}</p>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function QAQCPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    sortNewestFirst(
      WORK_ORDERS.filter(o => ['Preload QAQC', 'Containerization', 'Post QAQC'].includes(o.stage))
    )
  )
  const [containers, setContainers] = useState<Container[]>(CONTAINERS)
  const [containerModalOrder, setContainerModalOrder] = useState<WorkOrder | null>(null)
  const [inspectOrder, setInspectOrder] = useState<WorkOrder | null>(null)

  const preloadQAQC       = useMemo(() => orders.filter(o => o.stage === 'Preload QAQC'), [orders])
  const inContainerization = useMemo(() => orders.filter(o => o.stage === 'Containerization'), [orders])
  const postQAQC           = useMemo(() => orders.filter(o => o.stage === 'Post QAQC'), [orders])
  const availableContainerCount = containers.filter(c => c.status === 'available').length

  // Group containerization orders by container
  const containerGroups = useMemo(() => {
    const map = new Map<string, WorkOrder[]>()
    for (const o of inContainerization) {
      const key = o.containerId ?? '__none__'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(o)
    }
    return map
  }, [inContainerization])

  function handleAssignContainer(orderId: string, containerId: string) {
    const orderBeingAssigned = orders.find(o => o.id === orderId)
    if (!orderBeingAssigned) return

    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
            ...o,
            stage: 'Containerization' as Stage,
            containerId,
            elapsedHours: 0,
            stageHistory: [
              ...o.stageHistory,
              {
                stage: 'Preload QAQC' as Stage,
                personId: QAQC_OFFICER,
                personName: QAQC_OFFICER_NAME,
                startedAt: new Date(Date.now() - o.elapsedHours * 3600000).toISOString(),
                endedAt: new Date().toISOString(),
                durationHours: o.elapsedHours,
              },
            ],
          }
        : o
    ))

    // Update container: mark in-use, set destination from order, push workOrderId
    setContainers(prev => prev.map(c => {
      if (c.id !== containerId) return c
      return {
        ...c,
        status: 'in-use',
        destination: orderBeingAssigned.destination,
        workOrderIds: c.workOrderIds.includes(orderId)
          ? c.workOrderIds
          : [...c.workOrderIds, orderId],
      }
    }))

    setContainerModalOrder(null)
  }

  function handleApprove(orderId: string, _notes: string) {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
            ...o,
            stage: 'Waybill Pending Signature' as Stage,
            elapsedHours: 0,
            stageHistory: [
              ...o.stageHistory,
              {
                stage: 'Post QAQC' as Stage,
                personId: QAQC_OFFICER,
                personName: QAQC_OFFICER_NAME,
                startedAt: new Date(Date.now() - o.elapsedHours * 3600000).toISOString(),
                endedAt: new Date().toISOString(),
                durationHours: o.elapsedHours,
              },
            ],
          }
        : o
    ))

    // Release container if no remaining orders in containerization
    const approvingOrder = orders.find(o => o.id === orderId)
    if (approvingOrder?.containerId) {
      const cid = approvingOrder.containerId
      const remainingInContainer = orders.filter(
        o => o.id !== orderId && o.containerId === cid && o.stage === 'Containerization'
      )
      if (remainingInContainer.length === 0) {
        setContainers(prev => prev.map(c =>
          c.id === cid
            ? { ...c, status: 'available', destination: undefined, workOrderIds: [] }
            : c
        ))
      }
    }

    setInspectOrder(null)
  }

  function handleReject(orderId: string) {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, stage: 'Containerization' as Stage, elapsedHours: 0 } : o
    ))
    setInspectOrder(null)
  }

  return (
    <AppShell
      role="qaqc"
      currentPath="/qaqc"
      title="QAQC Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC' }]}
    >
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Inspection"      value={preloadQAQC.length}         color="#F59E0B" icon={ShieldCheck} />
        <StatCard label="Containerization Active" value={inContainerization.length}  color="#8B5CF6" icon={Package} />
        <StatCard label="Post QAQC Pending"       value={postQAQC.length}            color="#3B82F6" icon={CheckCircle2} />
        <StatCard label="Containers Available"    value={availableContainerCount}    color="#22C55E" icon={Archive} />
      </div>

      {/* PRELOAD QAQC QUEUE */}
      <section className="mb-8">
        <SectionTitle title="Preload QAQC Queue" count={preloadQAQC.length} className="mb-3" />
        {preloadQAQC.length === 0 && (
          <p className="text-sm text-gray-400">No orders awaiting container assignment.</p>
        )}
        <div className="space-y-3">
          {preloadQAQC.map(o => {
            const slaHrs = STAGE_SLA_HOURS[o.stage]
            const breached = slaHrs != null && o.elapsedHours > slaHrs
            return (
              <Card key={o.id} className={`p-4 relative overflow-hidden ${breached ? 'border-red-200' : ''}`}>
                {breached && <div className="absolute top-0 left-0 right-0 h-0.75 bg-red-500" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                      <StagePill stage={o.stage as Stage} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {o.items.length} item{o.items.length !== 1 ? 's' : ''} &middot; {o.requestType} &middot; Pending action by {o.assignedToName ?? 'Unassigned'}
                    </p>
                    {slaHrs && (
                      <div className="mt-2">
                        <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} showLabel />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => setContainerModalOrder(o)}
                  >
                    Assign Container
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CONTAINERIZATION IN PROGRESS */}
      <section className="mb-8">
        <SectionTitle title="Containerization in Progress" count={inContainerization.length} className="mb-3" />
        {inContainerization.length === 0 && (
          <p className="text-sm text-gray-400">No active packing.</p>
        )}
        <div className="space-y-3">
          {/* Orders without a container */}
          {(containerGroups.get('__none__') ?? []).map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage as Stage} />
                  </div>
                  <p className="text-sm text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500 mt-0.5">No container assigned &middot; {fmtHours(o.elapsedHours)} elapsed</p>
                </div>
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">Awaiting container</span>
              </div>
            </Card>
          ))}
          {/* Orders grouped by container */}
          {Array.from(containerGroups.entries())
            .filter(([key]) => key !== '__none__')
            .map(([cid, grpOrders]) => (
              <ContainerGroupCard
                key={cid}
                containerId={cid}
                groupOrders={grpOrders}
                container={containers.find(c => c.id === cid)}
              />
            ))
          }
        </div>
      </section>

      {/* POST QAQC INSPECTION */}
      <section className="mb-8">
        <SectionTitle title="Post-QAQC Inspection" count={postQAQC.length} className="mb-3" />
        {postQAQC.length === 0 && (
          <p className="text-sm text-gray-400">No containers ready for inspection.</p>
        )}
        <div className="space-y-3">
          {postQAQC.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage as Stage} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Container: <span className="font-mono font-semibold text-gray-700">{o.containerId ?? '—'}</span>
                    {' · '}Packed by {o.assignedToName ?? 'Unassigned'}
                    {' · '}{fmtHours(o.elapsedHours)} elapsed
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setInspectOrder(o)}
                >
                  Inspect &amp; Approve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CONTAINER MODAL */}
      {containerModalOrder && (
        <ContainerModal
          order={containerModalOrder}
          containers={containers}
          allOrders={orders}
          onAssign={cid => handleAssignContainer(containerModalOrder.id, cid)}
          onClose={() => setContainerModalOrder(null)}
        />
      )}

      {/* INSPECT DIALOG */}
      {inspectOrder && (
        <InspectDialog
          order={inspectOrder}
          onApprove={notes => handleApprove(inspectOrder.id, notes)}
          onReject={() => handleReject(inspectOrder.id)}
          onClose={() => setInspectOrder(null)}
        />
      )}
    </AppShell>
  )
}
