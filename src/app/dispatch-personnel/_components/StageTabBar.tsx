'use client'

export type StageTab = 'Assigned' | 'Containerization' | 'Waybill Pending' | 'Waybill Done' | 'Awaiting Deckspace'

export const STAGE_TABS: StageTab[] = ['Assigned', 'Containerization', 'Waybill Pending', 'Waybill Done', 'Awaiting Deckspace']

interface StageTabBarProps {
  active: StageTab
  counts: Record<StageTab, number>
  onSelect: (tab: StageTab) => void
}

export function StageTabBar({ active, counts, onSelect }: StageTabBarProps) {
  return (
    <div className="mb-5 border-b border-border-default">
      <div className="flex gap-0.5 overflow-x-auto">
        {STAGE_TABS.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150 ${
              active === tab
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              active === tab ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
