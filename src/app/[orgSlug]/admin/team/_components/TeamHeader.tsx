'use client'

import { Download } from 'lucide-react'
import { SearchInput } from '@/components/ui/Form'

interface TeamHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  onExportCSV: () => void
}

export function TeamHeader({ search, onSearchChange, onExportCSV }: TeamHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search name, email, role…"
        size="sm"
        className="flex-1 max-w-90"
      />
      <button
        onClick={onExportCSV}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', border: '1px solid #D1D5DB',
          borderRadius: 7, background: '#fff', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: '#374151',
          flexShrink: 0,
        }}
      >
        <Download size={14} />
        Export CSV
      </button>
    </div>
  )
}
