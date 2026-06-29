/* eslint-disable */
'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingDown, Package, Clock, Building2, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'

type AlertLevel = 'critical' | 'reorder'

interface AlertItem {
  id: string; name: string; category: string
  qty: number; reorderAt: number; unit: string
  location: string; supplier: string; leadDays: number
  lastUpdated: string; status: AlertLevel
  contactEmail?: string
}

const ALERTS: AlertItem[] = [
  {
    id: 'EQ-0063', name: 'Choke Manifold — 5000 PSI', category: 'Well Control',
    qty: 2, reorderAt: 3, unit: 'units', location: 'Bay 3-B',
    supplier: 'Cameron International', leadDays: 30, lastUpdated: '2026-06-20',
    status: 'critical', contactEmail: 'orders@cameron.com',
  },
  {
    id: 'EQ-0115', name: 'Generator — 250 KVA', category: 'Power',
    qty: 1, reorderAt: 2, unit: 'units', location: 'Power Bay',
    supplier: 'Aggreko Nigeria', leadDays: 45, lastUpdated: '2026-06-18',
    status: 'critical', contactEmail: 'nigeria@aggreko.com',
  },
  {
    id: 'EQ-0037', name: 'BOP Gasket Kit — 13.5"', category: 'Well Control',
    qty: 4, reorderAt: 10, unit: 'kits', location: 'Bay 1-C',
    supplier: 'NOV Nigeria', leadDays: 21, lastUpdated: '2026-06-26',
    status: 'reorder', contactEmail: 'supply@nov.com',
  },
  {
    id: 'EQ-0089', name: 'Mud Pump Liner — 6.5"', category: 'Drilling',
    qty: 6, reorderAt: 8, unit: 'pieces', location: 'Bay 1-A',
    supplier: 'National Oilwell Varco', leadDays: 21, lastUpdated: '2026-06-22',
    status: 'reorder', contactEmail: 'supply@nov.com',
  },
]

const LEVEL_CFG = {
  critical: { label: 'Critical',  color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <XCircle size={14}/> },
  reorder:  { label: 'Reorder',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: <TrendingDown size={14}/> },
}

function stockPct(qty: number, reorderAt: number) {
  return Math.min(100, Math.round((qty / (reorderAt * 2)) * 100))
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function BarFill({ pct, status }: { pct: number; status: AlertLevel }) {
  const color = status === 'critical' ? '#DC2626' : '#D97706'
  return (
    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }}/>
    </div>
  )
}

export default function InventoryAlertsPage() {
  const [filter, setFilter] = useState<AlertLevel | 'all'>('all')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const shown = ALERTS.filter(a => !dismissed.has(a.id) && (filter === 'all' || a.status === filter))

  const critical = ALERTS.filter(a => a.status === 'critical' && !dismissed.has(a.id)).length
  const reorder  = ALERTS.filter(a => a.status === 'reorder'  && !dismissed.has(a.id)).length

  return (
    <AppShell
      role="inventory"
      currentPath="/inventory/alerts"
      title="Reorder Alerts"
      breadcrumb={[
        { label: 'Inventory', href: '/inventory' },
        { label: 'Reorder Alerts' },
      ]}
    >
      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { label: 'Total Active Alerts', value: critical + reorder,                                      color: '#F04A4A', icon: <AlertTriangle size={16}/> },
            { label: 'Critical Stock',       value: critical,                                                color: '#DC2626', icon: <XCircle size={16}/> },
            { label: 'Reorder Required',     value: reorder,                                                 color: '#D97706', icon: <TrendingDown size={16}/> },
            { label: 'Max Lead Time',         value: `${Math.max(...ALERTS.map(a => a.leadDays))}d`,        color: '#8B5CF6', icon: <Clock size={16}/> },
          ] as { label: string; value: string | number; color: string; icon: React.ReactNode }[]).map(k => (
            <div key={k.label} className="bg-white border border-border-default rounded-card shadow-card p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${k.color}14`, color: k.color }}>
                {k.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 leading-none mb-0.5">{k.value}</p>
                <p className="text-xs text-neutral-500">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          {(['all', 'critical', 'reorder'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                filter === f
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}>
              {f === 'all' ? 'All Alerts' : LEVEL_CFG[f].label}
            </button>
          ))}
          <span className="ml-auto text-xs text-neutral-400">{shown.length} active alerts</span>
        </div>

        {/* Alert cards */}
        {shown.length === 0 ? (
          <div className="bg-white border border-border-default rounded-card shadow-card py-20 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-4">
              <CheckCircle2 size={26} className="text-green-600"/>
            </div>
            <h2 className="text-lg font-bold text-neutral-800 mb-1">All Clear</h2>
            <p className="text-sm text-neutral-500">No reorder alerts for this filter. All stock levels are above minimum thresholds.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map(item => {
              const cfg = LEVEL_CFG[item.status]
              const pct = stockPct(item.qty, item.reorderAt)
              const deficit = item.reorderAt - item.qty
              const isCritical = item.status === 'critical'
              return (
                <div key={item.id}
                  className="bg-white border rounded-card shadow-card overflow-hidden"
                  style={{
                    borderColor: isCritical ? '#FECACA' : '#FDE68A',
                    borderTopWidth: 3,
                    borderTopColor: cfg.color,
                  }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: cfg.bg, color: cfg.color }}>
                          <Package size={18}/>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: cfg.bg }}>
                              {cfg.icon}
                              {cfg.label}
                            </span>
                            <code className="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">{item.id}</code>
                          </div>
                          <h3 className="font-bold text-neutral-900 text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-neutral-500 mt-0.5">{item.category} &mdash; {item.location}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold" style={{ color: cfg.color }}>{item.qty}</p>
                        <p className="text-xs text-neutral-500">{item.unit} remaining</p>
                        <p className="text-[11px] font-semibold text-neutral-400 mt-0.5">Min: {item.reorderAt} {item.unit}</p>
                      </div>
                    </div>

                    {/* Stock level bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] text-neutral-500 mb-1.5">
                        <span>Stock level</span>
                        <span>{pct}% of reorder threshold</span>
                      </div>
                      <BarFill pct={pct} status={item.status}/>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        {deficit > 0
                          ? <span style={{ color: cfg.color }}>{deficit} {item.unit} below minimum threshold</span>
                          : 'At minimum threshold'}
                      </p>
                    </div>

                    {/* Supplier + lead time + actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100 gap-4">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                          <Building2 size={13} className="text-neutral-400"/>
                          <span className="font-medium">{item.supplier}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                          <Clock size={13} className="text-neutral-400"/>
                          <span><span className="font-semibold">{item.leadDays}d</span> lead time</span>
                        </div>
                        <span className="text-[11px] text-neutral-400">Updated {formatDate(item.lastUpdated)}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setDismissed(s => new Set([...s, item.id]))}
                          className="px-3 py-1.5 text-xs font-semibold border border-neutral-200 rounded-lg text-neutral-500 hover:bg-neutral-50 transition-colors"
                        >
                          Dismiss
                        </button>
                        <a
                          href={`mailto:${item.contactEmail}?subject=Reorder Request: ${item.name} (${item.id})&body=Hi,%0A%0APlease send a quote for %20${item.reorderAt * 2} ${item.unit} of ${item.name} (${item.id}).%0A%0ARegards`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white no-underline transition-colors"
                          style={{ background: cfg.color }}
                        >
                          Request Reorder
                          <ChevronRight size={12}/>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
