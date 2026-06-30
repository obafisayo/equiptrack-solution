'use client'

import { Building2, Users, CreditCard, ShieldCheck, ScrollText } from 'lucide-react'
import type { Tab } from './types'

const TABS: { key: Tab; label: string; icon: typeof Building2 }[] = [
  { key: 'overview',     label: 'Overview',     icon: Building2    },
  { key: 'team',         label: 'Team',         icon: Users        },
  { key: 'subscription', label: 'Subscription', icon: CreditCard   },
  { key: 'sso',          label: 'SSO Config',   icon: ShieldCheck  },
  { key: 'audit',        label: 'Audit Log',    icon: ScrollText   },
]

interface OrgTabNavProps {
  active: Tab
  onSelect: (tab: Tab) => void
}

export function OrgTabNav({ active, onSelect }: OrgTabNavProps) {
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0' }}>
      {TABS.map(tab => {
        const isActive = active === tab.key
        const Icon = tab.icon
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 14px', border: 'none',
              borderBottom: `2px solid ${isActive ? '#F04A4A' : 'transparent'}`,
              marginBottom: -1,
              background: 'transparent', cursor: 'pointer',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#F04A4A' : '#6B7280',
            }}
          >
            <Icon size={14} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
