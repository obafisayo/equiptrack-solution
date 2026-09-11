'use client'

import { useState, useMemo } from 'react'
import { WorkOrderCard } from '@/components/domain/WorkOrderCard'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { type WorkOrder } from '@/lib/mock-data'
import { type UrgencyLevel } from '@/config/sla'
import { DISPATCH_STAGES } from './constants'
import { type Stage } from '@/lib/lifecycle'

const URGENCY_OPTIONS: Array<UrgencyLevel | 'All'> = ['All', 'Urgent', 'High', 'Medium', 'Low']
const STAGE_OPTIONS: Array<Stage | 'All'> = ['All', ...DISPATCH_STAGES]

function FilterRow({ label, options, active, onSelect }: {
  label: string
  options: string[]
  active: string
  onSelect: (v: string) => void
}) {
  return (
    <div className="flex items-start gap-3 flex-wrap">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 shrink-0 mt-1 w-20">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
              active === opt
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-border-default text-gray-600 hover:border-gray-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

interface QueueViewProps {
  orders: WorkOrder[]
  selectedOrderId: string | null
  onSelectOrder: (id: string) => void
  onAssignOrder: (order: WorkOrder) => void
  onReverseOrder: (order: WorkOrder) => void
}

export function QueueView({
  orders,
  selectedOrderId,
  onSelectOrder,
  onAssignOrder,
  onReverseOrder,
}: QueueViewProps) {
  const [unassignedUrgency, setUnassignedUrgency] = useState<UrgencyLevel | 'All'>('All')
  const [activeStage, setActiveStage] = useState<string>('All')
  const [activeUrgency, setActiveUrgency] = useState<UrgencyLevel | 'All'>('All')

  const unassignedOrders = useMemo(
    () => orders.filter(o => o.stage === 'Dispatch Queue'),
    [orders]
  )

  const filteredUnassigned = useMemo(() => {
    if (unassignedUrgency === 'All') return unassignedOrders
    return unassignedOrders.filter(o => o.urgency === unassignedUrgency)
  }, [unassignedOrders, unassignedUrgency])

  const activeOrders = useMemo(
    () => orders.filter(o => DISPATCH_STAGES.includes(o.stage as Stage)),
    [orders]
  )

  const filteredActive = useMemo(() => {
    let list = activeOrders
    if (activeStage !== 'All') list = list.filter(o => o.stage === activeStage)
    if (activeUrgency !== 'All') list = list.filter(o => o.urgency === activeUrgency)
    return list
  }, [activeOrders, activeStage, activeUrgency])

  return (
    <>
      {/* UNASSIGNED REQUESTS */}
      <section className="mb-8">
        <SectionTitle title="Unassigned Requests" count={unassignedOrders.length} className="mb-3" />
        <div className="mb-4">
          <FilterRow
            label="Urgency"
            options={URGENCY_OPTIONS}
            active={unassignedUrgency}
            onSelect={v => setUnassignedUrgency(v as UrgencyLevel | 'All')}
          />
        </div>
        {filteredUnassigned.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No unassigned requests at this priority</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredUnassigned.map(o => (
              <WorkOrderCard
                key={o.id}
                order={o}
                onClick={() => onSelectOrder(o.id)}
                onAssign={() => onAssignOrder(o)}
                onReverse={() => onReverseOrder(o)}
                isSelected={selectedOrderId === o.id}
                showActions
              />
            ))}
          </div>
        )}
      </section>

      {/* ALL ACTIVE WORKING ORDERS */}
      <section>
        <SectionTitle title="All Active Working Orders" count={filteredActive.length} className="mb-3" />
        <div className="flex flex-col gap-2 mb-4">
          <FilterRow label="Stage" options={STAGE_OPTIONS} active={activeStage} onSelect={setActiveStage} />
          <FilterRow
            label="Urgency"
            options={URGENCY_OPTIONS}
            active={activeUrgency}
            onSelect={v => setActiveUrgency(v as UrgencyLevel | 'All')}
          />
        </div>
        {filteredActive.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No orders match this filter</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredActive.map(o => (
              <WorkOrderCard
                key={o.id}
                order={o}
                onClick={() => onSelectOrder(o.id)}
                onAssign={() => onAssignOrder(o)}
                onReverse={() => onReverseOrder(o)}
                isSelected={selectedOrderId === o.id}
                showActions
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
