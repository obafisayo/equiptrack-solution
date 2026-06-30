'use client'

import { Plus } from 'lucide-react'
import { SearchInput } from '@/components/ui/Form'

interface SearchAndAddBarProps {
  search: string
  onSearchChange: (value: string) => void
  onAddClick: () => void
}

export function SearchAndAddBar({ search, onSearchChange, onAddClick }: SearchAndAddBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ flex: 1, maxWidth: 360 }}>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search organisations..."
          size="sm"
        />
      </div>
      <button
        onClick={onAddClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', border: 'none', borderRadius: 7,
          background: '#F04A4A', color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Plus size={15} />
        Add Organisation
      </button>
    </div>
  )
}
