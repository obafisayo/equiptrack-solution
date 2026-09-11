'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ClipboardCheck, CheckCircle2, AlertTriangle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { type WorkOrder, sortNewestFirst } from '@/lib/mock-data'
import { LIVE_ORDERS } from '@/lib/workflow-store'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'
import { Toast } from './_components/Toast'
import { ConfirmDialog } from './_components/ConfirmDialog'
import { TaskFilterBar, type TaskFilter } from './_components/TaskFilterBar'
import { TaskCard, type TaskAction } from './_components/TaskCard'

const MY_ID = 'WH1'

export default function WarehousePersonnelPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    sortNewestFirst(
      LIVE_ORDERS.filter(
        o =>
          o.assignedTo === MY_ID &&
          ['Warehouse Assigned', 'Picking', 'GI Created'].includes(o.stage)
      )
    )
  )
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('All')
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; action: TaskAction } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleAction(orderId: string, action: TaskAction) {
    setConfirmAction({ orderId, action })
  }

  function executeAction() {
    if (!confirmAction) return
    const { orderId, action } = confirmAction
    const now = new Date().toISOString()

    const liveOrder = LIVE_ORDERS.find(o => o.id === orderId)

    if (action === 'process') {
      if (liveOrder) {
        const cur = liveOrder.stageHistory[liveOrder.stageHistory.length - 1]
        if (cur && !cur.endedAt) { cur.endedAt = now; cur.personId = MY_ID; cur.personName = 'Emeka Okonkwo' }
        liveOrder.stage = 'Picking'
        liveOrder.stageHistory.push({ stage: 'Picking' as Stage, personId: MY_ID, personName: 'Emeka Okonkwo', startedAt: now })
      }
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, stage: 'Picking' as Stage, elapsedHours: 0 } : o)
      )
      showToast('Order moved to Processing')
    } else if (action === 'gi') {
      if (liveOrder) {
        const cur = liveOrder.stageHistory[liveOrder.stageHistory.length - 1]
        if (cur && !cur.endedAt) { cur.endedAt = now; cur.personId = MY_ID; cur.personName = 'Emeka Okonkwo' }
        liveOrder.stage = 'GI Created'
        liveOrder.stageHistory.push({ stage: 'GI Created' as Stage, personId: MY_ID, personName: 'Emeka Okonkwo', startedAt: now })
      }
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, stage: 'GI Created' as Stage, elapsedHours: 0 } : o)
      )
      showToast('GI created — order is ready for dispatch transfer')
    } else if (action === 'transfer') {
      if (liveOrder) {
        const cur = liveOrder.stageHistory[liveOrder.stageHistory.length - 1]
        if (cur && !cur.endedAt) { cur.endedAt = now; cur.personId = MY_ID; cur.personName = 'Emeka Okonkwo'; cur.durationHours = liveOrder.elapsedHours }
        liveOrder.stage = 'Dispatch Queue'
        liveOrder.assignedTo = null
        liveOrder.assignedToName = null
        liveOrder.stageHistory.push({ stage: 'Dispatch Queue' as Stage, personId: null, personName: null, startedAt: now })
      }
      setOrders(prev => prev.filter(o => o.id !== orderId))
      showToast('Transferred to Dispatch Queue.')
    }
    setConfirmAction(null)
  }

  // Per-filter counts
  const filterCounts = useMemo(() => {
    const nearSla = orders.filter(o => {
      const sla = STAGE_SLA_HOURS[o.stage]
      if (!sla) return false
      const pct = o.elapsedHours / sla
      return pct >= 0.75
    }).length

    return {
      'All':                orders.length,
      'Warehouse Assigned': orders.filter(o => o.stage === 'Warehouse Assigned').length,
      'Picking':         orders.filter(o => o.stage === 'Picking').length,
      'GI Created':         orders.filter(o => o.stage === 'GI Created').length,
      'Near SLA':           nearSla,
    } satisfies Record<TaskFilter, number>
  }, [orders])

  const filteredOrders = useMemo(() => {
    if (taskFilter === 'All') return orders
    if (taskFilter === 'Near SLA') {
      return orders.filter(o => {
        const sla = STAGE_SLA_HOURS[o.stage]
        if (!sla) return false
        return o.elapsedHours / sla >= 0.75
      })
    }
    return orders.filter(o => o.stage === taskFilter)
  }, [orders, taskFilter])

  const atRisk = filterCounts['Near SLA']
  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null

  const confirmMeta: Record<TaskAction, { title: string; description: string; label: string }> = {
    process: {
      title: 'Confirm Item Picked',
      description: 'Make sure that the item is picked before marking as picked.',
      label: 'Yes, Mark as Picked',
    },
    gi: {
      title: 'Create Goods Issue',
      description: 'Confirm all items have been picked and GI document is ready.',
      label: 'Confirm GI Created',
    },
    transfer: {
      title: 'Transfer to Dispatch',
      description: 'This will send the order to the Dispatch team. It will leave your active task list.',
      label: 'Transfer to Dispatch',
    },
  }

  return (
    <AppShell
      role="wh_per"
      currentPath="/warehouse-personnel"
      title="My Tasks"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'My Tasks' }]}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Emeka Okonkwo</span>
          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            Warehouse Personnel
          </span>
        </div>
        <Link
          href="/warehouse-personnel/history"
          className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1"
        >
          View History
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="My Active Tasks" value={orders.length} icon={ClipboardCheck} />
        <StatCard label="Completed Today" value={3} color="#16A34A" icon={CheckCircle2} />
        <StatCard
          label="SLA At Risk"
          value={atRisk}
          color={atRisk > 0 ? '#DC2626' : '#16A34A'}
          icon={AlertTriangle}
        />
      </div>

      <TaskFilterBar active={taskFilter} counts={filterCounts} onSelect={setTaskFilter} />

      <SectionTitle title="My Assigned Tasks" count={filteredOrders.length} className="mb-3" />

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No tasks match this filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => (
            <TaskCard
              key={order.id}
              order={order}
              isSelected={selectedOrderId === order.id}
              onSelect={setSelectedOrderId}
              onAction={handleAction}
            />
          ))}
        </div>
      )}

      {confirmAction && confirmMeta[confirmAction.action] && (
        <ConfirmDialog
          title={confirmMeta[confirmAction.action].title}
          description={confirmMeta[confirmAction.action].description}
          confirmLabel={confirmMeta[confirmAction.action].label}
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          role="wh_per"
        />
      )}

      {toast && <Toast message={toast} />}
    </AppShell>
  )
}
