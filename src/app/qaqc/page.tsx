'use client'

import { useState } from 'react'
import { ShieldCheck, Package, CheckCircle2, Archive } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, CONTAINERS, type WorkOrder, type Container } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'

const QAQC_OFFICER = 'QA1'
const QAQC_OFFICER_NAME = 'Femi Emmanuel'

interface ContainerModalProps {
  order: WorkOrder
  containers: Container[]
  onAssign: (containerId: string) => void
  onClose: () => void
}

function ContainerModal({ order, containers, onAssign, onClose }: ContainerModalProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const available = containers.filter(c => c.status === 'available')

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-sm mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Assign Container</h2>
        <p className="text-xs text-gray-500 mb-4">
          Assigning to <span className="font-mono font-semibold text-brand-500">{order.id}</span> â€” {order.destination}
        </p>

        {available.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No containers available.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {available.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md border transition-colors duration-150 ${
                  selected === c.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-border-default hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-900 text-sm">{c.id}</span>
                  <span className="text-xs font-medium text-gray-500">{c.size}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{c.yard}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button
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

interface InspectDialogProps {
  order: WorkOrder
  onApprove: (notes: string) => void
  onReject: () => void
  onClose: () => void
}

function InspectDialog({ order, onApprove, onReject, onClose }: InspectDialogProps) {
  const [notes, setNotes] = useState('')
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-md mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Post-QAQC Inspection</h2>
        <p className="text-xs text-gray-500 mb-4">
          <span className="font-mono font-semibold text-brand-500">{order.id}</span> Â· Container: <span className="font-mono font-semibold">{order.containerId ?? 'â€”'}</span>
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Inspection Notes (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-border-default rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            placeholder="Add notes about the inspection..."
          />
        </div>

        <div className="flex gap-2">
          <Button variant="danger" size="md" onClick={onReject}>Return to Containerization</Button>
          <div className="flex-1" />
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" onClick={() => onApprove(notes)}>Approve</Button>
        </div>
      </div>
    </div>
  )
}

export default function QAQCPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(
    WORK_ORDERS.filter(o => ['Preload QAQC', 'Containerization', 'Post QAQC'].includes(o.stage))
  )
  const [containers, setContainers] = useState<Container[]>(CONTAINERS)
  const [containerModalOrder, setContainerModalOrder] = useState<WorkOrder | null>(null)
  const [inspectOrder, setInspectOrder] = useState<WorkOrder | null>(null)

  const preloadQAQC   = orders.filter(o => o.stage === 'Preload QAQC')
  const inContainerization = orders.filter(o => o.stage === 'Containerization')
  const postQAQC      = orders.filter(o => o.stage === 'Post QAQC')
  const availableContainers = containers.filter(c => c.status === 'available').length

  function handleAssignContainer(orderId: string, containerId: string) {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
            ...o,
            stage: 'Containerization',
            containerId,
            elapsedHours: 0,
            stageHistory: [
              ...o.stageHistory,
              { stage: 'Preload QAQC', personId: QAQC_OFFICER, personName: QAQC_OFFICER_NAME, startedAt: new Date(Date.now() - o.elapsedHours * 3600000).toISOString(), endedAt: new Date().toISOString(), durationHours: o.elapsedHours },
            ],
          }
        : o
    ))
    setContainers(prev => prev.map(c =>
      c.id === containerId ? { ...c, status: 'in-use', workOrderId: orderId } : c
    ))
    setContainerModalOrder(null)
  }

  function handleApprove(orderId: string, _notes: string) {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? {
            ...o,
            stage: 'Waybill Pending Signature',
            elapsedHours: 0,
            stageHistory: [
              ...o.stageHistory,
              { stage: 'Post QAQC', personId: QAQC_OFFICER, personName: QAQC_OFFICER_NAME, startedAt: new Date(Date.now() - o.elapsedHours * 3600000).toISOString(), endedAt: new Date().toISOString(), durationHours: o.elapsedHours },
            ],
          }
        : o
    ))
    setInspectOrder(null)
  }

  function handleReject(orderId: string) {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, stage: 'Containerization', elapsedHours: 0 }
        : o
    ))
    setInspectOrder(null)
  }

  return (
    <AppShell
      role="qaqc"
      currentPath="/qaqc"
      title="QAQC Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC' }]}
      actionLabel="Container Fleet"
      actionHref="/qaqc/containers"
    >
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Inspection"      value={preloadQAQC.length}        color="#F59E0B" icon={ShieldCheck} />
        <StatCard label="Containerization Active" value={inContainerization.length} color="#8B5CF6" icon={Package} />
        <StatCard label="Post QAQC Pending"       value={postQAQC.length}           color="#3B82F6" icon={CheckCircle2} />
        <StatCard label="Containers Available"    value={availableContainers}       color="#22C55E" icon={Archive} />
      </div>

      {/* QA/QC QUEUE */}
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>QA/QC Queue</h2>

      {/* PRELOAD QAQC QUEUE */}
      <section className="mb-8">
        <SectionTitle title="Preload QAQC Queue" count={preloadQAQC.length} />
        {preloadQAQC.length === 0 && <p className="text-sm text-gray-400 mt-3">No orders awaiting container assignment.</p>}
        <div className="space-y-3 mt-3">
          {preloadQAQC.map(o => {
            const slaHrs = STAGE_SLA_HOURS[o.stage]
            return (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                      <StagePill stage={o.stage} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {o.items.length} item{o.items.length !== 1 ? 's' : ''} Â· {o.requestType} Â· Assigned to {o.assignedToName ?? 'Unassigned'}
                    </p>
                    {slaHrs && (
                      <div className="mt-2">
                        <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} showLabel />
                      </div>
                    )}
                  </div>
                  <Button
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
        <SectionTitle title="Containerization in Progress" count={inContainerization.length} />
        {inContainerization.length === 0 && <p className="text-sm text-gray-400 mt-3">No active packing.</p>}
        <div className="space-y-3 mt-3">
          {inContainerization.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage} />
                  </div>
                  <p className="text-sm text-gray-900">{o.destination}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>Container: <span className="font-mono font-semibold text-gray-700">{o.containerId ?? 'â€”'}</span></span>
                    <span>Â·</span>
                    <span>Packing by {o.assignedToName ?? 'Unassigned'}</span>
                    <span>Â·</span>
                    <span>{fmtHours(o.elapsedHours)} elapsed</span>
                  </div>
                </div>
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">Packing in progress</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* POST QAQC INSPECTION */}
      <section className="mb-8">
        <SectionTitle title="Post-QAQC Inspection" count={postQAQC.length} />
        {postQAQC.length === 0 && <p className="text-sm text-gray-400 mt-3">No containers ready for inspection.</p>}
        <div className="space-y-3 mt-3">
          {postQAQC.map(o => (
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
                    {' Â· '}Packed by {o.assignedToName ?? 'Unassigned'}
                  </p>
                </div>
                <Button
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
