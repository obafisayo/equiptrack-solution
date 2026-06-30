'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

const TIER_LABEL: Record<string, string> = {
  enterprise: 'Enterprise', professional: 'Professional', starter: 'Starter',
}

const SUB_LABEL: Record<string, string> = {
  active: 'Active', trialing: 'Trialing', past_due: 'Past Due',
  cancelled: 'Cancelled', suspended: 'Suspended',
}

interface Subscription {
  tier: string
  status: string
  seats: number
  seatsUsed: number
}

interface SubscriptionCardProps {
  orgSlug: string
  subscription: Subscription
}

export function SubscriptionCard({ orgSlug, subscription }: SubscriptionCardProps) {
  const seatPct   = Math.round((subscription.seatsUsed / subscription.seats) * 100)
  const seatColor = seatPct >= 90 ? '#EF4444' : seatPct >= 70 ? '#F59E0B' : '#10B981'

  return (
    <div style={{
      background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
      padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 14px' }}>Subscription</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <span style={{
          background: '#FFF1F1', color: '#F04A4A', fontSize: 12, fontWeight: 700,
          padding: '3px 10px', borderRadius: 9999,
        }}>{TIER_LABEL[subscription.tier]}</span>
        <span style={{
          background: '#F0FDF4', color: '#16A34A', fontSize: 12, fontWeight: 700,
          padding: '3px 10px', borderRadius: 9999,
        }}>{SUB_LABEL[subscription.status] ?? subscription.status}</span>
      </div>

      <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
        Seat Usage
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 7, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${seatPct}%`, height: '100%', background: seatColor, borderRadius: 4 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: seatColor, flexShrink: 0 }}>
          {subscription.seatsUsed}/{subscription.seats}
        </span>
      </div>

      {seatPct >= 80 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 10px', background: '#FEF3C7',
          borderRadius: 6, border: '1px solid #FCD34D',
        }}>
          <AlertTriangle size={13} color="#D97706" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 11, color: '#92400E', margin: 0 }}>
            {seatPct}% of seats used - consider upgrading.
          </p>
        </div>
      )}

      <Link
        href={`/${orgSlug}/admin/billing`}
        style={{
          display: 'block', marginTop: 12, textAlign: 'center',
          padding: '8px 0', background: '#F04A4A', color: '#fff',
          borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none',
        }}
      >
        Manage Billing
      </Link>
    </div>
  )
}
