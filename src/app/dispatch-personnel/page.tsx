'use client'

import { useState, useMemo } from 'react'
import { ClipboardCheck, FileText, Anchor } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { WORK_ORDERS, type WorkOrder, sortNewestFirst } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { StageTabBar, STAGE_TABS, type StageTab } from './_components/StageTabBar'
import { AssignedTab } from './_components/AssignedTab'
import { ContainerGroupsTab } from './_components/ContainerGroupsTab'
import { WaybillPendingTab } from './_components/WaybillPendingTab'
import { AwaitingDeckspaceTab } from './_components/AwaitingDeckspaceTab'
import { WaybillDialog } from './_components/WaybillDialog'
import { PackDialog } from './_components/PackDialog'
import { VesselRequestDialog } from './_components/VesselRequestDialog'

const MY_ID = 'DP1'

const STAGE_MAP: Record<StageTab, Stage[]> = {
  'Assigned':            ['Dispatch Assigned'],
  'Containerization':    ['Containerization'],
  'Waybill Pending':     ['Waybill Pending Signature'],
  'Waybill Done':        ['Waybill Done'],
  'Awaiting Deckspace':  ['Awaiting Deckspace'],
}

function groupByContainer(orders: WorkOrder[], keyFor: (o: WorkOrder) => string) {
  const groups: Record<string, WorkOrder[]> = {}
  for (const o of orders) {
    const key = keyFor(o)
    if (!groups[key]) groups[key] = []
    groups[key].push(o)
  }
  return groups
}

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

  const tabCounts = useMemo(() => {
    const counts = {} as Record<StageTab, number>
    for (const tab of STAGE_TABS) {
      counts[tab] = orders.filter(o => STAGE_MAP[tab].includes(o.stage as Stage)).length
    }
    return counts
  }, [orders])

  function advanceStage(orderId: string, nextStage: Stage) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage: nextStage, elapsedHours: 0 } : o))
  }

  function advanceMultiple(orderIds: string[], nextStage: Stage) {
    setOrders(prev => prev.map(o => orderIds.includes(o.id) ? { ...o, stage: nextStage, elapsedHours: 0 } : o))
  }

  function handlePackOrders(orderIds: string[], cargoClass: import('@/lib/mock-data').DangerousGoodsClass) {
    const autoContainerId = `CNT-AUTO-${Date.now().toString(36).toUpperCase()}`
    setOrders(prev => prev.map(o =>
      orderIds.includes(o.id) ? { ...o, stage: 'Containerization' as Stage, containerId: autoContainerId, elapsedHours: 0, cargoClass } : o
    ))
    setShowPackDialog(false)
    setActiveTab('Containerization')
  }

  function handleRequestDeckspace(orderId: string) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage: 'Awaiting Deckspace' as Stage, elapsedHours: 0 } : o))
    setVesselOrder(null)
    setActiveTab('Awaiting Deckspace')
  }

  const containerGroups    = useMemo(() => groupByContainer(orders.filter(o => o.stage === 'Containerization'), o => o.containerId ?? 'no-container'), [orders])
  const waybillDoneGroups  = useMemo(() => groupByContainer(orders.filter(o => o.stage === 'Waybill Done'), o => o.containerId ?? o.id), [orders])

  const assignedOrders        = orders.filter(o => o.stage === 'Dispatch Assigned')
  const waybillPendingOrders  = orders.filter(o => o.stage === 'Waybill Pending Signature')
  const awaitingOrders        = orders.filter(o => o.stage === 'Awaiting Deckspace')

  const totalActive = assignedOrders.length + Object.keys(containerGroups).length

  return (
    <AppShell
      role="dsp_per"
      currentPath="/dispatch-personnel"
      title="My Tasks"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'My Tasks' }]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="My Active Tasks"    value={totalActive}              color="#8B5CF6" icon={ClipboardCheck} />
        <StatCard label="Waybills Pending"   value={waybillPendingOrders.length} color="#3B82F6" icon={FileText} />
        <StatCard label="Awaiting Deckspace" value={awaitingOrders.length}    color="#10B981" icon={Anchor} />
      </div>

      <StageTabBar active={activeTab} counts={tabCounts} onSelect={setActiveTab} />

      {activeTab === 'Assigned' && (
        <AssignedTab orders={assignedOrders} onPack={() => setShowPackDialog(true)} />
      )}

      {activeTab === 'Containerization' && (
        <ContainerGroupsTab
          title="Containers Being Packed"
          emptyLabel="No containers currently being packed."
          groups={containerGroups}
          onSubmitQAQC={(gOrders) => advanceMultiple(gOrders.map(o => o.id), 'Post QAQC')}
        />
      )}

      {activeTab === 'Waybill Pending' && (
        <WaybillPendingTab orders={waybillPendingOrders} onGenerateWaybill={setWaybillOrder} />
      )}

      {activeTab === 'Waybill Done' && (
        <ContainerGroupsTab
          title="Ready to Request Deckspace"
          emptyLabel="No orders ready for deckspace request."
          groups={waybillDoneGroups}
          onRequestDeckspace={setVesselOrder}
        />
      )}

      {activeTab === 'Awaiting Deckspace' && (
        <AwaitingDeckspaceTab orders={awaitingOrders} />
      )}

      {showPackDialog && (
        <PackDialog
          orders={assignedOrders}
          onConfirm={handlePackOrders}
          onClose={() => setShowPackDialog(false)}
        />
      )}

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

      {vesselOrder && (
        <VesselRequestDialog
          order={vesselOrder}
          onConfirm={() => handleRequestDeckspace(vesselOrder.id)}
          onClose={() => setVesselOrder(null)}
        />
      )}
    </AppShell>
  )
}
