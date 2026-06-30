'use client'

import { ORGANISATIONS } from '@/lib/mock-platform'

export function SubscriptionMixCard() {
  const tiers = [
    { label: 'Enterprise',   count: ORGANISATIONS.filter(o => o.subscription.tier === 'enterprise').length,   color: '#F04A4A' },
    { label: 'Professional', count: ORGANISATIONS.filter(o => o.subscription.tier === 'professional').length, color: '#3B82F6' },
    { label: 'Starter',      count: ORGANISATIONS.filter(o => o.subscription.tier === 'starter').length,      color: '#9CA3AF' },
  ]

  return (
    <div className="bg-white rounded-card border border-border-default shadow-card p-5">
      <p className="text-sm font-bold text-neutral-900 mb-4">Subscription Mix</p>
      <div className="space-y-3">
        {tiers.map(tier => {
          const pct = Math.round((tier.count / ORGANISATIONS.length) * 100)
          return (
            <div key={tier.label} className="flex items-center gap-3">
              <span className="text-xs text-neutral-600 w-24 shrink-0">{tier.label}</span>
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: pct + '%', backgroundColor: tier.color }}/>
              </div>
              <span className="text-xs font-bold text-neutral-900 w-7 text-right">{tier.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
