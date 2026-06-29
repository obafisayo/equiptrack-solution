/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import {
  Plus, Search, Lock, AlertTriangle, CheckCircle, Clock, X,
  CheckCircle2, Package,
} from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Form'
import { DatePicker } from '@/components/ui/DatePicker'
import { Dropdown } from '@/components/ui/Dropdown'

// ── Types ─────────────────────────────────────────────────────────────────────

type CCUType   = 'Waste Skip' | '15ft Half Height Basket' | '23ft Half Height Basket' | 'Chemical Tote Tank' | 'Open Top Basket' | 'Closed Top Basket'
type CCUStatus = 'Available' | 'In Transit' | 'Assigned' | 'Maintenance' | 'Quarantine'

interface CCUContainer {
  serialNumber: string; type: CCUType
  footprintM2: number; lengthM: number; widthM: number; maxGrossWeightKg: number
  inspectionExpiry: string; status: CCUStatus; available: boolean
  certNo?: string; owner?: string; location?: string
}

const TODAY = '2026-06-29'

// ── Mock Data ─────────────────────────────────────────────────────────────────

const INIT_CONTAINERS: CCUContainer[] = [
  { serialNumber:'13162',       type:'Waste Skip',              footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300,  inspectionExpiry:'2026-06-04', status:'Available',  available:true,  certNo:'CERT-2024-001', owner:'TotalEnergies', location:'Onne Base'           },
  { serialNumber:'13164',       type:'Waste Skip',              footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300,  inspectionExpiry:'2026-06-29', status:'Available',  available:true,  certNo:'CERT-2024-002', owner:'TotalEnergies', location:'Onne Base'           },
  { serialNumber:'13174',       type:'Waste Skip',              footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300,  inspectionExpiry:'2026-06-04', status:'In Transit', available:false, certNo:'CERT-2024-003', owner:'TotalEnergies', location:'Bonga FPSO'          },
  { serialNumber:'13177',       type:'Waste Skip',              footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300,  inspectionExpiry:'2026-06-29', status:'Available',  available:true,  certNo:'CERT-2024-004', owner:'TotalEnergies', location:'Onne Base'           },
  { serialNumber:'13181',       type:'Waste Skip',              footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300,  inspectionExpiry:'2026-07-14', status:'Available',  available:true,  certNo:'CERT-2024-005', owner:'TotalEnergies', location:'Onne Base'           },
  { serialNumber:'13347',       type:'Waste Skip',              footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300,  inspectionExpiry:'2026-07-28', status:'Available',  available:true,  certNo:'CERT-2024-006', owner:'TotalEnergies', location:'Onne Base'           },
  { serialNumber:'158551',      type:'15ft Half Height Basket', footprintM2:10.7, lengthM:4.45, widthM:2.4,  maxGrossWeightKg:12750, inspectionExpiry:'2026-07-21', status:'Available',  available:true,  certNo:'CERT-2024-007', owner:'Schlumberger',  location:'Onne Base'           },
  { serialNumber:'23830',       type:'23ft Half Height Basket', footprintM2:16.9, lengthM:6.9,  widthM:2.44, maxGrossWeightKg:15350, inspectionExpiry:'2026-06-16', status:'In Transit', available:false, certNo:'CERT-2024-008', owner:'TotalEnergies', location:'Agbami FPSO'         },
  { serialNumber:'23846',       type:'23ft Half Height Basket', footprintM2:16.9, lengthM:6.9,  widthM:2.44, maxGrossWeightKg:15350, inspectionExpiry:'2026-07-02', status:'Assigned',   available:false, certNo:'CERT-2024-009', owner:'TotalEnergies', location:'Onne Base'           },
  { serialNumber:'28-MZ-75-01', type:'Chemical Tote Tank',      footprintM2:4.2,  lengthM:3.8,  widthM:1.1,  maxGrossWeightKg:9935,  inspectionExpiry:'2026-06-30', status:'Available',  available:true,  certNo:'CERT-2024-010', owner:'Halliburton',   location:'Onne Base'           },
  { serialNumber:'28-MZ-75-02', type:'Chemical Tote Tank',      footprintM2:4.2,  lengthM:3.8,  widthM:1.1,  maxGrossWeightKg:9935,  inspectionExpiry:'2026-07-04', status:'Assigned',   available:false, certNo:'CERT-2024-011', owner:'Halliburton',   location:'Escravos Terminal'   },
  { serialNumber:'28-MZ-75-03', type:'Chemical Tote Tank',      footprintM2:4.2,  lengthM:3.8,  widthM:1.1,  maxGrossWeightKg:9935,  inspectionExpiry:'2026-06-20', status:'Available',  available:false, certNo:'CERT-2024-012', owner:'Halliburton',   location:'Onne Base'           },
  { serialNumber:'40-BX-01',    type:'Open Top Basket',         footprintM2:8.4,  lengthM:4.2,  widthM:2.0,  maxGrossWeightKg:9000,  inspectionExpiry:'2026-09-15', status:'Available',  available:true,  certNo:'CERT-2024-013', owner:'Baker Hughes',  location:'Onne Base'           },
  { serialNumber:'40-BX-02',    type:'Open Top Basket',         footprintM2:8.4,  lengthM:4.2,  widthM:2.0,  maxGrossWeightKg:9000,  inspectionExpiry:'2026-08-20', status:'Maintenance',available:false, certNo:'CERT-2024-014', owner:'Baker Hughes',  location:'Workshop'            },
  { serialNumber:'CT-44-A',     type:'Closed Top Basket',       footprintM2:11.2, lengthM:4.7,  widthM:2.38, maxGrossWeightKg:13500, inspectionExpiry:'2026-10-01', status:'Available',  available:true,  certNo:'CERT-2024-015', owner:'Weatherford',   location:'Onne Base'           },
  { serialNumber:'CT-44-B',     type:'Closed Top Basket',       footprintM2:11.2, lengthM:4.7,  widthM:2.38, maxGrossWeightKg:13500, inspectionExpiry:'2026-07-07', status:'In Transit', available:false, certNo:'CERT-2024-016', owner:'Weatherford',   location:'Erha FPSO'           },
  { serialNumber:'WS-99-01',    type:'Waste Skip',              footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300,  inspectionExpiry:'2026-05-10', status:'Quarantine', available:false, certNo:'CERT-2024-017', owner:'TotalEnergies', location:'Quarantine Bay'      },
  { serialNumber:'HHB-55-01',   type:'15ft Half Height Basket', footprintM2:10.7, lengthM:4.45, widthM:2.4,  maxGrossWeightKg:12750, inspectionExpiry:'2026-11-30', status:'Available',  available:true,  certNo:'CERT-2024-018', owner:'Schlumberger',  location:'Onne Base'           },
]

// ── Expiry helpers ─────────────────────────────────────────────────────────────

function diffDays(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000)
}

type ExpiryState = 'expired' | 'today' | 'locked' | 'warning' | 'soon' | 'ok'

function getExpiryState(expiry: string): ExpiryState {
  const d = diffDays(TODAY, expiry)
  if (d < 0) return 'expired'
  if (d === 0) return 'today'
  if (d <= 3) return 'locked'
  if (d <= 7) return 'warning'
  if (d <= 30) return 'soon'
  return 'ok'
}

function ExpiryChip({ expiry }: { expiry: string }) {
  const days = diffDays(TODAY, expiry)
  const state = getExpiryState(expiry)
  const abs = Math.abs(days)

  const cfg = {
    expired: { label:`Expired ${abs}d ago`,   cls:'bg-red-50 text-red-700 border-red-200',      icon: null              },
    today:   { label:'Expires today',          cls:'bg-amber-50 text-amber-700 border-amber-200', icon: null              },
    locked:  { label:`LOCKED — ${days}d left`, cls:'bg-red-50 text-red-700 border-red-300',       icon: <Lock size={10}/> },
    warning: { label:`Warning — ${days}d left`,cls:'bg-amber-50 text-amber-700 border-amber-300', icon: <AlertTriangle size={10}/> },
    soon:    { label:`${days}d remaining`,      cls:'bg-yellow-50 text-yellow-700 border-yellow-200', icon: null           },
    ok:      { label:`${days}d remaining`,      cls:'bg-green-50 text-green-700 border-green-200',  icon: null             },
  }[state]

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${cfg.cls}`}>
      {cfg.icon}{cfg.label}
    </span>
  )
}

function StatusDot({ c }: { c: CCUContainer }) {
  const s = getExpiryState(c.inspectionExpiry)
  if (s === 'expired' || s === 'locked')
    return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100"><AlertTriangle size={12} className="text-red-500"/></span>
  if (s === 'warning' || s === 'today' || c.status !== 'Available')
    return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100"><Clock size={12} className="text-amber-500"/></span>
  return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100"><CheckCircle size={12} className="text-green-500"/></span>
}

const STATUS_BADGE: Record<CCUStatus, string> = {
  'Available':   'bg-green-50 text-green-700 border-green-200',
  'In Transit':  'bg-blue-50 text-blue-700 border-blue-200',
  'Assigned':    'bg-purple-50 text-purple-700 border-purple-200',
  'Maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
  'Quarantine':  'bg-red-50 text-red-700 border-red-200',
}

const CCU_TYPES_OPT = ['Waste Skip','15ft Half Height Basket','23ft Half Height Basket','Chemical Tote Tank','Open Top Basket','Closed Top Basket'].map(v=>({value:v,label:v}))
const OWNER_OPT     = ['TotalEnergies','Schlumberger','Halliburton','Baker Hughes','Weatherford'].map(v=>({value:v,label:v}))
const LOCATION_OPT  = ['Onne Base','Bonga FPSO','Agbami FPSO','Erha FPSO','Escravos Terminal','Workshop','Quarantine Bay'].map(v=>({value:v,label:v}))

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ContainerFleetPage() {
  const [containers, setContainers] = useState<CCUContainer[]>(INIT_CONTAINERS)
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('all')
  const [expiryFilter, setExpiryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detail,       setDetail]       = useState<CCUContainer | null>(null)

  // Register panel
  const [regOpen, setRegOpen] = useState(false)
  const [regForm, setRegForm] = useState({ serialNumber:'', type:'Waste Skip' as CCUType, owner:'', location:'', certNo:'', inspectionExpiry:'', maxGrossWeightKg:'', lengthM:'', widthM:'' })
  const [regErrors, setRegErrors] = useState<Record<string,string>>({})
  const [regOk, setRegOk] = useState(false)

  // KPIs
  const total     = containers.length
  const available = containers.filter(c => c.status === 'Available').length
  const locked    = containers.filter(c => getExpiryState(c.inspectionExpiry) === 'locked').length
  const expired   = containers.filter(c => getExpiryState(c.inspectionExpiry) === 'expired').length

  const filtered = useMemo(() => containers.filter(c => {
    if (search) {
      const q = search.toLowerCase()
      if (!c.serialNumber.toLowerCase().includes(q) && !c.type.toLowerCase().includes(q) && !(c.owner??'').toLowerCase().includes(q)) return false
    }
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (expiryFilter !== 'all' && getExpiryState(c.inspectionExpiry) !== expiryFilter) return false
    return true
  }), [containers, search, typeFilter, expiryFilter, statusFilter])

  function toggle(sn: string) {
    setContainers(prev => prev.map(c => c.serialNumber===sn ? {...c,available:!c.available} : c))
    if (detail?.serialNumber===sn) setDetail(p => p ? {...p,available:!p.available} : null)
  }

  function validateReg() {
    const e: Record<string,string> = {}
    if (!regForm.serialNumber.trim()) e.serialNumber='Required'
    if (!regForm.inspectionExpiry)   e.inspectionExpiry='Required'
    if (!regForm.owner)              e.owner='Required'
    setRegErrors(e)
    return Object.keys(e).length===0
  }

  const DIMS_DEFAULT: Record<CCUType, { footprintM2:number; lengthM:number; widthM:number; maxGrossWeightKg:number }> = {
    'Waste Skip':               { footprintM2:7.2,  lengthM:3.96, widthM:1.8,  maxGrossWeightKg:6300  },
    '15ft Half Height Basket':  { footprintM2:10.7, lengthM:4.45, widthM:2.4,  maxGrossWeightKg:12750 },
    '23ft Half Height Basket':  { footprintM2:16.9, lengthM:6.9,  widthM:2.44, maxGrossWeightKg:15350 },
    'Chemical Tote Tank':       { footprintM2:4.2,  lengthM:3.8,  widthM:1.1,  maxGrossWeightKg:9935  },
    'Open Top Basket':          { footprintM2:8.4,  lengthM:4.2,  widthM:2.0,  maxGrossWeightKg:9000  },
    'Closed Top Basket':        { footprintM2:11.2, lengthM:4.7,  widthM:2.38, maxGrossWeightKg:13500 },
  }

  function submitReg(e: React.FormEvent) {
    e.preventDefault()
    if (!validateReg()) return
    const d = DIMS_DEFAULT[regForm.type]
    setContainers(prev => [{
      serialNumber: regForm.serialNumber.trim(), type: regForm.type,
      footprintM2:  d.footprintM2,
      lengthM:      regForm.lengthM ? parseFloat(regForm.lengthM) : d.lengthM,
      widthM:       regForm.widthM  ? parseFloat(regForm.widthM)  : d.widthM,
      maxGrossWeightKg: regForm.maxGrossWeightKg ? parseInt(regForm.maxGrossWeightKg) : d.maxGrossWeightKg,
      inspectionExpiry: regForm.inspectionExpiry,
      status: 'Available', available: true,
      certNo: regForm.certNo || undefined, owner: regForm.owner || undefined, location: regForm.location || undefined,
    }, ...prev])
    setRegOk(true)
    setTimeout(() => {
      setRegOpen(false); setRegOk(false)
      setRegForm({ serialNumber:'',type:'Waste Skip',owner:'',location:'',certNo:'',inspectionExpiry:'',maxGrossWeightKg:'',lengthM:'',widthM:'' })
    }, 1500)
  }

  const hasFilters = search || typeFilter!=='all' || expiryFilter!=='all' || statusFilter!=='all'

  return (
    <AppShell role="qaqc" currentPath="/qaqc/containers" title="Fleet Management"
      breadcrumb={[{label:'QAQC',href:'/qaqc'},{label:'CCU Fleet Management'}]}>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total CCUs"   value={total}     color="#3B82F6" icon={Package}/>
        <StatCard label="Available"    value={available} color="#22C55E" icon={CheckCircle}/>
        <StatCard label="Locked"       value={locked}    color={locked>0?'#F97316':'#22C55E'} icon={Lock}/>
        <StatCard label="Expired"      value={expired}   color={expired>0?'#EF4444':'#22C55E'} icon={AlertTriangle}/>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">CCU Fleet Management</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {total} total containers &bull; {available} available &bull; {locked} locked &bull; {expired} expired
          </p>
        </div>
        <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={() => setRegOpen(true)}>
          Register New CCU
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search serial no. or type…"
            className="w-full h-9 pl-8 pr-3 text-sm border border-border-default rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"/>
        </div>

        {([
          { val: typeFilter,   set: setTypeFilter,   opts: [['all','All Types'],['Waste Skip','Waste Skip'],['15ft Half Height Basket','15ft HH Basket'],['23ft Half Height Basket','23ft HH Basket'],['Chemical Tote Tank','Chemical Tote Tank'],['Open Top Basket','Open Top Basket'],['Closed Top Basket','Closed Top Basket']] },
          { val: expiryFilter, set: setExpiryFilter, opts: [['all','All Expiry'],['expired','Expired'],['locked','Locked (1–3d)'],['warning','Warning (4–7d)'],['soon','Expiring Soon'],['ok','Valid (30d+)']] },
          { val: statusFilter, set: setStatusFilter, opts: [['all','All Statuses'],['Available','Available'],['In Transit','In Transit'],['Assigned','Assigned'],['Maintenance','Maintenance'],['Quarantine','Quarantine']] },
        ] as { val: string; set: (v:string)=>void; opts: [string,string][] }[]).map((f,i) => (
          <select key={i} aria-label={f.opts[0][1]} value={f.val} onChange={e => f.set(e.target.value)}
            className="h-9 px-3 text-xs border border-border-default rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer">
            {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}

        {hasFilters && (
          <button type="button" onClick={() => { setSearch(''); setTypeFilter('all'); setExpiryFilter('all'); setStatusFilter('all') }}
            className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-700">
            <X size={12}/> Clear
          </button>
        )}
        <span className="text-xs text-neutral-400 ml-auto whitespace-nowrap">{filtered.length} containers</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              <th className="w-10 px-4 py-3"/>
              {['Serial Number','Type','Footprint Area','Length','Width','Max Gross Weight','Inspection Expiry','Status','Available'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="py-14 text-center text-neutral-400 text-sm">No CCUs match the current filters.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.serialNumber} className="hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => setDetail(c)}>
                <td className="px-4 py-3"><StatusDot c={c}/></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono text-sm font-bold text-neutral-900">{c.serialNumber}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">{c.type}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">{c.footprintM2} m²</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">{c.lengthM} m</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">{c.widthM} m</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-700">
                  <span className="flex items-center gap-1.5"><Package size={11} className="text-neutral-300 shrink-0"/>{c.maxGrossWeightKg.toLocaleString()} kg</span>
                </td>
                <td className="px-4 py-3"><ExpiryChip expiry={c.inspectionExpiry}/></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                  <button type="button" role="switch" aria-checked={c.available}
                    onClick={() => toggle(c.serialNumber)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${c.available?'bg-brand-500':'bg-neutral-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${c.available?'translate-x-4':'translate-x-0.5'}`}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Detail panel ── */}
      {detail && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setDetail(null)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusDot c={detail}/>
                  <span className="font-mono font-bold text-lg text-neutral-900">{detail.serialNumber}</span>
                </div>
                <p className="text-sm text-neutral-500">{detail.type}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <ExpiryChip expiry={detail.inspectionExpiry}/>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[detail.status]}`}>{detail.status}</span>
                </div>
              </div>
              <button type="button" aria-label="Close" onClick={() => setDetail(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Physical Specifications</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[['Footprint',`${detail.footprintM2} m²`],['Length',`${detail.lengthM} m`],['Width',`${detail.widthM} m`],['Max Gross Wt',`${detail.maxGrossWeightKg.toLocaleString()} kg`]].map(([l,v])=>(
                    <div key={l} className="bg-neutral-50 rounded-lg border border-border-default p-3">
                      <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">{l}</p>
                      <p className="text-sm font-bold text-neutral-900">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Registration Details</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[['Cert. No.',detail.certNo??'—'],['Owner',detail.owner??'—'],['Location',detail.location??'—'],['Insp. Expiry',detail.inspectionExpiry]].map(([l,v])=>(
                    <div key={l} className="bg-neutral-50 rounded-lg border border-border-default p-3">
                      <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">{l}</p>
                      <p className="text-xs font-semibold text-neutral-800">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-border-default space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-700">Available in pool</span>
                  <button type="button" role="switch" aria-checked={detail.available}
                    onClick={() => toggle(detail.serialNumber)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${detail.available?'bg-brand-500':'bg-neutral-200'}`}>
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${detail.available?'translate-x-4':'translate-x-0.5'}`}/>
                  </button>
                </div>
                {(getExpiryState(detail.inspectionExpiry)==='expired'||getExpiryState(detail.inspectionExpiry)==='locked') && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                    Inspection overdue or critical. Schedule renewal before deploying.
                  </div>
                )}
                <Button variant="secondary" fullWidth size="sm">Schedule Inspection</Button>
                <Button variant="secondary" fullWidth size="sm">Update Location</Button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ── Register CCU panel ── */}
      {regOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setRegOpen(false)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[460px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Register New CCU</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Add a container to the fleet registry</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setRegOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>
            {regOk ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle2 size={28} className="text-green-500"/></div>
                <p className="text-base font-bold text-neutral-900">CCU Registered</p>
                <p className="text-sm text-neutral-500">Container added to the fleet registry.</p>
              </div>
            ) : (
              <form onSubmit={submitReg} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Serial Number <span className="text-status-critical">*</span></label>
                  <Input placeholder="e.g. 13162 or 28-MZ-75-04" value={regForm.serialNumber}
                    onChange={e=>{setRegForm(f=>({...f,serialNumber:e.target.value}));setRegErrors(x=>({...x,serialNumber:''}))}}
                    error={!!regErrors.serialNumber}/>
                  {regErrors.serialNumber && <p className="text-xs text-status-critical">{regErrors.serialNumber}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">CCU Type</label>
                  <Dropdown options={CCU_TYPES_OPT} value={regForm.type} onChange={v=>setRegForm(f=>({...f,type:v as CCUType}))} placeholder="Select type…"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Owner <span className="text-status-critical">*</span></label>
                    <Dropdown options={OWNER_OPT} value={regForm.owner}
                      onChange={v=>{setRegForm(f=>({...f,owner:v}));setRegErrors(x=>({...x,owner:''}))}}
                      placeholder="Select…" error={!!regErrors.owner}/>
                    {regErrors.owner && <p className="text-xs text-status-critical">{regErrors.owner}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Location</label>
                    <Dropdown options={LOCATION_OPT} value={regForm.location} onChange={v=>setRegForm(f=>({...f,location:v}))} placeholder="Select…"/>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Certificate No.</label>
                  <Input placeholder="e.g. CERT-2024-019" value={regForm.certNo} onChange={e=>setRegForm(f=>({...f,certNo:e.target.value}))}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Inspection Expiry Date <span className="text-status-critical">*</span></label>
                  <DatePicker value={regForm.inspectionExpiry}
                    onChange={v=>{setRegForm(f=>({...f,inspectionExpiry:v}));setRegErrors(x=>({...x,inspectionExpiry:''}))}}
                    error={!!regErrors.inspectionExpiry}/>
                  {regErrors.inspectionExpiry && <p className="text-xs text-status-critical">{regErrors.inspectionExpiry}</p>}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Max Weight (kg)</label>
                    <Input type="number" placeholder="Auto" value={regForm.maxGrossWeightKg} onChange={e=>setRegForm(f=>({...f,maxGrossWeightKg:e.target.value}))}/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Length (m)</label>
                    <Input type="number" step="0.01" placeholder="Auto" value={regForm.lengthM} onChange={e=>setRegForm(f=>({...f,lengthM:e.target.value}))}/>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Width (m)</label>
                    <Input type="number" step="0.01" placeholder="Auto" value={regForm.widthM} onChange={e=>setRegForm(f=>({...f,widthM:e.target.value}))}/>
                  </div>
                </div>
                <div className="pt-2 border-t border-border-default">
                  <Button type="submit" variant="brand" fullWidth size="md">Register CCU</Button>
                </div>
              </form>
            )}
          </aside>
        </>
      )}
    </AppShell>
  )
}
