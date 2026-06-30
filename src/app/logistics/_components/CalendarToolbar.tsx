'use client'

import { ChevronLeft, ChevronRight, Plus, Filter as FilterIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { CalView } from './types'

interface Props {
  filterOpen: boolean
  onToggleFilter: () => void
  navLabel: string
  onPrev: () => void
  onNext: () => void
  calView: CalView
  onSelectView: (v: CalView) => void
  onNewAgenda: () => void
}

export function CalendarToolbar({ filterOpen, onToggleFilter, navLabel, onPrev, onNext, calView, onSelectView, onNewAgenda }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-default gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleFilter}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${filterOpen ? 'bg-brand-50 border-brand-300 text-brand-600' : 'border-border-default text-neutral-600 hover:border-neutral-300'}`}
        >
          <FilterIcon size={13}/> Filter
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPrev} className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"><ChevronLeft size={16}/></button>
          <p className="text-sm font-bold text-neutral-900 min-w-[180px] text-center">{navLabel}</p>
          <button type="button" onClick={onNext} className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 transition-colors"><ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-md border border-border-default overflow-hidden text-xs font-semibold">
          {(['Day', 'Week', 'Month'] as CalView[]).map(v => (
            <button
              key={v} type="button"
              onClick={() => onSelectView(v)}
              className={`px-3 py-1.5 transition-colors ${calView === v ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              {v}
            </button>
          ))}
        </div>
        <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={onNewAgenda}>
          New Agenda
        </Button>
      </div>
    </div>
  )
}
