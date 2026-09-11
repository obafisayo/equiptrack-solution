'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { type WorkOrder, type Container, sortNewestFirst } from '@/lib/mock-data'
import { LIVE_ORDERS, LIVE_CONTAINERS, LIVE_CCU_FLEET, assignCCUFromFleet } from '@/lib/workflow-store'
import { type Stage } from '@/lib/lifecycle'
import { QaqcStats } from './_components/QaqcStats'
import { PreloadQaqcSection } from './_components/PreloadQaqcSection'
import { ContainerizationSection } from './_components/ContainerizationSection'
import { PostQaqcSection } from './_components/PostQaqcSection'
import { CCUPickerModal } from './_components/CCUPickerModal'
import { InspectDialog } from './_components/InspectDialog'
import type { CCUContainer } from '@/app/qaqc/containers/_components/types'

const QAQC_OFFICER = 'QA1'
const QAQC_OFFICER_NAME = 'Femi Emmanuel'

export default function QAQCPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    sortNewestFirst(
      LIVE_ORDERS.filter(o => ['Dispatch Assigned', 'Preload QAQC', 'Containerization', 'Post QAQC'].includes(o.stage))
    )
  )
  const [containers, setContainers] = useState<Container[]>(() => [...LIVE_CONTAINERS])
  const [ccuFleet, setCcuFleet] = useState<CCUContainer[]>(() => [...LIVE_CCU_FLEET])
  const [inspectOrder, setInspectOrder] = useState<WorkOrder | null>(null)

  // pending container assignment modal state — personnel-based
  const [assigningPersonnel, setAssigningPersonnel] = useState<{
    id: string; name: string; destination: string
  } | null>(null)

  const preloadQAQC        = useMemo(() => orders.filter(o => o.stage === 'Dispatch Assigned' || o.stage === 'Preload QAQC'), [orders])
  const inContainerization = useMemo(() => orders.filter(o => o.stage === 'Containerization'), [orders])
  const postQAQC           = useMemo(() => orders.filter(o => o.stage === 'Post QAQC'), [orders])
  const availableContainerCount = ccuFleet.filter(c => c.available).length

  const containerGroups = useMemo(() => {
    const map = new Map<string, WorkOrder[]>()
    for (const o of inContainerization) {
      const key = o.containerId ?? '__none__'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(o)
    }
    return map
  }, [inContainerization])

  // QAQC picks a CCU serial from the fleet and assigns it to dispatch personnel
  function handleAssignCCU(serialNumber: string) {
    if (!assigningPersonnel) return
    assignCCUFromFleet(serialNumber, assigningPersonnel.id, assigningPersonnel.destination)
    setCcuFleet([...LIVE_CCU_FLEET])
    // Reflect the updated assignedCCUSerial on the orders in local state
    setOrders(prev => prev.map(o =>
      o.assignedTo === assigningPersonnel.id ? { ...o, assignedCCUSerial: serialNumber } : o
    ))
    setAssigningPersonnel(null)
  }

  function handleApprove(orderId: string, _notes: string) {
    const liveOrder = LIVE_ORDERS.find(o => o.id === orderId)
    if (liveOrder) liveOrder.stage = 'Waybill Pending Signature'

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

    // Release container when all its orders leave containerization
    const approvingOrder = orders.find(o => o.id === orderId)
    if (approvingOrder?.containerId) {
      const cid = approvingOrder.containerId
      const remaining = orders.filter(o => o.id !== orderId && o.containerId === cid && o.stage === 'Containerization')
      if (remaining.length === 0) {
        const liveC = LIVE_CONTAINERS.find(c => c.id === cid)
        if (liveC) { liveC.status = 'available'; liveC.destination = undefined; liveC.workOrderIds = [] }
        setContainers([...LIVE_CONTAINERS])
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
      <QaqcStats
        preloadCount={preloadQAQC.length}
        containerizationCount={inContainerization.length}
        postQaqcCount={postQAQC.length}
        availableContainerCount={availableContainerCount}
      />

      <PreloadQaqcSection
        orders={preloadQAQC}
        onAssignContainer={(pid, pname, dest) => setAssigningPersonnel({ id: pid, name: pname, destination: dest })}
      />

      <ContainerizationSection
        orders={inContainerization}
        containerGroups={containerGroups}
        containers={containers}
      />

      <PostQaqcSection orders={postQAQC} onInspect={setInspectOrder} />

      <CCUPickerModal
        open={!!assigningPersonnel}
        destination={assigningPersonnel?.destination ?? ''}
        personnelName={assigningPersonnel?.name ?? ''}
        ccuFleet={ccuFleet}
        onAssign={handleAssignCCU}
        onClose={() => setAssigningPersonnel(null)}
      />

      <InspectDialog
        order={inspectOrder}
        open={!!inspectOrder}
        onApprove={notes => inspectOrder && handleApprove(inspectOrder.id, notes)}
        onReject={() => inspectOrder && handleReject(inspectOrder.id)}
        onClose={() => setInspectOrder(null)}
      />
    </AppShell>
  )
}
