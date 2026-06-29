'use client'

import { useState, useMemo } from 'react'
import { Truck, UserCheck, ShieldCheck, Anchor, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { AssignModal } from '@/components/domain/AssignModal'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, PERSONNEL, type WorkOrder, sortNewestFirst, getPersonnelByDept } from '@/lib/mock-data'
import { STAGE_REVERSAL, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'

const DISPATCH_STAGES: Stage[] = [
  'Dispatch Queue', 'Dispatch Assigned', 'Preload QAQC',
  'Containerization', 'Post QAQC', 'Waybill Pending Signature',
  'Waybill Done', 'Awaiting Deckspace',
]

type MainTab = 'Queue' | 'Personnel Tasks'
const QUEUE_SUBTABS = ['Dispatch Queue', 'Assigned', 'QAQC', 'Waybill', 'Deckspace'] as const
type QueueSubTab = typeof QUEUE_SUBTABS[number]

const QUEUE_STAGE_MAP: Record<QueueSubTab, Stage[]> = {
  'Dispatch Queue': ['Dispatch Queue'],
  'Assigned':       ['Dispatch Assigned'],
  'QAQC':           ['Preload QAQC', 'Containerization', 'Post QAQC'],
  'Waybill':        ['Waybill Pending Signature', 'Waybill Done'],
  'Deckspace':      ['Awaiting Deckspace'],
}

const DISPATCH_PERSONNEL = PERSONNEL.filter(p => p.dept === 'dispatch')

const PERSONNEL_STAGES: Stage[] = ['Dispatch Assigned', 'Containerization', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace']

export default function DispatchSupervisorPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    sortNewestFirst(WORK_ORDERS.filter(o => DISPATCH_STAGES.includes(o.stage)))
  )
  const [mainTab, setMainTab] = useState<MainTab>('Queue')
  const [queueSubTab, setQueueSubTab] = useState<QueueSubTab>('Dispatch Queue')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [assigningOrder, setAssigningOrder] = useState<WorkOrder | null>(null)
  const [slaOpen, setSlaOpen] = useState(true)

  const dispatchPersonnel = getPersonnelByDept('dispatch')
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

  const subTabOrders = useMemo(
    () => orders.filter(o => QUEUE_STAGE_MAP[queueSubTab].includes(o.stage)),
    [orders, queueSubTab]
  )

  function handleAssign(personnelId: string, personnelName: string) {
    if (!assigningOrder) return
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
    setOrders(prev => prev.map(o =>
      o.id === order.id
        ? { ...o, stage: prevStage, elapsedHours: 0, assignedTo: null, assignedToName: null }
        : o
    ))
    setSelectedOrderId(null)
  }

  function advanceStage(orderId: string, nextStage: Stage) {
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
      {/* SLA BREACHES */}
      {slaBreaches.length > 0 && (
        <section className="mb-6">
          <button
            type="button"
            onClick={() => setSlaOpen(o => !o)}
            className="flex items-center gap-2 w-full mb-3"
          >
            <span className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-700 tracking-wider uppercase">
                SLA BREACHED — {slaBreaches.length} order{slaBreaches.length !== 1 ? 's' : ''}
              </span>
            </span>
            <span className="text-xs text-gray-400">{slaOpen ? '▲ collapse' : '▼ expand'}</span>
          </button>
          {slaOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {slaBreaches.map(o => (
                <WorkOrderCard
                  key={o.id}
                  order={o}
                  onClick={() => setSelectedOrderId(o.id)}
                  onAssign={() => setAssigningOrder(o)}
                  onReverse={() => handleReverse(o)}
                  isSelected={selectedOrderId === o.id}
                  showActions
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* STAT ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Dispatch Queue"    value={queueCount}    color="#8B5CF6" icon={Truck} />
        <StatCard label="Active (Assigned)" value={assignedCount} color="#3B82F6" icon={UserCheck} />
        <StatCard label="QAQC Pending"      value={qaqcCount}     color="#F59E0B" icon={ShieldCheck} />
        <StatCard label="Awaiting Deckspace" value={deckspaceCount} color="#10B981" icon={Anchor} />
      </div>

      {/* MAIN TABS */}
      <div className="mb-5 border-b border-border-default">
        <div className="flex gap-0.5">
          {(['Queue', 'Personnel Tasks'] as MainTab[]).map(tab => (
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

      {/* ── QUEUE VIEW ── */}
      {mainTab === 'Queue' && (
        <>
          <div className="mb-4 border-b border-border-default">
            <div className="flex gap-0.5 overflow-x-auto">
              {QUEUE_SUBTABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setQueueSubTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150 ${
                    queueSubTab === tab
                      ? 'border-brand-500 text-brand-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    queueSubTab === tab ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {orders.filter(o => QUEUE_STAGE_MAP[tab].includes(o.stage)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <SectionTitle title={queueSubTab} count={subTabOrders.length} className="mb-3" />

          {subTabOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No orders in this stage.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {subTabOrders.map(o => (
                <WorkOrderCard
                  key={o.id}
                  order={o}
                  onClick={() => setSelectedOrderId(o.id)}
                  onAssign={() => setAssigningOrder(o)}
                  onReverse={() => handleReverse(o)}
                  isSelected={selectedOrderId === o.id}
                  showActions
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── PERSONNEL TASKS VIEW ── */}
      {mainTab === 'Personnel Tasks' && (
        <div className="space-y-6">
          {DISPATCH_PERSONNEL.map(person => {
            const personOrders = sortNewestFirst(
              orders.filter(o => o.assignedTo === person.id && PERSONNEL_STAGES.includes(o.stage))
            )

            return (
              <section key={person.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-violet-700">
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
                        className={`h-full rounded-full ${person.active / person.capacity >= 0.9 ? 'bg-red-500' : 'bg-violet-500'}`}
                        style={{ width: `${Math.min(100, Math.round((person.active / person.capacity) * 100))}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                      {Math.round((person.active / person.capacity) * 100)}% load
                    </p>
                  </div>
                </div>

                {personOrders.length === 0 ? (
                  <p className="text-xs text-gray-400 ml-11 mb-1">No active tasks in dispatch stages.</p>
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
                              {o.stage === 'Dispatch Assigned' && (
                                <button
                                  type="button"
                                  onClick={() => advanceStage(o.id, 'Containerization')}
                                  className="text-[11px] font-semibold px-2.5 py-1 rounded bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                                >
                                  Start Packing
                                </button>
                              )}
                              {o.stage === 'Containerization' && (
                                <button
                                  type="button"
                                  onClick={() => advanceStage(o.id, 'Post QAQC')}
                                  className="text-[11px] font-semibold px-2.5 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                                >
                                  Submit QAQC
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => { setSelectedOrderId(o.id); setMainTab('Queue') }}
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
      <DetailPanel
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onAssign={o => setAssigningOrder(o)}
        onReverse={handleReverse}
        role="dsp_sup"
      />

      {/* ASSIGN MODAL */}
      <AssignModal
        order={assigningOrder}
        personnel={dispatchPersonnel}
        onConfirm={handleAssign}
        onClose={() => setAssigningOrder(null)}
      />
    </AppShell>
  )
}
