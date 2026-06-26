'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { AssignModal } from '@/components/domain/AssignModal'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { WORK_ORDERS, type WorkOrder, getPersonnelByDept } from '@/lib/mock-data'
import { STAGE_REVERSAL, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS } from '@/config/sla'

const DISPATCH_STAGES: Stage[] = [
  'Dispatch Queue', 'Dispatch Assigned', 'Preload QAQC',
  'Containerization', 'Post QAQC', 'Waybill Pending Signature',
  'Waybill Done', 'Awaiting Deckspace',
]

const TABS = ['Dispatch Queue', 'Assigned', 'QAQC', 'Waybill', 'Deckspace'] as const
type Tab = typeof TABS[number]

const TAB_STAGES: Record<Tab, Stage[]> = {
  'Dispatch Queue':  ['Dispatch Queue'],
  'Assigned':        ['Dispatch Assigned'],
  'QAQC':            ['Preload QAQC', 'Containerization', 'Post QAQC'],
  'Waybill':         ['Waybill Pending Signature', 'Waybill Done'],
  'Deckspace':       ['Awaiting Deckspace'],
}

export default function DispatchSupervisorPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(
    WORK_ORDERS.filter(o => DISPATCH_STAGES.includes(o.stage))
  )
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [assigningOrder, setAssigningOrder] = useState<WorkOrder | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('Dispatch Queue')
  const [slaOpen, setSlaOpen] = useState(true)

  const dispatchPersonnel = getPersonnelByDept('dispatch')

  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null

  // SLA breaches in dispatch stages
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

  const queueCount      = orders.filter(o => o.stage === 'Dispatch Queue').length
  const assignedCount   = orders.filter(o => o.stage === 'Dispatch Assigned').length
  const qaqcCount       = orders.filter(o => ['Preload QAQC','Containerization','Post QAQC'].includes(o.stage)).length
  const deckspaceCount  = orders.filter(o => o.stage === 'Awaiting Deckspace').length

  const tabOrders = orders.filter(o => TAB_STAGES[activeTab].includes(o.stage))

  function handleAssign(personnelId: string, personnelName: string) {
    if (!assigningOrder) return
    setOrders(prev => prev.map(o =>
      o.id === assigningOrder.id
        ? {
            ...o,
            assignedTo: personnelId,
            assignedToName: personnelName,
            stage: 'Dispatch Assigned',
            elapsedHours: 0,
            stageHistory: [
              ...o.stageHistory,
              { stage: o.stage, personId: o.assignedTo ?? 'dsp_sup', personName: o.assignedToName ?? 'Chika Obi', startedAt: new Date(Date.now() - o.elapsedHours * 3600000).toISOString(), endedAt: new Date().toISOString(), durationHours: o.elapsedHours },
            ],
          }
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

  return (
    <AppShell role="dsp_sup" currentPath="/dispatch" title="Dispatch Dashboard">
      {/* SLA BREACHES */}
      {slaBreaches.length > 0 && (
        <section className="mb-6">
          <button
            onClick={() => setSlaOpen(o => !o)}
            className="flex items-center gap-2 w-full mb-3 group"
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
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Dispatch Queue" value={queueCount} color="#8B5CF6" />
        <StatCard label="Active (Assigned)" value={assignedCount} color="#3B82F6" />
        <StatCard label="QAQC Pending" value={qaqcCount} color="#F59E0B" />
        <StatCard label="Awaiting Deckspace" value={deckspaceCount} color="#10B981" />
      </div>

      {/* TABS */}
      <div className="mb-4 border-b border-border-default">
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-150 ${
                activeTab === tab
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {orders.filter(o => TAB_STAGES[tab].includes(o.stage)).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <SectionTitle title={activeTab} count={tabOrders.length} />

      {tabOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No orders in this stage.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tabOrders.map(o => (
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
