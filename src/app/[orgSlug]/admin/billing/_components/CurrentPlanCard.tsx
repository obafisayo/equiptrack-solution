'use client'

import { Users, TrendingUp, Calendar } from 'lucide-react'
import type { SubscriptionPlan } from '@/lib/types'
import { TIER_LABEL, TIER_COLOR, FEATURE_LABEL, formatCurrency, formatDate } from './constants'

interface CurrentPlanCardProps {
  sub: SubscriptionPlan
  showUpgrade: boolean
  onToggleUpgrade: () => void
}

export function CurrentPlanCard({ sub, showUpgrade, onToggleUpgrade }: CurrentPlanCardProps) {
  const tc       = TIER_COLOR[sub.tier]
  const seatPct  = Math.round((sub.seatsUsed / sub.seats) * 100)
  const daysLeft = Math.ceil((new Date(sub.billingCycleEnd).getTime() - Date.now()) / 86400000)

  return (
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
          onClick={onToggleUpgrade}
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
            Cycle: {formatDate(sub.billingCycleStart)} - {formatDate(sub.billingCycleEnd)}
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
  )
}
