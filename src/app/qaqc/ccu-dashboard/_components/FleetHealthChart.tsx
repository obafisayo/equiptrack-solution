'use client'

import type { CCUContainer, CCUStatus } from '@/app/qaqc/containers/_components/types'

interface Props {
  containers: CCUContainer[]
}

const STATUS_CONFIG: Record<CCUStatus, { label: string; color: string; bg: string }> = {
  'Available':          { label: 'Available',          color: '#22C55E', bg: 'bg-green-500'  },
  'In Transit':         { label: 'In Transit',         color: '#F59E0B', bg: 'bg-amber-500'  },
  'Assigned':           { label: 'Assigned',           color: '#F59E0B', bg: 'bg-amber-400'  },
  'Maintenance':        { label: 'Maintenance',        color: '#EF4444', bg: 'bg-red-500'    },
  'Quarantine':         { label: 'Quarantine',         color: '#EF4444', bg: 'bg-red-600'    },
  'Pending Inspection': { label: 'Pending Inspection', color: '#94A3B8', bg: 'bg-slate-400'  },
}

export function FleetHealthChart({ containers }: Props) {
  const total = containers.length || 1

  const counts: Partial<Record<CCUStatus, number>> = {}
  containers.forEach(c => {
    counts[c.status] = (counts[c.status] ?? 0) + 1
  })

  const entries = Object.entries(counts) as [CCUStatus, number][]

  return (
    <div className="bg-white border border-border-default rounded-card shadow-card p-5">
      <h3 className="text-[14px] font-bold text-gray-800 mb-4">Fleet Health</h3>

      {/* Bar chart */}
      <div className="flex h-6 rounded-lg overflow-hidden gap-0.5 mb-4">
        {entries.map(([status, count]) => {
          const pct = (count / total) * 100
          if (pct < 1) return null
          const cfg = STATUS_CONFIG[status]
          return (
            <div
              key={status}
              className={`${cfg.bg} transition-all duration-500`}
              style={{ width: pct + '%' }}
              title={`${cfg.label}: ${count}`}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {entries.map(([status, count]) => {
          const pct = Math.round((count / total) * 100)
          const cfg = STATUS_CONFIG[status]
          return (
            <div key={status} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shrink-0 ${cfg.bg}`} />
              <span className="text-[12px] text-gray-600 flex-1">{cfg.label}</span>
              <span className="text-[12px] font-bold text-gray-800">{count}</span>
              <span className="text-[11px] text-gray-400 w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
