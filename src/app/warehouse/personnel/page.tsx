'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { WORK_ORDERS, PERSONNEL, type WorkOrder, type Personnel } from '@/lib/mock-data'
import { fmtHours, STAGE_SLA_HOURS } from '@/config/sla'
import { type Stage } from '@/lib/lifecycle'

const WAREHOUSE_STAGES: Stage[] = [
  'New Request', 'Warehouse Assigned', 'Processing', 'GI Created', 'Transferred to Dispatch',
]

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  const palette = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']
  const color = palette[name.charCodeAt(0) % palette.length]
  return (
    <div
      style={{ width: size, height: size, background: color, borderRadius: '50%', flexShrink: 0 }}
      className="flex items-center justify-center text-white font-bold"
    >
      <span style={{ fontSize: size / 2.8 }}>{initials}</span>
    </div>
  )
}

function LoadBar({ pct }: { pct: number }) {
  const color = pct > 80 ? '#EF4444' : pct > 60 ? '#F59E0B' : '#22C55E'
  return (
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  )
}

interface ReassignModalProps {
  source: Personnel
  targets: Personnel[]
  orders: WorkOrder[]
  onConfirm: (selectedIds: string[], targetId: string, targetName: string) => void
  onClose: () => void
}

function ReassignModal({ source, targets, orders, onConfirm, onClose }: ReassignModalProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(orders.map(o => o.id))
  const [targetId, setTargetId] = useState<string>(targets[0]?.id ?? '')

  const toggleOrder = (id: string) =>
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const target = targets.find(p => p.id === targetId)

  return (
    <div className="fixed inset-0 bg-black/45 z-[400] flex items-center justify-center p-4">
      <div className="bg-white rounded-modal shadow-overlay w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div>
            <h2 className="font-semibold text-gray-900">Reassign Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">From {source.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reassign to</label>
            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-border-default text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {targets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.active} / {p.capacity} active)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Select orders to reassign ({selectedOrderIds.length} of {orders.length})
            </label>
            <div className="max-h-48 overflow-y-auto border border-border-default rounded-md divide-y divide-border-subtle">
              {orders.map(o => (
                <label
                  key={o.id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.includes(o.id)}
                    onChange={() => toggleOrder(o.id)}
                    className="accent-brand-500"
                  />
                  <span className="font-mono-id text-brand-500 text-xs font-semibold">{o.id}</span>
                  <span className="text-sm text-gray-700 flex-1 truncate">{o.destination}</span>
                  <span className="text-xs text-gray-400">{fmtHours(o.elapsedHours)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border-default">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-button border border-border-default text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (target) onConfirm(selectedOrderIds, target.id, target.name)
            }}
            disabled={selectedOrderIds.length === 0 || !targetId}
            className="flex-1 h-9 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-45 transition-colors"
          >
            Reassign {selectedOrderIds.length} Order{selectedOrderIds.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PersonnelLoadPage() {
  const warehousePersonnel = PERSONNEL.filter(p => p.dept === 'warehouse')
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    WORK_ORDERS.filter(o => WAREHOUSE_STAGES.includes(o.stage as Stage))
  )
  const [reassigningFrom, setReassigningFrom] = useState<Personnel | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const ordersForPerson = (personId: string) =>
    orders.filter(o => o.assignedTo === personId)

  const overloaded = warehousePersonnel.filter(p => {
    const active = ordersForPerson(p.id).length
    return active / p.capacity > 0.8
  })

  const totalActive = orders.filter(o => o.assignedTo != null).length
  const totalCap = warehousePersonnel.reduce((s, p) => s + p.capacity, 0)
  const avgLoad = warehousePersonnel.length
    ? Math.round(totalActive / warehousePersonnel.length)
    : 0

  function handleReassign(selectedOrderIds: string[], targetId: string, targetName: string) {
    setOrders(prev =>
      prev.map(o =>
        selectedOrderIds.includes(o.id)
          ? { ...o, assignedTo: targetId, assignedToName: targetName }
          : o
      )
    )
    setReassigningFrom(null)
  }

  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null

  return (
    <AppShell
      role="wh_sup"
      currentPath="/warehouse/personnel"
      title="Personnel Load"
      breadcrumb={[{ label: 'Dashboard', href: '/warehouse' }]}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Personnel" value={warehousePersonnel.length} />
        <StatCard
          label="Overloaded"
          value={overloaded.length}
          color={overloaded.length > 0 ? '#EF4444' : '#22C55E'}
        />
        <StatCard label="Avg Active Orders" value={avgLoad} />
        <StatCard label="Total Capacity" value={totalCap} />
      </div>

      {/* Personnel cards */}
      <SectionTitle title="Warehouse Team" count={warehousePersonnel.length} className="mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {warehousePersonnel.map(person => {
          const personOrders = ordersForPerson(person.id)
          const active = personOrders.length
          const pct = Math.round((active / person.capacity) * 100)
          const isOverloaded = pct > 80
          const isWarning = pct > 60 && pct <= 80

          return (
            <div
              key={person.id}
              className={`bg-white rounded-card border shadow-card p-5 ${
                isOverloaded ? 'border-status-critical/40' : 'border-border-default'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={person.name} size={36} />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{person.name}</p>
                    <p className="text-xs text-gray-500">Warehouse Personnel</p>
                  </div>
                </div>
                {isOverloaded && (
                  <span className="text-xs font-semibold text-status-critical bg-status-critical-bg px-2 py-0.5 rounded-full">
                    OVERLOADED
                  </span>
                )}
                {isWarning && !isOverloaded && (
                  <span className="text-xs font-semibold text-status-medium bg-status-medium-bg px-2 py-0.5 rounded-full">
                    HIGH LOAD
                  </span>
                )}
              </div>

              {/* Load bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium">Active Orders</span>
                  <span className={`font-bold ${isOverloaded ? 'text-status-critical' : isWarning ? 'text-status-medium' : 'text-gray-700'}`}>
                    {active} / {person.capacity}
                  </span>
                </div>
                <LoadBar pct={pct} />
              </div>

              {/* Orders list */}
              {personOrders.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No active orders</p>
              ) : (
                <div className="space-y-1 max-h-36 overflow-y-auto mb-3">
                  {personOrders.map(o => {
                    const sla = o.elapsedHours > (STAGE_SLA_HOURS[o.stage] ?? Infinity)
                    return (
                      <button
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left hover:bg-gray-50 transition-colors ${
                          selectedOrderId === o.id ? 'bg-red-50' : ''
                        }`}
                      >
                        <span className="font-mono-id text-brand-500 text-xs font-semibold">{o.id}</span>
                        <span className="text-xs text-gray-500 truncate mx-2 flex-1">{o.destination}</span>
                        <span className={`text-xs font-semibold ${sla ? 'text-status-critical' : 'text-gray-400'}`}>
                          {fmtHours(o.elapsedHours)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Reassign button */}
              {personOrders.length > 0 && (
                <button
                  onClick={() => setReassigningFrom(person)}
                  className="w-full h-8 rounded-button border border-border-default text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-brand-300 hover:text-brand-500 transition-colors"
                >
                  Reassign Orders
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Reassign Modal */}
      {reassigningFrom && (
        <ReassignModal
          source={reassigningFrom}
          targets={warehousePersonnel.filter(p => p.id !== reassigningFrom.id)}
          orders={ordersForPerson(reassigningFrom.id)}
          onConfirm={handleReassign}
          onClose={() => setReassigningFrom(null)}
        />
      )}

      {/* Detail panel */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          role="wh_sup"
        />
      )}
    </AppShell>
  )
}
