'use client'

import { SearchInput, Select } from '@/components/ui/Form'
import { type UrgencyLevel } from '@/config/sla'
import { LIFECYCLE } from '@/lib/lifecycle'

export type RequestType = 'All' | 'SAP' | 'TR' | 'VENDOR' | 'NON_STOCK'
export type SortOption = 'oldest' | 'newest' | 'overdue'
export type ViewMode = 'cards' | 'table'

const STAGE_OPTIONS = ['All', ...LIFECYCLE]
const URGENCY_OPTIONS: Array<UrgencyLevel | 'All'> = ['All', 'Low', 'Medium', 'High', 'Urgent']
const TYPE_OPTIONS: RequestType[] = ['All', 'SAP', 'TR', 'VENDOR', 'NON_STOCK']
const TYPE_LABELS: Record<RequestType, string> = {
  All: 'All', SAP: 'SAP', TR: 'TR', VENDOR: 'Vendor', NON_STOCK: 'Non-Stock',
}

const MONTHS = [
  { value: '', label: 'All Months' },
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' },   { value: '04', label: 'April' },
  { value: '05', label: 'May' },     { value: '06', label: 'June' },
  { value: '07', label: 'July' },    { value: '08', label: 'August' },
  { value: '09', label: 'September' },{ value: '10', label: 'October' },
  { value: '11', label: 'November' },{ value: '12', label: 'December' },
]

const currentYear = new Date().getFullYear()
const YEARS = [
  { value: '', label: 'All Years' },
  ...Array.from({ length: 5 }, (_, i) => {
    const y = (currentYear - i).toString()
    return { value: y, label: y }
  }),
]

function PillRow({ label, options, active, onSelect, getLabel }: {
  label: string
  options: string[]
  active: string
  onSelect: (v: string) => void
  getLabel?: (v: string) => string
}) {
  return (
    <div className="flex items-start gap-3 flex-wrap">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0 mt-[5px] w-24">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 ${
              active === opt
                ? 'bg-gray-900 border-gray-900 text-white'
                : 'bg-white border-border-default text-gray-600 hover:border-gray-400'
            }`}
          >
            {getLabel ? getLabel(opt) : opt}
          </button>
        ))}
      </div>
    </div>
  )
}

interface FilterBarProps {
  search: string
  sort: SortOption
  viewMode: ViewMode
  stageFilter: string
  typeFilter: RequestType
  urgencyFilter: UrgencyLevel | 'All'
  monthFilter: string
  yearFilter: string
  onSearchChange: (v: string) => void
  onSortChange: (v: SortOption) => void
  onViewModeChange: (v: ViewMode) => void
  onStageFilterChange: (v: string) => void
  onTypeFilterChange: (v: RequestType) => void
  onUrgencyFilterChange: (v: UrgencyLevel | 'All') => void
  onMonthFilterChange: (v: string) => void
  onYearFilterChange: (v: string) => void
}

export function FilterBar({
  search, sort, viewMode, stageFilter, typeFilter, urgencyFilter, monthFilter, yearFilter,
  onSearchChange, onSortChange, onViewModeChange, onStageFilterChange,
  onTypeFilterChange, onUrgencyFilterChange, onMonthFilterChange, onYearFilterChange,
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

      {/* Filter rows with labels */}
      <PillRow label="Stages" options={STAGE_OPTIONS} active={stageFilter} onSelect={onStageFilterChange} />
      <PillRow label="Urgency" options={URGENCY_OPTIONS} active={urgencyFilter} onSelect={v => onUrgencyFilterChange(v as UrgencyLevel | 'All')} />
      <PillRow label="Order Type" options={TYPE_OPTIONS} active={typeFilter} onSelect={v => onTypeFilterChange(v as RequestType)} getLabel={v => TYPE_LABELS[v as RequestType]} />

      {/* Date filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0 w-24">Date</span>
        <Select
          aria-label="Filter by month"
          value={monthFilter}
          onChange={e => onMonthFilterChange(e.target.value)}
          size="sm"
          className="w-auto min-w-36"
        >
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </Select>
        <Select
          aria-label="Filter by year"
          value={yearFilter}
          onChange={e => onYearFilterChange(e.target.value)}
          size="sm"
          className="w-auto min-w-28"
        >
          {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
        </Select>
      </div>
    </div>
  )
}
