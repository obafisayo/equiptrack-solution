'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { AssignModal } from '@/components/domain/AssignModal'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { WORK_ORDERS, PERSONNEL, type WorkOrder, getPersonnelByDept } from '@/lib/mock-data'
import { STAGE_REVERSAL, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, type UrgencyLevel } from '@/config/sla'

const WAREHOUSE_STAGES: Stage[] = [
  'New Request',
  'Warehouse Assigned',
  'Processing',
  'GI Created',
  'Transferred to Dispatch',
]

const STAGE_FILTER_OPTIONS = ['All', ...WAREHOUSE_STAGES, 'Near SLA']
const URGENCY_OPTIONS: Array<UrgencyLevel | 'All'> = ['All', 'Urgent', 'High', 'Medium', 'Low']

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
    WORK_ORDERS.filter(o => WAREHOUSE_STAGES.includes(o.stage as Stage) || o.stage === 'Pending Base Coordinator Approval')
  )
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
        const prev_stage = STAGE_REVERSAL[o.stage as Stage]
        if (!prev_stage) return o
        return { ...o, stage: prev_stage, elapsedHours: 0 }
      })
    )
  }

  const processingToday = Math.round(activeOrders.length * 0.25)

  return (
    <AppShell role="wh_sup" currentPath="/warehouse" title="Warehouse Dashboard">
      {/* SLA BREACHES */}
      <section className="mb-6">
        <button
          onClick={() => setBreachesCollapsed(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-card bg-status-critical-bg border border-status-critical/30 text-left mb-3 hover:bg-red-100 transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-status-critical uppercase tracking-wider">SLA BREACHES</span>
            {breachedOrders.length > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-status-critical text-white text-xs font-bold">
                {breachedOrders.length}
              </span>
            )}
          </div>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={`text-status-critical transition-transform duration-150 ${breachesCollapsed ? '-rotate-90' : ''}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {!breachesCollapsed && (
          breachedOrders.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-card bg-status-low-bg border border-status-low/30 text-sm text-status-low font-medium">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6 12 2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All SLAs on track
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {breachedOrders.map(order => (
                <WorkOrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrderId(order.id)}
                  onAssign={() => setAssigningOrderId(order.id)}
                  onReverse={() => handleReverse(order.id)}
                  isSelected={selectedOrderId === order.id}
                  showActions
                />
              ))}
            </div>
          )
        )}
      </section>

      {/* STAT ROW */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Active Orders" value={activeOrders.length} />
        <StatCard
          label="SLA Breaches"
          value={breachedOrders.length}
          color={breachedOrders.length > 0 ? '#EF4444' : '#22C55E'}
        />
        <StatCard label="Processing Today" value={processingToday} />
        <StatCard label="Avg Cycle Time" value="4h 12m" />
      </div>

      {/* PENDING INCOMING QUEUE */}
      <section className="mb-6">
        <SectionTitle title="Pending Incoming Queue" count={incomingOrders.length} className="mb-3" />
        <div className="flex gap-2 mb-3">
          {URGENCY_OPTIONS.map(tab => (
            <button
              key={tab}
              onClick={() => setIncomingTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${
                incomingTab === tab
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'bg-white border-border-default text-gray-600 hover:border-brand-300 hover:text-brand-500'
              }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className="ml-1.5 opacity-75">
                  ({incomingOrders.filter(o => o.urgency === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>
        {filteredIncoming.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No incoming requests at this priority</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredIncoming.map(order => (
              <WorkOrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrderId(order.id)}
                onAssign={() => setAssigningOrderId(order.id)}
                isSelected={selectedOrderId === order.id}
                showActions
              />
            ))}
          </div>
        )}
      </section>

      {/* ALL ACTIVE ORDERS */}
      <section>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <SectionTitle title="All Active Orders" count={filteredActive.length} />
          <div className="flex gap-1.5 flex-wrap ml-auto">
            {STAGE_FILTER_OPTIONS.map(f => (
              <button
                key={f}
                onClick={() => setStageFilter(f)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                  stageFilter === f
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'bg-white border-border-default text-gray-600 hover:border-brand-300'
                }`}
              >
                {f}
              </button>
            ))}
            <select
              value={urgencyFilter}
              onChange={e => setUrgencyFilter(e.target.value as UrgencyLevel | 'All')}
              className="ml-2 px-2.5 py-1 rounded-full text-xs font-medium border border-border-default bg-white text-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {URGENCY_OPTIONS.map(u => (
                <option key={u} value={u}>{u === 'All' ? 'All Urgency' : u}</option>
              ))}
            </select>
          </div>
        </div>
        {filteredActive.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No orders match this filter</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredActive.map(order => (
              <WorkOrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrderId(order.id)}
                onAssign={() => setAssigningOrderId(order.id)}
                onReverse={() => handleReverse(order.id)}
                isSelected={selectedOrderId === order.id}
                showActions
              />
            ))}
          </div>
        )}
      </section>

      {/* DETAIL PANEL */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onAssign={() => setAssigningOrderId(selectedOrder.id)}
          onReverse={() => handleReverse(selectedOrder.id)}
          role="wh_sup"
        />
      )}

      {/* ASSIGN MODAL */}
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
