'use client'

import { useState, useMemo } from 'react'
import { ClipboardCheck, Ship as ShipIcon } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { type WorkOrder, type DangerousGoodsClass, sortNewestFirst } from '@/lib/mock-data'
import { LIVE_ORDERS, LIVE_CCU_FLEET, setWaybillPending, markShipped, packOrdersIntoContainer } from '@/lib/workflow-store'
import type { CCUContainer } from '@/app/qaqc/containers/_components/types'
import { type Stage } from '@/lib/lifecycle'
import { StageTabBar, STAGE_TABS, type StageTab } from './_components/StageTabBar'
import { AssignedTab } from './_components/AssignedTab'
import { ContainerGroupsTab } from './_components/ContainerGroupsTab'
import { WaybillPendingTab } from './_components/WaybillPendingTab'
import { AwaitingDeckspaceTab } from './_components/AwaitingDeckspaceTab'
import { ShippedTab } from './_components/ShippedTab'
import { WaybillDialog } from './_components/WaybillDialog'
import { WaybillDocument } from './_components/WaybillDocument'
import { VesselRequestDialog } from './_components/VesselRequestDialog'
import { Toast } from '@/app/warehouse-personnel/_components/Toast'

const MY_ID   = 'DP4'
const MY_NAME = 'Tunde Bello'

const STAGE_MAP: Record<StageTab, Stage[]> = {
  'Assigned':            ['Dispatch Assigned'],
  'Containerization':    ['Containerization'],
  'Waybill Pending':     ['Waybill Pending Signature'],
  'Waybill Done':        ['Waybill Done'],
  'Awaiting Deckspace':  ['Awaiting Deckspace'],
  'Shipped':             ['Shipped'],
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
      LIVE_ORDERS.filter(o =>
        o.assignedTo === MY_ID &&
        ['Dispatch Assigned', 'Containerization', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace', 'Shipped'].includes(o.stage)
      )
    )
  )
  // CCU assigned to me by QAQC — derived from my orders' assignedCCUSerial
  const [assignedCCU, setAssignedCCU] = useState<CCUContainer | undefined>(() => {
    const serial = LIVE_ORDERS.find(o => o.assignedTo === MY_ID && o.assignedCCUSerial)?.assignedCCUSerial
    return serial ? LIVE_CCU_FLEET.find(c => c.serialNumber === serial) : undefined
  })

  const [activeTab, setActiveTab] = useState<StageTab>('Assigned')
  const [waybillOrder, setWaybillOrder] = useState<WorkOrder | null>(null)
  const [printWaybillOrder, setPrintWaybillOrder] = useState<WorkOrder | null>(null)
  const [vesselOrder, setVesselOrder] = useState<WorkOrder | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const tabCounts = useMemo(() => {
    const counts = {} as Record<StageTab, number>
    for (const tab of STAGE_TABS) {
      counts[tab] = orders.filter(o => STAGE_MAP[tab].includes(o.stage as Stage)).length
    }
    return counts
  }, [orders])

  function refreshContainers() {
    const serial = LIVE_ORDERS.find(o => o.assignedTo === MY_ID && o.assignedCCUSerial)?.assignedCCUSerial
    setAssignedCCU(serial ? LIVE_CCU_FLEET.find(c => c.serialNumber === serial) : undefined)
  }

  function handlePack(orderIds: string[], containerId: string, cargoClass: DangerousGoodsClass) {
    packOrdersIntoContainer(orderIds, containerId, cargoClass, MY_ID, MY_NAME)
    // Sync local order state from LIVE_ORDERS
    setOrders(prev => prev.map(o => {
      if (!orderIds.includes(o.id)) return o
      const live = LIVE_ORDERS.find(l => l.id === o.id)
      return live ? { ...live } : o
    }))
    refreshContainers()
    setActiveTab('Containerization')
  }

  function advanceMultiple(orderIds: string[], nextStage: Stage) {
    setOrders(prev => prev.map(o => orderIds.includes(o.id) ? { ...o, stage: nextStage, elapsedHours: 0 } : o))
    for (const id of orderIds) {
      const lo = LIVE_ORDERS.find(o => o.id === id)
      if (lo) lo.stage = nextStage
    }
  }

  function handleRequestDeckspace(orderId: string) {
    const liveOrder = LIVE_ORDERS.find(o => o.id === orderId)
    if (liveOrder) liveOrder.stage = 'Awaiting Deckspace'
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage: 'Awaiting Deckspace' as Stage, elapsedHours: 0 } : o))
    setVesselOrder(null)
    setActiveTab('Awaiting Deckspace')
  }

  function handleMarkShipped(orderId: string) {
    markShipped(orderId, MY_ID, MY_NAME)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, stage: 'Shipped' as Stage, elapsedHours: 0 } : o))
    setActiveTab('Shipped')
  }

  const containerGroups   = useMemo(() => groupByContainer(orders.filter(o => o.stage === 'Containerization'), o => o.containerId ?? 'no-container'), [orders])
  const waybillDoneGroups = useMemo(() => groupByContainer(orders.filter(o => o.stage === 'Waybill Done'), o => o.containerId ?? o.id), [orders])

  const assignedOrders       = orders.filter(o => o.stage === 'Dispatch Assigned')
  const waybillPendingOrders = orders.filter(o => o.stage === 'Waybill Pending Signature')
  const awaitingOrders       = orders.filter(o => o.stage === 'Awaiting Deckspace')
  const shippedOrders        = orders.filter(o => o.stage === 'Shipped')

  const totalActive = assignedOrders.length + Object.keys(containerGroups).length

  return (
    <AppShell
      role="dsp_per"
      currentPath="/dispatch-personnel"
      title="My Tasks"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'My Tasks' }]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard label="My Active Tasks" value={totalActive}          color="#8B5CF6" icon={ClipboardCheck} />
        <StatCard label="Shipped"         value={shippedOrders.length} color="#16A34A" icon={ShipIcon} />
      </div>

      <StageTabBar active={activeTab} counts={tabCounts} onSelect={setActiveTab} />

      {activeTab === 'Assigned' && (
        <AssignedTab
          orders={assignedOrders}
          assignedCCU={assignedCCU}
          onPack={handlePack}
        />
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
          onPrintWaybill={setPrintWaybillOrder}
        />
      )}

      {activeTab === 'Awaiting Deckspace' && (
        <AwaitingDeckspaceTab orders={awaitingOrders} onMarkShipped={handleMarkShipped} />
      )}

      {activeTab === 'Shipped' && (
        <ShippedTab orders={shippedOrders} onPrintWaybill={setPrintWaybillOrder} />
      )}

      {waybillOrder && (
        <WaybillDialog
          order={waybillOrder}
          onClose={() => setWaybillOrder(null)}
          onConfirm={() => {
            const wb = setWaybillPending(waybillOrder.id, MY_ID, MY_NAME)
            setOrders(prev => prev.map(o => o.id === waybillOrder.id ? { ...o, waybillNumber: wb, waybillApproved: false } : o))
            setWaybillOrder(null)
            showToast(`Waybill ${wb} sent successfully — awaiting executive signature.`)
          }}
        />
      )}

      {printWaybillOrder && (
        <WaybillDocument
          order={printWaybillOrder}
          mode="approved"
          onClose={() => setPrintWaybillOrder(null)}
        />
      )}

      {vesselOrder && (
        <VesselRequestDialog
          order={vesselOrder}
          onConfirm={() => handleRequestDeckspace(vesselOrder.id)}
          onClose={() => setVesselOrder(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </AppShell>
  )
}
