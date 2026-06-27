'use client'

import { useState } from 'react'
import { Package, AlertCircle, Users, AlertTriangle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { StatCard } from '@/components/domain/StatCard'
import { AssignModal } from '@/components/domain/AssignModal'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, type WorkOrder, getPersonnelByDept } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'

const DISPATCH_ACTIVE_STAGES: Stage[] = ['Dispatch Assigned', 'Preload QAQC', 'Containerization', 'Post QAQC', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace']

function LoadBar({ active, cap }: { active: number; cap: number }) {
  const pct = Math.min((active / cap) * 100, 100)
  const color = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#22C55E'
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>{active} active</span>
        <span>Cap: {cap}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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

  const totalActive = orders.filter(o => o.assignedTo != null).length
  const unassigned  = orders.filter(o => o.assignedTo == null).length
  const overloaded  = personnel.filter(p => {
    const active = orders.filter(o => o.assignedTo === p.id).length
    return active >= p.capacity * 0.9
  }).length

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
      actionLabel="Dispatch Queue"
      actionHref="/dispatch"
    >
      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Active Orders" value={totalActive}       color="#8B5CF6"                              icon={Package} />
        <StatCard label="Unassigned"          value={unassigned}        color={unassigned > 0 ? '#EF4444' : '#22C55E'} icon={AlertCircle} />
        <StatCard label="Personnel"           value={personnel.length}  color="#3B82F6"                              icon={Users} />
        <StatCard label="Overloaded"          value={overloaded}        color={overloaded > 0 ? '#F97316' : '#22C55E'} icon={AlertTriangle} />
      </div>

      {/* PERSONNEL LOAD VISUAL */}
      <section className="mb-6">
        <SectionTitle title="Dispatch Team Load" count={personnel.length} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 items-start">
          {personnel.map(p => {
            const pOrders = getPersonOrders(p.id)
            const load = Math.round((pOrders.length / p.capacity) * 100)
            const isExpanded = expandedPerson === p.id
            const isOverloaded = load >= 90

            return (
              <Card key={p.id} className={`p-5 ${isOverloaded ? 'border-amber-300' : ''}`}>
                {/* Header row */}
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedPerson(isExpanded ? null : p.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: isOverloaded ? '#F97316' : '#8B5CF6' }}
                    >
                      {p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">Dispatch Personnel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className={`text-xl font-bold ${isOverloaded ? 'text-amber-600' : 'text-gray-900'}`}>
                        {load}%
                      </span>
                      <p className="text-xs text-gray-400">load</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <LoadBar active={pOrders.length} cap={p.capacity} />

                {isOverloaded && (
                  <p className="mt-3 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded">
                    OVERLOADED - consider reassigning
                  </p>
                )}

                {isExpanded && (
                  <div className="mt-4 border-t border-border-default pt-4">
                    {pOrders.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No active orders.</p>
                    ) : (
                      <div className="space-y-3 max-h-[172px] overflow-y-auto pr-1">
                      {pOrders.map(o => (
                        <div key={o.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="font-mono text-brand-500 font-bold text-xs leading-tight">{o.id}</span>
                            <button
                              onClick={e => { e.stopPropagation(); setReassigningOrder(o) }}
                              className="text-xs text-brand-500 hover:text-brand-600 font-semibold border border-brand-200 hover:border-brand-400 px-2.5 py-1 rounded transition-colors duration-150 flex-shrink-0"
                            >
                              Reassign
                            </button>
                          </div>
                          <p className="text-sm text-gray-800 font-medium leading-snug">{o.destination}</p>
                          <p className="text-xs text-gray-400 mt-1">{o.stage}</p>
                        </div>
                      ))
                      }
                      </div>
                    )}
                  </div>
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
