'use client'

import { use } from 'react'
import { Users, UserPlus, Activity, CheckCircle2 } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'
import { OnboardingChecklist } from '@/components/orgadmin/OnboardingChecklist'
import { ORGANISATIONS, USERS, INVITATIONS, AUDIT_EVENTS, SSO_CONFIGS } from '@/lib/mock-platform'
import { TeamSnapshot } from './_components/TeamSnapshot'
import { SubscriptionCard } from './_components/SubscriptionCard'
import { QuickActionsPanel } from './_components/QuickActionsPanel'
import { RecentActivityCard } from './_components/RecentActivityCard'
import { PendingInvitesAlert } from './_components/PendingInvitesAlert'

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

  const scoreColor = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <div className="space-y-5">
      {/* Onboarding checklist - only for orgs still onboarding */}
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
        <TeamSnapshot orgSlug={orgSlug} members={members} />

        {/* Right: Subscription + Quick actions */}
        <div className="flex-[1] flex flex-col gap-4">
          <SubscriptionCard orgSlug={orgSlug} subscription={org.subscription} />
          <QuickActionsPanel orgSlug={orgSlug} />
        </div>
      </div>

      {/* Audit log snippet */}
      {recentAudit.length > 0 && (
        <RecentActivityCard orgSlug={orgSlug} events={recentAudit} />
      )}

      {/* Pending invites alert */}
      {pending.length > 0 && (
        <PendingInvitesAlert orgSlug={orgSlug} count={pending.length} />
      )}
    </div>
  )
}
