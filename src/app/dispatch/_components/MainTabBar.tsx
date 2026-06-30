'use client'

import { Users } from 'lucide-react'
import { type MainTab } from './constants'

interface MainTabBarProps {
  active: MainTab
  onSelect: (tab: MainTab) => void
}

export function MainTabBar({ active, onSelect }: MainTabBarProps) {
  return (
    <div className="mb-5 border-b border-border-default">
      <div className="flex gap-0.5">
        {(['Queue', 'Personnel Tasks'] as MainTab[]).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors duration-150 ${
              active === tab
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'Personnel Tasks' && <Users size={14} />}
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
