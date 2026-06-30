import type { VesselStatus } from './types'

const STATUSES: VesselStatus[] = ['In Transit', 'Docking', 'Loading', 'Awaiting Berth', 'Departed']

interface Props {
  statusFilter: VesselStatus | 'all'
  shownCount: number
  onSelect: (s: VesselStatus | 'all') => void
}

export function StatusFilterBar({ statusFilter, shownCount, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button onClick={() => onSelect('all')}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${statusFilter === 'all' ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
        All Vessels
      </button>
      {STATUSES.map(s => (
        <button key={s} onClick={() => onSelect(s)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${statusFilter === s ? 'bg-neutral-900 border-neutral-900 text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
          {s}
        </button>
      ))}
      <span className="ml-auto text-xs text-neutral-400">{shownCount} vessels</span>
    </div>
  )
}
