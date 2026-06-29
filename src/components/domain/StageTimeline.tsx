import { LIFECYCLE, STAGE_DEPARTMENT, type Stage } from '@/lib/lifecycle'
import { fmtHours } from '@/config/sla'
import type { StageHistoryEntry } from '@/lib/mock-data'

const DEPT_TIMELINE: Record<string, {
  bg: string; text: string; dot: string; line: string; shadow: string
}> = {
  pending:   { bg: 'bg-slate-400',   text: 'text-slate-400',   dot: 'bg-slate-400',   line: 'bg-slate-400/30',   shadow: 'shadow-[0_0_0_2px_rgba(148,163,184,0.25)]' },
  warehouse: { bg: 'bg-blue-500',    text: 'text-blue-500',    dot: 'bg-blue-500',    line: 'bg-blue-500/30',    shadow: 'shadow-[0_0_0_2px_rgba(59,130,246,0.25)]' },
  dispatch:  { bg: 'bg-violet-500',  text: 'text-violet-500',  dot: 'bg-violet-500',  line: 'bg-violet-500/30',  shadow: 'shadow-[0_0_0_2px_rgba(139,92,246,0.25)]' },
  qaqc:      { bg: 'bg-amber-500',   text: 'text-amber-500',   dot: 'bg-amber-500',   line: 'bg-amber-500/30',   shadow: 'shadow-[0_0_0_2px_rgba(245,158,11,0.25)]' },
  final:     { bg: 'bg-emerald-500', text: 'text-emerald-500', dot: 'bg-emerald-500', line: 'bg-emerald-500/30', shadow: 'shadow-[0_0_0_2px_rgba(16,185,129,0.25)]' },
}

interface StageStripProps { currentStage: Stage }

export function StageStrip({ currentStage }: StageStripProps) {
  const currentIdx = LIFECYCLE.indexOf(currentStage)

  return (
    <div className="flex gap-0.5 items-center">
      {LIFECYCLE.map((stage, i) => {
        const dept      = STAGE_DEPARTMENT[stage] ?? 'pending'
        const cls       = DEPT_TIMELINE[dept] ?? DEPT_TIMELINE.pending
        const isPast    = i < currentIdx
        const isCurrent = i === currentIdx
        return (
          <div
            key={stage}
            title={stage}
            className={[
              'flex-1 rounded-sm',
              cls.bg,
              isCurrent ? 'h-1' : 'h-0.75',
              isCurrent || isPast ? 'opacity-100' : 'opacity-35',
            ].join(' ')}
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
        const dept   = STAGE_DEPARTMENT[entry.stage as Stage] ?? 'pending'
        const cls    = DEPT_TIMELINE[dept] ?? DEPT_TIMELINE.pending
        const isLast = i === history.length - 1

        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 border-2 border-white ${cls.dot} ${cls.shadow}`} />
              {!isLast && <div className={`w-px flex-1 mt-1 min-h-5 ${cls.line}`} />}
            </div>

            <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-4'}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{entry.stage}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{entry.personName ?? 'Unassigned'}</p>
                </div>
                <div className="text-right shrink-0">
                  {entry.durationHours != null ? (
                    <span className={`text-xs font-semibold ${cls.text}`}>
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
