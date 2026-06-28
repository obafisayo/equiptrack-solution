'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2, CheckCircle2, Users, DollarSign, Clock,
  User, Package, Globe,
} from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'
import { BarChart } from '@/components/domain/Charts'
import { PLATFORM_STATS, ORGANISATIONS, WAITLIST, AUDIT_EVENTS } from '@/lib/mock-platform'
import type { AuditEvent } from '@/lib/types'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function fmtMRR(n: number) {
  return '$' + n.toLocaleString('en-US')
}

function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
}

const ORG_STATUS_STYLE: Record<string, string> = {
  active:     'bg-status-success-bg text-status-success',
  onboarding: 'bg-status-info-bg text-status-info',
  suspended:  'bg-status-critical-bg text-status-critical',
  waitlist:   'bg-status-medium-bg text-status-medium',
  trialing:   'bg-brand-50 text-brand-500',
  churned:    'bg-neutral-100 text-neutral-500',
}

const TIER_STYLE: Record<string, { className: string; label: string }> = {
  enterprise:    { className: 'bg-brand-50 text-brand-500', label: 'Enterprise' },
  professional:  { className: 'bg-status-info-bg text-status-info', label: 'Professional' },
  starter:       { className: 'bg-neutral-100 text-neutral-500', label: 'Starter' },
}

const PRIORITY_STYLE: Record<string, string> = {
  high:   'bg-status-critical-bg text-status-critical',
  medium: 'bg-status-medium-bg text-status-medium',
  low:    'bg-neutral-100 text-neutral-500',
}

function actionIcon(event: AuditEvent) {
  if (event.targetType === 'user')         return <User size={13} />
  if (event.targetType === 'org')          return <Building2 size={13} />
  if (event.targetType === 'subscription') return <DollarSign size={13} />
  if (event.targetType === 'sso')         return <Globe size={13} />
  return <Package size={13} />
}

const TARGET_TYPE_STYLE: Record<string, string> = {
  user:         'bg-brand-50 text-brand-500',
  org:          'bg-status-info-bg text-status-info',
  workorder:    'bg-status-medium-bg text-status-medium',
  subscription: 'bg-status-success-bg text-status-success',
  sso:          'bg-neutral-100 text-neutral-600',
}

/* ── Mock 6-month MRR data ────────────────────────────────────────────────── */

const MRR_HISTORY = [
  { label: 'Jan', value: 2840 },
  { label: 'Feb', value: 3120 },
  { label: 'Mar', value: 3450 },
  { label: 'Apr', value: 3780 },
  { label: 'May', value: 4310 },
  { label: 'Jun', value: 4844 },
]

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function SysadminDashboard() {
  const [_hoveredOrgRow, setHoveredOrgRow] = useState<string | null>(null)

  const pendingWaitlist = WAITLIST.filter(w => w.status === 'pending')
  const recentWaitlist  = WAITLIST.filter(w => w.status === 'pending').slice(0, 4)
  const recentAudit     = [...AUDIT_EVENTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  return (
    <div className="space-y-6">

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Organisations"
          value={PLATFORM_STATS.totalOrgs}
          icon={Building2}
          color="#3B82F6"
          trend="+3 this month"
          trendPositive
        />
        <StatCard
          label="Active Orgs"
          value={PLATFORM_STATS.activeOrgs}
          icon={CheckCircle2}
          color="#10B981"
          trend={`${PLATFORM_STATS.activeOrgs}/${PLATFORM_STATS.totalOrgs} orgs`}
        />
        <StatCard
          label="Total Users"
          value={PLATFORM_STATS.totalUsers}
          icon={Users}
          color="#8B5CF6"
          trend="+5 this month"
          trendPositive
        />
        <StatCard
          label="Monthly Revenue"
          value={fmtMRR(PLATFORM_STATS.mrr)}
          icon={DollarSign}
          color="#F04A4A"
          trend="+12.4% MoM"
          trendPositive
        />
        <StatCard
          label="Waitlist Pending"
          value={pendingWaitlist.length}
          icon={Clock}
          color="#F59E0B"
          trend={`${PLATFORM_STATS.waitlistCount} total`}
        />
      </div>

      {/* ── Second Row ──────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Left: Organisation Health Table (60%) */}
        <div className="flex-[3] bg-white rounded-card border border-border-default shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-neutral-50">
            <div>
              <p className="text-sm font-bold text-neutral-900 m-0">Organisation Health</p>
              <p className="text-xs text-neutral-500 mt-0.5">All {ORGANISATIONS.length} organisations</p>
            </div>
            <Link href="/sysadmin/organisations" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-border-default">
                <tr>
                  {['Organisation', 'Tier', 'Status', 'Seats', 'Health', 'Action'].map(h => (
                    <th key={h} className="text-left whitespace-nowrap px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {ORGANISATIONS.map(org => {
                  const tierStyle = TIER_STYLE[org.subscription.tier] ?? TIER_STYLE.starter
                  const statusKey = org.subscription.status === 'trialing' ? 'trialing' : org.status
                  const statusClass = ORG_STATUS_STYLE[statusKey] ?? ORG_STATUS_STYLE.active
                  const scoreColor = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'

                  return (
                    <tr
                      key={org.id}
                      className="hover:bg-neutral-50 transition-colors"
                      onMouseEnter={() => setHoveredOrgRow(org.id)}
                      onMouseLeave={() => setHoveredOrgRow(null)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-brand-500">
                              {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-semibold text-neutral-900">{org.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={['text-[11px] font-bold px-2 py-0.5 rounded-badge', tierStyle.className].join(' ')}>
                          {tierStyle.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={['text-[11px] font-bold px-2 py-0.5 rounded-badge capitalize', statusClass].join(' ')}>
                          {statusKey}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-700 font-medium text-xs">
                        {org.subscription.seatsUsed}/{org.subscription.seats}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: org.healthScore + '%', backgroundColor: scoreColor }} />
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: scoreColor }}>
                            {org.healthScore}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={'/sysadmin/organisations/' + org.id}
                          className="text-xs font-semibold text-brand-500 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-md no-underline transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Two stacked cards (40%) */}
        <div className="flex-[2] flex flex-col gap-4">

          {/* Recent Waitlist */}
          <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-neutral-50">
              <p className="text-sm font-bold text-neutral-900 m-0">Recent Waitlist</p>
              <Link href="/sysadmin/waitlist" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline">
                View all
              </Link>
            </div>
            <div className="divide-y divide-border-default">
              {recentWaitlist.map(entry => {
                const priorityClass = PRIORITY_STYLE[entry.priority]
                return (
                  <div key={entry.id} className="p-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 m-0 truncate">
                        {entry.companyName}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">{entry.industry}</p>
                    </div>
                    <span className={['text-[10px] font-bold px-2 py-0.5 rounded-badge uppercase shrink-0', priorityClass].join(' ')}>
                      {entry.priority}
                    </span>
                    <Link
                      href="/sysadmin/waitlist"
                      className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 border border-border-default hover:border-border-strong px-2 py-1 rounded-md no-underline shrink-0 transition-colors bg-white"
                    >
                      Review
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-card border border-border-default shadow-card p-5">
            <p className="text-sm font-bold text-neutral-900 m-0 mb-1">MRR Growth</p>
            <p className="text-xs text-neutral-500 m-0 mb-4">Last 6 months</p>
            <BarChart
              data={MRR_HISTORY.map(m => ({
                label: m.label,
                value: Math.round(m.value / 1000 * 10) / 10,
              }))}
              color="#F04A4A"
              height={160}
            />
            <p className="text-[11px] text-neutral-400 text-center mt-2 font-medium">
              Values in $K
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent Audit Events ──────────────────────────────────────────── */}
      <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-neutral-50">
          <p className="text-sm font-bold text-neutral-900 m-0">Recent Audit Events</p>
          <Link href="/sysadmin/audit" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-border-default">
              <tr>
                {['Time', 'Actor', 'Action', 'Target', 'IP Address'].map(h => (
                  <th key={h} className="text-left whitespace-nowrap px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {recentAudit.map((event, _i) => {
                const ttClass = TARGET_TYPE_STYLE[event.targetType] ?? TARGET_TYPE_STYLE.org
                return (
                  <tr key={event.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap" title={new Date(event.createdAt).toLocaleString()}>
                      {relativeTime(event.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-xs">{event.actorName}</span>
                        <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-1.5 py-0.5 rounded-badge">
                          {event.actorRole}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[11px] font-mono text-neutral-700 bg-neutral-50 px-1.5 py-0.5 rounded border border-border-default">
                        {event.action}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={['inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0', ttClass].join(' ')}>
                          {actionIcon(event)}
                        </span>
                        <span className="text-neutral-700 text-xs truncate max-w-[160px]">
                          {event.targetLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 font-mono text-[11px]">
                      {event.ipAddress ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
