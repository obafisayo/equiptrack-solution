'use client'

import { SearchInput, Select } from '@/components/ui/Form'
import { type UrgencyLevel } from '@/config/sla'

export type RequestType = 'All' | 'SAP' | 'TR' | 'VENDOR' | 'NON_STOCK'
export type SortOption = 'oldest' | 'newest' | 'overdue'
export type ViewMode = 'cards' | 'table'

const DEPT_GROUPS = [
  { label: 'All Stages', value: 'all' },
  { label: 'Warehouse', value: 'warehouse' },
  { label: 'Dispatch', value: 'dispatch' },
  { label: 'QAQC', value: 'qaqc' },
  { label: 'Final', value: 'final' },
  { label: 'Pending', value: 'pending' },
]

interface FilterBarProps {
  search: string
  sort: SortOption
  viewMode: ViewMode
  deptFilter: string
  typeFilter: RequestType
  urgencyFilter: UrgencyLevel | 'All'
  onSearchChange: (v: string) => void
  onSortChange: (v: SortOption) => void
  onViewModeChange: (v: ViewMode) => void
  onDeptFilterChange: (v: string) => void
  onTypeFilterChange: (v: RequestType) => void
  onUrgencyFilterChange: (v: UrgencyLevel | 'All') => void
}

export function FilterBar({
  search,
  sort,
  viewMode,
  deptFilter,
  typeFilter,
  urgencyFilter,
  onSearchChange,
  onSortChange,
  onViewModeChange,
  onDeptFilterChange,
  onTypeFilterChange,
  onUrgencyFilterChange,
}: FilterBarProps) {
  return (
    <div className="bg-white border border-border-default rounded-card shadow-card p-4 mb-5 space-y-3">
      {/* Row 1: Search + View toggle + Sort */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search delivery number, destination, assignee..."
          className="flex-1 min-w-50"
          size="sm"
        />
        <Select
          aria-label="Sort order"
          value={sort}
          onChange={e => onSortChange(e.target.value as SortOption)}
          size="sm"
          className="w-auto min-w-35"
        >
          <option value="oldest">Oldest First</option>
          <option value="newest">Newest First</option>
          <option value="overdue">Most Overdue</option>
        </Select>
        <div className="flex border border-border-default rounded-md overflow-hidden">
          <button
            onClick={() => onViewModeChange('cards')}
            className={`px-3 h-9 text-sm transition-colors ${viewMode === 'cards' ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            title="Card view"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
              <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`px-3 h-9 text-sm transition-colors border-l border-border-default ${viewMode === 'table' ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            title="Table view"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: Department + Type + Urgency pills */}
      <div className="flex flex-wrap gap-2">
        {DEPT_GROUPS.map(g => (
          <button
            key={g.value}
            onClick={() => onDeptFilterChange(g.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
              deptFilter === g.value
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-white border-border-default text-gray-600 hover:border-brand-300'
            }`}
          >
            {g.label}
          </button>
        ))}
        <div className="w-px bg-border-default mx-1" />
        {(['All', 'SAP', 'TR', 'VENDOR', 'NON_STOCK'] as RequestType[]).map(t => (
          <button
            key={t}
            onClick={() => onTypeFilterChange(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
              typeFilter === t
                ? 'bg-neutral-800 border-neutral-800 text-white'
                : 'bg-white border-border-default text-gray-600 hover:border-neutral-400'
            }`}
          >
            {t}
          </button>
        ))}
        <div className="w-px bg-border-default mx-1" />
        {(['All', 'Urgent', 'High', 'Medium', 'Low'] as Array<UrgencyLevel | 'All'>).map(u => (
          <button
            key={u}
            onClick={() => onUrgencyFilterChange(u)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
              urgencyFilter === u
                ? 'bg-neutral-800 border-neutral-800 text-white'
                : 'bg-white border-border-default text-gray-600 hover:border-neutral-400'
            }`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  )
}
