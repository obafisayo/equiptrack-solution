'use client'

import { WAITLIST, AUDIT_EVENTS } from '@/lib/mock-platform'
import { ActionBar } from './_components/ActionBar'
import { KpiStrip } from './_components/KpiStrip'
import { MrrGrowthCard } from './_components/MrrGrowthCard'
import { SubscriptionMixCard } from './_components/SubscriptionMixCard'
import { PendingWaitlistCard } from './_components/PendingWaitlistCard'
import { OrganisationHealthTable } from './_components/OrganisationHealthTable'
import { RecentAuditEventsTable } from './_components/RecentAuditEventsTable'

export default function SysadminDashboard() {
  const pendingWaitlist = WAITLIST.filter(w => w.status === 'pending')
  const recentWaitlist  = WAITLIST.filter(w => w.status === 'pending').slice(0, 4)
  const recentAudit     = [...AUDIT_EVENTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 6)

  return (
    <div className="space-y-6">
      <ActionBar />

      <KpiStrip pendingWaitlistCount={pendingWaitlist.length} />

      {/* Analytics Row: MRR chart + Waitlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MrrGrowthCard />

        <div className="flex flex-col gap-4">
          <SubscriptionMixCard />
          <PendingWaitlistCard entries={recentWaitlist} />
        </div>
      </div>

      <OrganisationHealthTable />

      <RecentAuditEventsTable events={recentAudit} />
    </div>
  )
}
