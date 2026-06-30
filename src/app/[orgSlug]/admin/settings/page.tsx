'use client'

import { use, useState } from 'react'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { SettingsTabBar } from './_components/SettingsTabBar'
import { GeneralTab } from './_components/GeneralTab'
import { SLAConfigTab } from './_components/SLAConfigTab'
import { NotificationsTab } from './_components/NotificationsTab'
import { DangerZoneTab } from './_components/DangerZoneTab'
import type { Tab } from './_components/types'

export default function OrgAdminSettingsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const [activeTab, setActiveTab] = useState<Tab>('general')

  if (!org) {
    return (
      <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#9CA3AF' }}>Organisation not found.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Manage organisation configuration and preferences</p>
      </div>

      <SettingsTabBar active={activeTab} onSelect={setActiveTab} />

      {activeTab === 'general'       && <GeneralTab org={org} />}
      {activeTab === 'sla'           && <SLAConfigTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'danger'        && <DangerZoneTab orgName={org.name} />}
    </div>
  )
}
