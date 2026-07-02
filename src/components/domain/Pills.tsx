import { STAGE_DEPARTMENT, type Stage } from '@/lib/lifecycle'
import { getSlaStatus, fmtHours, type UrgencyLevel } from '@/config/sla'
import type { DangerousGoodsClass } from '@/lib/mock-data'

// ── Department → Tailwind badge class strings ─────────────────────────────────
const DEPT_PILL: Record<string, { pill: string; dot: string }> = {
  pending:   { pill: 'bg-slate-400/15 text-slate-600    border border-slate-400/30',   dot: 'bg-slate-400'   },
  warehouse: { pill: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30', dot: 'bg-emerald-500' },
  dispatch:  { pill: 'bg-violet-500/15 text-violet-700  border border-violet-500/30',  dot: 'bg-violet-500'  },
  qaqc:      { pill: 'bg-amber-500/15  text-amber-700   border border-amber-500/30',   dot: 'bg-amber-500'   },
  final:     { pill: 'bg-green-500/15  text-green-700   border border-green-500/30',   dot: 'bg-green-500'   },
}

export function StagePill({ stage }: { stage: Stage }) {
  const dept = STAGE_DEPARTMENT[stage] ?? 'pending'
  const cls  = DEPT_PILL[dept] ?? DEPT_PILL.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${cls.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cls.dot}`} />
      {stage}
    </span>
  )
}

// ── Urgency → Tailwind badge class strings ────────────────────────────────────
const URGENCY_PILL: Record<UrgencyLevel, { pill: string; dot: string; label: string }> = {
  Low:    { pill: 'bg-green-500/15  text-green-700  border border-green-500/30',  dot: 'bg-green-500',  label: '7 days' },
  Medium: { pill: 'bg-amber-500/15  text-amber-700  border border-amber-500/30',  dot: 'bg-amber-500',  label: '5 days' },
  High:   { pill: 'bg-orange-500/15 text-orange-700 border border-orange-500/30', dot: 'bg-orange-500', label: '3 days' },
  Urgent: { pill: 'bg-red-500/15    text-red-700    border border-red-500/30',    dot: 'bg-red-500',    label: 'Next boat' },
}

export function UrgencyPill({ level }: { level: UrgencyLevel }) {
  const cls = URGENCY_PILL[level] ?? URGENCY_PILL.Low
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${cls.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cls.dot}`} />
      {level} · {cls.label}
    </span>
  )
}

// ── Request type → Tailwind badge class strings ───────────────────────────────
const TYPE_CLASS: Record<string, string> = {
  SAP:       'bg-slate-100  text-slate-800',
  TR:        'bg-violet-50  text-violet-800',
  VENDOR:    'bg-orange-50  text-orange-800',
  NON_STOCK: 'bg-green-50   text-green-800',
}

export function TypeBadge({ type }: { type: 'SAP' | 'TR' | 'VENDOR' | 'NON_STOCK' }) {
  const cls   = TYPE_CLASS[type] ?? TYPE_CLASS.SAP
  const label = type === 'NON_STOCK' ? 'Non-Stock' : type
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${cls}`}>
      {label}
    </span>
  )
}

// ── Dangerous Goods badge ─────────────────────────────────────────────────────
const DG_BADGE: Record<DangerousGoodsClass, { label: string; cls: string } | null> = {
  normal:       null,
  dangerous:    { label: 'DG',          cls: 'bg-orange-50 text-orange-700 border border-orange-200' },
  explosive:    { label: 'EXPLOSIVE',   cls: 'bg-red-50    text-red-700    border border-red-200 font-bold' },
  radioactive:  { label: 'RADIOACTIVE', cls: 'bg-red-100   text-red-800    border border-red-300 font-bold' },
  refrigerated: { label: 'REFRIGERATED',cls: 'bg-slate-50  text-slate-700  border border-slate-200' },
  hazardous:    { label: 'HAZARDOUS',   cls: 'bg-amber-50  text-amber-700  border border-amber-200' },
}

export function DangerousGoodsPill({ dgClass }: { dgClass: DangerousGoodsClass }) {
  const cfg = DG_BADGE[dgClass]
  if (!cfg) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

// ── SLA chip ──────────────────────────────────────────────────────────────────
const SLA_CHIP_CLASS = {
  breached: 'bg-red-50   text-red-700',
  warning:  'bg-amber-50 text-amber-700',
  ontrack:  'bg-green-50 text-green-700',
}
const SLA_SVG_COLOR = {
  breached: '#B91C1C',
  warning:  '#B45309',
  ontrack:  '#15803D',
}

export function SLAChip({ elapsedHours, slaHours }: { elapsedHours: number; slaHours: number | undefined }) {
  const status  = getSlaStatus(elapsedHours, slaHours)
  const variant = status.breached ? 'breached' : status.warning ? 'warning' : 'ontrack'
  const svgCol  = SLA_SVG_COLOR[variant]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${SLA_CHIP_CLASS[variant]}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <circle cx="5" cy="5" r="3.5" stroke={svgCol} strokeWidth="1.2" />
        <path d="M5 2.8V5L6.3 6.3" stroke={svgCol} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {fmtHours(elapsedHours)}{slaHours ? ` / ${fmtHours(slaHours)}` : ''}
    </span>
  )
}
