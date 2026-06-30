'use client'

import { Input } from '@/components/ui/Form'
import type { SubscriptionTier } from '@/lib/types'
import { TIER_DETAILS } from './styleMaps'
import type { WizardForm } from './WizardForm'

interface WizardStepSubscriptionProps {
  form: WizardForm
  onChange: <K extends keyof WizardForm>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onTierSelect: (tier: SubscriptionTier) => void
}

export function WizardStepSubscription({ form, onChange, onTierSelect }: WizardStepSubscriptionProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-neutral-700 mb-2">Subscription Tier</p>
        <div className="space-y-2">
          {(Object.entries(TIER_DETAILS) as [SubscriptionTier, typeof TIER_DETAILS[SubscriptionTier]][]).map(([key, t]) => (
            <button key={key} type="button" onClick={() => onTierSelect(key)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${form.tier===key ? 'border-brand-500 bg-brand-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-neutral-900">{t.label}</span>
                  <span className="text-[10px] text-neutral-500 ml-2">{t.seats}</span>
                </div>
                <span className="text-sm font-bold" style={{color:t.color}}>{t.price}</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Seat Override <span className="text-neutral-400 font-normal">(optional)</span></label>
        <Input type="number" min={1} max={999} value={form.seats} onChange={onChange('seats')} size="sm" className="w-28"/>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Billing Contact Name</label>
        <Input value={form.billingContact} onChange={onChange('billingContact')} placeholder="Finance manager name" size="sm"/>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Billing Email</label>
        <Input type="email" value={form.billingEmail} onChange={onChange('billingEmail')} placeholder="billing@company.com" size="sm"/>
      </div>
    </div>
  )
}
