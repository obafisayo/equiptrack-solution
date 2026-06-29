'use client'

import { useState, useMemo } from 'react'
import { Package, AlertTriangle, Clock, Timer, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { AssignModal } from '@/components/domain/AssignModal'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Select } from '@/components/ui/Form'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, type WorkOrder, getPersonnelByDept, sortNewestFirst } from '@/lib/mock-data'
import { STAGE_REVERSAL, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours, type UrgencyLevel } from '@/config/sla'

const WAREHOUSE_STAGES: Stage[] = [
  'New Request',
  'Warehouse Assigned',
  'Processing',
  'GI Created',
  'Transferred to Dispatch',
]

const STAGE_FILTER_OPTIONS = ['All', ...WAREHOUSE_STAGES, 'Near SLA']
const URGENCY_OPTIONS: Array<UrgencyLevel | 'All'> = ['All', 'Urgent', 'High', 'Medium', 'Low']

type MainTab = 'Overview' | 'Personnel Tasks'

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

const PERSONNEL_STAGES: Stage[] = ['Warehouse Assigned', 'Processing', 'GI Created']

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
      {/* SLA BREACHES */}
      <section className="mb-6">
        <button
          type="button"
          onClick={() => setBreachesCollapsed(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-card bg-red-50 border border-red-200/70 text-left mb-3 hover:bg-red-100 transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-red-700 uppercase tracking-wider">SLA BREACHES</span>
            {breachedOrders.length > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-red-600 text-white text-xs font-bold">
                {breachedOrders.length}
              </span>
            )}
          </div>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={`text-red-600 transition-transform duration-150 ${breachesCollapsed ? '-rotate-90' : ''}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {!breachesCollapsed && (
          breachedOrders.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-card bg-green-50 border border-green-200/70 text-sm text-green-700 font-medium">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Active Orders" value={activeOrders.length} icon={Package} />
        <StatCard
          label="SLA Breaches"
          value={breachedOrders.length}
          color={breachedOrders.length > 0 ? '#EF4444' : '#22C55E'}
          icon={AlertTriangle}
        />
        <StatCard label="Processing Today" value={processingToday} icon={Clock} />
        <StatCard label="Avg Cycle Time" value="4h 12m" icon={Timer} />
      </div>

      {/* MAIN TABS */}
      <div className="mb-5 border-b border-border-default">
        <div className="flex gap-0.5">
          {(['Overview', 'Personnel Tasks'] as MainTab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setMainTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
                mainTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'Personnel Tasks' && <Users size={14} />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      {mainTab === 'Overview' && (
        <>
          {/* PENDING INCOMING QUEUE */}
          <section className="mb-6">
            <SectionTitle title="Pending Incoming Queue" count={incomingOrders.length} className="mb-3" />
            <div className="flex gap-2 flex-wrap mb-3">
              {URGENCY_OPTIONS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setIncomingTab(tab)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${
                    incomingTab === tab
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-white border-border-default text-gray-600 hover:border-gray-300'
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
                    type="button"
                    onClick={() => setStageFilter(f)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
                      stageFilter === f
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'bg-white border-border-default text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <Select
                  title="Filter by urgency"
                  value={urgencyFilter}
                  onChange={e => setUrgencyFilter(e.target.value as UrgencyLevel | 'All')}
                  size="sm"
                  className="ml-2 w-auto min-w-28"
                >
                  {URGENCY_OPTIONS.map(u => (
                    <option key={u} value={u}>{u === 'All' ? 'All Urgency' : u}</option>
                  ))}
                </Select>
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
        </>
      )}

      {/* ── PERSONNEL TASKS VIEW ── */}
      {mainTab === 'Personnel Tasks' && (
        <div className="space-y-6">
          {warehousePersonnel.map(person => {
            const personOrders = sortNewestFirst(
              orders.filter(o => o.assignedTo === person.id && PERSONNEL_STAGES.includes(o.stage as Stage))
            )

            return (
              <section key={person.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-700">
                      {person.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.role} · {person.active} active / {person.capacity} capacity</p>
                  </div>
                  <div className="w-24">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${person.active / person.capacity >= 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, Math.round((person.active / person.capacity) * 100))}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                      {Math.round((person.active / person.capacity) * 100)}% load
                    </p>
                  </div>
                </div>

                {personOrders.length === 0 ? (
                  <p className="text-xs text-gray-400 ml-11 mb-1">No active tasks in warehouse stages.</p>
                ) : (
                  <div className="space-y-2 ml-11">
                    {personOrders.map(o => {
                      const slaHrs = STAGE_SLA_HOURS[o.stage]
                      const breached = slaHrs != null && o.elapsedHours > slaHrs

                      return (
                        <Card key={o.id} className={`p-3 relative overflow-hidden ${breached ? 'border-red-200' : ''}`}>
                          {breached && <div className="absolute top-0 left-0 right-0 h-0.75 bg-red-500" />}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs font-bold text-brand-500">{o.id}</span>
                                <StagePill stage={o.stage} />
                              </div>
                              <p className="text-xs text-gray-700 font-medium truncate">{o.destination}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.requestType}</p>
                              {slaHrs && (
                                <div className="mt-1.5">
                                  <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0">
                              {o.stage === 'Warehouse Assigned' && (
                                <button
                                  type="button"
                                  onClick={() => advanceStageOnPersonnel(o.id, 'Processing')}
                                  className="text-[11px] font-semibold px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  Start Processing
                                </button>
                              )}
                              {o.stage === 'Processing' && (
                                <button
                                  type="button"
                                  onClick={() => advanceStageOnPersonnel(o.id, 'GI Created')}
                                  className="text-[11px] font-semibold px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  Create GI
                                </button>
                              )}
                              {o.stage === 'GI Created' && (
                                <button
                                  type="button"
                                  onClick={() => advanceStageOnPersonnel(o.id, 'Transferred to Dispatch')}
                                  className="text-[11px] font-semibold px-2.5 py-1 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
                                >
                                  Transfer
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => { setSelectedOrderId(o.id); setMainTab('Overview') }}
                                className="text-[11px] font-medium px-2.5 py-1 rounded border border-border-default text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1.5">{fmtHours(o.elapsedHours)} in stage</p>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}

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
