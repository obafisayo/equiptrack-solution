'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AlertTriangle, ShieldCheck, CheckCircle, Flag } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { WORK_ORDERS } from '@/lib/mock-data'

const INCIDENTS = [
  { id: 'INC-001', type: 'Near Miss',       location: 'Warehouse Bay 3', severity: 'medium', reportedBy: 'Emeka Okonkwo',   date: '2026-06-26', status: 'open'        },
  { id: 'INC-002', type: 'Equipment Damage', location: 'Dispatch Yard',  severity: 'high',   reportedBy: 'Biodun Adekunle', date: '2026-06-25', status: 'under_review' },
  { id: 'INC-003', type: 'Slip/Trip',        location: 'Loading Bay 1',  severity: 'low',    reportedBy: 'Kenneth Nwosu',   date: '2026-06-24', status: 'closed'       },
  { id: 'INC-004', type: 'Near Miss',        location: 'Container Yard', severity: 'medium', reportedBy: 'Tunde Bello',     date: '2026-06-23', status: 'open'         },
  { id: 'INC-005', type: 'First Aid',        location: 'Warehouse Bay 1',severity: 'low',    reportedBy: 'Yinka Adeyemi',   date: '2026-06-22', status: 'closed'       },
]

const SEV_STYLE: Record<string, { bg: string; color: string }> = {
  low:    { bg: '#F0FDF4', color: '#16A34A' },
  medium: { bg: '#FFFBEB', color: '#D97706' },
  high:   { bg: '#FEF2F2', color: '#DC2626' },
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  open:         { bg: '#FEF2F2', color: '#DC2626', label: 'Open'         },
  under_review: { bg: '#FFFBEB', color: '#D97706', label: 'Under Review' },
  closed:       { bg: '#F0FDF4', color: '#16A34A', label: 'Closed'       },
}

const INSPECTIONS = WORK_ORDERS.slice(0, 5).map((wo, i) => ({
  ...wo,
  inspectionStatus: i === 0 ? 'flagged' : i < 3 ? 'passed' : 'pending',
}))

export default function SafetyDashboard() {
  const currentPath = usePathname()
  const [activeTab, setActiveTab] = useState<'incidents' | 'inspections'>('incidents')

  const openCount   = INCIDENTS.filter(i => i.status === 'open').length
  const highSev     = INCIDENTS.filter(i => i.severity === 'high').length
  const closedCount = INCIDENTS.filter(i => i.status === 'closed').length
  const flagged     = INSPECTIONS.filter(i => i.inspectionStatus === 'flagged').length

  return (
    <AppShell role="safety" currentPath={currentPath} title="Safety Dashboard">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Open Incidents"    value={openCount}   icon={AlertTriangle} />
        <StatCard label="High Severity"     value={highSev}     icon={Flag} />
        <StatCard label="Closed This Month" value={closedCount} icon={CheckCircle} />
        <StatCard label="Flagged Equipment" value={flagged}     icon={ShieldCheck} />
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {(['incidents', 'inspections'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 16px', border: 'none', background: 'none',
              fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? '#F04A4A' : '#6B7280',
              borderBottom: activeTab === tab ? '2px solid #F04A4A' : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer', textTransform: 'capitalize',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Incidents tab */}
      {activeTab === 'incidents' && (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                  {['ID', 'Type', 'Location', 'Severity', 'Reported By', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map((inc, i) => {
                  const sv = SEV_STYLE[inc.severity]
                  const st = STATUS_STYLE[inc.status]
                  return (
                    <tr key={inc.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                      <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>{inc.id}</td>
                      <td style={{ padding: '11px 16px', fontWeight: 500, color: '#111827' }}>{inc.type}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280' }}>{inc.location}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: sv.bg, color: sv.color, textTransform: 'capitalize' }}>{inc.severity}</span>
                      </td>
                      <td style={{ padding: '11px 16px', color: '#374151' }}>{inc.reportedBy}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>{inc.date}</td>
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
      )}

      {/* Inspections tab */}
      {activeTab === 'inspections' && (
        <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                  {['Work Order', 'Type', 'Stage', 'Assigned To', 'Inspection'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INSPECTIONS.map((wo, i) => {
                  const isStyle =
                    wo.inspectionStatus === 'flagged' ? { bg: '#FEF2F2', color: '#DC2626', label: 'Flagged' } :
                    wo.inspectionStatus === 'passed'  ? { bg: '#F0FDF4', color: '#16A34A', label: 'Passed'  } :
                    { bg: '#F9FAFB', color: '#9CA3AF', label: 'Pending' }
                  return (
                    <tr key={wo.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                      <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>{wo.workOrderNumber}</td>
                      <td style={{ padding: '11px 16px', color: '#374151' }}>{wo.requestType}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>{wo.stage}</td>
                      <td style={{ padding: '11px 16px', color: '#374151' }}>{wo.assignedToName ?? '—'}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: isStyle.bg, color: isStyle.color }}>{isStyle.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  )
}
