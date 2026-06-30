'use client'

import { SearchInput, Select } from '@/components/ui/Form'
import type { WaitlistEntry } from '@/lib/types'

export type StatusFilter = 'all' | WaitlistEntry['status']
export type PriorityFilter = 'all' | WaitlistEntry['priority']

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: StatusFilter
  onStatusFilterChange: (value: StatusFilter) => void
  priorityFilter: PriorityFilter
  onPriorityFilterChange: (value: PriorityFilter) => void
}

export function FilterBar({
  search, onSearchChange,
  statusFilter, onStatusFilterChange,
  priorityFilter, onPriorityFilterChange,
}: FilterBarProps) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Search */}
      <div style={{ flex: 1, minWidth: 240 }}>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search company, email, industry..."
          size="sm"
        />
      </div>

      {/* Status filter */}
      <Select aria-label="Filter by status" value={statusFilter} onChange={e => onStatusFilterChange(e.target.value as StatusFilter)} size="sm">
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="converted">Converted</option>
      </Select>

      {/* Priority filter */}
      <Select aria-label="Filter by priority" value={priorityFilter} onChange={e => onPriorityFilterChange(e.target.value as PriorityFilter)} size="sm">
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </Select>
    </div>
  )
}
