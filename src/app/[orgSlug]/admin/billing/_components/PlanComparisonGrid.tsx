'use client'

import type { SubscriptionPlan } from '@/lib/types'
import { PLANS, TIER_COLOR, TIER_LABEL, formatCurrency } from './constants'

interface PlanComparisonGridProps {
  sub: SubscriptionPlan
}

export function PlanComparisonGrid({ sub }: PlanComparisonGridProps) {
  return (
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
  )
}
