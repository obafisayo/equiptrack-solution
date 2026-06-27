'use client'

import { use } from 'react'
import Link from 'next/link'
import {
  Users, UserPlus, ShieldCheck, Activity, CheckCircle2, Clock, AlertTriangle,
} from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'
import { OnboardingChecklist } from '@/components/orgadmin/OnboardingChecklist'
import { ORGANISATIONS, USERS, INVITATIONS, AUDIT_EVENTS, SSO_CONFIGS } from '@/lib/mock-platform'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins  = Math.floor(diff / 60000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
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

const USER_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A' },
  invited:   { bg: '#EFF6FF', color: '#2563EB' },
  suspended: { bg: '#FEF2F2', color: '#DC2626' },
  inactive:  { bg: '#F9FAFB', color: '#6B7280' },
}

/* ── Quick action card ────────────────────────────────────────────────────── */

function QuickAction({ href, icon, label, description, color }: {
  href: string
  icon: React.ReactNode
  label: string
  description: string
  color: string
}) {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)')}
    >
      <div style={{
        background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
        padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'box-shadow 150ms ease',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{label}</p>
          <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>{description}</p>
        </div>
      </div>
    </Link>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function OrgAdminOverview({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)

  const org = ORGANISATIONS.find(o => o.slug === orgSlug)

  if (!org) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 15, color: '#6B7280' }}>Organisation not found.</p>
      </div>
    )
  }

  const members   = USERS.filter(u => u.orgId === org.id)
  const active    = members.filter(u => u.status === 'active')
  const pending   = INVITATIONS.filter(i => i.orgId === org.id && i.status === 'pending')
  const ssoConfig = SSO_CONFIGS.find(s => s.orgId === org.id)
  const recentAudit = AUDIT_EVENTS
    .filter(e => e.orgId === org.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const seatPct   = Math.round((org.subscription.seatsUsed / org.subscription.seats) * 100)
  const seatColor = seatPct >= 90 ? '#EF4444' : seatPct >= 70 ? '#F59E0B' : '#10B981'
  const scoreColor = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'

  const tierLabel: Record<string, string> = {
    enterprise: 'Enterprise', professional: 'Professional', starter: 'Starter',
  }
  const subLabel: Record<string, string> = {
    active: 'Active', trialing: 'Trialing', past_due: 'Past Due',
    cancelled: 'Cancelled', suspended: 'Suspended',
  }

  return (
    <div className="space-y-5">
      {/* Onboarding checklist — only for orgs still onboarding */}
      {org.status === 'onboarding' && (
        <OnboardingChecklist
          orgSlug={orgSlug}
          hasSSOConfigured={ssoConfig?.status === 'verified'}
          hasMembersInvited={members.filter(u => u.role !== 'org_admin').length > 0}
          hasWorkOrders={org.activeWorkOrders > 0}
        />
      )}

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Team Members"    value={members.length}        icon={Users}         color="#3B82F6" trend={`${active.length} active`} />
        <StatCard label="Pending Invites" value={pending.length}        icon={UserPlus}      color="#F59E0B" trend={`${org.subscription.seatsUsed}/${org.subscription.seats} seats`} />
        <StatCard label="Active Orders"   value={org.activeWorkOrders}  icon={Activity}      color="#F04A4A" />
        <StatCard label="Health Score"    value={org.healthScore}       icon={CheckCircle2}  color={scoreColor} />
      </div>

      {/* Middle row */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Team snapshot */}
        <div className="flex-[2] bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Team ({members.length})</p>
            <Link href={`/${orgSlug}/admin/team`} style={{ fontSize: 12, color: '#F04A4A', fontWeight: 600, textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                  {['Name', 'Role', 'Status', 'Last Active'].map(h => (
                    <th key={h} className="text-left whitespace-nowrap" style={{
                      padding: '9px 16px', fontSize: 11, fontWeight: 600,
                      color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.slice(0, 6).map(user => {
                  const us = USER_STATUS_STYLE[user.status] ?? USER_STATUS_STYLE.active
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: '#111827' }}>{user.displayName}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          background: '#F1F5F9', color: '#475569',
                          fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                        }}>{ROLE_LABEL[user.role] ?? user.role}</span>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          background: us.bg, color: us.color,
                          fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, textTransform: 'capitalize',
                        }}>{user.status}</span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#6B7280', fontSize: 12 }}>
                        {user.lastActiveAt ? relativeTime(user.lastActiveAt) : 'Never'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Subscription + Quick actions */}
        <div className="flex-[1] flex flex-col gap-4">

          {/* Subscription card */}
          <div style={{
            background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
            padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 14px' }}>Subscription</p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <span style={{
                background: '#FFF1F1', color: '#F04A4A', fontSize: 12, fontWeight: 700,
                padding: '3px 10px', borderRadius: 9999,
              }}>{tierLabel[org.subscription.tier]}</span>
              <span style={{
                background: '#F0FDF4', color: '#16A34A', fontSize: 12, fontWeight: 700,
                padding: '3px 10px', borderRadius: 9999,
              }}>{subLabel[org.subscription.status] ?? org.subscription.status}</span>
            </div>

            <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
              Seat Usage
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, height: 7, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${seatPct}%`, height: '100%', background: seatColor, borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: seatColor, flexShrink: 0 }}>
                {org.subscription.seatsUsed}/{org.subscription.seats}
              </span>
            </div>

            {seatPct >= 80 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 10px', background: '#FEF3C7',
                borderRadius: 6, border: '1px solid #FCD34D',
              }}>
                <AlertTriangle size={13} color="#D97706" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: '#92400E', margin: 0 }}>
                  {seatPct}% of seats used — consider upgrading.
                </p>
              </div>
            )}

            <Link
              href={`/${orgSlug}/admin/billing`}
              style={{
                display: 'block', marginTop: 12, textAlign: 'center',
                padding: '8px 0', background: '#F04A4A', color: '#fff',
                borderRadius: 6, fontSize: 12, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Manage Billing
            </Link>
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <QuickAction
              href={`/${orgSlug}/admin/invite`}
              icon={<UserPlus size={17} color="#F04A4A" />}
              label="Invite Member"
              description="Add a new team member"
              color="#F04A4A"
            />
            <QuickAction
              href={`/${orgSlug}/admin/sso`}
              icon={<ShieldCheck size={17} color="#2563EB" />}
              label="SSO Settings"
              description="Configure Microsoft SSO"
              color="#2563EB"
            />
          </div>
        </div>
      </div>

      {/* Audit log snippet */}
      {recentAudit.length > 0 && (
        <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Recent Activity</p>
            <Link href={`/${orgSlug}/admin/audit`} style={{ fontSize: 12, color: '#F04A4A', fontWeight: 600, textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {recentAudit.map(e => (
              <div key={e.id} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                    <strong style={{ color: '#111827' }}>{e.actorName}</strong>{' '}
                    <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#6B7280' }}>{e.action}</code>{' '}
                    {e.targetLabel}
                  </p>
                </div>
                <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>
                  {relativeTime(e.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending invites alert */}
      {pending.length > 0 && (
        <div style={{
          background: '#FFFBEB', borderRadius: 8, border: '1px solid #FCD34D',
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Clock size={18} color="#D97706" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#92400E', margin: 0 }}>
              {pending.length} pending invitation{pending.length > 1 ? 's' : ''}
            </p>
            <p style={{ fontSize: 12, color: '#B45309', margin: '2px 0 0' }}>
              These invites will expire if not accepted.
            </p>
          </div>
          <Link
            href={`/${orgSlug}/admin/team`}
            style={{
              fontSize: 12, fontWeight: 600, color: '#D97706',
              textDecoration: 'none', padding: '5px 12px',
              border: '1px solid #FCD34D', borderRadius: 6,
              background: '#FEF3C7', flexShrink: 0,
            }}
          >
            Review
          </Link>
        </div>
      )}
    </div>
  )
}
