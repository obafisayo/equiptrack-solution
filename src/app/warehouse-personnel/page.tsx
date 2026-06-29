'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ClipboardCheck, CheckCircle2, AlertTriangle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { WORK_ORDERS, type WorkOrder, sortNewestFirst } from '@/lib/mock-data'
import { STAGE_SLA_HOURS, fmtHours, type UrgencyLevel } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

const MY_ID = 'WH1'

type TaskFilter = 'All' | 'Warehouse Assigned' | 'Processing' | 'GI Created' | 'Near SLA'

const URGENCY_COLOR: Record<UrgencyLevel, { badge: string }> = {
  Low:    { badge: 'bg-green-50  text-green-700' },
  Medium: { badge: 'bg-amber-50  text-amber-700' },
  High:   { badge: 'bg-orange-50 text-orange-700' },
  Urgent: { badge: 'bg-red-50    text-red-700' },
}

interface ToastProps { message: string }
function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-500 bg-neutral-900 text-white px-4 py-3 rounded-card shadow-overlay text-sm font-medium animate-fade-in">
      {message}
    </div>
  )
}

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}
function ConfirmDialog({ title, description, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/45 z-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-modal shadow-overlay w-full max-w-sm">
        <div className="px-6 py-5">
          <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex gap-3 px-6 pb-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-9 rounded-button border border-border-default text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-9 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

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
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; action: 'process' | 'gi' | 'transfer' } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleAction(orderId: string, action: 'process' | 'gi' | 'transfer') {
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
      showToast('GI created — order is ready for dispatch transfer')
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

  const confirmMeta: Record<string, { title: string; description: string; label: string }> = {
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

      {/* Filter tabs with counts */}
      <div className="flex gap-2 flex-wrap mb-5">
        {(['All', 'Warehouse Assigned', 'Processing', 'GI Created', 'Near SLA'] as TaskFilter[]).map(f => {
          const count = filterCounts[f]
          const isActive = taskFilter === f
          return (
            <button
              key={f}
              type="button"
              onClick={() => setTaskFilter(f)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 ${
                isActive
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'bg-white border-border-default text-gray-600 hover:border-gray-300'
              }`}
            >
              {f}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <SectionTitle title="My Assigned Tasks" count={filteredOrders.length} className="mb-3" />

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">No tasks match this filter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => {
            const sla = STAGE_SLA_HOURS[order.stage]
            const breached = sla != null && order.elapsedHours > sla
            const urgConfig = URGENCY_COLOR[order.urgency]

            return (
              <div
                key={order.id}
                className={`bg-white rounded-card border shadow-card relative overflow-hidden cursor-pointer transition-shadow duration-150 hover:shadow-raised ${
                  breached ? 'border-red-200' : 'border-border-default'
                } ${selectedOrderId === order.id ? 'ring-2 ring-brand-500' : ''}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                {breached && (
                  <div className="absolute top-0 left-0 right-0 h-0.75 bg-status-critical rounded-t-card" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-id text-brand-500 font-bold text-sm">{order.id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgConfig.badge}`}>
                        {order.urgency}
                      </span>
                    </div>
                    <StagePill stage={order.stage as Stage} />
                  </div>

                  <div className="flex items-center gap-1.5 mb-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400 shrink-0">
                      <path d="M6 1C4.07 1 2.5 2.57 2.5 4.5C2.5 7.25 6 11 6 11C6 11 9.5 7.25 9.5 4.5C9.5 2.57 7.93 1 6 1ZM6 6C5.17 6 4.5 5.33 4.5 4.5C4.5 3.67 5.17 3 6 3C6.83 3 7.5 3.67 7.5 4.5C7.5 5.33 6.83 6 6 6Z" fill="currentColor"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-800">{order.destination}</span>
                    <span className="text-xs text-gray-400 ml-1">· {order.items?.length ?? 1} item{(order.items?.length ?? 1) !== 1 ? 's' : ''}</span>
                  </div>

                  {sla && (
                    <div className="mb-3">
                      <SLABar elapsedHours={order.elapsedHours} slaHours={sla} />
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
                    {order.stage === 'Warehouse Assigned' && (
                      <button
                        type="button"
                        onClick={() => handleAction(order.id, 'process')}
                        className="px-3 h-8 rounded-button bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Start Processing
                      </button>
                    )}
                    {order.stage === 'Processing' && (
                      <button
                        type="button"
                        onClick={() => handleAction(order.id, 'gi')}
                        className="px-3 h-8 rounded-button bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Create GI
                      </button>
                    )}
                    {order.stage === 'GI Created' && (
                      <button
                        type="button"
                        onClick={() => handleAction(order.id, 'transfer')}
                        className="px-3 h-8 rounded-button bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-colors"
                      >
                        Transfer to Dispatch
                      </button>
                    )}
                    <span className="text-xs text-gray-400 self-center ml-auto">
                      {fmtHours(order.elapsedHours)} in stage
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
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
