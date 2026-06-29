/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import {
  Package, AlertTriangle, CheckCircle, TrendingDown,
  Search, Plus, X, ArrowDown, ArrowUp, ArrowRightLeft,
  ClipboardList, Filter, CheckCircle2,
} from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard }  from '@/components/domain/StatCard'
import { Button }    from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import { Dropdown }  from '@/components/ui/Dropdown'
import { CONTAINERS } from '@/lib/mock-data'

// ── Types ─────────────────────────────────────────────────────────────────────

type StockStatus = 'ok' | 'reorder' | 'critical'
type MovType = 'Issue' | 'Receive' | 'Transfer' | 'Adjustment'

interface StockItem {
  id: string; name: string; category: string
  qty: number; reorderAt: number; unit: string
  status: StockStatus; location: string; lastUpdated: string
  supplier?: string; leadDays?: number
}

interface Movement {
  id: string; itemId: string; itemName: string
  type: MovType; qty: number; date: string; time: string
  by: string; reference?: string; note?: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const INIT_STOCK: StockItem[] = [
  { id:'EQ-0012', name:'Drill Pipe — 5" 19.5ppf',    category:'Drilling',     qty:48,  reorderAt:20,  unit:'joints',  status:'ok',       location:'Bay 2-A',  lastUpdated:'2026-06-25', supplier:'Baker Hughes',      leadDays:14 },
  { id:'EQ-0037', name:'BOP Gasket Kit — 13.5"',     category:'Well Control', qty:4,   reorderAt:10,  unit:'kits',    status:'reorder',  location:'Bay 1-C',  lastUpdated:'2026-06-26', supplier:'NOV Nigeria',        leadDays:21 },
  { id:'EQ-0051', name:'Chemical — Barite Sacks',    category:'Drilling',     qty:210, reorderAt:100, unit:'sacks',   status:'ok',       location:'Chem Store',lastUpdated:'2026-06-27', supplier:'Halliburton NG',    leadDays:7  },
  { id:'EQ-0063', name:'Choke Manifold — 5000 PSI',  category:'Well Control', qty:2,   reorderAt:3,   unit:'units',   status:'critical', location:'Bay 3-B',  lastUpdated:'2026-06-20', supplier:'Cameron Int.',      leadDays:30 },
  { id:'EQ-0078', name:'Safety Valve — 4.5"',        category:'Safety',       qty:12,  reorderAt:5,   unit:'units',   status:'ok',       location:'Bay 2-B',  lastUpdated:'2026-06-24', supplier:'Weatherford NG',    leadDays:14 },
  { id:'EQ-0089', name:'Mud Pump Liner — 6.5"',      category:'Drilling',     qty:6,   reorderAt:8,   unit:'pieces',  status:'reorder',  location:'Bay 1-A',  lastUpdated:'2026-06-22', supplier:'National Oilwell',  leadDays:21 },
  { id:'EQ-0102', name:'Flex Hose — 3" x 20ft',      category:'Piping',       qty:30,  reorderAt:15,  unit:'lengths', status:'ok',       location:'Bay 4-D',  lastUpdated:'2026-06-26', supplier:'Parker Hannifin',   leadDays:10 },
  { id:'EQ-0115', name:'Generator — 250 KVA',        category:'Power',        qty:1,   reorderAt:2,   unit:'units',   status:'critical', location:'Power Bay', lastUpdated:'2026-06-18', supplier:'Aggreko',           leadDays:45 },
  { id:'EQ-0128', name:'BOP Accumulator Unit',       category:'Well Control', qty:3,   reorderAt:2,   unit:'units',   status:'ok',       location:'Bay 3-A',  lastUpdated:'2026-06-23', supplier:'Cameron Int.',      leadDays:30 },
  { id:'EQ-0133', name:'Drill Bit — 12.25" PDC',     category:'Drilling',     qty:8,   reorderAt:4,   unit:'pieces',  status:'ok',       location:'Bay 2-C',  lastUpdated:'2026-06-27', supplier:'Schlumberger NG',   leadDays:14 },
]

const INIT_MOVEMENTS: Movement[] = [
  { id:'MOV-1001', itemId:'EQ-0012', itemName:'Drill Pipe — 5" 19.5ppf',  type:'Issue',      qty:12, date:'2026-06-27', time:'14:30', by:'Emeka Okonkwo',   reference:'WO-0087', note:'Issued to Bonga FPSO expedition.' },
  { id:'MOV-1002', itemId:'EQ-0051', itemName:'Chemical — Barite Sacks',  type:'Receive',    qty:50, date:'2026-06-26', time:'09:15', by:'Ngozi Eze',       reference:'PO-2241', note:'Received from Halliburton delivery.' },
  { id:'MOV-1003', itemId:'EQ-0037', itemName:'BOP Gasket Kit — 13.5"',   type:'Issue',      qty:2,  date:'2026-06-25', time:'11:00', by:'Tunde Bello',     reference:'WO-0085', note:'Issued for BOP maintenance.' },
  { id:'MOV-1004', itemId:'EQ-0078', itemName:'Safety Valve — 4.5"',      type:'Transfer',   qty:3,  date:'2026-06-24', time:'16:45', by:'Ngozi Eze',       reference:'TRF-099', note:'Transferred to Bay 2-B from Bay 4.' },
  { id:'MOV-1005', itemId:'EQ-0063', itemName:'Choke Manifold — 5000 PSI',type:'Adjustment', qty:-1, date:'2026-06-20', time:'08:00', by:'Segun Folarin',   reference:'ADJ-012', note:'One unit sent for off-site repair.' },
  { id:'MOV-1006', itemId:'EQ-0102', itemName:'Flex Hose — 3" x 20ft',    type:'Receive',    qty:10, date:'2026-06-19', time:'10:30', by:'Ngozi Eze',       reference:'PO-2238', note:'Partial PO delivery received.' },
  { id:'MOV-1007', itemId:'EQ-0133', itemName:'Drill Bit — 12.25" PDC',   type:'Issue',      qty:2,  date:'2026-06-18', time:'07:00', by:'Biodun Adekunle', reference:'WO-0081', note:'Dispatched on MV Seplat Pride.' },
]

// ── Style maps ────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<StockStatus, { badge: string; bar: string; label: string }> = {
  ok:       { badge:'bg-green-50  text-green-700  border-green-200',  bar:'bg-green-500',  label:'In Stock'  },
  reorder:  { badge:'bg-amber-50  text-amber-700  border-amber-200',  bar:'bg-amber-500',  label:'Reorder'   },
  critical: { badge:'bg-red-50    text-red-700    border-red-200',    bar:'bg-red-500',    label:'Critical'  },
}

const MOV_CFG: Record<MovType, { icon: typeof ArrowDown; badge: string; label: string }> = {
  Issue:      { icon: ArrowUp,          badge:'bg-red-50    text-red-700    border-red-200',    label:'Issue'      },
  Receive:    { icon: ArrowDown,        badge:'bg-green-50  text-green-700  border-green-200',  label:'Receive'    },
  Transfer:   { icon: ArrowRightLeft,   badge:'bg-blue-50   text-blue-700   border-blue-200',   label:'Transfer'   },
  Adjustment: { icon: ClipboardList,    badge:'bg-neutral-50 text-neutral-600 border-neutral-200',label:'Adjustment'},
}

const CATEGORIES = ['All','Drilling','Well Control','Safety','Piping','Power']
const UNIT_OPTIONS = ['joints','kits','sacks','units','pieces','lengths','sets','pallets'].map(v=>({value:v,label:v}))
const CAT_OPTIONS  = ['Drilling','Well Control','Safety','Piping','Power','Other'].map(v=>({value:v,label:v}))

type Tab = 'stock' | 'movements' | 'reorder'

// ── Main Component ────────────────────────────────────────────────────────────

export default function InventoryDashboard() {
  const [stock, setStock]         = useState<StockItem[]>(INIT_STOCK)
  const [movements, setMovements] = useState<Movement[]>(INIT_MOVEMENTS)
  const [tab, setTab]             = useState<Tab>('stock')

  // Filters
  const [search,  setSearch]  = useState('')
  const [catFilter, setCat]   = useState('All')

  // Panels
  const [detailItem, setDetailItem] = useState<StockItem | null>(null)
  const [issueItem,  setIssueItem]  = useState<StockItem | null>(null)
  const [addOpen,    setAddOpen]    = useState(false)

  // Issue form
  const [issueForm, setIssueForm] = useState({ qty: '', workOrder: '', note: '' })
  const [issueOk,   setIssueOk]   = useState(false)

  // Add stock form
  const [addForm, setAddForm]   = useState({ name:'', category:'', qty:'', reorderAt:'', unit:'', location:'' })
  const [addOk,   setAddOk]     = useState(false)
  const [addErrors, setAddErrors] = useState<Record<string,string>>({})

  // Derived
  const okCount       = stock.filter(i => i.status === 'ok').length
  const reorderCount  = stock.filter(i => i.status === 'reorder').length
  const criticalCount = stock.filter(i => i.status === 'critical').length
  const containerCount = CONTAINERS.filter(c => c.status === 'available').length

  const reorderQueue = stock.filter(i => i.status === 'reorder' || i.status === 'critical')

  const filteredStock = useMemo(() =>
    stock.filter(item => {
      const q = search.toLowerCase()
      if (catFilter !== 'All' && item.category !== catFilter) return false
      if (q && !item.name.toLowerCase().includes(q) && !item.id.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) return false
      return true
    }),
    [stock, search, catFilter]
  )

  function submitIssue(e: React.FormEvent) {
    e.preventDefault()
    if (!issueItem || !issueForm.qty) return
    const qty = parseInt(issueForm.qty)
    if (isNaN(qty) || qty <= 0) return

    const newMov: Movement = {
      id: `MOV-${Date.now()}`, itemId: issueItem.id, itemName: issueItem.name,
      type: 'Issue', qty, date: '2026-06-29', time: '00:00',
      by: 'Ngozi Eze', reference: issueForm.workOrder || undefined, note: issueForm.note || undefined,
    }
    setMovements(prev => [newMov, ...prev])
    setStock(prev => prev.map(s => {
      if (s.id !== issueItem.id) return s
      const newQty = s.qty - qty
      const status: StockStatus = newQty <= 0 ? 'critical' : newQty <= s.reorderAt ? (newQty <= s.reorderAt / 2 ? 'critical' : 'reorder') : 'ok'
      return { ...s, qty: newQty, status, lastUpdated: '2026-06-29' }
    }))
    setIssueOk(true)
    setTimeout(() => { setIssueItem(null); setIssueOk(false); setIssueForm({ qty:'', workOrder:'', note:'' }) }, 1400)
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault()
    const err: Record<string,string> = {}
    if (!addForm.name) err.name = 'Required'
    if (!addForm.category) err.category = 'Required'
    if (!addForm.qty || isNaN(+addForm.qty)) err.qty = 'Required'
    if (!addForm.unit) err.unit = 'Required'
    setAddErrors(err)
    if (Object.keys(err).length > 0) return

    const qty = parseInt(addForm.qty)
    const ro  = parseInt(addForm.reorderAt) || Math.floor(qty * 0.3)
    const status: StockStatus = qty <= 0 ? 'critical' : qty <= ro ? 'reorder' : 'ok'
    const id = `EQ-${String(stock.length + 200).padStart(4,'0')}`
    setStock(prev => [...prev, {
      id, name: addForm.name, category: addForm.category, qty, reorderAt: ro,
      unit: addForm.unit, status, location: addForm.location || 'TBD', lastUpdated: '2026-06-29',
    }])
    setMovements(prev => [{
      id: `MOV-${Date.now()}`, itemId: id, itemName: addForm.name, type: 'Receive',
      qty, date: '2026-06-29', time: '00:00', by: 'Ngozi Eze', note: 'Initial stock entry',
    }, ...prev])
    setAddOk(true)
    setTimeout(() => { setAddOpen(false); setAddOk(false); setAddForm({name:'',category:'',qty:'',reorderAt:'',unit:'',location:''}) }, 1400)
  }

  return (
    <AppShell
      role="inventory"
      currentPath="/inventory"
      title="Stock Overview"
      breadcrumb={[{label:'Home',href:'/'},{label:'Inventory'}]}
    >
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="In Stock"             value={okCount}        icon={CheckCircle}    color="#10B981" />
        <StatCard label="Reorder Required"     value={reorderCount}   icon={TrendingDown}   color={reorderCount>0?'#F59E0B':'#22C55E'} />
        <StatCard label="Critical Low"         value={criticalCount}  icon={AlertTriangle}  color={criticalCount>0?'#EF4444':'#22C55E'} />
        <StatCard label="Containers Available" value={containerCount} icon={Package}        color="#3B82F6" />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex-1 relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID or category…"
            className="w-full h-9 pl-8 pr-3 text-sm border border-border-default rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={() => setAddOpen(true)}>
          Add Stock
        </Button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-border-default mb-5">
        {([
          ['stock',     `Stock (${stock.length})`],
          ['movements', `Movements (${movements.length})`],
          ['reorder',   `Reorder Queue (${reorderQueue.length})`],
        ] as [Tab, string][]).map(([t, label]) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab===t?'border-brand-500 text-brand-500':'border-transparent text-neutral-500 hover:text-neutral-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── STOCK TAB ── */}
      {tab === 'stock' && (
        <div>
          {/* Category filter */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Filter size={13} className="text-neutral-400"/>
            {CATEGORIES.map(c => (
              <button key={c} type="button" onClick={() => setCat(c)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${catFilter===c?'bg-brand-500 text-white border-brand-500':'border-border-default text-neutral-600 hover:bg-neutral-50'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-border-default">
                <tr>
                  {['Item ID','Description','Category','Qty / Reorder','Location','Status',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {filteredStock.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-neutral-400 text-sm">No items match.</td></tr>
                ) : filteredStock.map(item => {
                  const sc  = STATUS_CFG[item.status]
                  const pct = item.reorderAt > 0 ? Math.min(100, Math.round((item.qty / Math.max(item.reorderAt * 2, item.qty)) * 100)) : 100
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => setDetailItem(item)}>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-neutral-500">{item.id}</td>
                      <td className="px-4 py-3 font-semibold text-neutral-900 max-w-52">
                        <span className="block truncate">{item.name}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-500">{item.category}</td>
                      <td className="px-4 py-3 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${item.status==='critical'?'text-red-600':item.status==='reorder'?'text-amber-600':'text-neutral-900'}`}>
                            {item.qty}
                          </span>
                          <span className="text-xs text-neutral-400">/ {item.reorderAt} {item.unit}</span>
                        </div>
                        <div className="h-1 w-20 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full rounded-full ${sc.bar}`} style={{width:`${pct}%`}}/>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-500">{item.location}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <Button variant="secondary" size="sm"
                          onClick={() => setIssueItem(item)}>
                          Issue
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MOVEMENTS TAB ── */}
      {tab === 'movements' && (
        <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-border-default">
              <tr>
                {['ID','Item','Type','Qty','Date','By','Reference','Notes'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {movements.map(m => {
                const mc  = MOV_CFG[m.type]
                const Icon = mc.icon
                const isNeg = m.type === 'Issue' || (m.type === 'Adjustment' && m.qty < 0)
                return (
                  <tr key={m.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-400">{m.id}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800 max-w-40 truncate">{m.itemName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${mc.badge}`}>
                        <Icon size={10}/>{mc.label}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-bold text-sm ${isNeg?'text-red-600':'text-green-600'}`}>
                      {isNeg&&m.qty>0?'-':m.qty<0?'':'+' }{Math.abs(m.qty)}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">{m.date} {m.time}</td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{m.by}</td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-500">{m.reference ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500 max-w-40 truncate">{m.note ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── REORDER QUEUE TAB ── */}
      {tab === 'reorder' && (
        <div className="space-y-3">
          {reorderQueue.length === 0 ? (
            <div className="bg-white rounded-card border border-border-default shadow-card py-16 text-center">
              <CheckCircle className="mx-auto text-green-300 mb-3" size={40} strokeWidth={1.5}/>
              <p className="text-sm font-semibold text-neutral-400">All stock levels are healthy</p>
            </div>
          ) : reorderQueue.map(item => {
            const sc  = STATUS_CFG[item.status]
            const shortfall = item.reorderAt - item.qty
            return (
              <div key={item.id} className={`bg-white rounded-card border shadow-card p-5 ${item.status==='critical'?'border-red-200 ring-1 ring-red-100':'border-amber-200 ring-1 ring-amber-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-neutral-500">{item.id}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>{sc.label}</span>
                    </div>
                    <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-neutral-500">
                      <span>Current: <strong className={item.status==='critical'?'text-red-600':'text-amber-600'}>{item.qty} {item.unit}</strong></span>
                      <span>Reorder at: <strong>{item.reorderAt} {item.unit}</strong></span>
                      <span>Shortfall: <strong className="text-red-600">{Math.max(0,shortfall)} {item.unit}</strong></span>
                    </div>
                    {item.supplier && (
                      <div className="flex items-center gap-4 mt-1 text-xs text-neutral-400">
                        <span>Supplier: <strong className="text-neutral-600">{item.supplier}</strong></span>
                        <span>Lead time: <strong className="text-neutral-600">{item.leadDays} days</strong></span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button variant="brand" size="sm">Raise PO</Button>
                    <Button variant="secondary" size="sm" onClick={() => setDetailItem(item)}>Details</Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Stock Detail Panel ── */}
      {detailItem && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setDetailItem(null)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <p className="font-mono text-xs font-bold text-neutral-400 mb-1">{detailItem.id}</p>
                <h2 className="text-base font-bold text-neutral-900">{detailItem.name}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border mt-1 ${STATUS_CFG[detailItem.status].badge}`}>
                  {STATUS_CFG[detailItem.status].label}
                </span>
              </div>
              <button type="button" aria-label="Close" onClick={() => setDetailItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Category',    detailItem.category],
                  ['Location',    detailItem.location],
                  ['Current Qty', `${detailItem.qty} ${detailItem.unit}`],
                  ['Reorder At',  `${detailItem.reorderAt} ${detailItem.unit}`],
                  ['Supplier',    detailItem.supplier ?? '—'],
                  ['Lead Time',   detailItem.leadDays ? `${detailItem.leadDays} days` : '—'],
                  ['Last Updated',detailItem.lastUpdated],
                ].map(([label, value]) => (
                  <div key={label} className="bg-neutral-50 rounded-lg p-3 border border-border-default">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-neutral-800">{value}</p>
                  </div>
                ))}
              </div>
              {/* Stock bar */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-border-default">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-neutral-600">Stock Level</span>
                  <span className="font-bold">{detailItem.qty} / {detailItem.reorderAt * 2} {detailItem.unit}</span>
                </div>
                <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${STATUS_CFG[detailItem.status].bar}`}
                    style={{width:`${Math.min(100,Math.round((detailItem.qty/Math.max(detailItem.reorderAt*2,detailItem.qty))*100))}%`}}/>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>0</span><span className="text-red-500">Reorder: {detailItem.reorderAt}</span><span>{detailItem.reorderAt*2}</span>
                </div>
              </div>
              {/* Recent movements */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Recent Movements</p>
                <div className="space-y-2">
                  {movements.filter(m=>m.itemId===detailItem.id).slice(0,4).map(m=>{
                    const mc=MOV_CFG[m.type]; const Icon=mc.icon
                    const isNeg = m.type==='Issue'||(m.type==='Adjustment'&&m.qty<0)
                    return (
                      <div key={m.id} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-neutral-50 border border-border-default">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${mc.badge}`}><Icon size={9}/>{mc.label}</span>
                        <span className={`font-bold ${isNeg?'text-red-600':'text-green-600'}`}>{isNeg?'-':'+'}{Math.abs(m.qty)} {detailItem.unit}</span>
                        <span className="text-neutral-400 ml-auto">{m.date}</span>
                      </div>
                    )
                  })}
                  {movements.filter(m=>m.itemId===detailItem.id).length === 0 && (
                    <p className="text-xs text-neutral-400 text-center py-4">No movements recorded</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-default flex gap-3">
              <Button variant="secondary" fullWidth size="sm" onClick={() => { setDetailItem(null); setIssueItem(detailItem) }}>Issue Equipment</Button>
              <Button variant="brand" fullWidth size="sm">Raise PO</Button>
            </div>
          </aside>
        </>
      )}

      {/* ── Issue Equipment Panel ── */}
      {issueItem && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIssueItem(null)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Issue Equipment</h2>
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{issueItem.name}</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setIssueItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>

            {issueOk ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500"/>
                </div>
                <p className="text-base font-bold text-neutral-900">Equipment Issued</p>
                <p className="text-sm text-neutral-500">Stock level has been updated and movement recorded.</p>
              </div>
            ) : (
              <form onSubmit={submitIssue} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-neutral-50 rounded-xl p-4 border border-border-default">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Available stock</span>
                    <span className="font-bold text-neutral-900">{issueItem.qty} {issueItem.unit}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-neutral-400">Location</span>
                    <span className="text-neutral-600">{issueItem.location}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Quantity to Issue <span className="text-status-critical">*</span></label>
                  <Input type="number" min="1" max={issueItem.qty} placeholder={`Max ${issueItem.qty}`}
                    value={issueForm.qty} onChange={e => setIssueForm(f=>({...f,qty:e.target.value}))} required/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Work Order / Reference</label>
                  <Input placeholder="e.g. WO-0088, PO-2244…"
                    value={issueForm.workOrder} onChange={e => setIssueForm(f=>({...f,workOrder:e.target.value}))}/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Note</label>
                  <Textarea rows={2} placeholder="Destination, purpose, or instructions…"
                    value={issueForm.note} onChange={e => setIssueForm(f=>({...f,note:e.target.value}))}/>
                </div>
                <div className="pt-2 border-t border-border-default">
                  <Button type="submit" variant="brand" fullWidth size="md">Confirm Issue</Button>
                </div>
              </form>
            )}
          </aside>
        </>
      )}

      {/* ── Add Stock Panel ── */}
      {addOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setAddOpen(false)}/>
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[440px] bg-white shadow-overlay flex flex-col animate-slide-in">
            <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Add Stock Item</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Register new equipment in inventory</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setAddOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
            </div>

            {addOk ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500"/>
                </div>
                <p className="text-base font-bold text-neutral-900">Stock Added</p>
                <p className="text-sm text-neutral-500">The item has been added to inventory.</p>
              </div>
            ) : (
              <form onSubmit={submitAdd} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Item Description <span className="text-status-critical">*</span></label>
                  <Input placeholder="e.g. Drill Pipe 5in 19.5ppf" value={addForm.name}
                    onChange={e => { setAddForm(f=>({...f,name:e.target.value})); setAddErrors(x=>({...x,name:''})) }}
                    error={!!addErrors.name}/>
                  {addErrors.name && <p className="text-xs text-status-critical">{addErrors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Category <span className="text-status-critical">*</span></label>
                  <Dropdown options={CAT_OPTIONS} value={addForm.category}
                    onChange={v => { setAddForm(f=>({...f,category:v})); setAddErrors(x=>({...x,category:''})) }}
                    placeholder="Select category…" error={!!addErrors.category}/>
                  {addErrors.category && <p className="text-xs text-status-critical">{addErrors.category}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Initial Qty <span className="text-status-critical">*</span></label>
                    <Input type="number" min="0" placeholder="0" value={addForm.qty}
                      onChange={e => { setAddForm(f=>({...f,qty:e.target.value})); setAddErrors(x=>({...x,qty:''})) }}
                      error={!!addErrors.qty}/>
                    {addErrors.qty && <p className="text-xs text-status-critical">{addErrors.qty}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Reorder At</label>
                    <Input type="number" min="0" placeholder="Auto" value={addForm.reorderAt}
                      onChange={e => setAddForm(f=>({...f,reorderAt:e.target.value}))}/>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Unit <span className="text-status-critical">*</span></label>
                    <Dropdown options={UNIT_OPTIONS} value={addForm.unit}
                      onChange={v => { setAddForm(f=>({...f,unit:v})); setAddErrors(x=>({...x,unit:''})) }}
                      placeholder="e.g. joints" error={!!addErrors.unit}/>
                    {addErrors.unit && <p className="text-xs text-status-critical">{addErrors.unit}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-neutral-700">Storage Location</label>
                    <Input placeholder="Bay 1-A" value={addForm.location}
                      onChange={e => setAddForm(f=>({...f,location:e.target.value}))}/>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-default">
                  <Button type="submit" variant="brand" fullWidth size="md">Add to Inventory</Button>
                </div>
              </form>
            )}
          </aside>
        </>
      )}
    </AppShell>
  )
}
