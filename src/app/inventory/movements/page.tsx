/* eslint-disable */
'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, ArrowRightLeft, ClipboardList, Package } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { SearchInput } from '@/components/ui/Form'

type MovType = 'Issue' | 'Receive' | 'Transfer' | 'Adjustment'

interface Movement {
  id: string; itemId: string; itemName: string
  type: MovType; qty: number; date: string; time: string
  by: string; reference?: string; note?: string
}

const MOVEMENTS: Movement[] = [
  { id:'MOV-1001', itemId:'EQ-0012', itemName:'Drill Pipe — 5" 19.5ppf',    type:'Issue',      qty:12,  date:'2026-06-27', time:'14:30', by:'Emeka Okonkwo',   reference:'WO-0087', note:'Issued to Bonga FPSO expedition.' },
  { id:'MOV-1002', itemId:'EQ-0051', itemName:'Chemical — Barite Sacks',    type:'Receive',    qty:50,  date:'2026-06-26', time:'09:15', by:'Ngozi Eze',       reference:'PO-2241', note:'Received from Halliburton delivery.' },
  { id:'MOV-1003', itemId:'EQ-0037', itemName:'BOP Gasket Kit — 13.5"',     type:'Issue',      qty:2,   date:'2026-06-25', time:'11:00', by:'Tunde Bello',     reference:'WO-0085', note:'Issued for BOP maintenance.' },
  { id:'MOV-1004', itemId:'EQ-0078', itemName:'Safety Valve — 4.5"',        type:'Transfer',   qty:3,   date:'2026-06-24', time:'16:45', by:'Ngozi Eze',       reference:'TRF-099', note:'Transferred to Bay 2-B from Bay 4.' },
  { id:'MOV-1005', itemId:'EQ-0063', itemName:'Choke Manifold — 5000 PSI',  type:'Adjustment', qty:-1,  date:'2026-06-20', time:'08:00', by:'Segun Folarin',   reference:'ADJ-012', note:'One unit sent for off-site repair.' },
  { id:'MOV-1006', itemId:'EQ-0102', itemName:'Flex Hose — 3" x 20ft',      type:'Receive',    qty:10,  date:'2026-06-19', time:'10:30', by:'Ngozi Eze',       reference:'PO-2238', note:'Partial PO delivery received.' },
  { id:'MOV-1007', itemId:'EQ-0133', itemName:'Drill Bit — 12.25" PDC',     type:'Issue',      qty:2,   date:'2026-06-18', time:'07:00', by:'Biodun Adekunle', reference:'WO-0081', note:'Dispatched on MV Seplat Pride.' },
  { id:'MOV-1008', itemId:'EQ-0089', itemName:'Mud Pump Liner — 6.5"',      type:'Issue',      qty:2,   date:'2026-06-17', time:'13:20', by:'Emeka Okonkwo',   reference:'WO-0079', note:'Issued for MNT-001 mud pump repair.' },
  { id:'MOV-1009', itemId:'EQ-0051', itemName:'Chemical — Barite Sacks',    type:'Issue',      qty:30,  date:'2026-06-15', time:'06:00', by:'Biodun Adekunle', reference:'WO-0077', note:'Issued for well kill operation.' },
  { id:'MOV-1010', itemId:'EQ-0012', itemName:'Drill Pipe — 5" 19.5ppf',    type:'Receive',    qty:24,  date:'2026-06-12', time:'11:45', by:'Ngozi Eze',       reference:'PO-2235', note:'Backlog shipment arrived from Port Harcourt.' },
]

const TYPE_CFG: Record<MovType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Issue:      { label:'Issue',      color:'#DC2626', bg:'#FEF2F2', icon:<ArrowUp size={12}/> },
  Receive:    { label:'Receive',    color:'#16A34A', bg:'#F0FDF4', icon:<ArrowDown size={12}/> },
  Transfer:   { label:'Transfer',   color:'#7C3AED', bg:'#F5F3FF', icon:<ArrowRightLeft size={12}/> },
  Adjustment: { label:'Adjustment', color:'#D97706', bg:'#FFFBEB', icon:<ClipboardList size={12}/> },
}

function formatDate(d: string, t: string) {
  return `${new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })} ${t}`
}

export default function InventoryMovementsPage() {
  const [typeFilter, setTypeFilter] = useState<MovType | 'all'>('all')
  const [search, setSearch] = useState('')

  const shown = MOVEMENTS.filter(m => {
    const matchType = typeFilter === 'all' || m.type === typeFilter
    const matchSearch = search === '' || m.itemName.toLowerCase().includes(search.toLowerCase())
      || m.itemId.toLowerCase().includes(search.toLowerCase())
      || (m.reference ?? '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  const totalIssued   = MOVEMENTS.filter(m => m.type === 'Issue').reduce((s,m) => s + Math.abs(m.qty), 0)
  const totalReceived = MOVEMENTS.filter(m => m.type === 'Receive').reduce((s,m) => s + m.qty, 0)

  return (
    <AppShell role="inventory" currentPath="/inventory/movements" title="Movements Log" breadcrumb={[{ label:'Inventory', href:'/inventory' }, { label:'Movements Log' }]}>
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { label:'Total Movements',  value: MOVEMENTS.length,                          color:'#3B82F6', icon:<ArrowRightLeft size={16}/> },
            { label:'Units Issued',     value: totalIssued,                               color:'#DC2626', icon:<ArrowUp size={16}/> },
            { label:'Units Received',   value: totalReceived,                             color:'#16A34A', icon:<ArrowDown size={16}/> },
            { label:'Active Items',     value: new Set(MOVEMENTS.map(m=>m.itemId)).size,  color:'#8B5CF6', icon:<Package size={16}/> },
          ] as { label:string; value:string|number; color:string; icon:React.ReactNode }[]).map(k => (
            <div key={k.label} className="bg-white border border-border-default rounded-card shadow-card p-4 flex items-start gap-3">
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

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-75">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search item, ID, or reference…"
              size="sm"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'Issue', 'Receive', 'Transfer', 'Adjustment'] as const).map(t => {
              const cfg = t !== 'all' ? TYPE_CFG[t] : null
              return (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    typeFilter === t
                      ? 'bg-neutral-900 border-neutral-900 text-white'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}>
                  {t === 'all' ? 'All Types' : t}
                </button>
              )
            })}
          </div>
          <span className="ml-auto text-xs text-neutral-400 whitespace-nowrap">{shown.length} entries</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Date / Time</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Item</th>
                <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Qty</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">By</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Reference</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {shown.map(m => {
                const cfg = TYPE_CFG[m.type]
                return (
                  <tr key={m.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-neutral-600 whitespace-nowrap">
                      {formatDate(m.date, m.time)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{color:cfg.color, background:cfg.bg}}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800 text-xs">{m.itemName}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{m.itemId}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${m.qty < 0 ? 'text-red-600' : 'text-neutral-800'}`}>
                        {m.qty > 0 ? '+' : ''}{m.qty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{m.by}</td>
                    <td className="px-4 py-3">
                      {m.reference && (
                        <code className="font-mono text-[11px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{m.reference}</code>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-500 max-w-50 truncate" title={m.note}>{m.note}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {shown.length === 0 && (
            <div className="py-16 text-center text-sm text-neutral-400">No movements match your search.</div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
