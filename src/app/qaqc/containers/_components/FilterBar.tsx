'use client'

import { X } from 'lucide-react'
import { SearchInput, Select } from '@/components/ui/Form'

interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  typeFilter: string
  onTypeFilterChange: (v: string) => void
  expiryFilter: string
  onExpiryFilterChange: (v: string) => void
  statusFilter: string
  onStatusFilterChange: (v: string) => void
  filteredCount: number
  onClear: () => void
}

export function FilterBar({
  search, onSearchChange,
  typeFilter, onTypeFilterChange,
  expiryFilter, onExpiryFilterChange,
  statusFilter, onStatusFilterChange,
  filteredCount, onClear,
}: FilterBarProps) {
  const hasFilters = search || typeFilter !== 'all' || expiryFilter !== 'all' || statusFilter !== 'all'

  const filterDefs: { val: string; set: (v: string) => void; opts: [string, string][] }[] = [
    { val: typeFilter,   set: onTypeFilterChange,   opts: [['all','All Types'],['Waste Skip','Waste Skip'],['15ft Half Height Basket','15ft HH Basket'],['23ft Half Height Basket','23ft HH Basket'],['Chemical Tote Tank','Chemical Tote Tank'],['Open Top Basket','Open Top Basket'],['Closed Top Basket','Closed Top Basket']] },
    { val: expiryFilter, set: onExpiryFilterChange, opts: [['all','All Expiry'],['expired','Expired'],['locked','Locked (1-3d)'],['warning','Warning (4-7d)'],['soon','Expiring Soon'],['ok','Valid (30d+)']] },
    { val: statusFilter, set: onStatusFilterChange, opts: [['all','All Statuses'],['Available','Available'],['In Transit','In Transit'],['Assigned','Assigned'],['Maintenance','Maintenance'],['Quarantine','Quarantine']] },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex-1 min-w-[180px] max-w-xs">
        <SearchInput value={search} onChange={onSearchChange}
          placeholder="Search serial no. or type…"
          size="sm" />
      </div>

      {filterDefs.map((f, i) => (
        <Select key={i} aria-label={f.opts[0][1]} value={f.val} onChange={e => f.set(e.target.value)} size="sm">
          {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
      ))}

      {hasFilters && (
        <button type="button" onClick={onClear}
          className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:text-brand-700">
          <X size={12} /> Clear
        </button>
      )}
      <span className="text-xs text-neutral-400 ml-auto whitespace-nowrap">{filteredCount} containers</span>
    </div>
  )
}
