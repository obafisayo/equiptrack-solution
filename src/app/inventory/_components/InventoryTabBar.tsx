'use client'

import type { Tab } from './types'

interface InventoryTabBarProps {
  active: Tab
  stockCount: number
  movementsCount: number
  reorderCount: number
  onSelect: (tab: Tab) => void
}

export function InventoryTabBar({ active, stockCount, movementsCount, reorderCount, onSelect }: InventoryTabBarProps) {
  return (
    <div className="flex gap-0 border-b border-border-default mb-5">
      {([
        ['stock',     `Stock (${stockCount})`],
        ['movements', `Movements (${movementsCount})`],
        ['reorder',   `Reorder Queue (${reorderCount})`],
      ] as [Tab, string][]).map(([t, label]) => (
        <button key={t} type="button" onClick={() => onSelect(t)}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${active===t?'border-brand-500 text-brand-500':'border-transparent text-neutral-500 hover:text-neutral-800'}`}>
          {label}
        </button>
      ))}
    </div>
  )
}
