'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, X, ChevronDown, Building2 } from 'lucide-react'
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

/* ── Add Org panel ────────────────────────────────────────────────────────── */

const INDUSTRIES = [
  'Oil & Gas', 'Mining', 'Construction', 'Logistics', 'Manufacturing', 'Other',
]

const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Angola', 'Egypt', 'Other',
]

interface AddOrgPanelProps {
  onClose: () => void
}

function AddOrgPanel({ onClose }: AddOrgPanelProps) {
  const [form, setForm] = useState({
    name: '', industry: '', country: '', tier: 'starter' as SubscriptionTier,
    seats: '10', adminEmail: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(onClose, 1500)
  }

  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }
  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB',
    borderRadius: 6, fontSize: 13, color: '#111827', background: '#fff',
    outline: 'none', boxSizing: 'border-box' as const,
  }

  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
        background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        zIndex: 100, display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 64, borderBottom: '1px solid #E2E8F0', flexShrink: 0,
      }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Add Organisation</p>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>Provision a new tenant</p>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      {submitted ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', background: '#F0FDF4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Organisation created</p>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>An invitation has been sent to the admin.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ flex: 1, overflow: 'auto', padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Organisation Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Shell Nigeria Ltd"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Admin Email *</label>
              <input
                required
                type="email"
                value={form.adminEmail}
                onChange={e => setForm(f => ({ ...f, adminEmail: e.target.value }))}
                placeholder="admin@company.com"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Industry</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: 28, cursor: 'pointer' }}
                  >
                    <option value="">Select…</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none', paddingRight: 28, cursor: 'pointer' }}
                  >
                    <option value="">Select…</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Subscription Tier</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {(['starter', 'professional', 'enterprise'] as SubscriptionTier[]).map(tier => {
                  const ts = TIER_STYLE[tier]
                  const selected = form.tier === tier
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tier }))}
                      style={{
                        padding: '8px 6px', border: `2px solid ${selected ? ts.color : '#E2E8F0'}`,
                        borderRadius: 6, background: selected ? ts.bg : '#fff',
                        cursor: 'pointer', textAlign: 'center',
                        fontSize: 12, fontWeight: selected ? 700 : 500,
                        color: selected ? ts.color : '#6B7280',
                      }}
                    >
                      {ts.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Seat Limit</label>
              <input
                type="number"
                min="1"
                max="500"
                value={form.seats}
                onChange={e => setForm(f => ({ ...f, seats: e.target.value }))}
                style={{ ...inputStyle, width: 120 }}
              />
            </div>
          </div>
        </form>
      )}

      {/* Footer */}
      {!submitted && (
        <div style={{
          display: 'flex', gap: 10, padding: '16px 20px',
          borderTop: '1px solid #E2E8F0', flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, padding: '9px 0', border: '1px solid #D1D5DB',
              borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600,
              color: '#374151', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-org-form"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(e as unknown as React.FormEvent)
            }}
            style={{
              flex: 2, padding: '9px 0', border: 'none',
              borderRadius: 6, background: '#F04A4A', fontSize: 13, fontWeight: 600,
              color: '#fff', cursor: 'pointer',
            }}
          >
            Create Organisation
          </button>
        </div>
      )}
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

export default function OrganisationsPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [showPanel, setShowPanel] = useState(false)
  const [confirmFor, setConfirmFor] = useState<{ id: string; action: 'suspend' | 'activate' } | null>(null)
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set())

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
      {/* Add panel overlay */}
      {showPanel && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.25)' }}
          onClick={() => setShowPanel(false)}
        />
      )}
      {showPanel && <AddOrgPanel onClose={() => setShowPanel(false)} />}

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
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search organisations…"
              style={{
                width: '100%', padding: '8px 12px 8px 32px',
                border: '1px solid #D1D5DB', borderRadius: 7,
                fontSize: 13, color: '#111827', background: '#fff',
                outline: 'none', boxSizing: 'border-box',
              }}
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
        <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
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
