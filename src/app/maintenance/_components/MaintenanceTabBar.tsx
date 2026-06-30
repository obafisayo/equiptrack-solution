'use client'

import type { Tab } from './types'

interface MaintenanceTabBarProps {
  active: Tab
  ordersCount: number
  scheduleCount: number
  historyCount: number
  onSelect: (tab: Tab) => void
}

export function MaintenanceTabBar({ active, ordersCount, scheduleCount, historyCount, onSelect }: MaintenanceTabBarProps) {
  return (
    <div className="flex gap-0 border-b border-border-default mb-5">
      {([
        ['orders',   `Work Orders (${ordersCount})`],
        ['schedule', `Schedule (${scheduleCount})`],
        ['history',  `History (${historyCount})`],
      ] as [Tab, string][]).map(([t, label]) => (
        <button key={t} type="button" onClick={() => onSelect(t)}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${active===t?'border-brand-500 text-brand-500':'border-transparent text-neutral-500 hover:text-neutral-800'}`}>
          {label}
        </button>
      ))}
    </div>
  )
}
