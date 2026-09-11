'use client'

import { X } from 'lucide-react'
import { SearchInput, Select } from '@/components/ui/Form'

interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  typeFilter: string
  onTypeFilterChange: (v: string) => void
  statusFilter: string
  onStatusFilterChange: (v: string) => void
  filteredCount: number
  onClear: () => void
}

export function FilterBar({
  search, onSearchChange,
  typeFilter, onTypeFilterChange,
  statusFilter, onStatusFilterChange,
  filteredCount, onClear,
}: FilterBarProps) {
  const hasFilters = search || typeFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex-1 min-w-52 max-w-xs">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search vessel name, IMO, owner..."
          size="sm"
        />
      </div>

      <Select
        aria-label="Filter by type"
        value={typeFilter}
        onChange={e => onTypeFilterChange(e.target.value)}
        size="sm"
      >
        <option value="all">All Types</option>
        <option value="Platform Supply Vessel">PSV</option>
        <option value="Anchor Handling Vessel">AHV</option>
        <option value="Fast Supply Vessel">FSV</option>
        <option value="Crew Transfer Vessel">CTV</option>
        <option value="Offshore Support Vessel">OSV</option>
        <option value="Barge">Barge</option>
      </Select>

      <Select
        aria-label="Filter by status"
        value={statusFilter}
        onChange={e => onStatusFilterChange(e.target.value)}
        size="sm"
      >
        <option value="all">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Idle">Idle</option>
        <option value="Standby">Standby</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Drydock">Drydock</option>
      </Select>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-xs font-semibold text-brand-accent hover:text-brand-accent-hover"
        >
          <X size={12} /> Clear
        </button>
      )}
      <span className="text-xs text-neutral-400 ml-auto whitespace-nowrap">{filteredCount} vessels</span>
    </div>
  )
}
