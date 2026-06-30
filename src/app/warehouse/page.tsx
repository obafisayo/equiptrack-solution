'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { AssignModal } from '@/components/domain/AssignModal'
import { WORK_ORDERS, type WorkOrder, getPersonnelByDept, sortNewestFirst } from '@/lib/mock-data'
import { STAGE_REVERSAL, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, type UrgencyLevel } from '@/config/sla'
import { SlaBreachesSection } from './_components/SlaBreachesSection'
import { StatsRow } from './_components/StatsRow'
import { MainTabBar, type MainTab } from './_components/MainTabBar'
import { OverviewTab } from './_components/OverviewTab'
import { PersonnelTasksTab } from './_components/PersonnelTasksTab'

const WAREHOUSE_STAGES: Stage[] = [
  'New Request',
  'Warehouse Assigned',
  'Processing',
  'GI Created',
  'Transferred to Dispatch',
]

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
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    sortNewestFirst(
      WORK_ORDERS.filter(o => WAREHOUSE_STAGES.includes(o.stage as Stage) || o.stage === 'Pending Base Coordinator Approval')
    )
  )
  const [mainTab, setMainTab] = useState<MainTab>('Overview')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null)
  const [stageFilter, setStageFilter] = useState<string>('All')
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'All'>('All')
  const [breachesCollapsed, setBreachesCollapsed] = useState(false)
  const [incomingTab, setIncomingTab] = useState<UrgencyLevel | 'All'>('All')

  const warehousePersonnel = getPersonnelByDept('warehouse')

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

  function handleAssign(orderId: string, personnelId: string, name: string) {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? { ...o, assignedTo: personnelId, assignedToName: name, stage: 'Warehouse Assigned' as Stage, elapsedHours: 0 }
          : o
      )
    )
    setAssigningOrderId(null)
  }

  function handleReverse(orderId: string) {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o
        const prevStage = STAGE_REVERSAL[o.stage as Stage]
        if (!prevStage) return o
        return { ...o, stage: prevStage, elapsedHours: 0 }
      })
    )
  }

  function advanceStageOnPersonnel(orderId: string, nextStage: Stage) {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, stage: nextStage, elapsedHours: 0 } : o
    ))
  }

  const processingToday = Math.round(activeOrders.length * 0.25)

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
        onReverseOrder={handleReverse}
      />

      <StatsRow
        activeOrdersCount={activeOrders.length}
        breachedOrdersCount={breachedOrders.length}
        processingToday={processingToday}
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
          onReverseOrder={handleReverse}
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
          onReverse={() => handleReverse(selectedOrder.id)}
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
    </AppShell>
  )
}
