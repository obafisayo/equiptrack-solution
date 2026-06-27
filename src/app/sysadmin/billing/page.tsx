'use client'

import { ORGANISATIONS } from '@/lib/mock-platform'
import type { SubscriptionTier, SubscriptionStatus } from '@/lib/types'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const TIER_LABEL: Record<SubscriptionTier, string> = {
  starter:      'Starter',
  professional: 'Professional',
  enterprise:   'Enterprise',
}

const TIER_COLOR: Record<SubscriptionTier, { bg: string; color: string }> = {
  starter:      { bg: '#F0FDF4', color: '#16A34A' },
  professional: { bg: '#EFF6FF', color: '#2563EB' },
  enterprise:   { bg: '#F5F3FF', color: '#7C3AED' },
}

const STATUS_COLOR: Record<SubscriptionStatus, { bg: string; color: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A' },
  trialing:  { bg: '#FEF3C7', color: '#D97706' },
  past_due:  { bg: '#FEF2F2', color: '#DC2626' },
  cancelled: { bg: '#F3F4F6', color: '#6B7280' },
  suspended: { bg: '#FEF2F2', color: '#DC2626' },
}

const TIER_PRICE: Record<SubscriptionTier, number> = {
  starter:      199,
  professional: 499,
  enterprise:   2499,
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function SysadminBillingPage() {
  const activeOrgs  = ORGANISATIONS.filter(o => o.subscription.status === 'active' || o.subscription.status === 'trialing')
  const mrr         = activeOrgs.reduce((sum, o) => sum + o.subscription.monthlyPrice, 0)
  const pastDueOrgs = ORGANISATIONS.filter(o => o.subscription.status === 'past_due')

  const byTier = (['starter', 'professional', 'enterprise'] as SubscriptionTier[]).map(tier => ({
    tier,
    count: ORGANISATIONS.filter(o => o.subscription.tier === tier).length,
    revenue: ORGANISATIONS
      .filter(o => o.subscription.tier === tier && (o.subscription.status === 'active' || o.subscription.status === 'trialing'))
      .reduce((s, o) => s + o.subscription.monthlyPrice, 0),
  }))

  const kpis = [
    { label: 'Monthly Recurring Revenue', value: formatCurrency(mrr), sub: `${activeOrgs.length} active orgs` },
    { label: 'Annual Run Rate',            value: formatCurrency(mrr * 12), sub: 'projected from MRR' },
    { label: 'Past Due',                   value: pastDueOrgs.length.toString(), sub: pastDueOrgs.length ? 'requires attention' : 'none', alert: pastDueOrgs.length > 0 },
    { label: 'Total Seats Sold',           value: ORGANISATIONS.reduce((s, o) => s + o.subscription.seats, 0).toString(), sub: 'across all plans' },
  ]

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Billing Overview
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          Platform-wide subscription and revenue metrics
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        {kpis.map(kpi => (
          <div key={kpi.label} style={{
            background: '#fff', borderRadius: 8, border: `1px solid ${kpi.alert ? '#FECACA' : '#E2E8F0'}`,
            padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 6px', fontWeight: 500 }}>{kpi.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: kpi.alert ? '#DC2626' : '#111827', margin: '0 0 4px' }}>{kpi.value}</p>
            <p style={{ fontSize: 11, color: kpi.alert ? '#EF4444' : '#9CA3AF', margin: 0 }}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Plan tier breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {byTier.map(t => {
          const tc = TIER_COLOR[t.tier]
          return (
            <div key={t.tier} style={{
              background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
              padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                  padding: '2px 8px', borderRadius: 999,
                  background: tc.bg, color: tc.color,
                }}>
                  {TIER_LABEL[t.tier]}
                </span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{formatCurrency(TIER_PRICE[t.tier])}/mo per org</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{t.count}</p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px' }}>organisations</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: tc.color }}>{formatCurrency(t.revenue)}/mo</p>
            </div>
          )
        })}
      </div>

      {/* Per-org table */}
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>All Subscriptions</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                {['Organisation', 'Plan', 'Status', 'Seats', 'MRR', 'Billing Cycle', 'Next Invoice'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                    color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORGANISATIONS.map((org, i) => {
                const tc  = TIER_COLOR[org.subscription.tier]
                const sc  = STATUS_COLOR[org.subscription.status]
                const pct = Math.round((org.subscription.seatsUsed / org.subscription.seats) * 100)
                return (
                  <tr key={org.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>
                      <div>{org.name}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{org.slug}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: tc.bg, color: tc.color }}>
                        {TIER_LABEL[org.subscription.tier]}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: sc.bg, color: sc.color, textTransform: 'capitalize' }}>
                        {org.subscription.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 12, color: '#374151' }}>{org.subscription.seatsUsed}/{org.subscription.seats}</div>
                      <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, marginTop: 4, width: 64 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: pct >= 90 ? '#EF4444' : '#3B82F6', borderRadius: 2 }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>
                      {formatCurrency(org.subscription.monthlyPrice)}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: 12 }}>
                      {formatDate(org.subscription.billingCycleStart)}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: 12 }}>
                      {formatDate(org.subscription.billingCycleEnd)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
