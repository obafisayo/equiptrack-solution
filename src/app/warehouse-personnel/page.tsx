'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ClipboardCheck, CheckCircle2, AlertTriangle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { WORK_ORDERS, type WorkOrder, sortNewestFirst } from '@/lib/mock-data'
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
      WORK_ORDERS.filter(
        o =>
          o.assignedTo === MY_ID &&
          ['Warehouse Assigned', 'Processing', 'GI Created'].includes(o.stage)
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

    if (action === 'process') {
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, stage: 'Processing' as Stage, elapsedHours: 0 } : o)
      )
      showToast('Order moved to Processing')
    } else if (action === 'gi') {
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, stage: 'GI Created' as Stage, elapsedHours: 0 } : o)
      )
      showToast('GI created - order is ready for dispatch transfer')
    } else if (action === 'transfer') {
      setOrders(prev => prev.filter(o => o.id !== orderId))
      showToast('Transferred to Dispatch. Track progress in History.')
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
      'Processing':         orders.filter(o => o.stage === 'Processing').length,
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
      title: 'Start Processing',
      description: 'Mark this order as being actively processed. Stage will update to Processing.',
      label: 'Start Processing',
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
        <StatCard label="Completed Today" value={3} color="#22C55E" icon={CheckCircle2} />
        <StatCard
          label="SLA At Risk"
          value={atRisk}
          color={atRisk > 0 ? '#EF4444' : '#22C55E'}
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
