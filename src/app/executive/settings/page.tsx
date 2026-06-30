'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { SettingsNav } from './_components/SettingsNav'
import { GeneralTab } from './_components/GeneralTab'
import { SsoTab } from './_components/SsoTab'
import { SlaTab } from './_components/SlaTab'
import { ApiTab } from './_components/ApiTab'
import type { SettingsTab } from './_components/types'

export default function OrgSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AppShell
      role="exec"
      currentPath="/executive/settings"
      title="Organization Settings"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Executive', href: '/executive' }, { label: 'Settings' }]}
    >
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">

        <SettingsNav activeTab={activeTab} onSelect={setActiveTab} />

        <div className="flex-1">
          {activeTab === 'sso' && <SsoTab saved={saved} onSave={handleSave} />}
          {activeTab === 'sla' && <SlaTab onSave={handleSave} />}
          {activeTab === 'api' && <ApiTab />}
          {activeTab === 'general' && <GeneralTab saved={saved} onSave={handleSave} />}
        </div>

      </div>
    </AppShell>
  )
}
