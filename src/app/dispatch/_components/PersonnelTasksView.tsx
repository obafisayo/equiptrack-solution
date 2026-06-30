'use client'

import { sortNewestFirst, type WorkOrder, type Personnel } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { PersonnelTaskCard } from './PersonnelTaskCard'
import { PERSONNEL_STAGES } from './constants'

interface PersonnelTasksViewProps {
  personnel: Personnel[]
  orders: WorkOrder[]
  onAdvanceStage: (orderId: string, nextStage: Stage) => void
  onViewOrder: (orderId: string) => void
}

export function PersonnelTasksView({ personnel, orders, onAdvanceStage, onViewOrder }: PersonnelTasksViewProps) {
  return (
    <div className="space-y-6">
      {personnel.map(person => {
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
                {personOrders.map(o => (
                  <PersonnelTaskCard key={o.id} order={o} onAdvanceStage={onAdvanceStage} onView={onViewOrder} />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
