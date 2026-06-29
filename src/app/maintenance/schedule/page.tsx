/* eslint-disable */
'use client'

import { useState } from 'react'
import { Calendar, Wrench, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'

type Priority = 'low' | 'medium' | 'high' | 'critical'

interface ScheduleItem {
  date: string; wo: string; equipment: string; task: string
  priority: Priority; assignedTo: string; estimatedHours: number; type: string
}

const SCHEDULE: ScheduleItem[] = [
  { date:'2026-06-30', wo:'MNT-002', equipment:'Generator Set A',         task:'Oil & filter change',             priority:'medium',   assignedTo:'Kenneth Nwosu',  estimatedHours:2,  type:'Preventive' },
  { date:'2026-07-01', wo:'MNT-005', equipment:'Crane #2',                task:'Hydraulic hose check',            priority:'medium',   assignedTo:'Danjuma Yusuf',  estimatedHours:2,  type:'Preventive' },
  { date:'2026-07-02', wo:'MNT-006', equipment:'Separator Unit',          task:'Safety valve calibration',        priority:'high',     assignedTo:'Segun Folarin',  estimatedHours:3,  type:'Calibration' },
  { date:'2026-07-04', wo:'MNT-004', equipment:'Choke Manifold',          task:'Valve seat inspection',           priority:'low',      assignedTo:'Kenneth Nwosu',  estimatedHours:3,  type:'Inspection' },
  { date:'2026-07-10', wo:'MNT-SCH-01', equipment:'Mud Pump #2',          task:'Liner check — routine',           priority:'low',      assignedTo:'Segun Folarin',  estimatedHours:2,  type:'Preventive' },
  { date:'2026-07-15', wo:'MNT-SCH-02', equipment:'BOP Stack — 13.5"',   task:'Hydraulic pressure test',         priority:'high',     assignedTo:'Segun Folarin',  estimatedHours:6,  type:'Inspection' },
  { date:'2026-07-20', wo:'MNT-SCH-03', equipment:'Generator Set B',      task:'Full service — 500hr',            priority:'medium',   assignedTo:'Kenneth Nwosu',  estimatedHours:5,  type:'Preventive' },
  { date:'2026-07-25', wo:'MNT-SCH-04', equipment:'Drill Rig #4',         task:'Derrick lubrication',             priority:'low',      assignedTo:'Danjuma Yusuf',  estimatedHours:4,  type:'Preventive' },
  { date:'2026-08-01', wo:'MNT-SCH-05', equipment:'Mud Pump #1',          task:'Quarterly overhaul',              priority:'high',     assignedTo:'Segun Folarin',  estimatedHours:10, type:'Overhaul'   },
  { date:'2026-08-10', wo:'MNT-SCH-06', equipment:'BOP Accumulator',      task:'Annual pressure recertification', priority:'critical', assignedTo:'Segun Folarin',  estimatedHours:8,  type:'Inspection' },
]

const PRIORITY_CFG: Record<Priority, { label: string; color: string; bg: string }> = {
  low:      { label:'Low',      color:'#16A34A', bg:'#F0FDF4' },
  medium:   { label:'Medium',   color:'#D97706', bg:'#FFFBEB' },
  high:     { label:'High',     color:'#EA580C', bg:'#FFF7ED' },
  critical: { label:'Critical', color:'#DC2626', bg:'#FEF2F2' },
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  Preventive:  <CheckCircle2 size={14} className="text-green-500"/>,
  Inspection:  <AlertTriangle size={14} className="text-amber-500"/>,
  Calibration: <Clock size={14} className="text-blue-500"/>,
  Overhaul:    <Wrench size={14} className="text-red-500"/>,
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000)
}

export default function MaintenanceSchedulePage() {
  const [filter, setFilter] = useState<Priority | 'all'>('all')

  const shown = filter === 'all' ? SCHEDULE : SCHEDULE.filter(s => s.priority === filter)
  const totalHours = shown.reduce((s, i) => s + i.estimatedHours, 0)

  return (
    <AppShell role="maintenance" currentPath="/maintenance/schedule" title="Maintenance Schedule" breadcrumb={[{ label:'Maintenance', href:'/maintenance' }, { label:'Schedule' }]}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { label:'Upcoming Items',    value: SCHEDULE.length,                                         icon:<Calendar size={16}/>,       color:'#3B82F6' },
            { label:'Total Est. Hours',  value:`${SCHEDULE.reduce((s,i)=>s+i.estimatedHours,0)}h`,      icon:<Clock size={16}/>,           color:'#8B5CF6' },
            { label:'Critical Upcoming', value: SCHEDULE.filter(s=>s.priority==='critical').length,      icon:<AlertTriangle size={16}/>,   color:'#DC2626' },
            { label:'High Priority',     value: SCHEDULE.filter(s=>s.priority==='high').length,          icon:<Wrench size={16}/>,          color:'#EA580C' },
          ] as { label:string; value:string|number; icon:React.ReactNode; color:string }[]).map(k => (
            <div key={k.label} className="bg-white border border-[#E2E8F0] rounded-card shadow-card p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{background:`${k.color}14`, color:k.color}}>
                {k.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 leading-none mb-0.5">{k.value}</p>
                <p className="text-xs text-neutral-500">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2">
          {(['all', 'low', 'medium', 'high', 'critical'] as const).map(p => (
            <button key={p} onClick={() => setFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                filter === p
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}>
              {p === 'all' ? 'All Priorities' : PRIORITY_CFG[p].label}
            </button>
          ))}
          <span className="ml-auto text-xs text-neutral-400">{shown.length} items &mdash; {totalHours}h estimated</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 w-36">Scheduled</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Work Order</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Equipment</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Task</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Priority</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Assigned To</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Est. Hrs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {shown.map(item => {
                const pc   = PRIORITY_CFG[item.priority]
                const days = daysUntil(item.date)
                return (
                  <tr key={item.wo} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800 text-xs">{formatDate(item.date)}</p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${days < 0 ? 'text-red-500' : days <= 3 ? 'text-amber-600' : 'text-neutral-400'}`}>
                        {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `in ${days}d`}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded">{item.wo}</code>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-800 text-xs">{item.equipment}</td>
                    <td className="px-4 py-3 text-neutral-600 text-xs">{item.task}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                        {TYPE_ICON[item.type]}
                        {item.type}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{color:pc.color, background:pc.bg}}>
                        {pc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{item.assignedTo}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-neutral-700 text-right">{item.estimatedHours}h</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {shown.length === 0 && (
            <div className="py-16 text-center text-sm text-neutral-400">No scheduled items match this filter.</div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
