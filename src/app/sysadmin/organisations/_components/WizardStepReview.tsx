'use client'

import { TIER_DETAILS } from './styleMaps'
import { ReviewRow } from './ReviewRow'
import type { WizardForm } from './WizardForm'

interface WizardStepReviewProps {
  form: WizardForm
}

export function WizardStepReview({ form }: WizardStepReviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-neutral-50 rounded-xl border border-border-default p-4 space-y-3">
        <ReviewRow label="Organisation" value={form.name}/>
        <ReviewRow label="Industry" value={form.industry}/>
        <ReviewRow label="Country" value={form.country}/>
        {form.website && <ReviewRow label="Website" value={form.website}/>}
      </div>
      <div className="bg-neutral-50 rounded-xl border border-border-default p-4 space-y-3">
        <ReviewRow label="Admin Name" value={form.adminName}/>
        <ReviewRow label="Admin Email" value={form.adminEmail}/>
        {form.adminPhone && <ReviewRow label="Phone" value={form.adminPhone}/>}
      </div>
      <div className="bg-neutral-50 rounded-xl border border-border-default p-4 space-y-3">
        <ReviewRow label="Tier" value={TIER_DETAILS[form.tier].label}/>
        <ReviewRow label="Price" value={TIER_DETAILS[form.tier].price}/>
        <ReviewRow label="Seats" value={form.seats}/>
        {form.billingEmail && <ReviewRow label="Billing Email" value={form.billingEmail}/>}
      </div>
      <p className="text-[11px] text-neutral-400 text-center">
        A setup email will be sent to {form.adminEmail}. The subscription starts on first login.
      </p>
    </div>
  )
}
