'use client'

import type { OrgStatus } from '@/lib/types'

export type FilterTab = 'all' | OrgStatus | 'trialing'

interface FilterTabsProps {
  tabs: { key: FilterTab; label: string; count: number }[]
  active: FilterTab
  onSelect: (key: FilterTab) => void
}

export function FilterTabs({ tabs, active, onSelect }: FilterTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0' }}>
      {tabs.map(tab => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            style={{
              padding: '9px 14px', border: 'none',
              borderBottom: `2px solid ${isActive ? '#1A6FBF' : 'transparent'}`,
              marginBottom: -1,
              background: 'transparent', cursor: 'pointer',
              fontSize: 13, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#1A6FBF' : '#6B7280',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {tab.label}
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 9999,
              background: isActive ? '#EFF6FF' : '#F3F4F6',
              color: isActive ? '#1A6FBF' : '#9CA3AF',
            }}>
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
