'use client'

import { TABS, type Tab } from './types'

interface SettingsTabBarProps {
  active: Tab
  onSelect: (tab: Tab) => void
}

export function SettingsTabBar({ active, onSelect }: SettingsTabBarProps) {
  return (
    <div style={{
      display: 'flex', gap: 4, borderBottom: '1px solid #E2E8F0',
      marginBottom: 24, overflowX: 'auto',
    }}>
      {TABS.map(tab => {
        const isActive = active === tab.id
        const isDanger = tab.id === 'danger'
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            style={{
              padding: '9px 16px', border: 'none', background: 'none',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? (isDanger ? '#DC2626' : '#F04A4A') : isDanger ? '#DC2626' : '#6B7280',
              borderBottom: isActive ? `2px solid ${isDanger ? '#DC2626' : '#F04A4A'}` : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer', whiteSpace: 'nowrap',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
