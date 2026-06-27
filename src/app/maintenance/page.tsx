'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Wrench, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { WORK_ORDERS } from '@/lib/mock-data'

const MAINTENANCE_TASKS = [
  { id: 'MNT-001', equipment: 'Mud Pump #3',       task: 'Liner seal replacement', priority: 'high',   status: 'in_progress', dueDate: '2026-06-28', wo: 'WO-0042' },
  { id: 'MNT-002', equipment: 'Generator Set A',   task: 'Oil & filter change',    priority: 'medium', status: 'pending',     dueDate: '2026-06-30', wo: 'WO-0048' },
  { id: 'MNT-003', equipment: 'BOP Stack — 13.5"', task: 'Annual pressure test',   priority: 'high',   status: 'pending',     dueDate: '2026-06-29', wo: 'WO-0051' },
  { id: 'MNT-004', equipment: 'Choke Manifold',    task: 'Valve seat inspection',  priority: 'low',    status: 'pending',     dueDate: '2026-07-04', wo: 'WO-0056' },
  { id: 'MNT-005', equipment: 'Crane #2',          task: 'Hydraulic hose check',   priority: 'medium', status: 'pending',     dueDate: '2026-07-01', wo: 'WO-0058' },
]

const REPAIR_HISTORY = [
  { id: 'REP-089', equipment: 'Mud Pump #1',    task: 'Piston rod replacement', completedAt: '2026-06-20', techNote: 'Replaced worn piston rod, tested at 3000 PSI.' },
  { id: 'REP-090', equipment: 'Separator Unit', task: 'Safety valve service',   completedAt: '2026-06-18', techNote: 'Calibrated at 850 PSI, replaced spring.'       },
  { id: 'REP-091', equipment: 'Drill Rig #4',  task: 'Derrick inspection',     completedAt: '2026-06-15', techNote: 'No defects found. Greased all pivot points.'    },
]

const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  low:    { bg: '#F0FDF4', color: '#16A34A' },
  medium: { bg: '#FFFBEB', color: '#D97706' },
  high:   { bg: '#FEF2F2', color: '#DC2626' },
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:     { bg: '#F9FAFB', color: '#6B7280', label: 'Pending'     },
  in_progress: { bg: '#EFF6FF', color: '#2563EB', label: 'In Progress' },
  completed:   { bg: '#F0FDF4', color: '#16A34A', label: 'Completed'   },
}

export default function MaintenanceDashboard() {
  const currentPath = usePathname()
  const [activeTab, setActiveTab]   = useState<'tasks' | 'history'>('tasks')
  const [completing, setCompleting] = useState<string | null>(null)
  const [tasks, setTasks]           = useState(MAINTENANCE_TASKS)

  const inProgress  = tasks.filter(t => t.status === 'in_progress').length
  const pending     = tasks.filter(t => t.status === 'pending').length
  const highPrio    = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length
  const completedWOs = WORK_ORDERS.filter(wo => wo.stage === 'Completed').length

  function handleComplete(id: string) {
    setCompleting(id)
    setTimeout(() => {
      setTasks(ts => ts.map(t => t.id === id ? { ...t, status: 'completed' } : t))
      setCompleting(null)
    }, 800)
  }

  return (
    <AppShell role="maintenance" currentPath={currentPath} title="My Tasks">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="In Progress"     value={inProgress}   icon={Wrench} />
        <StatCard label="Pending"         value={pending}      icon={Clock} />
        <StatCard label="High Priority"   value={highPrio}     icon={AlertTriangle} />
        <StatCard label="Completed (WOs)" value={completedWOs} icon={CheckCircle} />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {(['tasks', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 16px', border: 'none', background: 'none',
              fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? '#F04A4A' : '#6B7280',
              borderBottom: activeTab === tab ? '2px solid #F04A4A' : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}
          >
            {tab === 'tasks' ? 'My Tasks' : 'Repair History'}
          </button>
        ))}
      </div>

      {/* Tasks tab */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map(task => {
            const ps   = PRIORITY_STYLE[task.priority]
            const ss   = STATUS_STYLE[task.status]
            const isDone = task.status === 'completed'
            return (
              <div key={task.id} style={{
                background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)', opacity: isDone ? 0.6 : 1,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>{task.task}</p>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 999,
                      background: ps.bg, color: ps.color, textTransform: 'capitalize' as const, flexShrink: 0,
                    }}>
                      {task.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 2px' }}>{task.equipment}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>Due: {task.dueDate}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF' }}>{task.wo}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 9px',
                    borderRadius: 999, background: ss.bg, color: ss.color,
                  }}>
                    {ss.label}
                  </span>
                  {!isDone && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      disabled={completing === task.id}
                      style={{
                        padding: '6px 14px', border: 'none', borderRadius: 6,
                        background: '#F04A4A', color: '#fff', fontSize: 12, fontWeight: 600,
                        cursor: 'pointer', opacity: completing === task.id ? 0.7 : 1,
                        fontFamily: 'inherit',
                      }}
                    >
                      {completing === task.id ? 'Saving…' : 'Mark Done'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* History tab */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {REPAIR_HISTORY.map(rep => (
            <div key={rep.id} style={{
              background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
              padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{rep.task}</p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{rep.equipment}</p>
                </div>
                <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: '#F0FDF4', color: '#16A34A' }}>
                    Completed
                  </span>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>{rep.completedAt}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#374151', margin: 0, padding: '10px 12px', background: '#F9FAFB', borderRadius: 6, lineHeight: 1.5 }}>
                {rep.techNote}
              </p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
