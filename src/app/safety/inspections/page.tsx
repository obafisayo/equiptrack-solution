'use client'

import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'

type InspStatus = 'passed' | 'failed' | 'overdue' | 'scheduled' | 'in_progress'

interface Inspection {
  id: string; equipment: string; category: string; inspector: string
  lastDate: string; nextDate: string; status: InspStatus; findings?: string; frequency: string
}

const STATUS_CFG: Record<InspStatus, { badge: string; label: string }> = {
  passed:      { badge: 'bg-green-50 text-green-700 border-green-200',   label: 'Passed'      },
  failed:      { badge: 'bg-red-50 text-red-700 border-red-200',         label: 'Failed'      },
  overdue:     { badge: 'bg-red-50 text-red-700 border-red-200',         label: 'Overdue'     },
  scheduled:   { badge: 'bg-blue-50 text-blue-700 border-blue-200',      label: 'Scheduled'   },
  in_progress: { badge: 'bg-amber-50 text-amber-700 border-amber-200',   label: 'In Progress' },
}

const INSPECTIONS: Inspection[] = [
  { id:'INS-001', equipment:'BOP Stack — 13.5"',     category:'Well Control',  inspector:'Femi Emmanuel', lastDate:'2026-05-20', nextDate:'2026-06-20', status:'overdue',     findings:'Hydraulic pressure low, needs re-test', frequency:'Monthly'    },
  { id:'INS-002', equipment:'Crane #1',              category:'Lifting',       inspector:'Ngozi Okafor',  lastDate:'2026-06-15', nextDate:'2026-07-15', status:'passed',      findings:'All checks passed',                    frequency:'Monthly'    },
  { id:'INS-003', equipment:'Mud Pump #2',           category:'Drilling',      inspector:'Femi Emmanuel', lastDate:'2026-06-10', nextDate:'2026-07-10', status:'passed',      findings:undefined,                              frequency:'Monthly'    },
  { id:'INS-004', equipment:'Safety Valve — Sep',    category:'Process',       inspector:'Ngozi Okafor',  lastDate:'2026-06-22', nextDate:'2026-07-22', status:'in_progress', findings:undefined,                              frequency:'Monthly'    },
  { id:'INS-005', equipment:'Drill Rig #4 Derrick',  category:'Structural',    inspector:'Femi Emmanuel', lastDate:'2026-03-15', nextDate:'2026-06-15', status:'overdue',     findings:'Annual structural inspection past due', frequency:'Quarterly'  },
  { id:'INS-006', equipment:'Fire Suppression Sys',  category:'Safety',        inspector:'Ngozi Okafor',  lastDate:'2026-06-20', nextDate:'2026-09-20', status:'passed',      findings:'Pressure checks normal',               frequency:'Quarterly'  },
  { id:'INS-007', equipment:'Generator Set A',       category:'Power',         inspector:'Femi Emmanuel', lastDate:'2026-06-28', nextDate:'2026-07-28', status:'scheduled',   findings:undefined,                              frequency:'Monthly'    },
  { id:'INS-008', equipment:'Life Raft Pods × 4',   category:'Safety',        inspector:'Ngozi Okafor',  lastDate:'2026-04-01', nextDate:'2026-07-01', status:'scheduled',   findings:undefined,                              frequency:'Quarterly'  },
]

export default function SafetyInspectionsPage() {
  const passed    = INSPECTIONS.filter(i => i.status === 'passed').length
  const failed    = INSPECTIONS.filter(i => i.status === 'failed').length
  const overdue   = INSPECTIONS.filter(i => i.status === 'overdue').length
  const scheduled = INSPECTIONS.filter(i => i.status === 'scheduled').length

  return (
    <AppShell
      role="safety"
      currentPath="/safety/inspections"
      title="Inspections"
      breadcrumb={[{label:'Home',href:'/'},{label:'Safety',href:'/safety'},{label:'Inspections'}]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Passed"    value={passed}    color="#10B981" icon={CheckCircle2}/>
        <StatCard label="Scheduled" value={scheduled} color="#3B82F6" icon={Clock}/>
        <StatCard label="Overdue"   value={overdue}   color={overdue>0?'#EF4444':'#22C55E'} icon={AlertTriangle}/>
        <StatCard label="Failed"    value={failed}    color={failed>0?'#EF4444':'#22C55E'} icon={AlertTriangle}/>
      </div>

      <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              {['ID','Equipment','Category','Inspector','Last Checked','Next Due','Frequency','Status','Findings'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {INSPECTIONS.map(ins => {
              const sc = STATUS_CFG[ins.status]
              const isUrgent = ins.status === 'failed' || ins.status === 'overdue'
              return (
                <tr key={ins.id} className={`hover:bg-neutral-50 transition-colors ${isUrgent ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-neutral-500 whitespace-nowrap">{ins.id}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-900 whitespace-nowrap">{ins.equipment}</td>
                  <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">{ins.category}</td>
                  <td className="px-4 py-3 text-xs text-neutral-700 whitespace-nowrap">{ins.inspector}</td>
                  <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">{ins.lastDate}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    <span className={isUrgent ? 'text-red-600 font-bold' : 'text-neutral-500'}>{ins.nextDate}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">{ins.frequency}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>{sc.label}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500 max-w-48 truncate">{ins.findings ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
