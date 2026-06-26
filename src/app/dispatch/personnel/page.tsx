'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { StatCard } from '@/components/domain/StatCard'
import { AssignModal } from '@/components/domain/AssignModal'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, PERSONNEL, type WorkOrder, type Personnel, getPersonnelByDept } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'

const DISPATCH_ACTIVE_STAGES: Stage[] = ['Dispatch Assigned', 'Preload QAQC', 'Containerization', 'Post QAQC', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace']

function LoadBar({ active, cap }: { active: number; cap: number }) {
  const pct = Math.min((active / cap) * 100, 100)
  const color = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#22C55E'
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{active} active</span>
        <span>Cap: {cap}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function DispatchPersonnelPage() {
  const [orders, setOrders] = useState<WorkOrder[]>(
    WORK_ORDERS.filter(o => DISPATCH_ACTIVE_STAGES.includes(o.stage))
  )
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null)
  const [reassigningOrder, setReassigningOrder] = useState<WorkOrder | null>(null)

  const personnel = getPersonnelByDept('dispatch')

  function getPersonOrders(pid: string) {
    return orders.filter(o => o.assignedTo === pid)
  }

  const totalActive  = orders.filter(o => o.assignedTo != null).length
  const unassigned   = orders.filter(o => o.assignedTo == null).length
  const overloaded   = personnel.filter(p => p.active >= p.capacity * 0.9).length

  function handleReassign(personnelId: string, personnelName: string) {
    if (!reassigningOrder) return
    setOrders(prev => prev.map(o =>
      o.id === reassigningOrder.id
        ? { ...o, assignedTo: personnelId, assignedToName: personnelName }
        : o
    ))
    setReassigningOrder(null)
  }

  return (
    <AppShell
      role="dsp_sup"
      currentPath="/dispatch/personnel"
      title="Personnel Load"
      breadcrumb={[{ label: 'Dispatch Dashboard', href: '/dispatch' }]}
    >
      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Active Orders" value={totalActive} color="#8B5CF6" />
        <StatCard label="Unassigned" value={unassigned} color={unassigned > 0 ? '#EF4444' : '#22C55E'} />
        <StatCard label="Personnel" value={personnel.length} color="#3B82F6" />
        <StatCard label="Overloaded" value={overloaded} color={overloaded > 0 ? '#F97316' : '#22C55E'} />
      </div>

      {/* PERSONNEL LOAD VISUAL */}
      <section className="mb-6">
        <SectionTitle title="Dispatch Team Load" count={personnel.length} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {personnel.map(p => {
            const pOrders = getPersonOrders(p.id)
            const load = Math.round((p.active / p.capacity) * 100)
            const isExpanded = expandedPerson === p.id
            const isOverloaded = load >= 90

            return (
              <Card key={p.id} className={`${isOverloaded ? 'border-amber-300' : ''}`}>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedPerson(isExpanded ? null : p.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: isOverloaded ? '#F97316' : '#8B5CF6' }}
                    >
                      {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">Dispatch Personnel</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${isOverloaded ? 'text-amber-600' : 'text-gray-900'}`}>{load}%</span>
                    <p className="text-xs text-gray-400">load</p>
                  </div>
                </div>

                <LoadBar active={p.active} cap={p.capacity} />

                {isOverloaded && (
                  <p className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                    OVERLOADED â€” consider reassigning
                  </p>
                )}

                {isExpanded && pOrders.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-border-default pt-3">
                    {pOrders.map(o => (
                      <div key={o.id} className="flex items-center justify-between text-xs">
                        <span className="font-mono text-brand-500 font-semibold">{o.id}</span>
                        <span className="text-gray-500 truncate max-w-[120px]">{o.destination}</span>
                        <button
                          onClick={e => { e.stopPropagation(); setReassigningOrder(o) }}
                          className="text-brand-500 hover:text-brand-600 font-medium ml-2 flex-shrink-0"
                        >
                          Reassign
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {isExpanded && pOrders.length === 0 && (
                  <p className="mt-3 text-xs text-gray-400 border-t border-border-default pt-3">No active orders.</p>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* ALL DISPATCH ORDERS */}
      <section>
        <SectionTitle title="All Dispatch Orders" count={orders.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
          {orders.map(o => (
            <WorkOrderCard
              key={o.id}
              order={o}
              onAssign={() => setReassigningOrder(o)}
              showActions
            />
          ))}
        </div>
      </section>

      <AssignModal
        order={reassigningOrder}
        personnel={personnel}
        onConfirm={handleReassign}
        onClose={() => setReassigningOrder(null)}
      />
    </AppShell>
  )
}
