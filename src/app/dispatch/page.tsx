'use client'

import { useState, useMemo } from 'react'
import { Truck, UserCheck, ShieldCheck, Anchor } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { AssignModal } from '@/components/domain/AssignModal'
import { type WorkOrder, sortNewestFirst, getPersonnelByDept } from '@/lib/mock-data'
import { LIVE_ORDERS } from '@/lib/workflow-store'
import { STAGE_REVERSAL, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { SLABreachBanner } from './_components/SLABreachBanner'
import { MainTabBar } from './_components/MainTabBar'
import { QueueView } from './_components/QueueView'
import { PersonnelTasksView } from './_components/PersonnelTasksView'
import { DISPATCH_STAGES, type MainTab } from './_components/constants'

const SUPERVISOR_ID   = 'DSP1'
const SUPERVISOR_NAME = 'Chika Obi'

export default function DispatchSupervisorPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    sortNewestFirst(LIVE_ORDERS.filter(o => DISPATCH_STAGES.includes(o.stage)))
  )
  const [mainTab, setMainTab] = useState<MainTab>('Queue')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [assigningOrder, setAssigningOrder] = useState<WorkOrder | null>(null)
  const [slaOpen, setSlaOpen] = useState(true)

  const dispatchPersonnel = useMemo(() =>
    getPersonnelByDept('dispatch').map(p => ({
      ...p,
      active: orders.filter(o =>
        o.assignedTo === p.id &&
        ['Dispatch Assigned', 'Preload QAQC', 'Containerization', 'Post QAQC', 'Waybill Pending Signature', 'Awaiting Deckspace'].includes(o.stage)
      ).length,
    })),
    [orders]
  )

  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null

  const slaBreaches = useMemo(() =>
    orders
      .filter(o => {
        const sla = STAGE_SLA_HOURS[o.stage]
        return sla != null && o.elapsedHours > sla
      })
      .sort((a, b) => {
        const aOver = a.elapsedHours - (STAGE_SLA_HOURS[a.stage] ?? 0)
        const bOver = b.elapsedHours - (STAGE_SLA_HOURS[b.stage] ?? 0)
        return bOver - aOver
      }),
    [orders]
  )

  const queueCount     = orders.filter(o => o.stage === 'Dispatch Queue').length
  const assignedCount  = orders.filter(o => o.stage === 'Dispatch Assigned').length
  const qaqcCount      = orders.filter(o => ['Preload QAQC','Containerization','Post QAQC'].includes(o.stage)).length
  const deckspaceCount = orders.filter(o => o.stage === 'Awaiting Deckspace').length

  function handleAssign(personnelId: string, personnelName: string) {
    if (!assigningOrder) return
    const now  = new Date().toISOString()
    const live = LIVE_ORDERS.find(o => o.id === assigningOrder.id)
    if (live) {
      // Close out the Dispatch Queue stage and attribute it to the supervisor
      const cur = live.stageHistory[live.stageHistory.length - 1]
      if (cur && !cur.endedAt) {
        cur.endedAt    = now
        cur.personId   = SUPERVISOR_ID
        cur.personName = SUPERVISOR_NAME
        cur.durationHours = live.elapsedHours
      }
      live.assignedTo     = personnelId
      live.assignedToName = personnelName
      live.stage          = 'Dispatch Assigned'
      live.elapsedHours   = 0
      live.stageHistory.push({ stage: 'Dispatch Assigned', personId: personnelId, personName: personnelName, startedAt: now })
    }
    setOrders(prev => prev.map(o =>
      o.id === assigningOrder.id
        ? { ...o, assignedTo: personnelId, assignedToName: personnelName, stage: 'Dispatch Assigned', elapsedHours: 0 }
        : o
    ))
    setAssigningOrder(null)
    setSelectedOrderId(null)
  }

  function handleReverse(order: WorkOrder) {
    const prevStage = STAGE_REVERSAL[order.stage]
    if (!prevStage) return
    const live = LIVE_ORDERS.find(o => o.id === order.id)
    if (live) { live.stage = prevStage; live.elapsedHours = 0; live.assignedTo = null; live.assignedToName = null }
    setOrders(prev => prev.map(o =>
      o.id === order.id
        ? { ...o, stage: prevStage, elapsedHours: 0, assignedTo: null, assignedToName: null }
        : o
    ))
    setSelectedOrderId(null)
  }

  function advanceStage(orderId: string, nextStage: Stage) {
    const live = LIVE_ORDERS.find(o => o.id === orderId)
    if (live) { live.stage = nextStage; live.elapsedHours = 0 }
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, stage: nextStage, elapsedHours: 0 } : o
    ))
  }

  return (
    <AppShell
      role="dsp_sup"
      currentPath="/dispatch"
      title="Dispatch Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Dispatch' }]}
    >
      <SLABreachBanner
        slaBreaches={slaBreaches}
        slaOpen={slaOpen}
        onToggle={() => setSlaOpen(o => !o)}
        selectedOrderId={selectedOrderId}
        onSelectOrder={setSelectedOrderId}
        onAssignOrder={setAssigningOrder}
        onReverseOrder={handleReverse}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Dispatch Queue"    value={queueCount}    color="#8B5CF6" icon={Truck} />
        <StatCard label="Active (Assigned)" value={assignedCount} color="#1A6FBF" icon={UserCheck} />
        <StatCard label="QAQC Pending"      value={qaqcCount}     color="#D97706" icon={ShieldCheck} />
        <StatCard label="Awaiting Deckspace" value={deckspaceCount} color="#16A34A" icon={Anchor} />
      </div>

      <MainTabBar active={mainTab} onSelect={setMainTab} />

      {mainTab === 'Queue' && (
        <QueueView
          orders={orders}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
          onAssignOrder={setAssigningOrder}
          onReverseOrder={handleReverse}
        />
      )}

      {mainTab === 'Personnel Tasks' && (
        <PersonnelTasksView
          personnel={dispatchPersonnel}
          orders={orders}
          onAdvanceStage={advanceStage}
          onViewOrder={(orderId) => { setSelectedOrderId(orderId); setMainTab('Queue') }}
        />
      )}

      <DetailPanel
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onAssign={o => setAssigningOrder(o)}
        onReverse={handleReverse}
        role="dsp_sup"
      />

      <AssignModal
        order={assigningOrder}
        personnel={dispatchPersonnel}
        onConfirm={handleAssign}
        onClose={() => setAssigningOrder(null)}
      />
    </AppShell>
  )
}
