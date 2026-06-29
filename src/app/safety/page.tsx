/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import {
  AlertTriangle, ShieldCheck, CheckCircle2, Clock, Flag,
  Plus, X, ChevronDown, ChevronUp, Filter, FileText,
  MapPin, User, Calendar, ArrowRight, RefreshCw,
} from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard }    from '@/components/domain/StatCard'
import { Button }      from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import { Dropdown }    from '@/components/ui/Dropdown'
import { DatePicker }  from '@/components/ui/DatePicker'

// ── Types ─────────────────────────────────────────────────────────────────────

type Severity = 'low' | 'medium' | 'high' | 'critical'
type IncStatus = 'open' | 'under_review' | 'closed' | 'escalated'
type IncType =
  | 'Near Miss' | 'First Aid' | 'Equipment Damage'
  | 'Slip / Trip' | 'Chemical Spill' | 'Fire / Explosion'
  | 'Struck By Object' | 'Electrical Hazard' | 'Working at Height' | 'Other'

interface Incident {
  id: string
  type: IncType
  location: string
  severity: Severity
  reportedBy: string
  date: string
  time: string
  status: IncStatus
  description: string
  immediateAction: string
  investigator?: string
  witnesses?: string
  equipment?: string
  daysOpen: number
}

type InspStatus = 'passed' | 'failed' | 'pending' | 'overdue'
interface Inspection {
  id: string
  equipment: string
  category: string
  inspector: string
  lastDate: string
  nextDate: string
  status: InspStatus
  findings?: string
}

type PTWType = 'Hot Work' | 'Cold Work' | 'Confined Space' | 'Electrical' | 'Lifting' | 'Working at Height'
type PTWStatus = 'pending' | 'active' | 'closed' | 'suspended'
interface PTW {
  id: string
  type: PTWType
  location: string
  crew: string
  supervisor: string
  validFrom: string
  validTo: string
  status: PTWStatus
  description: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const INIT_INCIDENTS: Incident[] = [
  { id: 'INC-2026-001', type: 'Near Miss',          location: 'Warehouse Bay 3',   severity: 'medium',   reportedBy: 'Emeka Okonkwo',   date: '2026-06-26', time: '09:14', status: 'open',         description: 'Forklift passed within 0.5m of foot-worker crossing unmarked aisle during routine transfer.',        immediateAction: 'Area cordoned, supervisor notified. Pedestrian walkway markings to be refreshed.', investigator: 'Yinka Adeyemi', witnesses: 'Tunde Bello, Chibike Eze', equipment: 'Forklift FL-03', daysOpen: 2 },
  { id: 'INC-2026-002', type: 'Equipment Damage',   location: 'Dispatch Yard',     severity: 'high',     reportedBy: 'Biodun Adekunle', date: '2026-06-25', time: '14:33', status: 'under_review',  description: 'Rigging sling snapped during offshore container lift, container dropped 0.4m onto trailer bed.', immediateAction: 'Lift suspended, sling removed from service, third-party inspection requested.',    investigator: 'Femi Emmanuel',  witnesses: 'Chika Obi',                equipment: 'Sling Set SL-12B', daysOpen: 3 },
  { id: 'INC-2026-003', type: 'Slip / Trip',        location: 'Loading Bay 1',     severity: 'low',      reportedBy: 'Kenneth Nwosu',   date: '2026-06-24', time: '07:55', status: 'closed',        description: 'Technician slipped on wet concrete near draining basin. No injury sustained.',                   immediateAction: 'Area marked with wet floor signs, drainage improved.',                              investigator: 'Yinka Adeyemi', witnesses: 'None',                   equipment: 'N/A',              daysOpen: 0 },
  { id: 'INC-2026-004', type: 'Near Miss',          location: 'Container Yard',    severity: 'medium',   reportedBy: 'Tunde Bello',     date: '2026-06-23', time: '11:20', status: 'open',          description: 'Container swung during crane lift and struck scaffolding rail — no personnel injured.',           immediateAction: 'Lift aborted, exclusion zone extended, crane operator re-briefed.',                  investigator: 'Femi Emmanuel',  witnesses: 'Danjuma Yusuf',          equipment: 'Crane CR-01, Container CNT-009', daysOpen: 5 },
  { id: 'INC-2026-005', type: 'First Aid',          location: 'Warehouse Bay 1',   severity: 'low',      reportedBy: 'Yinka Adeyemi',   date: '2026-06-22', time: '16:02', status: 'closed',        description: 'Minor cut to right hand while handling metal casing. First aid administered on-site.',            immediateAction: 'Wound cleaned and dressed by first-aider. Cut-resistant gloves now mandatory.',     investigator: 'Femi Emmanuel',  witnesses: 'Ngozi Eze',              equipment: 'Metal Casing MC-44', daysOpen: 0 },
  { id: 'INC-2026-006', type: 'Chemical Spill',     location: 'Chemical Store',    severity: 'high',     reportedBy: 'Aisha Musa',      date: '2026-06-20', time: '08:48', status: 'escalated',     description: 'Drilling fluid drum overturned, spilling approximately 200L onto bay floor. Fumes detected.',     immediateAction: 'Immediate evacuation, MSDS consulted, spill contained with absorbent pads. ERT activated.', investigator: 'Yinka Adeyemi', witnesses: 'Tunde Bello, Biodun Adekunle', equipment: 'Drum DR-221 (Drilling Fluid)', daysOpen: 8 },
  { id: 'INC-2026-007', type: 'Working at Height',  location: 'Mezzanine Level 2', severity: 'critical', reportedBy: 'Segun Folarin',   date: '2026-06-18', time: '13:10', status: 'under_review',  description: 'Worker found without harness attached while on mezzanine platform at 4.2m height. Work stopped.', immediateAction: 'Work immediately halted. Full safety stand-down called. Toolbox talk held.',         investigator: 'Aisha Musa',     witnesses: 'Yinka Adeyemi, Emeka Okonkwo', equipment: 'Mezzanine Platform MZ-02', daysOpen: 10 },
  { id: 'INC-2026-008', type: 'Electrical Hazard',  location: 'Panel Room B',      severity: 'medium',   reportedBy: 'Danjuma Yusuf',   date: '2026-06-17', time: '10:05', status: 'closed',        description: 'Exposed wiring found behind Panel B-07 during routine maintenance. Area isolated.',              immediateAction: 'Panel B-07 isolated and locked out. Electrical contractor engaged for repair.',      investigator: 'Femi Emmanuel',  witnesses: 'None',                   equipment: 'Panel B-07',       daysOpen: 0 },
]

const INSPECTIONS: Inspection[] = [
  { id: 'INP-001', equipment: 'Forklift FL-01',        category: 'Mobile Plant',    inspector: 'Yinka Adeyemi',   lastDate: '2026-06-15', nextDate: '2026-07-15', status: 'passed',  findings: 'All systems operational. Tyre tread within tolerance.' },
  { id: 'INP-002', equipment: 'Forklift FL-03',        category: 'Mobile Plant',    inspector: 'Emeka Okonkwo',   lastDate: '2026-05-30', nextDate: '2026-06-30', status: 'overdue', findings: 'Due for brake inspection — scheduled post-incident review.' },
  { id: 'INP-003', equipment: 'Crane CR-01',           category: 'Lifting Gear',    inspector: 'Femi Emmanuel',   lastDate: '2026-06-20', nextDate: '2026-07-20', status: 'passed',  findings: 'Load test completed. No structural defects found.' },
  { id: 'INP-004', equipment: 'Sling Set SL-12B',      category: 'Rigging',         inspector: 'Chika Obi',       lastDate: '2026-06-25', nextDate: '2026-07-25', status: 'failed',  findings: 'Sling snapped during lift — removed from service, replacement ordered.' },
  { id: 'INP-005', equipment: 'Fire Suppression Bay 3',category: 'Fire Safety',     inspector: 'Aisha Musa',      lastDate: '2026-06-10', nextDate: '2026-09-10', status: 'passed',  findings: 'All extinguishers charged and in date. Sprinkler test passed.' },
  { id: 'INP-006', equipment: 'Mezzanine MZ-02',       category: 'Work at Height',  inspector: 'Segun Folarin',   lastDate: '2026-06-01', nextDate: '2026-07-01', status: 'overdue', findings: 'Guardrail inspection overdue. Work suspended pending inspection.' },
  { id: 'INP-007', equipment: 'Chemical Store CS-A',   category: 'COSHH',           inspector: 'Aisha Musa',      lastDate: '2026-06-22', nextDate: '2026-07-22', status: 'pending', findings: 'Bunding integrity check pending.' },
  { id: 'INP-008', equipment: 'Electrical Panel B-07', category: 'Electrical',      inspector: 'Danjuma Yusuf',   lastDate: '2026-06-17', nextDate: '2026-09-17', status: 'failed',  findings: 'Exposed wiring found. Panel isolated. Repair in progress.' },
]

const PTWS: PTW[] = [
  { id: 'PTW-2026-041', type: 'Hot Work',         location: 'Dispatch Yard',     crew: 'Biodun Adekunle, Tunde Bello',    supervisor: 'Chika Obi',       validFrom: '2026-06-29', validTo: '2026-06-29', status: 'active',    description: 'Welding repair of trailer hitch bracket. Fire watch in place.' },
  { id: 'PTW-2026-040', type: 'Confined Space',   location: 'Tank Farm TF-03',   crew: 'Segun Folarin, Kenneth Nwosu',    supervisor: 'Yinka Adeyemi',   validFrom: '2026-06-28', validTo: '2026-06-28', status: 'closed',    description: 'Entry for inspection and sludge removal. BA sets issued.' },
  { id: 'PTW-2026-039', type: 'Electrical',       location: 'Panel Room B',      crew: 'Danjuma Yusuf',                   supervisor: 'Femi Emmanuel',   validFrom: '2026-06-28', validTo: '2026-06-28', status: 'closed',    description: 'Repair of exposed wiring on Panel B-07. LOTO applied.' },
  { id: 'PTW-2026-042', type: 'Lifting',          location: 'Container Yard',    crew: 'Emeka Okonkwo, Ngozi Eze',        supervisor: 'Chika Obi',       validFrom: '2026-06-30', validTo: '2026-06-30', status: 'pending',   description: 'Crane lift of 12T container to vessel hold. Banksman assigned.' },
  { id: 'PTW-2026-043', type: 'Working at Height',location: 'Mezzanine MZ-02',   crew: 'Segun Folarin',                   supervisor: 'Yinka Adeyemi',   validFrom: '2026-07-01', validTo: '2026-07-01', status: 'pending',   description: 'Guardrail inspection and repair at 4.2m. Full harness required.' },
  { id: 'PTW-2026-038', type: 'Cold Work',        location: 'Chemical Store CS-A',crew: 'Aisha Musa, Kenneth Nwosu',      supervisor: 'Femi Emmanuel',   validFrom: '2026-06-27', validTo: '2026-06-27', status: 'suspended', description: 'Bunding repair — suspended pending re-assessment of chemical inventory.' },
]

// ── Style maps ────────────────────────────────────────────────────────────────

const SEV_CLASS: Record<Severity, { badge: string; bar: string }> = {
  low:      { badge: 'bg-green-50  text-green-700  border-green-200',  bar: 'bg-green-500'  },
  medium:   { badge: 'bg-amber-50  text-amber-700  border-amber-200',  bar: 'bg-amber-500'  },
  high:     { badge: 'bg-orange-50 text-orange-700 border-orange-200', bar: 'bg-orange-500' },
  critical: { badge: 'bg-red-50    text-red-700    border-red-200',    bar: 'bg-red-500'    },
}

const STATUS_CLASS: Record<IncStatus, { badge: string; label: string }> = {
  open:         { badge: 'bg-red-50    text-red-700    border-red-200',    label: 'Open'         },
  under_review: { badge: 'bg-amber-50  text-amber-700  border-amber-200',  label: 'Under Review' },
  closed:       { badge: 'bg-green-50  text-green-700  border-green-200',  label: 'Closed'       },
  escalated:    { badge: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Escalated'    },
}

const INS_CLASS: Record<InspStatus, { badge: string; label: string }> = {
  passed:  { badge: 'bg-green-50  text-green-700  border-green-200',  label: 'Passed'  },
  failed:  { badge: 'bg-red-50    text-red-700    border-red-200',    label: 'Failed'  },
  pending: { badge: 'bg-neutral-50 text-neutral-600 border-neutral-200', label: 'Pending' },
  overdue: { badge: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Overdue' },
}

const PTW_CLASS: Record<PTWStatus, { badge: string; label: string }> = {
  pending:   { badge: 'bg-blue-50   text-blue-700   border-blue-200',   label: 'Pending'   },
  active:    { badge: 'bg-green-50  text-green-700  border-green-200',  label: 'Active'    },
  closed:    { badge: 'bg-neutral-50 text-neutral-600 border-neutral-200', label: 'Closed' },
  suspended: { badge: 'bg-amber-50  text-amber-700  border-amber-200',  label: 'Suspended' },
}

const INC_TYPE_OPTIONS = [
  'Near Miss','First Aid','Equipment Damage','Slip / Trip',
  'Chemical Spill','Fire / Explosion','Struck By Object','Electrical Hazard',
  'Working at Height','Other',
].map(v => ({ value: v, label: v }))

const LOCATION_OPTIONS = [
  'Warehouse Bay 1','Warehouse Bay 2','Warehouse Bay 3',
  'Dispatch Yard','Loading Bay 1','Loading Bay 2',
  'Container Yard','Chemical Store','Panel Room B',
  'Mezzanine Level 2','Tank Farm','Maintenance Workshop','Other',
].map(v => ({ value: v, label: v }))

const SEV_OPTIONS = ['low','medium','high','critical'] as Severity[]
const SEV_LABELS: Record<Severity, string> = { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }

// ── Main component ────────────────────────────────────────────────────────────

type Tab = 'incidents' | 'inspections' | 'ptw'

export default function SafetyDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>(INIT_INCIDENTS)
  const [tab, setTab]             = useState<Tab>('incidents')

  // Filters
  const [filterSev,    setFilterSev]    = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Detail panel
  const [detailInc, setDetailInc] = useState<Incident | null>(null)
  const [newStatus, setNewStatus] = useState<IncStatus>('open')

  // Report panel
  const [reportOpen, setReportOpen] = useState(false)
  const [form, setForm] = useState({
    type: '', location: '', severity: '' as Severity | '',
    date: '', time: '', description: '', immediateAction: '',
    witnesses: '', equipment: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string,string>>({})
  const [submitOk, setSubmitOk] = useState(false)

  // ── Derived ──────────────────────────────────────────────────────────────────

  const openCount     = incidents.filter(i => i.status === 'open').length
  const highCount     = incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length
  const closedCount   = incidents.filter(i => i.status === 'closed').length
  const escalated     = incidents.filter(i => i.status === 'escalated').length
  const activeInspFail = INSPECTIONS.filter(i => i.status === 'failed' || i.status === 'overdue').length
  const activePTW      = PTWS.filter(p => p.status === 'active').length

  const filteredInc = useMemo(() => incidents.filter(i => {
    if (filterSev    !== 'all' && i.severity !== filterSev)    return false
    if (filterStatus !== 'all' && i.status   !== filterStatus) return false
    return true
  }), [incidents, filterSev, filterStatus])

  // ── Actions ───────────────────────────────────────────────────────────────────

  function updateStatus() {
    if (!detailInc) return
    setIncidents(prev => prev.map(i => i.id === detailInc.id ? { ...i, status: newStatus } : i))
    setDetailInc(prev => prev ? { ...prev, status: newStatus } : null)
  }

  function validateReport() {
    const e: Record<string,string> = {}
    if (!form.type)            e.type        = 'Required'
    if (!form.location)        e.location    = 'Required'
    if (!form.severity)        e.severity    = 'Required'
    if (!form.date)            e.date        = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  function submitReport(e: React.FormEvent) {
    e.preventDefault()
    if (!validateReport()) return
    const id = `INC-2026-${String(incidents.length + 1).padStart(3, '0')}`
    const newInc: Incident = {
      id, type: form.type as IncType, location: form.location,
      severity: form.severity as Severity, reportedBy: 'Current User',
      date: form.date, time: form.time || '00:00',
      status: 'open', description: form.description,
      immediateAction: form.immediateAction, witnesses: form.witnesses,
      equipment: form.equipment, daysOpen: 0,
    }
    setIncidents(prev => [newInc, ...prev])
    setSubmitOk(true)
    setTimeout(() => { setReportOpen(false); setSubmitOk(false); setForm({ type:'',location:'',severity:'',date:'',time:'',description:'',immediateAction:'',witnesses:'',equipment:'' }) }, 1600)
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AppShell
      role="safety"
      currentPath="/safety"
      title="Safety Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Safety' }]}
    >
      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Open Incidents"     value={openCount}         icon={AlertTriangle} color={openCount > 0 ? '#EF4444' : '#22C55E'} />
        <StatCard label="High / Critical"    value={highCount}         icon={Flag}          color={highCount > 0 ? '#F97316' : '#22C55E'} />
        <StatCard label="Closed This Month"  value={closedCount}       icon={CheckCircle2}  color="#10B981" />
        <StatCard label="Escalated"          value={escalated}         icon={ShieldCheck}   color={escalated > 0 ? '#8B5CF6' : '#22C55E'} />
        <StatCard label="Failed Inspections" value={activeInspFail}    icon={AlertTriangle} color={activeInspFail > 0 ? '#F59E0B' : '#22C55E'} />
      </div>

      {/* ── Action bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="brand" size="sm"
            icon={<Plus size={14}/>}
            onClick={() => setReportOpen(true)}
          >
            Report Incident
          </Button>
          <Button variant="secondary" size="sm" icon={<FileText size={14}/>}>
            Export Log
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Clock size={13} className="shrink-0"/>
          <span>Last updated: Today 08:42</span>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex gap-0 border-b border-border-default mb-5">
        {([
          ['incidents',   `Incidents (${incidents.length})`],
          ['inspections', `Inspections (${INSPECTIONS.length})`],
          ['ptw',         `Permit to Work (${PTWS.length})`],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
              tab === t
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-neutral-500 hover:text-neutral-800',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Incidents tab ── */}
      {tab === 'incidents' && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
              <Filter size={13}/> Filter:
            </div>
            <select
              aria-label="Filter by severity"
              value={filterSev}
              onChange={e => setFilterSev(e.target.value)}
              className="h-8 px-3 text-xs border border-border-default rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Severities</option>
              {SEV_OPTIONS.map(s => <option key={s} value={s}>{SEV_LABELS[s]}</option>)}
            </select>
            <select
              aria-label="Filter by status"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="h-8 px-3 text-xs border border-border-default rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="under_review">Under Review</option>
              <option value="escalated">Escalated</option>
              <option value="closed">Closed</option>
            </select>
            {(filterSev !== 'all' || filterStatus !== 'all') && (
              <button
                type="button"
                onClick={() => { setFilterSev('all'); setFilterStatus('all') }}
                className="flex items-center gap-1 text-xs text-brand-500 font-semibold hover:text-brand-600"
              >
                <X size={12}/> Clear
              </button>
            )}
            <span className="text-xs text-neutral-400 ml-auto">{filteredInc.length} record{filteredInc.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-border-default">
                <tr>
                  {['ID','Type','Location','Severity','Reported By','Date','Status',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filteredInc.map(inc => {
                  const sv = SEV_CLASS[inc.severity]
                  const st = STATUS_CLASS[inc.status]
                  return (
                    <tr
                      key={inc.id}
                      className="hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => { setDetailInc(inc); setNewStatus(inc.status) }}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-bold text-brand-500">{inc.id}</td>
                      <td className="px-4 py-3 font-medium text-neutral-900 whitespace-nowrap">{inc.type}</td>
                      <td className="px-4 py-3 text-neutral-600 text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-neutral-400 shrink-0"/>{inc.location}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border capitalize ${sv.badge}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-700 text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <User size={11} className="text-neutral-400 shrink-0"/>{inc.reportedBy}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-neutral-400 shrink-0"/>{inc.date}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${st.badge}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <ArrowRight size={14} className="text-neutral-300"/>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredInc.length === 0 && (
              <div className="py-12 text-center text-neutral-400 text-sm">No incidents match the selected filters.</div>
            )}
          </div>
        </div>
      )}

      {/* ── Inspections tab ── */}
      {tab === 'inspections' && (
        <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-border-default">
              <tr>
                {['ID','Equipment','Category','Inspector','Last Checked','Next Due','Status','Findings'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {INSPECTIONS.map(ins => {
                const sc = INS_CLASS[ins.status]
                const isUrgent = ins.status === 'failed' || ins.status === 'overdue'
                return (
                  <tr key={ins.id} className={`hover:bg-neutral-50 transition-colors ${isUrgent ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-neutral-500">{ins.id}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-900">{ins.equipment}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{ins.category}</td>
                    <td className="px-4 py-3 text-xs text-neutral-700">{ins.inspector}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{ins.lastDate}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={isUrgent ? 'text-red-600 font-bold' : 'text-neutral-500'}>{ins.nextDate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500 max-w-48 truncate">{ins.findings ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PTW tab ── */}
      {tab === 'ptw' && (
        <div className="space-y-3">
          {PTWS.map(ptw => {
            const pc = PTW_CLASS[ptw.status]
            const isActive = ptw.status === 'active'
            return (
              <div
                key={ptw.id}
                className={[
                  'bg-white rounded-card border shadow-card p-5',
                  isActive ? 'border-green-300 ring-1 ring-green-200' : 'border-border-default',
                ].join(' ')}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-brand-500">{ptw.id}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${pc.badge}`}>
                        {pc.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900">{ptw.type}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{ptw.description}</p>
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                      LIVE
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1"><MapPin size={11}/>{ptw.location}</span>
                  <span className="flex items-center gap-1"><User size={11}/> Supervisor: <strong className="text-neutral-700 ml-0.5">{ptw.supervisor}</strong></span>
                  <span className="flex items-center gap-1"><Calendar size={11}/> Valid: {ptw.validFrom} {ptw.validFrom !== ptw.validTo ? `– ${ptw.validTo}` : ''}</span>
                </div>
                <div className="mt-2 text-xs text-neutral-500">
                  Crew: <span className="text-neutral-700 font-medium">{ptw.crew}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Incident Detail Panel ── */}
      {detailInc && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setDetailInc(null)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{detailInc.type}</p>
                <h2 className="text-base font-bold text-neutral-900">{detailInc.id}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border capitalize ${SEV_CLASS[detailInc.severity].badge}`}>
                    {detailInc.severity}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${STATUS_CLASS[detailInc.status].badge}`}>
                    {STATUS_CLASS[detailInc.status].label}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDetailInc(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X size={17}/>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Date',         value: `${detailInc.date} ${detailInc.time}` },
                  { label: 'Location',     value: detailInc.location },
                  { label: 'Reported By',  value: detailInc.reportedBy },
                  { label: 'Investigator', value: detailInc.investigator ?? 'Unassigned' },
                  { label: 'Witnesses',    value: detailInc.witnesses ?? 'None recorded' },
                  { label: 'Equipment',    value: detailInc.equipment ?? 'N/A' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-neutral-50 rounded-lg p-3 border border-border-default">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-neutral-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Description</p>
                <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 rounded-lg p-3 border border-border-default">
                  {detailInc.description}
                </p>
              </div>

              {/* Immediate action */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Immediate Actions Taken</p>
                <p className="text-sm text-neutral-700 leading-relaxed bg-green-50 rounded-lg p-3 border border-green-100">
                  {detailInc.immediateAction}
                </p>
              </div>

              {/* Update status */}
              <div className="bg-white border border-border-default rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {(['open','under_review','escalated','closed'] as IncStatus[]).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewStatus(s)}
                      className={[
                        'px-3 py-2 text-xs font-bold rounded-lg border transition-all',
                        newStatus === s
                          ? STATUS_CLASS[s].badge + ' ring-1 ring-current'
                          : 'border-border-default text-neutral-500 hover:bg-neutral-50',
                      ].join(' ')}
                    >
                      {STATUS_CLASS[s].label}
                    </button>
                  ))}
                </div>
                <Button
                  variant="brand"
                  fullWidth
                  size="sm"
                  icon={<RefreshCw size={13}/>}
                  onClick={updateStatus}
                  disabled={newStatus === detailInc.status}
                >
                  Update Status
                </Button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ── Report Incident Panel ── */}
      {reportOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setReportOpen(false)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Report Incident</h2>
                <p className="text-xs text-neutral-400 mt-0.5">All fields marked * are required</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setReportOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X size={17}/>
              </button>
            </div>

            {submitOk ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500"/>
                </div>
                <p className="text-base font-bold text-neutral-900">Incident Reported</p>
                <p className="text-sm text-neutral-500">The incident has been logged and assigned for review.</p>
              </div>
            ) : (
              <form onSubmit={submitReport} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Incident Type <span className="text-status-critical">*</span></label>
                  <Dropdown options={INC_TYPE_OPTIONS} value={form.type}
                    onChange={v => { setForm(f => ({...f, type: v})); setFormErrors(e => ({...e, type:''})) }}
                    placeholder="Select type…" error={!!formErrors.type}/>
                  {formErrors.type && <p className="text-xs text-status-critical">{formErrors.type}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Location <span className="text-status-critical">*</span></label>
                  <Dropdown options={LOCATION_OPTIONS} value={form.location}
                    onChange={v => { setForm(f => ({...f, location: v})); setFormErrors(e => ({...e, location:''})) }}
                    placeholder="Select location…" error={!!formErrors.location}/>
                  {formErrors.location && <p className="text-xs text-status-critical">{formErrors.location}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Severity <span className="text-status-critical">*</span></label>
                  <div className="grid grid-cols-4 gap-2">
                    {SEV_OPTIONS.map(s => (
                      <button key={s} type="button"
                        onClick={() => { setForm(f => ({...f, severity: s})); setFormErrors(e => ({...e, severity:''})) }}
                        className={[
                          'py-2.5 rounded-lg border-2 text-xs font-bold capitalize transition-all',
                          form.severity === s ? SEV_CLASS[s].badge + ' border-current' : 'border-border-default text-neutral-500 hover:bg-neutral-50',
                        ].join(' ')}
                      >
                        {SEV_LABELS[s]}
                      </button>
                    ))}
                  </div>
                  {formErrors.severity && <p className="text-xs text-status-critical">{formErrors.severity}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Date <span className="text-status-critical">*</span></label>
                    <DatePicker value={form.date}
                      onChange={v => { setForm(f => ({...f, date: v})); setFormErrors(e => ({...e, date:''})) }}
                      max={new Date().toISOString().split('T')[0]}
                      placeholder="Incident date" error={!!formErrors.date}/>
                    {formErrors.date && <p className="text-xs text-status-critical">{formErrors.date}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Time</label>
                    <Input type="time" value={form.time}
                      onChange={e => setForm(f => ({...f, time: e.target.value}))}/>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Description <span className="text-status-critical">*</span></label>
                  <Textarea rows={3} placeholder="Describe exactly what happened…"
                    value={form.description} error={!!formErrors.description}
                    onChange={e => { setForm(f => ({...f, description: e.target.value})); setFormErrors(err => ({...err, description:''})) }}/>
                  {formErrors.description && <p className="text-xs text-status-critical">{formErrors.description}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Immediate Actions Taken</label>
                  <Textarea rows={2} placeholder="What immediate steps were taken to control the situation?"
                    value={form.immediateAction}
                    onChange={e => setForm(f => ({...f, immediateAction: e.target.value}))}/>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Witnesses</label>
                    <Input placeholder="Name(s)" value={form.witnesses}
                      onChange={e => setForm(f => ({...f, witnesses: e.target.value}))}/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Equipment Involved</label>
                    <Input placeholder="Equipment ID / name" value={form.equipment}
                      onChange={e => setForm(f => ({...f, equipment: e.target.value}))}/>
                  </div>
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
