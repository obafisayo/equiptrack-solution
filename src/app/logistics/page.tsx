/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import {
  ChevronLeft, ChevronRight, Plus, X, Filter as FilterIcon,
  Anchor, Navigation, Package, AlertTriangle, Clock, MapPin,
  Calendar as CalIcon, CheckCircle2,
} from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard }  from '@/components/domain/StatCard'
import { Button }    from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import { Dropdown }  from '@/components/ui/Dropdown'
import { DatePicker } from '@/components/ui/DatePicker'
import { VESSELS, type Vessel, type VesselStatus } from '@/lib/mock-data'

// ── Types ─────────────────────────────────────────────────────────────────────

type EventType  = 'Departure' | 'Arrival'
type CalView    = 'Day' | 'Week' | 'Month'

interface VesselEvent {
  id: string; vesselId: string; vesselName: string; type: EventType
  date: string; time: string; port: string; destination: string
  capacitySqM: number; bookedSqM: number
  distribution: { dept: string; units: number }[]
  status: VesselStatus; pic: string; notes?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const DAYS_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

const DEPT_CFG: Record<string, { bar: string; text: string }> = {
  DRILL:   { bar: 'bg-yellow-500', text: 'text-yellow-700' },
  FOPS:    { bar: 'bg-green-500',  text: 'text-green-700'  },
  ECP:     { bar: 'bg-blue-500',   text: 'text-blue-700'   },
  PROJECT: { bar: 'bg-teal-500',   text: 'text-teal-700'   },
  TECHLOG: { bar: 'bg-pink-500',   text: 'text-pink-700'   },
}

const VST_CFG: Record<VesselStatus, { label: string; badge: string; bar: string }> = {
  available:    { label: 'Available',  badge: 'bg-green-50 text-green-700 border border-green-200', bar: 'bg-green-500' },
  loading:      { label: 'Loading',    badge: 'bg-amber-50 text-amber-700 border border-amber-200', bar: 'bg-amber-500' },
  full:         { label: 'Full',       badge: 'bg-red-50 text-red-700 border border-red-200',       bar: 'bg-red-500'   },
  'in-transit': { label: 'In Transit', badge: 'bg-blue-50 text-blue-700 border border-blue-200',    bar: 'bg-blue-500'  },
  arrived:      { label: 'Arrived',    badge: 'bg-gray-50 text-gray-600 border border-gray-200',    bar: 'bg-gray-400'  },
}

const EVT_CHIP: Record<EventType, string> = {
  Departure: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  Arrival:   'bg-blue-100  text-blue-800  hover:bg-blue-200',
}

const COMMON_PORTS = [
  'Warri Port','Port Harcourt','Escravos Terminal','Bonga FPSO',
  'Agbami FPSO','Erha FPSO','Forcados Terminal','Lagos Apapa',
].map(v => ({ value: v, label: v }))

// ── Initial events ────────────────────────────────────────────────────────────

const INIT_EVENTS: VesselEvent[] = [
  { id:'EVT-005-DEP', vesselId:'VSL-005', vesselName:'MV ESCRAVOS STAR',  type:'Departure', date:'2026-06-22', time:'07:00', port:'Warri Port',     destination:'Escravos Terminal', capacitySqM:479, bookedSqM:479, distribution:[{dept:'DRILL',units:144},{dept:'FOPS',units:335}], status:'in-transit', pic:'Grace Okonkwo', notes:'Departed 22 Jun — fully loaded. ETA 28 Jun.' },
  { id:'EVT-001-DEP', vesselId:'VSL-001', vesselName:'MV SEPLAT PRIDE',   type:'Departure', date:'2026-06-28', time:'08:00', port:'Warri Port',     destination:'Bonga FPSO',        capacitySqM:479, bookedSqM:306, distribution:[{dept:'DRILL',units:122},{dept:'FOPS',units:107},{dept:'ECP',units:77}], status:'loading', pic:'Grace Okonkwo', notes:'Loading in progress. Final manifest due 06:00.' },
  { id:'EVT-005-ARR', vesselId:'VSL-005', vesselName:'MV ESCRAVOS STAR',  type:'Arrival',   date:'2026-06-28', time:'16:00', port:'Escravos Terminal', destination:'Escravos Terminal', capacitySqM:479, bookedSqM:479, distribution:[{dept:'DRILL',units:144},{dept:'FOPS',units:335}], status:'in-transit', pic:'Grace Okonkwo', notes:'ETA 28 Jun. Confirm berth.' },
  { id:'EVT-002-DEP', vesselId:'VSL-002', vesselName:'MV NIGER DELTA',    type:'Departure', date:'2026-06-30', time:'10:00', port:'Port Harcourt',  destination:'Agbami FPSO',       capacitySqM:413, bookedSqM:413, distribution:[{dept:'FOPS',units:248},{dept:'PROJECT',units:165}], status:'full', pic:'Grace Okonkwo', notes:'Vessel full. No further bookings.' },
  { id:'EVT-003-DEP', vesselId:'VSL-003', vesselName:'MV IJELE OFFSHORE', type:'Departure', date:'2026-07-03', time:'07:00', port:'Warri Port',     destination:'Erha FPSO',         capacitySqM:479, bookedSqM:143, distribution:[{dept:'DRILL',units:72},{dept:'TECHLOG',units:71}], status:'available', pic:'Grace Okonkwo', notes:'336 m² still available.' },
  { id:'EVT-004-DEP', vesselId:'VSL-004', vesselName:'MV OML 25 RUNNER',  type:'Departure', date:'2026-07-07', time:'09:00', port:'Port Harcourt',  destination:'Forcados Terminal', capacitySqM:350, bookedSqM:0,   distribution:[], status:'available', pic:'Grace Okonkwo', notes:'No cargo booked yet.' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function fmtDate(iso: string) {
  const d = new Date(iso+'T00:00:00'); return d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
}
function getCalendarCells(year: number, month: number): Date[] {
  const first = new Date(year, month, 1).getDay()
  const dim   = new Date(year, month+1, 0).getDate()
  const dprev = new Date(year, month, 0).getDate()
  const cells: Date[] = []
  for (let i = first-1; i >= 0; i--) cells.push(new Date(year, month-1, dprev-i))
  for (let d = 1; d <= dim; d++)     cells.push(new Date(year, month, d))
  const rem = 42 - cells.length
  for (let i = 1; i <= rem; i++)     cells.push(new Date(year, month+1, i))
  return cells
}
function getWeekOf(d: Date): Date[] {
  const dow = d.getDay()
  return Array.from({length:7}, (_,i) => { const x = new Date(d); x.setDate(d.getDate()-dow+i); return x })
}

const TODAY_ISO = '2026-06-28'
const TODAY     = new Date('2026-06-28T00:00:00')

// ── Sub-components ────────────────────────────────────────────────────────────

function EventDetailsPanel({ event, onClose }: { event: VesselEvent; onClose: () => void }) {
  const cfg = VST_CFG[event.status]
  const pct = event.capacitySqM > 0 ? Math.round((event.bookedSqM / event.capacitySqM) * 100) : 0
  const rem = event.capacitySqM - event.bookedSqM
  const tot = event.distribution.reduce((s,d) => s+d.units, 0)
  return (
    <div className="w-72 shrink-0 bg-white border-l border-border-default overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default sticky top-0 bg-white z-10">
        <p className="text-sm font-bold text-neutral-900">Event Details</p>
        <button type="button" aria-label="Close" onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors"><X size={15}/></button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${event.type==='Departure'?'bg-amber-100 text-amber-800':'bg-blue-100 text-blue-800'}`}>{event.type}</span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900">{event.vesselName}</p>
          <p className="font-mono text-xs text-brand-500 mt-0.5">#{event.vesselId}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-neutral-600"><CalIcon size={12} className="text-neutral-400"/>{event.date} at {event.time}</div>
          <div className="flex items-start gap-2 text-xs text-neutral-600"><MapPin size={12} className="text-neutral-400 mt-0.5"/><span>{event.port}{event.type==='Departure'&&<><br/><span className="text-neutral-400">→</span> {event.destination}</>}</span></div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-neutral-700">Deck Space</span>
            <span className="font-bold text-neutral-900">{event.bookedSqM}/{event.capacitySqM} m²</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full ${cfg.bar}`} style={{width:`${Math.min(100,pct)}%`}}/>
          </div>
          <div className="flex justify-between text-[10px] text-neutral-400"><span>{pct}% booked</span><span>{rem} m² free</span></div>
        </div>
        {event.distribution.length>0&&(
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Distribution</p>
            <div className="space-y-2">
              {event.distribution.map(d=>{
                const dc=DEPT_CFG[d.dept]??{bar:'bg-neutral-400',text:'text-neutral-600'}
                const p=event.capacitySqM>0?Math.round((d.units/event.capacitySqM)*100):0
                return (<div key={d.dept}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className={`font-bold ${dc.text} flex items-center gap-1`}><span className={`w-2 h-2 rounded-sm ${dc.bar}`}/>{d.dept}</span>
                    <span className="text-neutral-500">{d.units} m²</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${dc.bar}`} style={{width:`${p}%`}}/></div>
                </div>)
              })}
            </div>
          </div>
        )}
        <div className="bg-neutral-50 border border-border-default rounded-lg px-3 py-2.5 grid grid-cols-2 gap-y-1.5 text-xs">
          <span className="text-neutral-500">Total loaded</span><span className="font-bold text-right">{tot} m²</span>
          <span className="text-neutral-500">Remaining</span><span className={`font-bold text-right ${rem>0?'text-green-700':'text-red-600'}`}>{rem} m²</span>
          <span className="text-neutral-500">PIC</span><span className="font-bold text-right text-neutral-800">{event.pic}</span>
        </div>
        {event.notes&&<div><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-0.5">Notes</p><p className="text-xs text-neutral-600 leading-relaxed">{event.notes}</p></div>}
      </div>
    </div>
  )
}

function FilterPanel({ activeTypes, activeStatuses, onToggleType, onToggleStatus, onClose }:{
  activeTypes: Set<EventType>; activeStatuses: Set<VesselStatus>
  onToggleType:(t:EventType)=>void; onToggleStatus:(s:VesselStatus)=>void; onClose:()=>void
}) {
  return (
    <div className="w-52 shrink-0 bg-white border-r border-border-default overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default sticky top-0 bg-white z-10">
        <p className="text-sm font-bold text-neutral-900">Filter</p>
        <button type="button" aria-label="Close filter" onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X size={15}/></button>
      </div>
      <div className="p-4 space-y-5">
        <div>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Event Type</p>
          {(['Departure','Arrival'] as EventType[]).map(t=>(
            <label key={t} className="flex items-center gap-2.5 cursor-pointer mb-2">
              <input type="checkbox" checked={activeTypes.has(t)} onChange={()=>onToggleType(t)} className="w-4 h-4 accent-brand-500"/>
              <span className="text-sm text-neutral-700">{t}</span>
            </label>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Status</p>
          {(['available','loading','full','in-transit','arrived'] as VesselStatus[]).map(s=>{
            const cfg=VST_CFG[s]
            return (<label key={s} className="flex items-center gap-2.5 cursor-pointer mb-2">
              <input type="checkbox" checked={activeStatuses.has(s)} onChange={()=>onToggleStatus(s)} className="w-4 h-4 accent-brand-500"/>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
            </label>)
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LogisticsCalendar() {
  const [vessels]           = useState<Vessel[]>(VESSELS)
  const [events, setEvents] = useState<VesselEvent[]>(INIT_EVENTS)

  const [calView, setCalView]       = useState<CalView>('Month')
  const [viewYear, setViewYear]     = useState(2026)
  const [viewMonth, setViewMonth]   = useState(5)
  const [focusDate, setFocusDate]   = useState<Date>(TODAY) // for day/week views
  const [selectedId, setSelectedId] = useState<string|null>('EVT-001-DEP')
  const [filterOpen, setFilterOpen] = useState(false)

  const [activeTypes,    setActiveTypes]    = useState<Set<EventType>>(new Set(['Departure','Arrival']))
  const [activeStatuses, setActiveStatuses] = useState<Set<VesselStatus>>(new Set(['available','loading','full','in-transit','arrived']))

  // New Agenda panel
  const [newOpen, setNewOpen] = useState(false)
  const [agForm, setAgForm]   = useState({ vesselId:'', type:'Departure' as EventType, date:'', time:'08:00', port:'', destination:'', notes:'' })
  const [agErrors, setAgErrors] = useState<Record<string,string>>({})
  const [agSubmitOk, setAgSubmitOk] = useState(false)

  const vesselOptions = vessels.map(v => ({ value: v.id, label: v.name }))

  // Filtered events
  const filteredEvents = useMemo(
    () => events.filter(e => activeTypes.has(e.type) && activeStatuses.has(e.status)),
    [events, activeTypes, activeStatuses]
  )

  // Date → events map
  const eventsByDate = useMemo(() => {
    const map = new Map<string, VesselEvent[]>()
    for (const e of filteredEvents) {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date)!.push(e)
    }
    return map
  }, [filteredEvents])

  const calCells  = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth])
  const weekDates = useMemo(() => getWeekOf(focusDate), [focusDate])
  const selectedEvent = events.find(e => e.id === selectedId) ?? null

  // Month navigation
  function prevMonth() { viewMonth===0?(setViewMonth(11),setViewYear(y=>y-1)):setViewMonth(m=>m-1) }
  function nextMonth() { viewMonth===11?(setViewMonth(0),setViewYear(y=>y+1)):setViewMonth(m=>m+1) }

  // Day/Week navigation
  function prevDay()  { const d=new Date(focusDate); d.setDate(focusDate.getDate()-1); setFocusDate(d) }
  function nextDay()  { const d=new Date(focusDate); d.setDate(focusDate.getDate()+1); setFocusDate(d) }
  function prevWeek() { const d=new Date(focusDate); d.setDate(focusDate.getDate()-7); setFocusDate(d) }
  function nextWeek() { const d=new Date(focusDate); d.setDate(focusDate.getDate()+7); setFocusDate(d) }

  function toggleType(t: EventType) {
    setActiveTypes(prev=>{const n=new Set(prev);n.has(t)?n.delete(t):n.add(t);return n})
  }
  function toggleStatus(s: VesselStatus) {
    setActiveStatuses(prev=>{const n=new Set(prev);n.has(s)?n.delete(s):n.add(s);return n})
  }

  function validateAgenda() {
    const e: Record<string,string> = {}
    if (!agForm.vesselId) e.vesselId = 'Required'
    if (!agForm.date)     e.date     = 'Required'
    if (!agForm.port)     e.port     = 'Required'
    if (!agForm.destination) e.destination = 'Required'
    setAgErrors(e)
    return Object.keys(e).length === 0
  }

  function submitAgenda(e: React.FormEvent) {
    e.preventDefault()
    if (!validateAgenda()) return
    const vessel = vessels.find(v => v.id === agForm.vesselId)!
    const newEvt: VesselEvent = {
      id: `EVT-${Date.now()}`, vesselId: agForm.vesselId, vesselName: vessel.name,
      type: agForm.type, date: agForm.date, time: agForm.time,
      port: agForm.port, destination: agForm.destination,
      capacitySqM: vessel.capacityUnits, bookedSqM: 0,
      distribution: [], status: 'available', pic: 'Danjuma Yusuf',
      notes: agForm.notes || undefined,
    }
    setEvents(prev => [...prev, newEvt])
    setAgSubmitOk(true)
    setTimeout(() => {
      setNewOpen(false); setAgSubmitOk(false)
      setAgForm({ vesselId:'', type:'Departure', date:'', time:'08:00', port:'', destination:'', notes:'' })
    }, 1400)
  }

  const awaitingCount  = VESSELS.filter(v => v.status === 'available').length
  const loadingCount   = vessels.filter(v => v.status === 'loading').length
  const inTransitCount = vessels.filter(v => v.status === 'in-transit').length

  // Nav label
  const navLabel = calView === 'Month'
    ? `${MONTHS[viewMonth]} ${viewYear}`
    : calView === 'Week'
    ? `${weekDates[0].getDate()} ${MONTHS[weekDates[0].getMonth()].slice(0,3)} – ${weekDates[6].getDate()} ${MONTHS[weekDates[6].getMonth()].slice(0,3)} ${weekDates[6].getFullYear()}`
    : `${DAYS_FULL[focusDate.getDay()]}, ${focusDate.getDate()} ${MONTHS[focusDate.getMonth()]} ${focusDate.getFullYear()}`

  function onPrev() { calView==='Month'?prevMonth():calView==='Week'?prevWeek():prevDay() }
  function onNext() { calView==='Month'?nextMonth():calView==='Week'?nextWeek():nextDay() }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics"
      title="Vessel Schedule"
      breadcrumb={[{label:'Home',href:'/'},{label:'Logistics'},{label:'Calendar'}]}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Total Events"     value={events.length}  color="#3B82F6" icon={CalIcon}    />
        <StatCard label="Vessels Available" value={awaitingCount}  color="#22C55E" icon={Navigation} />
        <StatCard label="Currently Loading" value={loadingCount}   color="#F59E0B" icon={Package}    />
        <StatCard label="In Transit"        value={inTransitCount} color="#8B5CF6" icon={Anchor}     />
      </div>

      {/* Calendar card */}
      <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-default gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFilterOpen(v => !v)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${filterOpen?'bg-brand-50 border-brand-300 text-brand-600':'border-border-default text-neutral-600 hover:border-neutral-300'}`}
            >
              <FilterIcon size={13}/> Filter
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onPrev} className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"><ChevronLeft size={16}/></button>
              <p className="text-sm font-bold text-neutral-900 min-w-[180px] text-center">{navLabel}</p>
              <button type="button" onClick={onNext} className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex rounded-md border border-border-default overflow-hidden text-xs font-semibold">
              {(['Day','Week','Month'] as CalView[]).map(v => (
                <button
                  key={v} type="button"
                  onClick={() => setCalView(v)}
                  className={`px-3 py-1.5 transition-colors ${calView===v?'bg-neutral-900 text-white':'text-neutral-600 hover:bg-neutral-50'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={() => setNewOpen(true)}>
              New Agenda
            </Button>
          </div>
        </div>

        {/* 3-pane layout */}
        <div className="flex min-h-[520px]">
          {filterOpen && (
            <FilterPanel
              activeTypes={activeTypes} activeStatuses={activeStatuses}
              onToggleType={toggleType} onToggleStatus={toggleStatus}
              onClose={() => setFilterOpen(false)}
            />
          )}

          {/* Calendar body */}
          <div className="flex-1 overflow-hidden">

            {/* ── MONTH VIEW ── */}
            {calView === 'Month' && (<>
              <div className="grid grid-cols-7 border-b border-border-default">
                {DAYS_SHORT.map(d => (
                  <div key={d} className="py-2 text-center text-xs font-bold text-neutral-400 uppercase tracking-wide">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 grid-rows-6">
                {calCells.map((date, idx) => {
                  const key    = toKey(date)
                  const isCurM = date.getMonth() === viewMonth
                  const isToday= key === TODAY_ISO
                  const evts   = eventsByDate.get(key) ?? []
                  return (
                    <div
                      key={idx}
                      className={`border-b border-r border-border-default p-1.5 cursor-pointer ${!isCurM?'bg-neutral-50/60':''} ${isToday?'bg-brand-50/30':''}`}
                      onClick={() => { setFocusDate(date); setCalView('Day') }}
                    >
                      <div className="mb-1">
                        <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${isToday?'bg-brand-500 text-white':isCurM?'text-neutral-700':'text-neutral-300'}`}>
                          {date.getDate()}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {evts.slice(0,3).map(evt => (
                          <button
                            key={evt.id} type="button"
                            onClick={e => { e.stopPropagation(); setSelectedId(evt.id===selectedId?null:evt.id) }}
                            className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-colors ${selectedId===evt.id?'ring-1 ring-brand-500':''} ${EVT_CHIP[evt.type]}`}
                            title={`${evt.vesselName} — ${evt.time}`}
                          >
                            {evt.vesselId} {evt.time}
                          </button>
                        ))}
                        {evts.length>3 && <p className="text-[9px] text-neutral-400 pl-1">+{evts.length-3} more</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>)}

            {/* ── WEEK VIEW ── */}
            {calView === 'Week' && (<>
              <div className="grid grid-cols-7 border-b border-border-default">
                {weekDates.map((d, i) => {
                  const isToday = toKey(d) === TODAY_ISO
                  return (
                    <div
                      key={i}
                      className={`py-2.5 text-center cursor-pointer hover:bg-neutral-50 transition-colors ${isToday?'bg-brand-50':''}`}
                      onClick={() => { setFocusDate(d); setCalView('Day') }}
                    >
                      <p className="text-[10px] font-bold text-neutral-400 uppercase">{DAYS_SHORT[d.getDay()]}</p>
                      <span className={`inline-flex items-center justify-center w-8 h-8 mt-0.5 text-sm font-bold rounded-full ${isToday?'bg-brand-500 text-white':'text-neutral-700'}`}>
                        {d.getDate()}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-7 min-h-[440px] divide-x divide-border-default">
                {weekDates.map((d, i) => {
                  const key  = toKey(d)
                  const evts = eventsByDate.get(key) ?? []
                  const isToday = key === TODAY_ISO
                  return (
                    <div key={i} className={`p-1.5 space-y-1 overflow-y-auto ${isToday?'bg-brand-50/20':''}`}>
                      {evts.map(evt => (
                        <button
                          key={evt.id} type="button"
                          onClick={() => setSelectedId(evt.id===selectedId?null:evt.id)}
                          className={`w-full text-left p-2 rounded-md text-xs transition-all ${selectedId===evt.id?'ring-2 ring-brand-500':''} ${EVT_CHIP[evt.type]}`}
                        >
                          <p className="font-bold truncate">{evt.time}</p>
                          <p className="font-medium truncate">{evt.vesselName}</p>
                          <p className="text-[10px] opacity-80">{evt.type}</p>
                        </button>
                      ))}
                      {evts.length===0 && <div className="h-full flex items-start justify-center pt-6 text-[10px] text-neutral-300">—</div>}
                    </div>
                  )
                })}
              </div>
            </>)}

            {/* ── DAY VIEW ── */}
            {calView === 'Day' && (() => {
              const dayKey  = toKey(focusDate)
              const dayEvts = eventsByDate.get(dayKey) ?? []
              const isToday = dayKey === TODAY_ISO
              return (
                <div className="p-6">
                  <div className={`inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-xs font-bold ${isToday?'bg-brand-50 text-brand-700 border border-brand-200':'bg-neutral-50 text-neutral-600 border border-neutral-200'}`}>
                    {isToday && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"/>}
                    {isToday ? 'Today' : fmtDate(dayKey)}
                  </div>

                  {dayEvts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-neutral-300">
                      <CalIcon size={40} strokeWidth={1}/>
                      <p className="text-sm mt-3 font-medium">No events scheduled</p>
                      <button type="button" onClick={() => setNewOpen(true)}
                        className="mt-3 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors">
                        + Add new agenda
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayEvts.map(evt => {
                        const cfg = VST_CFG[evt.status]
                        return (
                          <button
                            key={evt.id} type="button"
                            onClick={() => setSelectedId(evt.id===selectedId?null:evt.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${selectedId===evt.id?'border-brand-500 bg-brand-50':'border-border-default bg-white hover:border-neutral-300'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${evt.type==='Departure'?'bg-amber-100 text-amber-800':'bg-blue-100 text-blue-800'}`}>{evt.type}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                                </div>
                                <p className="text-sm font-bold text-neutral-900">{evt.vesselName}</p>
                                <p className="font-mono text-xs text-brand-500">#{evt.vesselId}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-lg font-bold text-neutral-900">{evt.time}</p>
                                <p className="text-xs text-neutral-400">{evt.port}</p>
                              </div>
                            </div>
                            {evt.destination !== evt.port && (
                              <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                                <MapPin size={11}/> {evt.port} → {evt.destination}
                              </p>
                            )}
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-neutral-500">Deck utilisation</span>
                                <span className="font-bold">{evt.bookedSqM}/{evt.capacitySqM} m²</span>
                              </div>
                              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${cfg.bar}`} style={{width:`${evt.capacitySqM>0?Math.min(100,Math.round((evt.bookedSqM/evt.capacitySqM)*100)):0}%`}}/>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>

          {/* Details panel */}
          {selectedEvent && (
            <EventDetailsPanel event={selectedEvent} onClose={() => setSelectedId(null)}/>
          )}
        </div>
      </div>

      {/* ── New Agenda Panel ── */}
      {newOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setNewOpen(false)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[460px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">New Agenda Entry</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Schedule a vessel departure or arrival event</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setNewOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
                <X size={17}/>
              </button>
            </div>

            {agSubmitOk ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500"/>
                </div>
                <p className="text-base font-bold text-neutral-900">Agenda Added</p>
                <p className="text-sm text-neutral-500">The event has been added to the vessel schedule.</p>
              </div>
            ) : (
              <form onSubmit={submitAgenda} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Vessel */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Vessel <span className="text-status-critical">*</span></label>
                  <Dropdown
                    options={vesselOptions} value={agForm.vesselId}
                    onChange={v => { setAgForm(f=>({...f,vesselId:v})); setAgErrors(e=>({...e,vesselId:''})) }}
                    placeholder="Select vessel…" error={!!agErrors.vesselId} searchable
                  />
                  {agErrors.vesselId && <p className="text-xs text-status-critical">{agErrors.vesselId}</p>}
                </div>

                {/* Event type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Event Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Departure','Arrival'] as EventType[]).map(t => (
                      <button key={t} type="button"
                        onClick={() => setAgForm(f=>({...f,type:t}))}
                        className={`py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${agForm.type===t?(t==='Departure'?'border-amber-500 bg-amber-50 text-amber-800':'border-blue-500 bg-blue-50 text-blue-800'):'border-border-default text-neutral-500 hover:bg-neutral-50'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Date <span className="text-status-critical">*</span></label>
                    <DatePicker value={agForm.date}
                      onChange={v => { setAgForm(f=>({...f,date:v})); setAgErrors(e=>({...e,date:''})) }}
                      error={!!agErrors.date}/>
                    {agErrors.date && <p className="text-xs text-status-critical">{agErrors.date}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Time</label>
                    <Input type="time" value={agForm.time} onChange={e => setAgForm(f=>({...f,time:e.target.value}))}/>
                  </div>
                </div>

                {/* Port + Destination */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Port of Origin <span className="text-status-critical">*</span></label>
                  <Dropdown options={COMMON_PORTS} value={agForm.port}
                    onChange={v => { setAgForm(f=>({...f,port:v})); setAgErrors(e=>({...e,port:''})) }}
                    placeholder="Select or type port…" error={!!agErrors.port} searchable/>
                  {agErrors.port && <p className="text-xs text-status-critical">{agErrors.port}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Destination <span className="text-status-critical">*</span></label>
                  <Dropdown options={COMMON_PORTS} value={agForm.destination}
                    onChange={v => { setAgForm(f=>({...f,destination:v})); setAgErrors(e=>({...e,destination:''})) }}
                    placeholder="Select destination…" error={!!agErrors.destination} searchable/>
                  {agErrors.destination && <p className="text-xs text-status-critical">{agErrors.destination}</p>}
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Notes</label>
                  <Textarea rows={3} placeholder="Cargo notes, berth instructions, deadlines…"
                    value={agForm.notes} onChange={e => setAgForm(f=>({...f,notes:e.target.value}))}/>
                </div>

                <div className="pt-2 border-t border-border-default">
                  <Button type="submit" variant="brand" fullWidth size="md">Add to Schedule</Button>
                </div>
              </form>
            )}
          </aside>
        </>
      )}
    </AppShell>
  )
}
