'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Building2, Users, CreditCard, ShieldCheck, ScrollText } from 'lucide-react'
import { ORGANISATIONS, USERS, AUDIT_EVENTS, SSO_CONFIGS, INVITATIONS } from '@/lib/mock-platform'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins  = Math.floor(diff / 60000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
}

function fmtMRR(n: number) { return '$' + n.toLocaleString('en-US') }

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

const USER_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A' },
  invited:   { bg: '#EFF6FF', color: '#2563EB' },
  suspended: { bg: '#FEF2F2', color: '#DC2626' },
  inactive:  { bg: '#F9FAFB', color: '#6B7280' },
}

const ROLE_LABEL: Record<string, string> = {
  org_admin:            'Org Admin',
  requester:            'Requester',
  wh_supervisor:        'WH Supervisor',
  wh_personnel:         'WH Personnel',
  dsp_supervisor:       'DSP Supervisor',
  dsp_personnel:        'DSP Personnel',
  qaqc_officer:         'QAQC Officer',
  exec_viewer:          'Exec Viewer',
  safety_officer:       'Safety Officer',
  logistics_coordinator:'Logistics Coord.',
  inventory_manager:    'Inventory Mgr',
  rig_manager:          'Rig Manager',
  crane_operator:       'Crane Operator',
  maintenance_tech:     'Maintenance Tech',
}

const SUB_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A', label: 'Active'    },
  trialing:  { bg: '#F5F3FF', color: '#7C3AED', label: 'Trialing'  },
  past_due:  { bg: '#FEF2F2', color: '#DC2626', label: 'Past Due'  },
  cancelled: { bg: '#F9FAFB', color: '#6B7280', label: 'Cancelled' },
  suspended: { bg: '#FEF2F2', color: '#DC2626', label: 'Suspended' },
}

const FEATURE_LABELS: Record<string, string> = {
  sso_microsoft:      'Microsoft SSO',
  sso_google:         'Google SSO',
  api_access:         'API Access',
  advanced_analytics: 'Advanced Analytics',
  custom_sla:         'Custom SLA',
  audit_log:          'Audit Log',
  priority_support:   'Priority Support',
  white_label:        'White Label',
  bulk_import:        'Bulk Import',
  webhooks:           'Webhooks',
}

/* ── Tab types ────────────────────────────────────────────────────────────── */

type Tab = 'overview' | 'team' | 'subscription' | 'sso' | 'audit'

const TABS: { key: Tab; label: string; icon: typeof Building2 }[] = [
  { key: 'overview',     label: 'Overview',     icon: Building2    },
  { key: 'team',         label: 'Team',         icon: Users        },
  { key: 'subscription', label: 'Subscription', icon: CreditCard   },
  { key: 'sso',          label: 'SSO Config',   icon: ShieldCheck  },
  { key: 'audit',        label: 'Audit Log',    icon: ScrollText   },
]

/* ── Overview tab ─────────────────────────────────────────────────────────── */

function OverviewTab({ org }: { org: NonNullable<ReturnType<typeof ORGANISATIONS.find>> }) {
  const ts = TIER_STYLE[org.subscription.tier] ?? TIER_STYLE.starter
  const ss = STATUS_STYLE[org.status] ?? STATUS_STYLE.active
  const scoreColor = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'

  const kpis = [
    { label: 'Active Work Orders', value: org.activeWorkOrders, color: '#3B82F6' },
    { label: 'Team Members',       value: org.memberCount,       color: '#8B5CF6' },
    { label: 'Health Score',       value: org.healthScore,       color: scoreColor },
    { label: 'Seat Usage',
      value: `${org.subscription.seatsUsed}/${org.subscription.seats}`,
      color: '#F59E0B' },
  ]

  return (
    <div className="space-y-5">
      {/* Info card */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: 'Industry',   value: org.industry },
            { label: 'Country',    value: org.country  },
            { label: 'Timezone',   value: org.timezone },
            { label: 'Admin Email', value: org.adminEmail },
            { label: 'Created',    value: fmtDate(org.createdAt) },
            { label: 'Onboarded',  value: org.onboardedAt ? fmtDate(org.onboardedAt) : 'Not yet' },
            { label: 'Status',     value: (
              <span style={{
                background: ss.bg, color: ss.color, fontSize: 12, fontWeight: 600,
                padding: '2px 8px', borderRadius: 9999,
              }}>{ss.label}</span>
            )},
            { label: 'Tier', value: (
              <span style={{
                background: ts.bg, color: ts.color, fontSize: 12, fontWeight: 600,
                padding: '2px 8px', borderRadius: 9999,
              }}>{ts.label}</span>
            )},
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                {item.label}
              </p>
              {typeof item.value === 'string' ? (
                <p style={{ fontSize: 13, color: '#111827', margin: 0 }}>{item.value}</p>
              ) : item.value}
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} style={{
            background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
            padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: k.color, margin: '0 0 4px', lineHeight: 1 }}>
              {k.value}
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Health bar */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>Health Score</p>
          <span style={{ fontSize: 20, fontWeight: 700, color: scoreColor }}>{org.healthScore}</span>
        </div>
        <div style={{ height: 10, background: '#F3F4F6', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ width: `${org.healthScore}%`, height: '100%', background: scoreColor, borderRadius: 5 }} />
        </div>
        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
          {org.healthScore >= 80 ? 'Healthy — no issues detected.'
            : org.healthScore >= 50 ? 'Moderate — monitor closely.'
            : 'At risk — action required.'}
        </p>
      </div>
    </div>
  )
}

/* ── Team tab ─────────────────────────────────────────────────────────────── */

function TeamTab({ orgId }: { orgId: string }) {
  const members = USERS.filter(u => u.orgId === orgId)
  const orgInvitations = INVITATIONS.filter(i => i.orgId === orgId)

  return (
    <div className="space-y-5">
      {/* Members table */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Team Members ({members.length})</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                {['Name', 'Email', 'Role', 'Auth', 'Status', 'Last Login'].map(h => (
                  <th key={h} className="text-left whitespace-nowrap" style={{
                    padding: '9px 16px', fontSize: 11, fontWeight: 600,
                    color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(user => {
                const us = USER_STATUS_STYLE[user.status] ?? USER_STATUS_STYLE.active
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                    <td style={{ padding: '11px 16px', fontWeight: 600, color: '#111827' }}>
                      {user.displayName}
                    </td>
                    <td style={{ padding: '11px 16px', color: '#6B7280', fontFamily: 'monospace', fontSize: 12 }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        background: '#F1F5F9', color: '#475569',
                        fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                      }}>
                        {ROLE_LABEL[user.role] ?? user.role}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12, textTransform: 'capitalize' }}>
                      {user.authProvider}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        background: us.bg, color: us.color,
                        fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, textTransform: 'capitalize',
                      }}>{user.status}</span>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>
                      {user.lastActiveAt ? relativeTime(user.lastActiveAt) : 'Never'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending invitations */}
      {orgInvitations.length > 0 && (
        <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Pending Invitations ({orgInvitations.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                  {['Email', 'Role', 'Invited by', 'Expires', 'Auth', 'Status'].map(h => (
                    <th key={h} className="text-left whitespace-nowrap" style={{
                      padding: '9px 16px', fontSize: 11, fontWeight: 600,
                      color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orgInvitations.map(inv => {
                  const inviterName = USERS.find(u => u.id === inv.invitedBy)?.displayName ?? inv.invitedBy
                  const invStyle = inv.status === 'pending'
                    ? { bg: '#FEF3C7', color: '#D97706' }
                    : inv.status === 'accepted'
                    ? { bg: '#F0FDF4', color: '#16A34A' }
                    : { bg: '#FEF2F2', color: '#DC2626' }
                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '11px 16px', color: '#374151', fontFamily: 'monospace', fontSize: 12 }}>{inv.email}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{
                          background: '#F1F5F9', color: '#475569',
                          fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                        }}>{ROLE_LABEL[inv.role] ?? inv.role}</span>
                      </td>
                      <td style={{ padding: '11px 16px', color: '#6B7280' }}>{inviterName}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>{fmtDate(inv.expiresAt)}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12, textTransform: 'capitalize' }}>{inv.authMethod.replace('_', ' ')}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{
                          background: invStyle.bg, color: invStyle.color,
                          fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, textTransform: 'capitalize',
                        }}>{inv.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Subscription tab ─────────────────────────────────────────────────────── */

function SubscriptionTab({ org }: { org: NonNullable<ReturnType<typeof ORGANISATIONS.find>> }) {
  const sub = org.subscription
  const ts  = TIER_STYLE[sub.tier] ?? TIER_STYLE.starter
  const bs  = SUB_STATUS_STYLE[sub.status] ?? SUB_STATUS_STYLE.active
  const seatPct = Math.round((sub.seatsUsed / sub.seats) * 100)
  const seatColor = seatPct >= 90 ? '#EF4444' : seatPct >= 70 ? '#F59E0B' : '#10B981'

  return (
    <div className="space-y-5">
      {/* Billing overview */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>Billing Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Tier',         value: <span style={{ background: ts.bg, color: ts.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{ts.label}</span> },
            { label: 'Status',       value: <span style={{ background: bs.bg, color: bs.color, fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 9999 }}>{bs.label}</span> },
            { label: 'Monthly Price', value: <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>{fmtMRR(sub.monthlyPrice)}</span> },
            { label: 'Cycle Ends',   value: <span style={{ fontSize: 13, color: '#374151' }}>{fmtDate(sub.billingCycleEnd)}</span> },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                {item.label}
              </p>
              {item.value}
            </div>
          ))}
        </div>
      </div>

      {/* Seat usage */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Seat Usage</p>
          <span style={{ fontSize: 13, fontWeight: 700, color: seatColor }}>{sub.seatsUsed} / {sub.seats}</span>
        </div>
        <div style={{ height: 10, background: '#F3F4F6', borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ width: `${seatPct}%`, height: '100%', background: seatColor, borderRadius: 5 }} />
        </div>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{seatPct}% of seats used</p>
      </div>

      {/* Plan features */}
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-5"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 14px' }}>Included Features</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(FEATURE_LABELS).map(([key, label]) => {
            const included = sub.features.includes(key as Parameters<typeof sub.features.includes>[0])
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  background: included ? '#F0FDF4' : '#F3F4F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {included ? (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <polyline points="2 6 5 9 10 3" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                      <line x1="2" y1="2" x2="10" y2="10" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="10" y1="2" x2="2" y2="10" stroke="#D1D5DB" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 12, color: included ? '#111827' : '#9CA3AF' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── SSO tab ──────────────────────────────────────────────────────────────── */

function SSOTab({ orgId }: { orgId: string }) {
  const sso = SSO_CONFIGS.find(s => s.orgId === orgId)

  if (!sso) {
    return (
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-10 text-center"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
        }}>
          <ShieldCheck size={22} color="#9CA3AF" />
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>No SSO configured</p>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
          This organisation has not set up Single Sign-On.
        </p>
      </div>
    )
  }

  const verifiedStyle = sso.status === 'verified'
    ? { bg: '#F0FDF4', color: '#16A34A', label: 'Verified' }
    : sso.status === 'error'
    ? { bg: '#FEF2F2', color: '#DC2626', label: 'Error' }
    : { bg: '#FEF3C7', color: '#D97706', label: 'Pending' }

  const fields = [
    { label: 'Provider',          value: sso.provider === 'microsoft' ? 'Microsoft Azure AD' : 'Google Workspace' },
    { label: 'Tenant ID',         value: sso.tenantId },
    { label: 'Client ID',         value: sso.clientId, mono: true },
    { label: 'Status',            value: null as null },
    { label: 'Auto-provision',    value: sso.autoProvision ? 'Enabled' : 'Disabled' },
    { label: 'Default Role',      value: ROLE_LABEL[sso.defaultRole] ?? sso.defaultRole },
    { label: 'Verified At',       value: sso.verifiedAt ? fmtDate(sso.verifiedAt) : '—' },
    { label: 'Allowed Domains',   value: sso.allowedDomains.join(', ') || '—' },
  ]

  return (
    <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 18px' }}>SSO Configuration</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map(f => (
          <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              {f.label}
            </p>
            {f.label === 'Status' ? (
              <span style={{
                display: 'inline-block', width: 'fit-content',
                background: verifiedStyle.bg, color: verifiedStyle.color,
                fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
              }}>
                {verifiedStyle.label}
              </span>
            ) : (
              <p style={{
                fontSize: 13, color: '#111827', margin: 0,
                fontFamily: f.mono ? 'monospace' : undefined,
              }}>
                {f.value ?? '—'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Audit tab ────────────────────────────────────────────────────────────── */

function AuditTab({ orgId }: { orgId: string }) {
  const events = AUDIT_EVENTS.filter(e => e.orgId === orgId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-[8px] border border-[#E2E8F0] p-10 text-center"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>No audit events for this organisation.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              {['Time', 'Actor', 'Action', 'Target', 'IP'].map(h => (
                <th key={h} className="text-left whitespace-nowrap" style={{
                  padding: '10px 16px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                <td style={{ padding: '11px 16px', color: '#6B7280', whiteSpace: 'nowrap', fontSize: 12 }}>
                  {relativeTime(e.createdAt)}
                </td>
                <td style={{ padding: '11px 16px', fontWeight: 500, color: '#111827' }}>{e.actorName}</td>
                <td style={{ padding: '11px 16px' }}>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151' }}>{e.action}</code>
                </td>
                <td style={{ padding: '11px 16px', color: '#374151' }}>{e.targetLabel}</td>
                <td style={{ padding: '11px 16px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11 }}>
                  {e.ipAddress ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function OrgDetailPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const org = ORGANISATIONS.find(o => o.id === orgId)

  if (!org) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#6B7280' }}>Organisation not found.</p>
        <Link href="/sysadmin/organisations" style={{ fontSize: 13, color: '#F04A4A', fontWeight: 600 }}>
          Back to Organisations
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <Link
          href="/sysadmin/organisations"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: '#6B7280', textDecoration: 'none', marginBottom: 12,
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#111827')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#6B7280')}
        >
          <ArrowLeft size={13} />
          All Organisations
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: '#F04A4A18', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#F04A4A' }}>
              {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{org.name}</h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
              {org.industry} · {org.country} · ID: <code style={{ fontFamily: 'monospace', fontSize: 11 }}>{org.id}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0' }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', border: 'none',
                borderBottom: `2px solid ${active ? '#F04A4A' : 'transparent'}`,
                marginBottom: -1,
                background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? '#F04A4A' : '#6B7280',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview'     && <OverviewTab org={org} />}
      {activeTab === 'team'         && <TeamTab orgId={org.id} />}
      {activeTab === 'subscription' && <SubscriptionTab org={org} />}
      {activeTab === 'sso'          && <SSOTab orgId={org.id} />}
      {activeTab === 'audit'        && <AuditTab orgId={org.id} />}
    </div>
  )
}
