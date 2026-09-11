'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { AssignModal } from '@/components/domain/AssignModal'
import { type WorkOrder, getPersonnelByDept, sortNewestFirst } from '@/lib/mock-data'
import { LIVE_ORDERS } from '@/lib/workflow-store'
import { type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, type UrgencyLevel } from '@/config/sla'
import { SlaBreachesSection } from './_components/SlaBreachesSection'
import { StatsRow } from './_components/StatsRow'
import { MainTabBar, type MainTab } from './_components/MainTabBar'
import { OverviewTab } from './_components/OverviewTab'
import { PersonnelTasksTab } from './_components/PersonnelTasksTab'
import { ReverseStageModal } from './_components/ReverseStageModal'

function isBreached(order: WorkOrder): boolean {
  const sla = STAGE_SLA_HOURS[order.stage]
  return sla != null && order.elapsedHours > sla
}

function isNearSla(order: WorkOrder): boolean {
  const sla = STAGE_SLA_HOURS[order.stage]
  if (!sla) return false
  const pct = order.elapsedHours / sla
  return pct >= 0.75 && pct <= 1
}

export default function WarehouseDashboard() {
  const [orders, setOrders] = useState<WorkOrder[]>(() => sortNewestFirst(LIVE_ORDERS))
  const [mainTab, setMainTab] = useState<MainTab>('Overview')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null)
  const [reversingOrderId, setReversingOrderId] = useState<string | null>(null)
  const [stageFilter, setStageFilter] = useState<string>('All')
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'All'>('All')
  const [breachesCollapsed, setBreachesCollapsed] = useState(false)
  const [incomingTab, setIncomingTab] = useState<UrgencyLevel | 'All'>('All')

  const warehousePersonnel = useMemo(() =>
    getPersonnelByDept('warehouse').map(p => ({
      ...p,
      active: orders.filter(o =>
        o.assignedTo === p.id &&
        ['Warehouse Assigned', 'Picking', 'GI Created'].includes(o.stage)
      ).length,
    })),
    [orders]
  )

  const breachedOrders = useMemo(
    () => orders.filter(isBreached).sort((a, b) => b.elapsedHours - a.elapsedHours),
    [orders]
  )

  const incomingOrders = useMemo(
    () => orders.filter(o => o.stage === 'New Request' || o.stage === 'Warehouse Assigned'),
    [orders]
  )

  const filteredIncoming = useMemo(() => {
    if (incomingTab === 'All') return incomingOrders
    return incomingOrders.filter(o => o.urgency === incomingTab)
  }, [incomingOrders, incomingTab])

  const activeOrders = useMemo(
    () => orders.filter(o => o.stage !== 'Completed' && o.stage !== 'Shipped'),
    [orders]
  )

  const filteredActive = useMemo(() => {
    let list = activeOrders
    if (stageFilter !== 'All' && stageFilter !== 'Near SLA') {
      list = list.filter(o => o.stage === stageFilter)
    }
    if (stageFilter === 'Near SLA') {
      list = list.filter(isNearSla)
    }
    if (urgencyFilter !== 'All') {
      list = list.filter(o => o.urgency === urgencyFilter)
    }
    return list
  }, [activeOrders, stageFilter, urgencyFilter])

  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null
  const assigningOrder = orders.find(o => o.id === assigningOrderId) ?? null
  const reversingOrder = orders.find(o => o.id === reversingOrderId) ?? null

  function handleAssign(orderId: string, personnelId: string, name: string) {
    const live = LIVE_ORDERS.find(o => o.id === orderId)
    if (live) { live.assignedTo = personnelId; live.assignedToName = name; live.stage = 'Warehouse Assigned'; live.elapsedHours = 0 }
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, assignedTo: personnelId, assignedToName: name, stage: 'Warehouse Assigned' as Stage, elapsedHours: 0 }
          : o
      )
    )
    setAssigningOrderId(null)
  }

  function handleReverseToStage(orderId: string, targetStage: Stage) {
    const live = LIVE_ORDERS.find(o => o.id === orderId)
    if (live) { live.stage = targetStage; live.elapsedHours = 0 }
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, stage: targetStage, elapsedHours: 0 } : o
      )
    )
  }

  function advanceStageOnPersonnel(orderId: string, nextStage: Stage) {
    const live = LIVE_ORDERS.find(o => o.id === orderId)
    if (live) { live.stage = nextStage; live.elapsedHours = 0 }
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, stage: nextStage, elapsedHours: 0 } : o
    ))
  }

  return (
    <AppShell
      role="wh_sup"
      currentPath="/warehouse"
      title="Warehouse Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Warehouse' }]}
    >
      <SlaBreachesSection
        breachedOrders={breachedOrders}
        collapsed={breachesCollapsed}
        selectedOrderId={selectedOrderId}
        onToggleCollapsed={() => setBreachesCollapsed(v => !v)}
        onSelectOrder={setSelectedOrderId}
        onAssignOrder={setAssigningOrderId}
        onReverseOrder={setReversingOrderId}
      />

      <StatsRow
        activeOrdersCount={activeOrders.length}
        breachedOrdersCount={breachedOrders.length}
      />

      <MainTabBar active={mainTab} onSelect={setMainTab} />

      {mainTab === 'Overview' && (
        <OverviewTab
          incomingOrders={incomingOrders}
          filteredIncoming={filteredIncoming}
          filteredActive={filteredActive}
          incomingTab={incomingTab}
          stageFilter={stageFilter}
          urgencyFilter={urgencyFilter}
          selectedOrderId={selectedOrderId}
          onSetIncomingTab={setIncomingTab}
          onSetStageFilter={setStageFilter}
          onSetUrgencyFilter={setUrgencyFilter}
          onSelectOrder={setSelectedOrderId}
          onAssignOrder={setAssigningOrderId}
          onReverseOrder={setReversingOrderId}
        />
      )}

      {mainTab === 'Personnel Tasks' && (
        <PersonnelTasksTab
          personnel={warehousePersonnel}
          orders={orders}
          onAdvanceStage={advanceStageOnPersonnel}
          onViewOrder={(id) => { setSelectedOrderId(id); setMainTab('Overview') }}
        />
      )}

      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onAssign={() => setAssigningOrderId(selectedOrder.id)}
          onReverse={() => setReversingOrderId(selectedOrder.id)}
          role="wh_sup"
        />
      )}

      {assigningOrder && (
        <AssignModal
          order={assigningOrder}
          personnel={warehousePersonnel}
          onConfirm={(pid, name) => handleAssign(assigningOrder.id, pid, name)}
          onClose={() => setAssigningOrderId(null)}
        />
      )}

      {reversingOrder && (
        <ReverseStageModal
          currentStage={reversingOrder.stage as Stage}
          orderId={reversingOrder.id}
          onConfirm={handleReverseToStage}
          onClose={() => setReversingOrderId(null)}
        />
      )}
    </AppShell>
  )
}
