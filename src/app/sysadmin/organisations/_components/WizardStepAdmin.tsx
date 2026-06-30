'use client'

import { Input } from '@/components/ui/Form'
import type { WizardForm } from './WizardForm'

interface WizardStepAdminProps {
  form: WizardForm
  onChange: <K extends keyof WizardForm>(k: K) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export function WizardStepAdmin({ form, onChange }: WizardStepAdminProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800">
        This person will receive a setup email and become the first admin for <strong>{form.name || 'this organisation'}</strong>.
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Full Name <span className="text-brand-500">*</span></label>
        <Input value={form.adminName} onChange={onChange('adminName')} placeholder="e.g. Kenneth Omireh" size="sm"/>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Work Email <span className="text-brand-500">*</span></label>
        <Input type="email" value={form.adminEmail} onChange={onChange('adminEmail')} placeholder="admin@company.com" size="sm"/>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-neutral-700">Phone</label>
        <Input type="tel" value={form.adminPhone} onChange={onChange('adminPhone')} placeholder="+234 ..." size="sm"/>
      </div>
    </div>
  )
}
