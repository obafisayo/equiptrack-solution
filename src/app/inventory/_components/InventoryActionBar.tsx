'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Form'

interface InventoryActionBarProps {
  search: string
  onSearchChange: (value: string) => void
  onAddStock: () => void
}

export function InventoryActionBar({ search, onSearchChange, onAddStock }: InventoryActionBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex-1 max-w-sm">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name, ID or category…"
          size="sm"
        />
      </div>
      <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={onAddStock}>
        Add Stock
      </Button>
    </div>
  )
}
