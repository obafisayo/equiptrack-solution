'use client'

import { Input, Select } from '@/components/ui/Form'
import { INDUSTRIES, COUNTRIES } from './styleMaps'
import type { WizardForm } from './WizardForm'

interface WizardStepOrganisationProps {
  form: WizardForm
  onChange: <K extends keyof WizardForm>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function WizardStepOrganisation({ form, onChange }: WizardStepOrganisationProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Organisation Name <span className="text-brand-500">*</span></label>
        <Input value={form.name} onChange={onChange('name')} placeholder="e.g. Shell Nigeria Ltd" size="sm"/>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700">Industry <span className="text-brand-500">*</span></label>
          <Select aria-label="Industry" value={form.industry} onChange={onChange('industry')} size="sm">
            <option value="">Select...</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-700">Country <span className="text-brand-500">*</span></label>
          <Select aria-label="Country" value={form.country} onChange={onChange('country')} size="sm">
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Website</label>
        <Input value={form.website} onChange={onChange('website')} placeholder="https://..." type="url" size="sm"/>
      </div>
    </div>
  )
}
