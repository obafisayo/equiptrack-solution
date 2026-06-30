'use client'

import type { Tab } from './types'

interface TabBarProps {
  active: Tab
  incidentsCount: number
  inspectionsCount: number
  ptwCount: number
  onSelect: (tab: Tab) => void
}

export function TabBar({ active, incidentsCount, inspectionsCount, ptwCount, onSelect }: TabBarProps) {
  const tabs: [Tab, string][] = [
    ['incidents',   `Incidents (${incidentsCount})`],
    ['inspections', `Inspections (${inspectionsCount})`],
    ['ptw',         `Permit to Work (${ptwCount})`],
  ]

  return (
    <div className="flex gap-0 border-b border-border-default mb-5">
      {tabs.map(([t, label]) => (
        <button
          key={t}
          type="button"
          onClick={() => onSelect(t)}
          className={[
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            active === t
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-neutral-500 hover:text-neutral-800',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
