'use client'

import { useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { PRI_CFG } from './styleMaps'
import type { WorkOrder, ScheduleItem } from './types'

interface ScheduleTabProps {
  orders: WorkOrder[]
  schedule: ScheduleItem[]
  today: string
}

export function ScheduleTab({ orders, schedule, today }: ScheduleTabProps) {
  const scheduleByDate = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>()
    for (const s of schedule) {
      if (!map.has(s.date)) map.set(s.date, [])
      map.get(s.date)!.push(s)
    }
    return map
  }, [schedule])

  const scheduleDates = Array.from(scheduleByDate.keys()).sort()
  const overdueOrders = orders.filter(o => o.status === 'overdue')

  return (
    <div className="space-y-5">
      {/* Overdue alert */}
      {overdueOrders.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5"/>
          <div>
            <p className="text-sm font-bold text-red-800 mb-1">Overdue Work Orders</p>
            <div className="space-y-1">
              {overdueOrders.map(o=>(
                <p key={o.id} className="text-xs text-red-700">
                  <span className="font-mono font-bold">{o.id}</span> · {o.equipment} · {o.task}
                  <span className="ml-1 text-red-500">(was due {o.dueDate})</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming schedule grouped by date */}
      {scheduleDates.map(date => {
        const items = scheduleByDate.get(date)!
        const d = new Date(date+'T00:00:00')
        const isToday = date === today
        const label = isToday ? 'Today' : d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})
        return (
          <div key={date}>
            <div className={`flex items-center gap-2 mb-2`}>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isToday?'bg-brand-500 text-white':'bg-neutral-100 text-neutral-600'}`}>
                {label}
              </span>
              <div className="flex-1 h-px bg-border-default"/>
            </div>
            <div className="space-y-2">
              {items.map(s=>{
                const pc=PRI_CFG[s.priority]
                return (
                  <div key={s.wo} className="bg-white border border-border-default rounded-xl p-4 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-brand-500">{s.wo}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border capitalize ${pc.badge}`}>{s.priority}</span>
                        </div>
                        <p className="text-sm font-bold text-neutral-900">{s.task}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{s.equipment}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-neutral-600">{s.assignedTo.split(' ')[0]}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
