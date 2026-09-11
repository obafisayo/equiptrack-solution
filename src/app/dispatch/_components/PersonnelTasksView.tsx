'use client'

import { type WorkOrder, type Personnel } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { PERSONNEL_STAGES } from './constants'

interface PersonnelTasksViewProps {
  personnel: Personnel[]
  orders: WorkOrder[]
  onAdvanceStage: (orderId: string, nextStage: Stage) => void
  onViewOrder: (orderId: string) => void
}

export function PersonnelTasksView({ personnel, orders }: PersonnelTasksViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {personnel.map(person => {
        const activeCount = orders.filter(
          o => o.assignedTo === person.id && PERSONNEL_STAGES.includes(o.stage as Stage)
        ).length

        return (
          <div
            key={person.id}
            className="bg-white rounded-card border border-border-default shadow-card px-5 py-4 flex items-center gap-4"
          >
            <div className="w-9 h-9 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-violet-700">
                {person.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{person.name}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-bold text-gray-900 font-mono leading-none">
                {activeCount}<span className="text-gray-400 font-normal">/{person.capacity}</span>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
