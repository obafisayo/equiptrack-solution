'use client'

import { ROLE_TABS, type RoleKey } from './constants'

export interface RoleTabBarProps {
  active: RoleKey
  countByRole: Record<string, number>
  totalCount: number
  onSelect: (key: RoleKey) => void
}

export function RoleTabBar({ active, countByRole, totalCount, onSelect }: RoleTabBarProps) {
  return (
    <div className="mb-5 border-b border-border-default overflow-x-auto">
      <div className="flex gap-0.5 min-w-max">
        {ROLE_TABS.map(tab => {
          const count = tab.key === 'all' ? totalCount : (countByRole[tab.key] ?? 0)
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelect(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150 ${
                active === tab.key
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                active === tab.key ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
