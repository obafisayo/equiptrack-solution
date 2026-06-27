'use client'

import { usePathname } from 'next/navigation'
import { Truck, Anchor, Package, Navigation } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { WORK_ORDERS } from '@/lib/mock-data'

const VESSEL_SCHEDULE = [
  { vessel: 'MV SEPLAT PRIDE',   departure: '2026-06-28', port: 'Warri Port',    cargo: 14, status: 'loading'   },
  { vessel: 'MV NIGER DELTA',    departure: '2026-06-30', port: 'Port Harcourt', cargo: 8,  status: 'scheduled' },
  { vessel: 'MV IJELE OFFSHORE', departure: '2026-07-03', port: 'Warri Port',    cargo: 22, status: 'scheduled' },
  { vessel: 'MV OML 25 RUNNER',  departure: '2026-07-07', port: 'Port Harcourt', cargo: 5,  status: 'scheduled' },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  loading:   { bg: '#FEF3C7', color: '#D97706', label: 'Loading'   },
  scheduled: { bg: '#EFF6FF', color: '#2563EB', label: 'Scheduled' },
  departed:  { bg: '#F0FDF4', color: '#16A34A', label: 'Departed'  },
}

const dispatchOrders = WORK_ORDERS.filter(wo =>
  wo.stage === 'Dispatch Queue' ||
  wo.stage === 'Dispatch Assigned' ||
  wo.stage === 'Awaiting Deckspace'
)

export default function LogisticsDashboard() {
  const currentPath = usePathname()

  const awaiting   = WORK_ORDERS.filter(wo => wo.stage === 'Awaiting Deckspace').length
  const inDispatch = WORK_ORDERS.filter(wo => wo.stage === 'Dispatch Queue' || wo.stage === 'Dispatch Assigned').length
  const totalCargo = VESSEL_SCHEDULE.reduce((s, v) => s + v.cargo, 0)

  return (
    <AppShell role="logistics" currentPath={currentPath} title="Logistics Board">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Awaiting Deckspace" value={awaiting}              icon={Anchor} />
        <StatCard label="In Dispatch Queue"  value={inDispatch}            icon={Package} />
        <StatCard label="Vessels Scheduled"  value={VESSEL_SCHEDULE.length} icon={Navigation} />
        <StatCard label="Total Cargo Units"  value={totalCargo}            icon={Truck} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Vessel schedule */}
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Upcoming Vessels</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {VESSEL_SCHEDULE.map((v, i) => {
              const st = STATUS_STYLE[v.status]
              return (
                <div key={v.vessel} style={{
                  padding: '14px 20px',
                  borderBottom: i < VESSEL_SCHEDULE.length - 1 ? '1px solid #F3F4F6' : 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>{v.vessel}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{v.port} &middot; {v.departure}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 3px' }}>{v.cargo} units</p>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dispatch orders */}
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Dispatch Activity</p>
          </div>
          {dispatchOrders.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>No active dispatch orders.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {dispatchOrders.slice(0, 6).map((wo, i) => (
                <div key={wo.id} style={{
                  padding: '12px 20px',
                  borderBottom: i < Math.min(dispatchOrders.length, 6) - 1 ? '1px solid #F3F4F6' : 'none',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#374151', margin: '0 0 2px' }}>{wo.workOrderNumber}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{wo.stage}</p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999, background: '#F5F3FF', color: '#7C3AED' }}>
                    {wo.urgency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
