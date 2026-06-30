'use client'

export type TaskFilter = 'All' | 'Warehouse Assigned' | 'Processing' | 'GI Created' | 'Near SLA'

const FILTERS: TaskFilter[] = ['All', 'Warehouse Assigned', 'Processing', 'GI Created', 'Near SLA']

interface TaskFilterBarProps {
  active: TaskFilter
  counts: Record<TaskFilter, number>
  onSelect: (filter: TaskFilter) => void
}

export function TaskFilterBar({ active, counts, onSelect }: TaskFilterBarProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {FILTERS.map(f => {
        const count = counts[f]
        const isActive = active === f
        return (
          <button
            key={f}
            type="button"
            onClick={() => onSelect(f)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 ${
              isActive
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-white border-border-default text-gray-600 hover:border-gray-300'
            }`}
          >
            {f}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
