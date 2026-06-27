import { LIFECYCLE, STAGE_COLOR, STAGE_DEPARTMENT, DEPARTMENT_COLOR, type Stage } from '@/lib/lifecycle'
import { fmtHours } from '@/config/sla'
import type { StageHistoryEntry } from '@/lib/mock-data'

interface StageStripProps {
  currentStage: Stage
  compact?: boolean
}

export function StageStrip({ currentStage }: StageStripProps) {
  const currentIdx = LIFECYCLE.indexOf(currentStage)

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {LIFECYCLE.map((stage, i) => {
        const dept = STAGE_DEPARTMENT[stage]
        const color = DEPARTMENT_COLOR[dept]
        const isPast = i < currentIdx
        const isCurrent = i === currentIdx

        return (
          <div
            key={stage}
            title={stage}
            style={{
              flex: 1,
              height: isCurrent ? 4 : 3,
              borderRadius: 1.5,
              background: color,
              opacity: isCurrent || isPast ? 1 : 0.35,
            }}
          />
        )
      })}
    </div>
  )
}

interface StageHistoryProps {
  history: StageHistoryEntry[]
  currentStage: Stage
}

export function StageHistory({ history }: StageHistoryProps) {
  return (
    <div className="space-y-0">
      {history.map((entry, i) => {
        const color = STAGE_COLOR[entry.stage] ?? '#94A3B8'
        const isLast = i === history.length - 1

        return (
          <div key={i} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 border-2 border-white"
                style={{ background: color, boxShadow: `0 0 0 2px ${color}40` }}
              />
              {!isLast && <div className="w-px flex-1 mt-1" style={{ background: color + '30', minHeight: '20px' }} />}
            </div>

            {/* Content */}
            <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-4'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{entry.stage}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {entry.personName ?? 'Unassigned'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {entry.durationHours != null ? (
                    <span
                      className="text-xs font-semibold"
                      style={{ color }}
                    >
                      {fmtHours(entry.durationHours)}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">ongoing</span>
                  )}
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(entry.startedAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
