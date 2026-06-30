'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { WORK_ORDERS, CONTAINERS, type WorkOrder, type Container, sortNewestFirst } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { QaqcStats } from './_components/QaqcStats'
import { PreloadQaqcSection } from './_components/PreloadQaqcSection'
import { ContainerizationSection } from './_components/ContainerizationSection'
import { PostQaqcSection } from './_components/PostQaqcSection'
import { ContainerModal } from './_components/ContainerModal'
import { InspectDialog } from './_components/InspectDialog'

const QAQC_OFFICER = 'QA1'
const QAQC_OFFICER_NAME = 'Femi Emmanuel'

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
      <QaqcStats
        preloadCount={preloadQAQC.length}
        containerizationCount={inContainerization.length}
        postQaqcCount={postQAQC.length}
        availableContainerCount={availableContainerCount}
      />

      <PreloadQaqcSection orders={preloadQAQC} onAssignContainer={setContainerModalOrder} />

      <ContainerizationSection
        orders={inContainerization}
        containerGroups={containerGroups}
        containers={containers}
      />

      <PostQaqcSection orders={postQAQC} onInspect={setInspectOrder} />

      {containerModalOrder && (
        <ContainerModal
          order={containerModalOrder}
          containers={containers}
          allOrders={orders}
          onAssign={cid => handleAssignContainer(containerModalOrder.id, cid)}
          onClose={() => setContainerModalOrder(null)}
        />
      )}

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
