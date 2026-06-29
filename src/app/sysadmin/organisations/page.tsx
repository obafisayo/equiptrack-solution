/* eslint-disable */
'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Plus, X, Building2, CheckCircle2 } from 'lucide-react'
import { Input, Select, SearchInput } from '@/components/ui/Form'
import { ORGANISATIONS } from '@/lib/mock-platform'
import type { OrgStatus, SubscriptionTier } from '@/lib/types'

/* ── Style maps ───────────────────────────────────────────────────────────── */

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:     { bg: '#F0FDF4', color: '#16A34A', label: 'Active'     },
  onboarding: { bg: '#EFF6FF', color: '#2563EB', label: 'Onboarding' },
  suspended:  { bg: '#FEF2F2', color: '#DC2626', label: 'Suspended'  },
  waitlist:   { bg: '#FEF3C7', color: '#D97706', label: 'Waitlist'   },
  churned:    { bg: '#F9FAFB', color: '#6B7280', label: 'Churned'    },
}

const TIER_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  enterprise:   { bg: '#FFF1F1', color: '#F04A4A', label: 'Enterprise'   },
  professional: { bg: '#EFF6FF', color: '#2563EB', label: 'Professional' },
  starter:      { bg: '#F9FAFB', color: '#6B7280', label: 'Starter'      },
}

const SUB_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:   { bg: '#F0FDF4', color: '#16A34A', label: 'Active'    },
  trialing: { bg: '#F5F3FF', color: '#7C3AED', label: 'Trialing'  },
  past_due: { bg: '#FEF2F2', color: '#DC2626', label: 'Past Due'  },
  cancelled:{ bg: '#F9FAFB', color: '#6B7280', label: 'Cancelled' },
  suspended:{ bg: '#FEF2F2', color: '#DC2626', label: 'Suspended' },
}

/* ── Onboarding Wizard ────────────────────────────────────────────────────── */

const INDUSTRIES = ['Oil & Gas', 'Mining', 'Construction', 'Logistics', 'Manufacturing', 'Other']
const COUNTRIES  = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Angola', 'Egypt', 'Other']

const TIER_DETAILS = {
  starter:      { label:'Starter',      price:'$120/mo', seats:'Up to 15 seats',  color:'#6B7280', desc:'For small teams just getting started' },
  professional: { label:'Professional', price:'$480/mo', seats:'Up to 50 seats',  color:'#2563EB', desc:'For mid-sized operations with full module access' },
  enterprise:   { label:'Enterprise',   price:'$1,800/mo', seats:'Unlimited seats', color:'#F04A4A', desc:'For large operations with custom SLAs and priority support' },
}

const STEPS = ['Organisation', 'Admin Account', 'Subscription', 'Review']

interface WizardForm {
  name: string; industry: string; country: string; website: string
  adminName: string; adminEmail: string; adminPhone: string
  tier: SubscriptionTier; seats: string; billingContact: string; billingEmail: string
}

const EMPTY_FORM: WizardForm = {
  name:'', industry:'', country:'', website:'',
  adminName:'', adminEmail:'', adminPhone:'',
  tier:'starter', seats:'10', billingContact:'', billingEmail:'',
}

interface OnboardingWizardProps { onClose: () => void }

function OnboardingWizard({ onClose }: OnboardingWizardProps) {
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

  const td = TIER_DETAILS[form.tier]

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

        {/* Step indicator */}
        {!done && (
          <div className="flex items-center gap-0 px-6 py-3 border-b border-border-default bg-neutral-50 shrink-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-0 flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                    i < step ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-500 text-white' : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    {i < step ? <CheckCircle2 size={13}/> : i + 1}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${i === step ? 'text-brand-500' : 'text-neutral-400'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < step ? 'bg-brand-500' : 'bg-neutral-200'}`}/>
                )}
              </div>
            ))}
          </div>
        )}

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

            {/* Step 0: Organisation details */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Organisation Name <span className="text-brand-500">*</span></label>
                  <Input value={form.name} onChange={F('name')} placeholder="e.g. Shell Nigeria Ltd" size="sm"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700">Industry <span className="text-brand-500">*</span></label>
                    <Select aria-label="Industry" value={form.industry} onChange={F('industry')} size="sm">
                      <option value="">Select…</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700">Country <span className="text-brand-500">*</span></label>
                    <Select aria-label="Country" value={form.country} onChange={F('country')} size="sm">
                      <option value="">Select…</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Website</label>
                  <Input value={form.website} onChange={F('website')} placeholder="https://…" type="url" size="sm"/>
                </div>
              </div>
            )}

            {/* Step 1: Admin account */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800">
                  This person will receive a setup email and become the first admin for <strong>{form.name || 'this organisation'}</strong>.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Full Name <span className="text-brand-500">*</span></label>
                  <Input value={form.adminName} onChange={F('adminName')} placeholder="e.g. Kenneth Omireh" size="sm"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Work Email <span className="text-brand-500">*</span></label>
                  <Input type="email" value={form.adminEmail} onChange={F('adminEmail')} placeholder="admin@company.com" size="sm"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Phone</label>
                  <Input type="tel" value={form.adminPhone} onChange={F('adminPhone')} placeholder="+234 …" size="sm"/>
                </div>
              </div>
            )}

            {/* Step 2: Subscription */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-700 mb-2">Subscription Tier</p>
                  <div className="space-y-2">
                    {(Object.entries(TIER_DETAILS) as [SubscriptionTier, typeof TIER_DETAILS[SubscriptionTier]][]).map(([key, t]) => (
                      <button key={key} type="button" onClick={() => setForm(f => ({...f, tier:key}))}
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
                  <Input type="number" min={1} max={999} value={form.seats} onChange={F('seats')} size="sm" className="w-28"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Billing Contact Name</label>
                  <Input value={form.billingContact} onChange={F('billingContact')} placeholder="Finance manager name" size="sm"/>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-neutral-700">Billing Email</label>
                  <Input type="email" value={form.billingEmail} onChange={F('billingEmail')} placeholder="billing@company.com" size="sm"/>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
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
            )}
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-xs font-semibold text-neutral-900">{value}</span>
    </div>
  )
}

/* ── Confirm modal ────────────────────────────────────────────────────────── */

interface ConfirmModalProps {
  orgName: string
  action: 'suspend' | 'activate'
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({ orgName, action, onConfirm, onCancel }: ConfirmModalProps) {
  const isSuspend = action === 'suspend'
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12,
        padding: '28px 28px 24px', width: 400,
        boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: isSuspend ? '#FEF2F2' : '#F0FDF4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={18} color={isSuspend ? '#DC2626' : '#16A34A'} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
              {isSuspend ? 'Suspend Organisation' : 'Activate Organisation'}
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{orgName}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
          {isSuspend
            ? 'All users in this organisation will lose access immediately. Their data is retained and access can be restored.'
            : 'Users in this organisation will regain access. Any in-progress work orders will resume.'}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '9px 0', border: '1px solid #D1D5DB',
              borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600,
              color: '#374151', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 2, padding: '9px 0', border: 'none',
              borderRadius: 6, background: isSuspend ? '#EF4444' : '#16A34A',
              fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
            }}
          >
            {isSuspend ? 'Suspend Access' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

type FilterTab = 'all' | OrgStatus | 'trialing'

function OrganisationsPageInner() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [showPanel, setShowPanel] = useState(false)
  const [confirmFor, setConfirmFor] = useState<{ id: string; action: 'suspend' | 'activate' } | null>(null)
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (searchParams.get('action') === 'onboard') setShowPanel(true)
  }, [searchParams])

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all',        label: 'All',        count: ORGANISATIONS.length },
    { key: 'active',     label: 'Active',     count: ORGANISATIONS.filter(o => o.status === 'active').length },
    { key: 'onboarding', label: 'Onboarding', count: ORGANISATIONS.filter(o => o.status === 'onboarding').length },
    { key: 'trialing',   label: 'Trialing',   count: ORGANISATIONS.filter(o => o.subscription.status === 'trialing').length },
    { key: 'suspended',  label: 'Suspended',  count: ORGANISATIONS.filter(o => o.status === 'suspended').length },
  ]

  const filtered = ORGANISATIONS.filter(org => {
    const matchSearch = !search ||
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.adminEmail.toLowerCase().includes(search.toLowerCase())
    const matchTab =
      activeTab === 'all' ? true :
      activeTab === 'trialing' ? org.subscription.status === 'trialing' :
      org.status === activeTab
    return matchSearch && matchTab
  })

  function handleConfirm() {
    if (!confirmFor) return
    if (confirmFor.action === 'suspend') {
      setSuspendedIds(s => { const n = new Set(s); n.add(confirmFor.id); return n })
    } else {
      setSuspendedIds(s => { const n = new Set(s); n.delete(confirmFor.id); return n })
    }
    setConfirmFor(null)
  }

  return (
    <>
      {/* Onboarding wizard */}
      {showPanel && <OnboardingWizard onClose={() => setShowPanel(false)} />}

      {/* Confirm modal */}
      {confirmFor && (() => {
        const org = ORGANISATIONS.find(o => o.id === confirmFor.id)
        if (!org) return null
        return (
          <ConfirmModal
            orgName={org.name}
            action={confirmFor.action}
            onConfirm={handleConfirm}
            onCancel={() => setConfirmFor(null)}
          />
        )
      })()}

      <div className="space-y-5">
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: 360 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search organisations…"
              size="sm"
            />
          </div>
          <button
            onClick={() => setShowPanel(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', border: 'none', borderRadius: 7,
              background: '#F04A4A', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Plus size={15} />
            Add Organisation
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0' }}>
          {tabs.map(tab => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '9px 14px', border: 'none',
                  borderBottom: `2px solid ${active ? '#F04A4A' : 'transparent'}`,
                  marginBottom: -1,
                  background: 'transparent', cursor: 'pointer',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? '#F04A4A' : '#6B7280',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {tab.label}
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 9999,
                  background: active ? '#FFF1F1' : '#F3F4F6',
                  color: active ? '#F04A4A' : '#9CA3AF',
                }}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div className="bg-white rounded-card border border-border-default overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                  {['Organisation', 'Industry', 'Tier', 'Status', 'Billing', 'Seats', 'Health', 'Actions'].map(h => (
                    <th key={h} className="text-left whitespace-nowrap" style={{
                      padding: '10px 16px', fontSize: 11, fontWeight: 600,
                      color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                      No organisations match your filter.
                    </td>
                  </tr>
                )}
                {filtered.map(org => {
                  const isSuspended = suspendedIds.has(org.id) || org.status === 'suspended'
                  const statusKey = isSuspended ? 'suspended' : org.status
                  const ss = STATUS_STYLE[statusKey] ?? STATUS_STYLE.active
                  const ts = TIER_STYLE[org.subscription.tier] ?? TIER_STYLE.starter
                  const bs = SUB_STATUS_STYLE[org.subscription.status] ?? SUB_STATUS_STYLE.active
                  const scoreColor = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'

                  return (
                    <tr key={org.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: '#F04A4A18',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#F04A4A' }}>
                              {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{org.name}</p>
                            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0', fontFamily: 'monospace' }}>{org.adminEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{org.industry}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          background: ts.bg, color: ts.color, fontSize: 11, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 9999,
                        }}>{ts.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 9999, textTransform: 'capitalize',
                        }}>{ss.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          background: bs.bg, color: bs.color, fontSize: 11, fontWeight: 600,
                          padding: '2px 8px', borderRadius: 9999,
                        }}>{bs.label}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>
                        {org.subscription.seatsUsed}/{org.subscription.seats}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 52, height: 5, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${org.healthScore}%`, height: '100%', background: scoreColor, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor }}>{org.healthScore}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link
                            href={`/sysadmin/organisations/${org.id}`}
                            style={{
                              fontSize: 11, fontWeight: 600, color: '#F04A4A',
                              textDecoration: 'none', padding: '4px 10px',
                              background: '#FFF1F1', borderRadius: 5,
                            }}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => setConfirmFor({ id: org.id, action: isSuspended ? 'activate' : 'suspend' })}
                            style={{
                              fontSize: 11, fontWeight: 600,
                              color: isSuspended ? '#16A34A' : '#DC2626',
                              padding: '4px 10px',
                              background: isSuspended ? '#F0FDF4' : '#FEF2F2',
                              border: 'none', borderRadius: 5, cursor: 'pointer',
                            }}
                          >
                            {isSuspended ? 'Activate' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default function OrganisationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400 text-sm">Loading…</div>}>
      <OrganisationsPageInner />
    </Suspense>
  )
}
