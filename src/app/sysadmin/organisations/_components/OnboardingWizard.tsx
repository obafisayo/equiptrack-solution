'use client'

import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import type { SubscriptionTier } from '@/lib/types'
import { WizardStepIndicator } from './WizardStepIndicator'
import { WizardStepOrganisation } from './WizardStepOrganisation'
import { WizardStepAdmin } from './WizardStepAdmin'
import { WizardStepSubscription } from './WizardStepSubscription'
import { WizardStepReview } from './WizardStepReview'
import { EMPTY_FORM, type WizardForm } from './WizardForm'

interface OnboardingWizardProps { onClose: () => void }

export function OnboardingWizard({ onClose }: OnboardingWizardProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<WizardForm>(EMPTY_FORM)
  const [done, setDone] = useState(false)
  const F = <K extends keyof WizardForm>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  function canNext() {
    if (step === 0) return form.name.trim() !== '' && form.industry !== '' && form.country !== ''
    if (step === 1) return form.adminName.trim() !== '' && form.adminEmail.includes('@')
    if (step === 2) return true
    return true
  }

  function submit() {
    setDone(true)
    setTimeout(onClose, 2000)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[500px] bg-white shadow-overlay flex flex-col animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <p className="text-base font-bold text-neutral-900">Onboard Organisation</p>
            <p className="text-xs text-neutral-500 mt-0.5">Provision a new tenant in {4 - step} step{step < 3 ? 's' : ''}</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
            <X size={17}/>
          </button>
        </div>

        {!done && <WizardStepIndicator step={step} />}

        {/* Body */}
        {done ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-500"/>
            </div>
            <div>
              <p className="text-base font-bold text-neutral-900">Organisation provisioned</p>
              <p className="text-sm text-neutral-500 mt-1">An invitation has been sent to {form.adminEmail}. They can complete setup on first login.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {step === 0 && <WizardStepOrganisation form={form} onChange={F} />}
            {step === 1 && <WizardStepAdmin form={form} onChange={F} />}
            {step === 2 && (
              <WizardStepSubscription form={form} onChange={F} onTierSelect={(tier: SubscriptionTier) => setForm(f => ({ ...f, tier }))} />
            )}
            {step === 3 && <WizardStepReview form={form} />}
          </div>
        )}

        {/* Footer */}
        {!done && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border-default shrink-0">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                className="flex-1 h-9 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                Back
              </button>
            ) : (
              <button type="button" onClick={onClose}
                className="flex-1 h-9 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
            )}
            {step < 3 ? (
              <button type="button" disabled={!canNext()} onClick={() => setStep(s => s + 1)}
                className="flex-[2] h-9 text-sm font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors">
                Continue
              </button>
            ) : (
              <button type="button" onClick={submit}
                className="flex-[2] h-9 text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
                Launch Organisation
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
