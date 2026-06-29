'use client'

import { useState } from 'react'
import { Plus, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { Button } from '@/components/ui/Button'
import { Input, Textarea, Select } from '@/components/ui/Form'
import { DatePicker } from '@/components/ui/DatePicker'

type NMStatus = 'open' | 'under_review' | 'closed'
type NMCategory = 'Dropped Object' | 'Slip/Trip/Fall' | 'Equipment Failure' | 'Chemical Exposure' | 'Fire/Explosion Risk' | 'Other'

interface NearMiss {
  id: string; date: string; time: string; location: string
  category: NMCategory; description: string; reportedBy: string
  immediateAction?: string; status: NMStatus; daysOpen: number
}

const STATUS_CFG: Record<NMStatus, { badge: string; label: string }> = {
  open:         { badge: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Open'         },
  under_review: { badge: 'bg-blue-50 text-blue-700 border-blue-200',    label: 'Under Review' },
  closed:       { badge: 'bg-green-50 text-green-700 border-green-200', label: 'Closed'       },
}

const CAT_OPTIONS: NMCategory[] = ['Dropped Object','Slip/Trip/Fall','Equipment Failure','Chemical Exposure','Fire/Explosion Risk','Other']

const INIT_NMS: NearMiss[] = [
  { id:'NM-2026-001', date:'2026-06-28', time:'07:15', location:'Drill Floor', category:'Dropped Object', description:'Spanner dropped from derrick level 2, landed near crew member. No injury but high potential.', reportedBy:'Segun Folarin', immediateAction:'Area cordoned off, tool bag inspection ordered.', status:'under_review', daysOpen:1 },
  { id:'NM-2026-002', date:'2026-06-25', time:'14:30', location:'Workshop Bay', category:'Slip/Trip/Fall', description:'Spilled hydraulic fluid not immediately cleaned. Technician slipped but maintained balance.', reportedBy:'Kenneth Nwosu', immediateAction:'Fluid cleaned, spillage kit restocked at bay entrance.', status:'open', daysOpen:4 },
  { id:'NM-2026-003', date:'2026-06-20', time:'09:00', location:'Mud Pit Area', category:'Chemical Exposure', description:'Brief skin contact with drilling chemical during manual mixing — glove had a micro-tear.', reportedBy:'Biodun Adekunle', immediateAction:'First aid administered. Glove inspection protocol updated.', status:'closed', daysOpen:0 },
  { id:'NM-2026-004', date:'2026-06-18', time:'11:45', location:'Generator Room', category:'Fire/Explosion Risk', description:'Fuel spill on hot surface from a loose fitting. Detected before ignition.', reportedBy:'Danjuma Yusuf', immediateAction:'Generator shut down, area evacuated, fitting repaired.', status:'closed', daysOpen:0 },
]

export default function SafetyNearMissPage() {
  const [items, setItems] = useState<NearMiss[]>(INIT_NMS)
  const [reportOpen, setReportOpen] = useState(false)
  const [form, setForm] = useState({ date:'', time:'', location:'', category:'Dropped Object' as NMCategory, description:'', immediateAction:'', reportedBy:'' })
  const [submitOk, setSubmitOk] = useState(false)

  const open        = items.filter(n => n.status === 'open').length
  const underReview = items.filter(n => n.status === 'under_review').length
  const closed      = items.filter(n => n.status === 'closed').length

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.location || !form.description) return
    const id = `NM-2026-${String(items.length + 1).padStart(3,'0')}`
    setItems(prev => [{ id, date:form.date, time:form.time||'00:00', location:form.location, category:form.category, description:form.description, immediateAction:form.immediateAction||undefined, reportedBy:form.reportedBy||'Current User', status:'open', daysOpen:0 }, ...prev])
    setSubmitOk(true)
    setTimeout(() => { setReportOpen(false); setSubmitOk(false); setForm({ date:'',time:'',location:'',category:'Dropped Object',description:'',immediateAction:'',reportedBy:'' }) }, 1500)
  }

  return (
    <AppShell
      role="safety"
      currentPath="/safety/near-miss"
      title="Near Misses"
      breadcrumb={[{label:'Home',href:'/'},{label:'Safety',href:'/safety'},{label:'Near Misses'}]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Open"         value={open}        color={open>0?'#F59E0B':'#22C55E'} icon={AlertTriangle}/>
        <StatCard label="Under Review" value={underReview} color="#3B82F6"                     icon={AlertTriangle}/>
        <StatCard label="Closed"       value={closed}      color="#10B981"                     icon={CheckCircle2}/>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div/>
        <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={() => setReportOpen(true)}>
          Report Near Miss
        </Button>
      </div>

      <div className="space-y-3">
        {items.map(n => {
          const sc = STATUS_CFG[n.status]
          return (
            <div key={n.id} className="bg-white rounded-card border border-border-default shadow-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs font-bold text-brand-500">{n.id}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${sc.badge}`}>{sc.label}</span>
                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded-full">{n.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 leading-snug">{n.description}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-neutral-400 flex-wrap">
                    <span>{n.location}</span>
                    <span>{n.date} {n.time}</span>
                    <span>Reported by: <strong className="text-neutral-600">{n.reportedBy}</strong></span>
                  </div>
                  {n.immediateAction && (
                    <p className="mt-2 text-xs text-neutral-600 bg-neutral-50 rounded-lg px-3 py-2 border border-border-default">
                      Action: {n.immediateAction}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Report Near Miss panel */}
      {reportOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setReportOpen(false)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[460px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <h2 className="text-base font-bold text-neutral-900">Report Near Miss</h2>
              <button type="button" aria-label="Close" onClick={() => setReportOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>
            {submitOk ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle2 size={28} className="text-green-500"/></div>
                <p className="text-base font-bold text-neutral-900">Near Miss Reported</p>
              </div>
            ) : (
              <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Date <span className="text-status-critical">*</span></label>
                    <DatePicker value={form.date} onChange={v => setForm(f=>({...f,date:v}))}/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Time</label>
                    <Input type="time" value={form.time} onChange={e => setForm(f=>({...f,time:e.target.value}))}/>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Location <span className="text-status-critical">*</span></label>
                  <Input placeholder="e.g. Drill Floor, Workshop Bay…" value={form.location} onChange={e => setForm(f=>({...f,location:e.target.value}))}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Category</label>
                  <Select aria-label="Near miss category" value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value as NMCategory}))} size="sm">
                    {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">What happened? <span className="text-status-critical">*</span></label>
                  <Textarea rows={3} placeholder="Describe the near miss event…" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Immediate action taken</label>
                  <Textarea rows={2} placeholder="What was done immediately after…" value={form.immediateAction} onChange={e => setForm(f=>({...f,immediateAction:e.target.value}))}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Reported by</label>
                  <Input placeholder="Your name" value={form.reportedBy} onChange={e => setForm(f=>({...f,reportedBy:e.target.value}))}/>
                </div>
                <div className="pt-2 border-t border-border-default">
                  <Button type="submit" variant="brand" fullWidth size="md">Submit Report</Button>
                </div>
              </form>
            )}
          </aside>
        </>
      )}
    </AppShell>
  )
}
