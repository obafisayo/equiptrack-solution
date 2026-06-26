import { STAGE_COLOR, type Stage } from '@/lib/lifecycle'
import { URGENCY_CONFIG, getSlaStatus, fmtHours, type UrgencyLevel } from '@/config/sla'

export function StagePill({ stage }: { stage: Stage }) {
  const color = STAGE_COLOR[stage] ?? '#94A3B8'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: color + '18', color, border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      {stage}
    </span>
  )
}

export function UrgencyPill({ level }: { level: UrgencyLevel }) {
  const cfg = URGENCY_CONFIG[level]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.borderColor}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
      {level} · {cfg.label}
    </span>
  )
}

const TYPE_MAP: Record<string, { bg: string; color: string }> = {
  SAP:       { bg: '#EFF6FF', color: '#1D4ED8' },
  TR:        { bg: '#F5F3FF', color: '#6D28D9' },
  VENDOR:    { bg: '#FFF7ED', color: '#C2410C' },
  NON_STOCK: { bg: '#F0FDF4', color: '#166534' },
}

export function TypeBadge({ type }: { type: 'SAP' | 'TR' | 'VENDOR' | 'NON_STOCK' }) {
  const s = TYPE_MAP[type] ?? TYPE_MAP.SAP
  const label = type === 'NON_STOCK' ? 'Non-Stock' : type
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {label}
    </span>
  )
}

export function SLAChip({
  elapsedHours,
  slaHours,
}: {
  elapsedHours: number
  slaHours: number | undefined
}) {
  const status = getSlaStatus(elapsedHours, slaHours)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: status.bg, color: status.color }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="3.5" stroke={status.color} strokeWidth="1.2" />
        <path d="M5 2.8V5L6.3 6.3" stroke={status.color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {fmtHours(elapsedHours)}{slaHours ? ` / ${fmtHours(slaHours)}` : ''}
    </span>
  )
}
