/* eslint-disable */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthLeftPanel } from '@/components/layout/AuthLeftPanel'
import { Input, Select, Textarea } from '@/components/ui/Form'

const INDUSTRIES = ['Oil & Gas', 'Mining', 'Marine / Offshore', 'Construction', 'Logistics & Transport', 'Manufacturing', 'Energy', 'Other']
const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '500+']
const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Angola', 'Egypt', 'Cameroon', 'Ivory Coast', 'United Kingdom', 'UAE', 'Other']
const USE_CASES = [
  'Equipment lifecycle tracking',
  'Warehouse & dispatch management',
  'QAQC & compliance management',
  'Maintenance scheduling',
  'Safety & HSE management',
  'Inventory & stock management',
  'Executive reporting & analytics',
]

export default function WaitlistPage() {
  const [step, setStep] = useState(0) // 0 = company, 1 = contact, 2 = use case, 3 = done
  const [form, setForm] = useState({
    companyName: '', industry: '', country: '', companySize: '', website: '',
    contactName: '', contactEmail: '', contactPhone: '', jobTitle: '',
    useCases: [] as string[], additionalInfo: '',
  })

  const F = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  function toggleUseCase(uc: string) {
    setForm(f => ({
      ...f,
      useCases: f.useCases.includes(uc) ? f.useCases.filter(u => u !== uc) : [...f.useCases, uc],
    }))
  }

  function canNext() {
    if (step === 0) return form.companyName.trim() !== '' && form.industry !== '' && form.country !== '' && form.companySize !== ''
    if (step === 1) return form.contactName.trim() !== '' && form.contactEmail.includes('@')
    if (step === 2) return form.useCases.length > 0
    return true
  }

  function next(e: React.FormEvent) {
    e.preventDefault()
    if (step < 2) { setStep(s => s + 1); return }
    setStep(3)
  }

  const STEPS = ['Company', 'Contact', 'Use Case']

  const labelCls = 'block text-[13px] font-semibold text-neutral-700 mb-1.5'

  return (
    <div className="h-screen flex overflow-hidden">
      <AuthLeftPanel />

      {/* Right panel — independently scrollable */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex flex-col items-center justify-center px-10 py-12">
        <div className="w-full max-w-110">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-[9px] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
                <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
                <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
              </svg>
            </div>
          </div>

          {step < 3 ? (
            <>
              <h1 className="text-[24px] font-bold text-neutral-900 text-center tracking-tight m-0 mb-1.5">
                Join the Waitlist
              </h1>
              <p className="text-sm text-neutral-500 text-center mb-7 leading-relaxed m-0">
                Tell us about your company and we will get you set up on Equiptrack
              </p>

              {/* Step indicators */}
              <div className="flex items-center mb-7">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                        i < step ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-500 text-white' : 'bg-neutral-200 text-neutral-400'
                      }`}>
                        {i < step ? (
                          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : i + 1}
                      </div>
                      <span className={`text-[10px] font-semibold mt-1 ${i === step ? 'text-brand-500' : 'text-neutral-400'}`}>{s}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 mb-4 ${i < step ? 'bg-brand-500' : 'bg-neutral-200'}`}/>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={next} className="space-y-4">

                {/* Step 0: Company */}
                {step === 0 && (
                  <>
                    <div>
                      <label className={labelCls}>Company Name <span className="text-brand-500">*</span></label>
                      <Input value={form.companyName} onChange={F('companyName')} placeholder="e.g. Shell Nigeria Ltd" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Industry <span className="text-brand-500">*</span></label>
                        <Select aria-label="Industry" value={form.industry} onChange={F('industry')} required>
                          <option value="">Select…</option>
                          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </Select>
                      </div>
                      <div>
                        <label className={labelCls}>Country <span className="text-brand-500">*</span></label>
                        <Select aria-label="Country" value={form.country} onChange={F('country')} required>
                          <option value="">Select…</option>
                          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Company Size <span className="text-brand-500">*</span></label>
                      <div className="flex gap-2 flex-wrap">
                        {COMPANY_SIZES.map(size => (
                          <button key={size} type="button" onClick={() => setForm(f => ({...f, companySize: size}))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                              form.companySize === size
                                ? 'bg-brand-500 border-brand-500 text-white'
                                : 'bg-white border-neutral-300 text-neutral-600 hover:border-neutral-400'
                            }`}>
                            {size} employees
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Website <span className="text-neutral-400 font-normal">(optional)</span></label>
                      <Input type="url" value={form.website} onChange={F('website')} placeholder="https://yourcompany.com" />
                    </div>
                  </>
                )}

                {/* Step 1: Contact */}
                {step === 1 && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800">
                      This will be the primary contact for <strong>{form.companyName}</strong> on Equiptrack.
                    </div>
                    <div>
                      <label className={labelCls}>Full Name <span className="text-brand-500">*</span></label>
                      <Input value={form.contactName} onChange={F('contactName')} placeholder="e.g. Kenneth Omireh" required />
                    </div>
                    <div>
                      <label className={labelCls}>Work Email <span className="text-brand-500">*</span></label>
                      <Input type="email" value={form.contactEmail} onChange={F('contactEmail')} placeholder="you@company.com" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Phone</label>
                        <Input type="tel" value={form.contactPhone} onChange={F('contactPhone')} placeholder="+234 …" />
                      </div>
                      <div>
                        <label className={labelCls}>Job Title</label>
                        <Input value={form.jobTitle} onChange={F('jobTitle')} placeholder="e.g. Operations Manager" />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Use case */}
                {step === 2 && (
                  <>
                    <div>
                      <label className={labelCls}>What will you use Equiptrack for? <span className="text-brand-500">*</span></label>
                      <p className="text-[11px] text-neutral-400 mb-2">Select all that apply</p>
                      <div className="space-y-2">
                        {USE_CASES.map(uc => (
                          <button key={uc} type="button" onClick={() => toggleUseCase(uc)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                              form.useCases.includes(uc)
                                ? 'bg-brand-50 border-brand-400 text-brand-800'
                                : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                            }`}>
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              form.useCases.includes(uc) ? 'bg-brand-500 border-brand-500' : 'border-neutral-300'
                            }`}>
                              {form.useCases.includes(uc) && (
                                <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                              )}
                            </div>
                            <span className="text-sm font-medium">{uc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Anything else you want us to know?</label>
                      <Textarea value={form.additionalInfo} onChange={F('additionalInfo')} rows={3}
                        placeholder="Describe your operational context, scale, or specific challenges…"
                        className="resize-none" />
                    </div>
                  </>
                )}

                {/* Navigation */}
                <div className="flex gap-3 pt-1">
                  {step > 0 && (
                    <button type="button" onClick={() => setStep(s => s - 1)}
                      className="flex-1 h-10 border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
                      Back
                    </button>
                  )}
                  <button type="submit" disabled={!canNext()}
                    className={`flex-[2] h-10 rounded-lg text-sm font-semibold text-white transition-colors ${
                      canNext() ? 'bg-brand-500 hover:bg-brand-600' : 'bg-neutral-300 cursor-not-allowed'
                    }`}>
                    {step < 2 ? 'Continue' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Done state */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={2.5} strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">You are on the waitlist!</h2>
              <p className="text-sm text-neutral-500 leading-relaxed mb-2">
                We have received your application for <strong className="text-neutral-800">{form.companyName}</strong>.
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed mb-7">
                Our team will review your details and reach out to <strong className="text-neutral-800">{form.contactEmail}</strong> within 2 business days.
              </p>
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-left mb-6 space-y-1">
                <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">What happens next</p>
                {['Our team reviews your application', 'We schedule an onboarding call', 'Your organisation goes live on Equiptrack'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-neutral-700">
                    <span className="w-5 h-5 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-[10px] font-bold text-brand-500 shrink-0">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
              <Link href="/login" className="inline-block text-sm font-semibold text-brand-500 no-underline hover:text-brand-600">
                Back to login
              </Link>
            </div>
          )}

          {step < 3 && (
            <p className="text-[13px] text-neutral-500 text-center mt-5">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-500 font-semibold no-underline hover:text-brand-600">
                Sign in
              </Link>
            </p>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
