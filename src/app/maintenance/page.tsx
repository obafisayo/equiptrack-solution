/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import {
  Wrench, Clock, AlertTriangle, CheckCircle2, Plus, X,
  Calendar, User, Tag, FileText, Play, CheckCheck,
  RotateCcw, CalendarClock,
} from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard }   from '@/components/domain/StatCard'
import { Button }     from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import { Dropdown }   from '@/components/ui/Dropdown'
import { DatePicker } from '@/components/ui/DatePicker'

// ── Types ─────────────────────────────────────────────────────────────────────

type MaintPriority = 'low' | 'medium' | 'high' | 'critical'
type MaintStatus   = 'pending' | 'in_progress' | 'completed' | 'overdue'
type MaintType     = 'Preventive' | 'Corrective' | 'Inspection' | 'Calibration' | 'Overhaul'

interface WorkOrder {
  id: string; equipment: string; category: string
  task: string; type: MaintType; priority: MaintPriority; status: MaintStatus
  assignedTo: string; dueDate: string; startedAt?: string; completedAt?: string
  techNote?: string; estimatedHours: number; actualHours?: number
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const INIT_WOS: WorkOrder[] = [
  { id:'MNT-001', equipment:'Mud Pump #3',          category:'Drilling',     task:'Liner seal replacement',        type:'Corrective',  priority:'high',     status:'in_progress', assignedTo:'Segun Folarin',   dueDate:'2026-06-29', startedAt:'2026-06-27', estimatedHours:4,  techNote:'Seals showing excessive wear. Replacement parts in stock at Bay 1-A.' },
  { id:'MNT-002', equipment:'Generator Set A',       category:'Power',        task:'Oil & filter change',           type:'Preventive',  priority:'medium',   status:'pending',     assignedTo:'Kenneth Nwosu',   dueDate:'2026-06-30', estimatedHours:2   },
  { id:'MNT-003', equipment:'BOP Stack — 13.5"',    category:'Well Control', task:'Annual pressure test',          type:'Inspection',  priority:'high',     status:'overdue',     assignedTo:'Segun Folarin',   dueDate:'2026-06-27', estimatedHours:6   },
  { id:'MNT-004', equipment:'Choke Manifold',        category:'Well Control', task:'Valve seat inspection',         type:'Inspection',  priority:'low',      status:'pending',     assignedTo:'Kenneth Nwosu',   dueDate:'2026-07-04', estimatedHours:3   },
  { id:'MNT-005', equipment:'Crane #2',              category:'Lifting',      task:'Hydraulic hose check',          type:'Preventive',  priority:'medium',   status:'pending',     assignedTo:'Danjuma Yusuf',   dueDate:'2026-07-01', estimatedHours:2   },
  { id:'MNT-006', equipment:'Separator Unit',        category:'Process',      task:'Safety valve calibration',      type:'Calibration', priority:'high',     status:'pending',     assignedTo:'Segun Folarin',   dueDate:'2026-07-02', estimatedHours:3   },
  { id:'MNT-007', equipment:'Drill Rig #4',          category:'Drilling',     task:'Derrick structural inspection', type:'Inspection',  priority:'critical', status:'overdue',     assignedTo:'Segun Folarin',   dueDate:'2026-06-25', estimatedHours:8   },
]

const INIT_HISTORY: WorkOrder[] = [
  { id:'MNT-H001', equipment:'Mud Pump #1',    category:'Drilling',     task:'Piston rod replacement',    type:'Corrective',  priority:'high',   status:'completed', assignedTo:'Segun Folarin',  dueDate:'2026-06-20', completedAt:'2026-06-20', estimatedHours:5, actualHours:4.5, techNote:'Replaced worn piston rod, tested at 3000 PSI. All readings within tolerance.' },
  { id:'MNT-H002', equipment:'Separator Unit', category:'Process',      task:'Safety valve service',      type:'Calibration', priority:'medium', status:'completed', assignedTo:'Kenneth Nwosu', dueDate:'2026-06-18', completedAt:'2026-06-18', estimatedHours:3, actualHours:2.5, techNote:'Calibrated at 850 PSI, replaced spring, verified set point.' },
  { id:'MNT-H003', equipment:'Drill Rig #4',  category:'Drilling',     task:'Derrick inspection',        type:'Inspection',  priority:'low',    status:'completed', assignedTo:'Segun Folarin',  dueDate:'2026-06-15', completedAt:'2026-06-15', estimatedHours:8, actualHours:7,   techNote:'No structural defects found. Greased all pivot points. Next inspection due Oct.' },
  { id:'MNT-H004', equipment:'Crane #1',       category:'Lifting',      task:'Annual slewing ring check', type:'Inspection',  priority:'medium', status:'completed', assignedTo:'Danjuma Yusuf', dueDate:'2026-06-10', completedAt:'2026-06-11', estimatedHours:4, actualHours:5,   techNote:'Minor wear detected on slewing ring. Flagged for replacement at next overhaul.' },
]

// ── Schedule data (upcoming maintenance) ──────────────────────────────────────

const SCHEDULE = [
  { date:'2026-06-30', wo:'MNT-002', equipment:'Generator Set A',    task:'Oil & filter change',   priority:'medium' as MaintPriority, assignedTo:'Kenneth Nwosu' },
  { date:'2026-07-01', wo:'MNT-005', equipment:'Crane #2',           task:'Hydraulic hose check',  priority:'medium' as MaintPriority, assignedTo:'Danjuma Yusuf' },
  { date:'2026-07-02', wo:'MNT-006', equipment:'Separator Unit',     task:'Safety valve calibration',priority:'high' as MaintPriority, assignedTo:'Segun Folarin' },
  { date:'2026-07-04', wo:'MNT-004', equipment:'Choke Manifold',     task:'Valve seat inspection', priority:'low'    as MaintPriority, assignedTo:'Kenneth Nwosu' },
  { date:'2026-07-10', wo:'MNT-SCH-01', equipment:'Mud Pump #2',    task:'Liner check — routine', priority:'low'    as MaintPriority, assignedTo:'Segun Folarin' },
  { date:'2026-07-15', wo:'MNT-SCH-02', equipment:'BOP Stack — 13.5"',task:'Hydraulic pressure test',priority:'high' as MaintPriority,assignedTo:'Segun Folarin' },
  { date:'2026-07-20', wo:'MNT-SCH-03', equipment:'Generator Set B', task:'Full service — 500hr',  priority:'medium' as MaintPriority, assignedTo:'Kenneth Nwosu' },
]

// ── Style maps ────────────────────────────────────────────────────────────────

const PRI_CFG: Record<MaintPriority, { badge: string; bar: string }> = {
  low:      { badge:'bg-green-50  text-green-700  border-green-200',  bar:'bg-green-500'  },
  medium:   { badge:'bg-amber-50  text-amber-700  border-amber-200',  bar:'bg-amber-500'  },
  high:     { badge:'bg-orange-50 text-orange-700 border-orange-200', bar:'bg-orange-500' },
  critical: { badge:'bg-red-50    text-red-700    border-red-200',    bar:'bg-red-500'    },
}

const STS_CFG: Record<MaintStatus, { badge: string; label: string }> = {
  pending:     { badge:'bg-neutral-50 text-neutral-500 border-neutral-200', label:'Pending'     },
  in_progress: { badge:'bg-blue-50   text-blue-700   border-blue-200',     label:'In Progress' },
  completed:   { badge:'bg-green-50  text-green-700  border-green-200',    label:'Completed'   },
  overdue:     { badge:'bg-red-50    text-red-700    border-red-200',      label:'Overdue'     },
}

const TYPE_OPTIONS: MaintType[] = ['Preventive','Corrective','Inspection','Calibration','Overhaul']
const PRI_OPTIONS:  MaintPriority[] = ['low','medium','high','critical']

const EQUIPMENT_OPTIONS = [
  'Mud Pump #1','Mud Pump #2','Mud Pump #3','Generator Set A','Generator Set B',
  'BOP Stack — 13.5"','Choke Manifold','Crane #1','Crane #2','Separator Unit',
  'Drill Rig #4','Forklift FL-01','Forklift FL-03',
].map(v=>({value:v,label:v}))

const TECH_OPTIONS = [
  'Segun Folarin','Kenneth Nwosu','Danjuma Yusuf','Biodun Adekunle','Tunde Bello',
].map(v=>({value:v,label:v}))

const CAT_OPTIONS = [
  'Drilling','Well Control','Power','Lifting','Process','Safety','Mechanical',
].map(v=>({value:v,label:v}))

type Tab = 'orders' | 'schedule' | 'history'

// ── Main Component ────────────────────────────────────────────────────────────

export default function MaintenanceDashboard() {
  const [orders,  setOrders]  = useState<WorkOrder[]>(INIT_WOS)
  const [history, setHistory] = useState<WorkOrder[]>(INIT_HISTORY)
  const [tab, setTab]         = useState<Tab>('orders')

  // Detail panel
  const [detailWO, setDetailWO] = useState<WorkOrder | null>(null)
  const [noteInput, setNoteInput] = useState('')

  // Create WO panel
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({
    equipment:'', category:'', task:'', type:'Preventive' as MaintType,
    priority:'medium' as MaintPriority, assignedTo:'', dueDate:'', estimatedHours:'', note:'',
  })
  const [formErrors, setFormErrors] = useState<Record<string,string>>({})
  const [createOk, setCreateOk] = useState(false)

  // Completing animation
  const [completing, setCompleting] = useState<string|null>(null)

  // KPIs
  const inProgress  = orders.filter(o => o.status==='in_progress').length
  const pending     = orders.filter(o => o.status==='pending').length
  const overdue     = orders.filter(o => o.status==='overdue').length
  const completedCt = history.length

  function handleStart(id: string) {
    setOrders(prev => prev.map(o => o.id===id ? {...o, status:'in_progress', startedAt:'2026-06-29'} : o))
    if (detailWO?.id===id) setDetailWO(prev => prev ? {...prev, status:'in_progress', startedAt:'2026-06-29'} : null)
  }

  function handleComplete(id: string) {
    setCompleting(id)
    setTimeout(() => {
      const wo = orders.find(o => o.id===id)
      if (wo) {
        const done: WorkOrder = { ...wo, status:'completed', completedAt:'2026-06-29', techNote: noteInput || wo.techNote }
        setHistory(prev => [done, ...prev])
        setOrders(prev => prev.filter(o => o.id!==id))
        setDetailWO(null)
      }
      setCompleting(null)
      setNoteInput('')
    }, 900)
  }

  function validateForm() {
    const e: Record<string,string> = {}
    if (!form.equipment) e.equipment = 'Required'
    if (!form.task.trim()) e.task = 'Required'
    if (!form.assignedTo) e.assignedTo = 'Required'
    if (!form.dueDate) e.dueDate = 'Required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  function submitCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return
    const id = `MNT-${String(orders.length + history.length + 10).padStart(3,'0')}`
    const newWO: WorkOrder = {
      id, equipment: form.equipment, category: form.category || 'General',
      task: form.task, type: form.type, priority: form.priority,
      status: 'pending', assignedTo: form.assignedTo, dueDate: form.dueDate,
      estimatedHours: parseFloat(form.estimatedHours) || 0,
      techNote: form.note || undefined,
    }
    setOrders(prev => [newWO, ...prev])
    setCreateOk(true)
    setTimeout(() => {
      setCreateOpen(false); setCreateOk(false)
      setForm({ equipment:'',category:'',task:'',type:'Preventive',priority:'medium',assignedTo:'',dueDate:'',estimatedHours:'',note:'' })
    }, 1400)
  }

  // Group schedule by date
  const scheduleByDate = useMemo(() => {
    const map = new Map<string, typeof SCHEDULE>()
    for (const s of SCHEDULE) {
      if (!map.has(s.date)) map.set(s.date, [])
      map.get(s.date)!.push(s)
    }
    return map
  }, [])

  const scheduleDates = Array.from(scheduleByDate.keys()).sort()

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AppShell
      role="maintenance"
      currentPath="/maintenance"
      title="Maintenance"
      breadcrumb={[{label:'Home',href:'/'},{label:'Maintenance'}]}
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="In Progress"  value={inProgress}  icon={Wrench}       color="#3B82F6" />
        <StatCard label="Pending"      value={pending}     icon={Clock}        color="#F59E0B" />
        <StatCard label="Overdue"      value={overdue}     icon={AlertTriangle} color={overdue>0?'#EF4444':'#22C55E'} />
        <StatCard label="Completed"    value={completedCt} icon={CheckCheck}   color="#10B981" />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-5">
        <div/>
        <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={() => setCreateOpen(true)}>
          Create Work Order
        </Button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-border-default mb-5">
        {([
          ['orders',   `Work Orders (${orders.length})`],
          ['schedule', `Schedule (${SCHEDULE.length})`],
          ['history',  `History (${history.length})`],
        ] as [Tab, string][]).map(([t, label]) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab===t?'border-brand-500 text-brand-500':'border-transparent text-neutral-500 hover:text-neutral-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── WORK ORDERS TAB ── */}
      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length===0?(
            <div className="bg-white rounded-card border border-border-default shadow-card py-16 text-center">
              <Wrench size={40} className="mx-auto text-neutral-200 mb-3" strokeWidth={1.5}/>
              <p className="text-sm font-semibold text-neutral-400">No open work orders</p>
            </div>
          ):orders.map(wo=>{
            const pc=PRI_CFG[wo.priority]; const sc=STS_CFG[wo.status]
            const isOverdue=wo.status==='overdue'
            return (
              <div
                key={wo.id}
                className={`bg-white rounded-card border shadow-card p-5 cursor-pointer hover:shadow-md transition-all ${isOverdue?'border-red-200 ring-1 ring-red-100':'border-border-default'}`}
                onClick={() => { setDetailWO(wo); setNoteInput(wo.techNote??'') }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand-500">{wo.id}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${pc.badge}`}>{wo.priority}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>{sc.label}</span>
                      <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded-full">{wo.type}</span>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{wo.task}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{wo.equipment} · {wo.category}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><User size={11}/>{wo.assignedTo}</span>
                      <span className="flex items-center gap-1"><Calendar size={11}/>Due {wo.dueDate}</span>
                      <span className="flex items-center gap-1"><Clock size={11}/>Est. {wo.estimatedHours}h</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    {wo.status==='pending' && (
                      <Button variant="secondary" size="sm" icon={<Play size={11}/>}
                        onClick={() => handleStart(wo.id)}>
                        Start
                      </Button>
                    )}
                    {wo.status==='in_progress' && (
                      <Button variant="brand" size="sm" icon={<CheckCheck size={11}/>}
                        disabled={completing===wo.id}
                        onClick={() => handleComplete(wo.id)}>
                        {completing===wo.id?'Saving…':'Complete'}
                      </Button>
                    )}
                    {wo.status==='overdue' && (
                      <Button variant="danger" size="sm" icon={<Play size={11}/>}
                        onClick={() => handleStart(wo.id)}>
                        Start Now
                      </Button>
                    )}
                  </div>
                </div>
                {wo.techNote && (
                  <p className="mt-3 text-xs text-neutral-500 bg-neutral-50 rounded-lg px-3 py-2 border border-border-default">
                    {wo.techNote}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── SCHEDULE TAB ── */}
      {tab === 'schedule' && (
        <div className="space-y-5">
          {/* Overdue alert */}
          {orders.filter(o=>o.status==='overdue').length>0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5"/>
              <div>
                <p className="text-sm font-bold text-red-800 mb-1">Overdue Work Orders</p>
                <div className="space-y-1">
                  {orders.filter(o=>o.status==='overdue').map(o=>(
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
            const isToday = date === '2026-06-29'
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
      )}

      {/* ── HISTORY TAB ── */}
      {tab === 'history' && (
        <div className="space-y-3">
          {history.map(wo=>(
            <div key={wo.id} className="bg-white border border-border-default rounded-card shadow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-brand-500">{wo.id}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${PRI_CFG[wo.priority].badge}`}>{wo.priority}</span>
                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded-full">{wo.type}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border bg-green-50 text-green-700 border-green-200">Completed</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-900">{wo.task}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{wo.equipment} · {wo.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-neutral-700">{wo.assignedTo.split(' ')[0]}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{wo.completedAt}</p>
                  {wo.actualHours && (
                    <p className="text-xs font-bold text-neutral-600 mt-0.5">{wo.actualHours}h actual</p>
                  )}
                </div>
              </div>
              {wo.techNote && (
                <p className="text-xs text-neutral-600 bg-neutral-50 border border-border-default rounded-lg px-3 py-2.5 leading-relaxed">
                  {wo.techNote}
                </p>
              )}
              <div className="flex items-center gap-4 mt-3 text-xs text-neutral-400">
                <span>Est: {wo.estimatedHours}h</span>
                {wo.actualHours && <span className={wo.actualHours>wo.estimatedHours?'text-red-500':'text-green-600'}>Actual: {wo.actualHours}h</span>}
                <span>Due: {wo.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Work Order Detail Panel ── */}
      {detailWO && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setDetailWO(null)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <p className="font-mono text-xs font-bold text-brand-500 mb-1">{detailWO.id}</p>
                <h2 className="text-base font-bold text-neutral-900">{detailWO.task}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border capitalize ${PRI_CFG[detailWO.priority].badge}`}>{detailWO.priority}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-bold border ${STS_CFG[detailWO.status].badge}`}>{STS_CFG[detailWO.status].label}</span>
                </div>
              </div>
              <button type="button" aria-label="Close" onClick={() => setDetailWO(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Equipment',  detailWO.equipment],
                  ['Category',   detailWO.category],
                  ['Type',       detailWO.type],
                  ['Assigned To',detailWO.assignedTo],
                  ['Due Date',   detailWO.dueDate],
                  ['Est. Hours', `${detailWO.estimatedHours}h`],
                  ['Started',    detailWO.startedAt ?? 'Not started'],
                ].map(([label, value]) => (
                  <div key={label} className="bg-neutral-50 rounded-lg p-3 border border-border-default">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-neutral-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Tech notes editor */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">
                  Technician Notes
                </label>
                <Textarea
                  rows={3}
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Add findings, observations, or instructions…"
                />
              </div>

              {/* Action buttons */}
              {detailWO.status === 'pending' && (
                <Button variant="secondary" fullWidth size="md" icon={<Play size={14}/>}
                  onClick={() => handleStart(detailWO.id)}>
                  Start Work Order
                </Button>
              )}
              {(detailWO.status === 'in_progress' || detailWO.status === 'overdue') && (
                <Button variant="brand" fullWidth size="md" icon={<CheckCheck size={14}/>}
                  disabled={completing === detailWO.id}
                  onClick={() => handleComplete(detailWO.id)}>
                  {completing === detailWO.id ? 'Completing…' : 'Mark Complete'}
                </Button>
              )}
            </div>
          </aside>
        </>
      )}

      {/* ── Create Work Order Panel ── */}
      {createOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setCreateOpen(false)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Create Work Order</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Schedule new maintenance task</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setCreateOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>

            {createOk ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500"/>
                </div>
                <p className="text-base font-bold text-neutral-900">Work Order Created</p>
                <p className="text-sm text-neutral-500">The work order has been added to the queue.</p>
              </div>
            ) : (
              <form onSubmit={submitCreate} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Equipment */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Equipment <span className="text-status-critical">*</span></label>
                  <Dropdown options={EQUIPMENT_OPTIONS} value={form.equipment}
                    onChange={v=>{setForm(f=>({...f,equipment:v}));setFormErrors(e=>({...e,equipment:''}))}}
                    placeholder="Select equipment…" error={!!formErrors.equipment} searchable/>
                  {formErrors.equipment && <p className="text-xs text-status-critical">{formErrors.equipment}</p>}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Category</label>
                  <Dropdown options={CAT_OPTIONS} value={form.category}
                    onChange={v=>setForm(f=>({...f,category:v}))} placeholder="Select category…"/>
                </div>

                {/* Task description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Task Description <span className="text-status-critical">*</span></label>
                  <Input placeholder="Describe the maintenance task…" value={form.task}
                    onChange={e=>{setForm(f=>({...f,task:e.target.value}));setFormErrors(x=>({...x,task:''}))}}
                    error={!!formErrors.task}/>
                  {formErrors.task && <p className="text-xs text-status-critical">{formErrors.task}</p>}
                </div>

                {/* Type + Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Type</label>
                    <div className="space-y-1.5">
                      {TYPE_OPTIONS.map(t=>(
                        <button key={t} type="button"
                          onClick={()=>setForm(f=>({...f,type:t}))}
                          className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg border-2 text-left transition-all ${form.type===t?'border-brand-500 bg-brand-50 text-brand-700':'border-border-default text-neutral-500 hover:bg-neutral-50'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Priority</label>
                    <div className="space-y-1.5">
                      {PRI_OPTIONS.map(p=>(
                        <button key={p} type="button"
                          onClick={()=>setForm(f=>({...f,priority:p}))}
                          className={`w-full py-1.5 px-3 text-xs font-semibold rounded-lg border-2 capitalize text-left transition-all ${form.priority===p?PRI_CFG[p].badge+' border-current':'border-border-default text-neutral-500 hover:bg-neutral-50'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assigned To */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Assign To <span className="text-status-critical">*</span></label>
                  <Dropdown options={TECH_OPTIONS} value={form.assignedTo}
                    onChange={v=>{setForm(f=>({...f,assignedTo:v}));setFormErrors(e=>({...e,assignedTo:''}))}}
                    placeholder="Select technician…" error={!!formErrors.assignedTo}/>
                  {formErrors.assignedTo && <p className="text-xs text-status-critical">{formErrors.assignedTo}</p>}
                </div>

                {/* Due Date + Hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Due Date <span className="text-status-critical">*</span></label>
                    <DatePicker value={form.dueDate}
                      onChange={v=>{setForm(f=>({...f,dueDate:v}));setFormErrors(e=>({...e,dueDate:''}))}}
                      error={!!formErrors.dueDate}/>
                    {formErrors.dueDate && <p className="text-xs text-status-critical">{formErrors.dueDate}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Est. Hours</label>
                    <Input type="number" min="0.5" step="0.5" placeholder="e.g. 4"
                      value={form.estimatedHours} onChange={e=>setForm(f=>({...f,estimatedHours:e.target.value}))}/>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Notes / Instructions</label>
                  <Textarea rows={2} placeholder="Any initial notes, parts required, or safety precautions…"
                    value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
                </div>

                <div className="pt-2 border-t border-border-default">
                  <Button type="submit" variant="brand" fullWidth size="md">Create Work Order</Button>
                </div>
              </form>
            )}
          </aside>
        </>
      )}
    </AppShell>
  )
}
