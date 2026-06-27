'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AlertTriangle, CheckCircle, Package } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { CONTAINERS } from '@/lib/mock-data'

const STOCK_ITEMS = [
  { id: 'EQ-0012', name: 'Drill Pipe — 5" 19.5ppf',   category: 'Drilling',     qty: 48,  reorderAt: 20,  unit: 'joints',  status: 'ok'       },
  { id: 'EQ-0037', name: 'BOP Gasket Kit — 13.5"',    category: 'Well Control', qty: 4,   reorderAt: 10,  unit: 'kits',    status: 'reorder'  },
  { id: 'EQ-0051', name: 'Chemical — Barite Sacks',    category: 'Drilling',     qty: 210, reorderAt: 100, unit: 'sacks',   status: 'ok'       },
  { id: 'EQ-0063', name: 'Choke Manifold — 5000 PSI', category: 'Well Control', qty: 2,   reorderAt: 3,   unit: 'units',   status: 'critical' },
  { id: 'EQ-0078', name: 'Safety Valve — 4.5"',       category: 'Safety',       qty: 12,  reorderAt: 5,   unit: 'units',   status: 'ok'       },
  { id: 'EQ-0089', name: 'Mud Pump Liner — 6.5"',     category: 'Drilling',     qty: 6,   reorderAt: 8,   unit: 'pieces',  status: 'reorder'  },
  { id: 'EQ-0102', name: 'Flex Hose — 3" x 20ft',     category: 'Piping',       qty: 30,  reorderAt: 15,  unit: 'lengths', status: 'ok'       },
  { id: 'EQ-0115', name: 'Generator — 250 KVA',       category: 'Power',        qty: 1,   reorderAt: 2,   unit: 'units',   status: 'critical' },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  ok:       { bg: '#F0FDF4', color: '#16A34A', label: 'In Stock'  },
  reorder:  { bg: '#FEF3C7', color: '#D97706', label: 'Reorder'   },
  critical: { bg: '#FEF2F2', color: '#DC2626', label: 'Critical'  },
}

export default function InventoryDashboard() {
  const currentPath = usePathname()
  const [search, setSearch] = useState('')

  const filtered = STOCK_ITEMS.filter(item =>
    !search ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  const okCount        = STOCK_ITEMS.filter(i => i.status === 'ok').length
  const reorderCount   = STOCK_ITEMS.filter(i => i.status === 'reorder').length
  const criticalCount  = STOCK_ITEMS.filter(i => i.status === 'critical').length
  const containerCount = CONTAINERS.filter(c => c.status === 'available').length

  return (
    <AppShell role="inventory" currentPath={currentPath} title="Stock Overview">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="In Stock"             value={okCount}        icon={CheckCircle} />
        <StatCard label="Reorder Required"     value={reorderCount}   icon={AlertTriangle} />
        <StatCard label="Critical Low"         value={criticalCount}  icon={AlertTriangle} />
        <StatCard label="Containers Available" value={containerCount} icon={Package} />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search equipment name or category…"
          style={{
            width: '100%', maxWidth: 360, padding: '8px 12px',
            border: '1px solid #D1D5DB', borderRadius: 7, fontSize: 13,
            color: '#111827', outline: 'none', boxSizing: 'border-box' as const,
          }}
        />
      </div>

      {/* Stock table */}
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                {['Item ID', 'Description', 'Category', 'Qty', 'Reorder At', 'Unit', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', whiteSpace: 'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center' as const, color: '#9CA3AF' }}>No items match.</td>
                </tr>
              )}
              {filtered.map((item, i) => {
                const st = STATUS_STYLE[item.status]
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>{item.id}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 500, color: '#111827', maxWidth: 240 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.name}</span>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#6B7280' }}>{item.category}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: item.status === 'critical' ? '#DC2626' : item.status === 'reorder' ? '#D97706' : '#111827' }}>
                      {item.qty}
                    </td>
                    <td style={{ padding: '11px 16px', color: '#9CA3AF' }}>{item.reorderAt}</td>
                    <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>{item.unit}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </AppShell>
  )
}
