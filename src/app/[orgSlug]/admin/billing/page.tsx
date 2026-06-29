/* eslint-disable */
'use client'

import { use, useState } from 'react'
import { CreditCard, Users, TrendingUp, Calendar } from 'lucide-react'
import { ORGANISATIONS } from '@/lib/mock-platform'
import type { SubscriptionTier } from '@/lib/types'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const TIER_LABEL: Record<SubscriptionTier, string> = {
  starter:      'Starter',
  professional: 'Professional',
  enterprise:   'Enterprise',
}

const TIER_COLOR: Record<SubscriptionTier, { bg: string; color: string; border: string }> = {
  starter:      { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  professional: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  enterprise:   { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
}

const FEATURE_LABEL: Record<string, string> = {
  sso_microsoft:       'Microsoft SSO',
  sso_google:          'Google Workspace SSO',
  api_access:          'API Access',
  advanced_analytics:  'Advanced Analytics',
  custom_sla:          'Custom SLA Config',
  audit_log:           'Audit Log',
  priority_support:    'Priority Support',
  white_label:         'White Label',
  bulk_import:         'Bulk Import',
  webhooks:            'Webhooks',
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Mock invoices (no invoices in types — generated here) ─────────────────── */

function mockInvoices(monthlyPrice: number) {
  return [
    { id: 'INV-2026-06', period: 'Jun 2026', amount: monthlyPrice, status: 'paid',    date: '2026-06-01' },
    { id: 'INV-2026-05', period: 'May 2026', amount: monthlyPrice, status: 'paid',    date: '2026-05-01' },
    { id: 'INV-2026-04', period: 'Apr 2026', amount: monthlyPrice, status: 'paid',    date: '2026-04-01' },
    { id: 'INV-2026-03', period: 'Mar 2026', amount: monthlyPrice, status: 'paid',    date: '2026-03-01' },
  ]
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

const PLANS: { tier: SubscriptionTier; price: number; seats: number; description: string }[] = [
  { tier: 'starter',      price: 199,  seats: 10,  description: 'For small teams getting started with equipment tracking.' },
  { tier: 'professional', price: 499,  seats: 50,  description: 'Advanced features for growing oil & gas operations.' },
  { tier: 'enterprise',   price: 2499, seats: 250, description: 'Unlimited scale with dedicated support and SLAs.' },
]

export default function OrgAdminBillingPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const [showUpgrade, setShowUpgrade] = useState(false)

  if (!org) {
    return (
      <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#9CA3AF' }}>Organisation not found.</p>
      </div>
    )
  }

  const sub       = org.subscription
  const tc        = TIER_COLOR[sub.tier]
  const invoices  = mockInvoices(sub.monthlyPrice)
  const seatPct   = Math.round((sub.seatsUsed / sub.seats) * 100)
  const daysLeft  = Math.ceil((new Date(sub.billingCycleEnd).getTime() - Date.now()) / 86400000)

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Billing</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Manage your subscription and view invoices</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Current plan card */}
          <div style={{
            background: '#fff', borderRadius: 8, border: `1px solid ${tc.border}`,
            padding: '22px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                  padding: '3px 10px', borderRadius: 999, background: tc.bg, color: tc.color,
                  display: 'inline-block', marginBottom: 8,
                }}>
                  {TIER_LABEL[sub.tier]} Plan
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
                    {formatCurrency(sub.monthlyPrice)}
                  </span>
                  <span style={{ fontSize: 14, color: '#9CA3AF' }}>/month</span>
                </div>
              </div>
              <button
                onClick={() => setShowUpgrade(v => !v)}
                style={{
                  padding: '8px 16px', background: '#F04A4A', color: '#fff',
                  border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {showUpgrade ? 'Hide plans' : 'Change plan'}
              </button>
            </div>

            {/* Seat bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Users size={12} /> Seat usage
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: seatPct >= 90 ? '#DC2626' : '#374151' }}>
                  {sub.seatsUsed} / {sub.seats} ({seatPct}%)
                </span>
              </div>
              <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${seatPct}%`, height: '100%', borderRadius: 4,
                  background: seatPct >= 90 ? '#EF4444' : tc.color,
                  transition: 'width 250ms ease',
                }} />
              </div>
              {seatPct >= 90 && (
                <p style={{ fontSize: 11, color: '#EF4444', margin: '5px 0 0' }}>
                  Approaching seat limit. Upgrade your plan to add more members.
                </p>
              )}
            </div>

            {/* Billing cycle */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={13} color="#9CA3AF" />
                <span style={{ fontSize: 12, color: '#6B7280' }}>
                  Cycle: {formatDate(sub.billingCycleStart)} — {formatDate(sub.billingCycleEnd)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={13} color="#9CA3AF" />
                <span style={{ fontSize: 12, color: '#6B7280' }}>
                  Next invoice in {Math.max(0, daysLeft)} day{daysLeft !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Features */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
                Included features
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {sub.features.map(f => (
                  <span key={f} style={{
                    fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 999,
                    background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                  }}>
                    {FEATURE_LABEL[f] ?? f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Plan comparison (shown on toggle) */}
          {showUpgrade && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {PLANS.map(plan => {
                const ptc       = TIER_COLOR[plan.tier]
                const isCurrent = plan.tier === sub.tier
                return (
                  <div key={plan.tier} style={{
                    background: '#fff', borderRadius: 8,
                    border: `2px solid ${isCurrent ? ptc.color : '#E2E8F0'}`,
                    padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    position: 'relative',
                  }}>
                    {isCurrent && (
                      <span style={{
                        position: 'absolute', top: -10, left: 16,
                        background: ptc.color, color: '#fff',
                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                      }}>
                        Current
                      </span>
                    )}
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                      padding: '2px 8px', borderRadius: 999, background: ptc.bg, color: ptc.color,
                      display: 'inline-block', marginBottom: 10,
                    }}>
                      {TIER_LABEL[plan.tier]}
                    </span>
                    <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
                      {formatCurrency(plan.price)}<span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 400 }}>/mo</span>
                    </p>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 14px' }}>{plan.description}</p>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 12px' }}>Up to {plan.seats} seats</p>
                    <button
                      disabled={isCurrent}
                      style={{
                        width: '100%', padding: '8px 0', borderRadius: 6, border: 'none',
                        background: isCurrent ? '#F3F4F6' : ptc.color,
                        color: isCurrent ? '#9CA3AF' : '#fff',
                        fontSize: 12, fontWeight: 600,
                        cursor: isCurrent ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isCurrent ? 'Current plan' : plan.tier === 'enterprise' && sub.tier !== 'enterprise' ? 'Contact sales' : plan.price > sub.monthlyPrice ? 'Upgrade' : 'Downgrade'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Invoice history */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={15} color="#6B7280" />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Invoice History</p>
            </div>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                  {['Invoice', 'Period', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{
                      padding: '9px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                      color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>{inv.id}</td>
                    <td style={{ padding: '11px 16px', color: '#374151' }}>{inv.period}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 600, color: '#111827' }}>{formatCurrency(inv.amount)}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: '#F0FDF4', color: '#16A34A' }}>
                        Paid
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                      <button style={{
                        background: 'none', border: 'none', fontSize: 12, color: '#F04A4A',
                        fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column — summary card */}
        <div style={{
          background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
          padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          position: 'sticky', top: 16,
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Payment Method</p>

          <div style={{ padding: '12px 14px', background: '#F9FAFB', borderRadius: 7, border: '1px solid #E2E8F0', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 24, background: '#1A1F71', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>VISA</span>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0 }}>Visa ending in 4242</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0' }}>Expires 09/28</p>
              </div>
            </div>
          </div>

          <button style={{
            width: '100%', padding: '9px 0', border: '1px solid #E2E8F0', borderRadius: 7,
            background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151',
            cursor: 'pointer', marginBottom: 20,
          }}>
            Update payment method
          </button>

          <div style={{ paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
              Billing Contact
            </p>
            <p style={{ fontSize: 12, color: '#374151', margin: '0 0 4px', fontWeight: 500 }}>{org.name}</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{org.adminEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
