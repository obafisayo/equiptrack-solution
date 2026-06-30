'use client'

import { ORGANISATIONS } from '@/lib/mock-platform'
import { fmtDate, fmtMRR, TIER_STYLE, SUB_STATUS_STYLE, FEATURE_LABELS } from './styleMaps'

interface SubscriptionTabProps {
  org: NonNullable<ReturnType<typeof ORGANISATIONS.find>>
}

export function SubscriptionTab({ org }: SubscriptionTabProps) {
  const sub = org.subscription
  const ts  = TIER_STYLE[sub.tier] ?? TIER_STYLE.starter
  const bs  = SUB_STATUS_STYLE[sub.status] ?? SUB_STATUS_STYLE.active
  const seatPct = Math.round((sub.seatsUsed / sub.seats) * 100)
  const seatColor = seatPct >= 90 ? '#EF4444' : seatPct >= 70 ? '#F59E0B' : '#10B981'

  return (
    <div className="space-y-5">
      {/* Billing overview */}
      <div className="bg-white rounded-card border border-border-default p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>Billing Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Tier',         value: <span style={{ background: ts.bg, color: ts.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{ts.label}</span> },
            { label: 'Status',       value: <span style={{ background: bs.bg, color: bs.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{bs.label}</span> },
            { label: 'Monthly Price', value: <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{fmtMRR(sub.monthlyPrice)}</span> },
            { label: 'Cycle Ends',   value: <span style={{ fontSize: 13, color: '#374151' }}>{fmtDate(sub.billingCycleEnd)}</span> },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                {item.label}
              </p>
              {item.value}
            </div>
          ))}
        </div>
      </div>

      {/* Seat usage */}
      <div className="bg-white rounded-card border border-border-default p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Seat Usage</p>
          <span style={{ fontSize: 13, fontWeight: 700, color: seatColor }}>{sub.seatsUsed} / {sub.seats}</span>
        </div>
        <div style={{ height: 10, background: '#F3F4F6', borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ width: `${seatPct}%`, height: '100%', background: seatColor, borderRadius: 5 }} />
        </div>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{seatPct}% of seats used</p>
      </div>

      {/* Plan features */}
      <div className="bg-white rounded-card border border-border-default p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 14px' }}>Included Features</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(FEATURE_LABELS).map(([key, label]) => {
            const included = sub.features.includes(key as Parameters<typeof sub.features.includes>[0])
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  background: included ? '#F0FDF4' : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {included ? (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <line x1="2" y1="2" x2="10" y2="10" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="10" y1="2" x2="2" y2="10" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 12, color: included ? '#111827' : '#9CA3AF' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
