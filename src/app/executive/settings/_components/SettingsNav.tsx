'use client'

import { Shield, Key, Building2, Bell } from 'lucide-react'
import type { SettingsTab } from './types'

interface SettingsNavProps {
  activeTab: SettingsTab
  onSelect: (tab: SettingsTab) => void
}

const NAV_ITEMS: { key: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'sso',      label: 'Single Sign-On (SSO)', icon: Shield },
  { key: 'sla',      label: 'SLA & Alerts', icon: Bell },
  { key: 'api',      label: 'API & Integrations', icon: Key },
]

export function SettingsNav({ activeTab, onSelect }: SettingsNavProps) {
  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white border border-border-default rounded-card overflow-hidden shadow-sm">
        <nav className="flex flex-col">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={['flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors', activeTab === key ? 'bg-brand-50 text-brand-500 border-l-4 border-brand-500' : 'text-neutral-600 hover:bg-neutral-50 border-l-4 border-transparent'].join(' ')}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
