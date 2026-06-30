'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { OrgPageHeader } from './_components/OrgPageHeader'
import { OrgTabNav } from './_components/OrgTabNav'
import { OverviewTab } from './_components/OverviewTab'
import { TeamTab } from './_components/TeamTab'
import { SubscriptionTab } from './_components/SubscriptionTab'
import { SSOTab } from './_components/SSOTab'
import { AuditTab } from './_components/AuditTab'
import type { Tab } from './_components/types'

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
      <OrgPageHeader org={org} />

      <OrgTabNav active={activeTab} onSelect={setActiveTab} />

      {activeTab === 'overview'     && <OverviewTab org={org} />}
      {activeTab === 'team'         && <TeamTab orgId={org.id} />}
      {activeTab === 'subscription' && <SubscriptionTab org={org} />}
      {activeTab === 'sso'          && <SSOTab orgId={org.id} />}
      {activeTab === 'audit'        && <AuditTab orgId={org.id} />}
    </div>
  )
}
