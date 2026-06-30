'use client'

import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Card } from '@/components/ui/Card'
import { type WorkOrder, type Personnel, sortNewestFirst } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'

const PERSONNEL_STAGES: Stage[] = ['Warehouse Assigned', 'Processing', 'GI Created']

interface PersonnelTasksTabProps {
  personnel: Personnel[]
  orders: WorkOrder[]
  onAdvanceStage: (orderId: string, nextStage: Stage) => void
  onViewOrder: (orderId: string) => void
}

export function PersonnelTasksTab({ personnel, orders, onAdvanceStage, onViewOrder }: PersonnelTasksTabProps) {
  return (
    <div className="space-y-6">
      {personnel.map(person => {
        const personOrders = sortNewestFirst(
          orders.filter(o => o.assignedTo === person.id && PERSONNEL_STAGES.includes(o.stage as Stage))
        )

        return (
          <section key={person.id}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-blue-700">
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
                    className={`h-full rounded-full ${person.active / person.capacity >= 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, Math.round((person.active / person.capacity) * 100))}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                  {Math.round((person.active / person.capacity) * 100)}% load
                </p>
              </div>
            </div>

            {personOrders.length === 0 ? (
              <p className="text-xs text-gray-400 ml-11 mb-1">No active tasks in warehouse stages.</p>
            ) : (
              <div className="space-y-2 ml-11">
                {personOrders.map(o => {
                  const slaHrs = STAGE_SLA_HOURS[o.stage]
                  const breached = slaHrs != null && o.elapsedHours > slaHrs

                  return (
                    <Card key={o.id} className={`p-3 relative overflow-hidden ${breached ? 'border-red-200' : ''}`}>
                      {breached && <div className="absolute top-0 left-0 right-0 h-0.75 bg-red-500" />}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-brand-500">{o.id}</span>
                            <StagePill stage={o.stage} />
                          </div>
                          <p className="text-xs text-gray-700 font-medium truncate">{o.destination}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.requestType}</p>
                          {slaHrs && (
                            <div className="mt-1.5">
                              <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          {o.stage === 'Warehouse Assigned' && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStage(o.id, 'Processing')}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              Start Processing
                            </button>
                          )}
                          {o.stage === 'Processing' && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStage(o.id, 'GI Created')}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              Create GI
                            </button>
                          )}
                          {o.stage === 'GI Created' && (
                            <button
                              type="button"
                              onClick={() => onAdvanceStage(o.id, 'Transferred to Dispatch')}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
                            >
                              Transfer
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onViewOrder(o.id)}
                            className="text-[11px] font-medium px-2.5 py-1 rounded border border-border-default text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1.5">{fmtHours(o.elapsedHours)} in stage</p>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
