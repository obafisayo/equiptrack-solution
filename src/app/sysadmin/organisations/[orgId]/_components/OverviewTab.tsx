'use client'

import { ORGANISATIONS } from '@/lib/mock-platform'
import { fmtDate, STATUS_STYLE, TIER_STYLE } from './styleMaps'

interface OverviewTabProps {
  org: NonNullable<ReturnType<typeof ORGANISATIONS.find>>
}

export function OverviewTab({ org }: OverviewTabProps) {
  const ts = TIER_STYLE[org.subscription.tier] ?? TIER_STYLE.starter
  const ss = STATUS_STYLE[org.status] ?? STATUS_STYLE.active
  const scoreColor = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'

  const kpis = [
    { label: 'Active Work Orders', value: org.activeWorkOrders, color: '#3B82F6' },
    { label: 'Team Members',       value: org.memberCount,       color: '#8B5CF6' },
    { label: 'Health Score',       value: org.healthScore,       color: scoreColor },
    { label: 'Seat Usage',
      value: `${org.subscription.seatsUsed}/${org.subscription.seats}`,
      color: '#F59E0B' },
  ]

  return (
    <div className="space-y-5">
      {/* Info card */}
      <div className="bg-white rounded-card border border-border-default p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: 'Industry',   value: org.industry },
            { label: 'Country',    value: org.country  },
            { label: 'Timezone',   value: org.timezone },
            { label: 'Admin Email', value: org.adminEmail },
            { label: 'Created',    value: fmtDate(org.createdAt) },
            { label: 'Onboarded',  value: org.onboardedAt ? fmtDate(org.onboardedAt) : 'Not yet' },
            { label: 'Status',     value: (
              <span style={{
                background: ss.bg, color: ss.color, fontSize: 12, fontWeight: 600,
                padding: '2px 8px', borderRadius: 9999,
              }}>{ss.label}</span>
            )},
            { label: 'Tier', value: (
              <span style={{
                background: ts.bg, color: ts.color, fontSize: 12, fontWeight: 600,
                padding: '2px 8px', borderRadius: 9999,
              }}>{ts.label}</span>
            )},
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                {item.label}
              </p>
              {typeof item.value === 'string' ? (
                <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>{item.value}</p>
              ) : item.value}
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} style={{
            background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
            padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: k.color, margin: '0 0 4px', lineHeight: 1 }}>
              {k.value}
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Health bar */}
      <div className="bg-white rounded-card border border-border-default p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Health Score</p>
          <span style={{ fontSize: 20, fontWeight: 700, color: scoreColor }}>{org.healthScore}</span>
        </div>
        <div style={{ height: 10, background: '#F3F4F6', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${org.healthScore}%`, height: '100%', background: scoreColor, borderRadius: 5 }} />
        </div>
        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
          {org.healthScore >= 80 ? 'Healthy - no issues detected.'
            : org.healthScore >= 50 ? 'Moderate - monitor closely.'
            : 'At risk - action required.'}
        </p>
      </div>
    </div>
  )
}
