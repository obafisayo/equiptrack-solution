'use client'

import Link from 'next/link'
import {
  Building2, CheckCircle2, Users, DollarSign, Clock,
  User, Package, Globe, Plus, ChevronRight, ArrowUpRight,
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
  enterprise:    { className: 'bg-brand-50 text-brand-500',          label: 'Enterprise'   },
  professional:  { className: 'bg-status-info-bg text-status-info',  label: 'Professional' },
  starter:       { className: 'bg-neutral-100 text-neutral-500',     label: 'Starter'      },
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
  const pendingWaitlist = WAITLIST.filter(w => w.status === 'pending')
  const recentWaitlist  = WAITLIST.filter(w => w.status === 'pending').slice(0, 4)
  const recentAudit     = [...AUDIT_EVENTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6)

  return (
    <div className="space-y-6">

      {/* ── Action bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">Platform Overview</h1>
          <p className="text-xs text-neutral-500 mt-0.5">System-wide health and activity</p>
        </div>
        <Link
          href="/sysadmin/organisations?action=onboard"
          className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3.5 h-9 rounded-lg no-underline transition-colors"
        >
          <Plus size={13}/>
          Onboard Organisation
        </Link>
      </div>

      {/* ── KPI Strip ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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

      {/* ── Analytics Row: MRR chart + Waitlist ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* MRR Growth Chart */}
        <div className="bg-white rounded-card border border-border-default shadow-card p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-neutral-900">MRR Growth</p>
            <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              +12.4% MoM
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-5">Monthly recurring revenue — last 6 months</p>
          <BarChart
            data={MRR_HISTORY.map(m => ({
              label: m.label,
              value: Math.round(m.value / 1000 * 10) / 10,
            }))}
            color="#F04A4A"
            height={160}
          />
          <p className="text-[11px] text-neutral-400 text-center mt-2 font-medium">Values in $K</p>
        </div>

        {/* Tier breakdown + waitlist */}
        <div className="flex flex-col gap-4">

          {/* Tier breakdown */}
          <div className="bg-white rounded-card border border-border-default shadow-card p-5">
            <p className="text-sm font-bold text-neutral-900 mb-4">Subscription Mix</p>
            <div className="space-y-3">
              {[
                { label:'Enterprise',   count: ORGANISATIONS.filter(o=>o.subscription.tier==='enterprise').length,   color:'#F04A4A' },
                { label:'Professional', count: ORGANISATIONS.filter(o=>o.subscription.tier==='professional').length, color:'#3B82F6' },
                { label:'Starter',      count: ORGANISATIONS.filter(o=>o.subscription.tier==='starter').length,      color:'#9CA3AF' },
              ].map(tier => {
                const pct = Math.round((tier.count / ORGANISATIONS.length) * 100)
                return (
                  <div key={tier.label} className="flex items-center gap-3">
                    <span className="text-xs text-neutral-600 w-24 shrink-0">{tier.label}</span>
                    <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct + '%', backgroundColor: tier.color }}/>
                    </div>
                    <span className="text-xs font-bold text-neutral-900 w-7 text-right">{tier.count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Waitlist */}
          <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
              <p className="text-sm font-bold text-neutral-900">Pending Waitlist</p>
              <Link href="/sysadmin/waitlist" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline flex items-center gap-1">
                View all <ArrowUpRight size={11}/>
              </Link>
            </div>
            <div className="divide-y divide-border-default">
              {recentWaitlist.map(entry => {
                const priorityClass = PRIORITY_STYLE[entry.priority]
                return (
                  <div key={entry.id} className="px-5 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{entry.companyName}</p>
                      <p className="text-xs text-neutral-500">{entry.industry}</p>
                    </div>
                    <span className={['text-[10px] font-bold px-2 py-0.5 rounded-badge uppercase shrink-0', priorityClass].join(' ')}>
                      {entry.priority}
                    </span>
                    <Link
                      href="/sysadmin/waitlist"
                      className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 border border-border-default hover:border-border-strong px-2 py-1 rounded-md no-underline shrink-0 transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Organisation Health Table (full-width) ──────────────────────── */}
      <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-neutral-50">
          <div>
            <p className="text-sm font-bold text-neutral-900">Organisation Health</p>
            <p className="text-xs text-neutral-500 mt-0.5">All {ORGANISATIONS.length} organisations on platform</p>
          </div>
          <Link href="/sysadmin/organisations" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline flex items-center gap-1">
            Manage <ChevronRight size={12}/>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-border-default">
              <tr>
                {['Organisation', 'Tier', 'Status', 'Seats', 'MRR', 'Health', 'Last Active', ''].map(h => (
                  <th key={h} className="text-left whitespace-nowrap px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {ORGANISATIONS.map(org => {
                const tierStyle   = TIER_STYLE[org.subscription.tier] ?? TIER_STYLE.starter
                const statusKey   = org.subscription.status === 'trialing' ? 'trialing' : org.status
                const statusClass = ORG_STATUS_STYLE[statusKey] ?? ORG_STATUS_STYLE.active
                const scoreColor  = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'
                const mrr         = org.subscription.tier === 'enterprise' ? 1800 : org.subscription.tier === 'professional' ? 480 : 120

                return (
                  <tr key={org.id} className="hover:bg-neutral-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-brand-500">
                            {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">{org.name}</p>
                          <p className="text-[10px] text-neutral-400">{org.industry}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={['text-[11px] font-bold px-2 py-0.5 rounded-badge', tierStyle.className].join(' ')}>
                        {tierStyle.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={['text-[11px] font-bold px-2 py-0.5 rounded-badge capitalize', statusClass].join(' ')}>
                        {statusKey}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-700 font-medium text-xs">
                      {org.subscription.seatsUsed}/{org.subscription.seats}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-neutral-900">
                      ${mrr}/mo
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: org.healthScore + '%', backgroundColor: scoreColor }}/>
                        </div>
                        <span className="text-[11px] font-bold" style={{ color: scoreColor }}>{org.healthScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-400">
                      {relativeTime(org.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={'/sysadmin/organisations/' + org.id}
                        className="text-xs font-semibold text-brand-500 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-md no-underline transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Audit Events (full-width) ────────────────────────────── */}
      <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-neutral-50">
          <div>
            <p className="text-sm font-bold text-neutral-900">Recent Audit Events</p>
            <p className="text-xs text-neutral-500 mt-0.5">Last 6 platform actions</p>
          </div>
          <Link href="/sysadmin/audit" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline flex items-center gap-1">
            Full log <ChevronRight size={12}/>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-border-default">
              <tr>
                {['Time', 'Actor', 'Action', 'Target', 'IP Address'].map(h => (
                  <th key={h} className="text-left whitespace-nowrap px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {recentAudit.map(event => {
                const ttClass = TARGET_TYPE_STYLE[event.targetType] ?? TARGET_TYPE_STYLE.org
                return (
                  <tr key={event.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap" title={new Date(event.createdAt).toLocaleString()}>
                      {relativeTime(event.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-xs">{event.actorName}</span>
                        <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-1.5 py-0.5 rounded-badge">
                          {event.actorRole}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <code className="text-[11px] font-mono text-neutral-700 bg-neutral-50 px-1.5 py-0.5 rounded border border-border-default">
                        {event.action}
                      </code>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={['inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0', ttClass].join(' ')}>
                          {actionIcon(event)}
                        </span>
                        <span className="text-neutral-700 text-xs truncate max-w-40">{event.targetLabel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
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
