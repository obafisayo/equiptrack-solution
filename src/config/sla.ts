import type { Stage } from '@/lib/lifecycle'

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Urgent'

export const URGENCY_CONFIG: Record<UrgencyLevel, {
  days: number | null
  label: string
  color: string
  bg: string
  borderColor: string
}> = {
  Low:    { days: 7,    label: '7 days',    color: '#22C55E', bg: '#F0FDF4', borderColor: '#22C55E33' },
  Medium: { days: 5,    label: '5 days',    color: '#F59E0B', bg: '#FFFBEB', borderColor: '#F59E0B33' },
  High:   { days: 3,    label: '3 days',    color: '#F97316', bg: '#FFF7ED', borderColor: '#F9731633' },
  Urgent: { days: null, label: 'Next boat', color: '#EF4444', bg: '#FEF2F2', borderColor: '#EF444433' },
}

export const STAGE_SLA_HOURS: Partial<Record<Stage, number>> = {
  'Pending Base Coordinator Approval': 8,
  'New Request':                       4,
  'Warehouse Assigned':                2,
  'Processing':                        8,
  'GI Created':                        2,
  'Transferred to Dispatch':           1,
  'Dispatch Queue':                    2,
  'Dispatch Assigned':                 4,
  'Preload QAQC':                      2,
  'Containerization':                  3,
  'Post QAQC':                         2,
  'Waybill Pending Signature':         4,
  'Waybill Done':                      1,
  'Awaiting Deckspace':                24,
}

export const SLA_WARNING_THRESHOLD = 0.75

export const SLA_COLORS = {
  onTrack:  { color: '#22C55E', bg: '#F0FDF4' },
  warning:  { color: '#F59E0B', bg: '#FFFBEB' },
  breached: { color: '#EF4444', bg: '#FEF2F2' },
}

export function getSlaStatus(elapsedHours: number, slaHours: number | undefined) {
  if (!slaHours) return { pct: 0, breached: false, warning: false, ...SLA_COLORS.onTrack }
  const pct = Math.min((elapsedHours / slaHours) * 100, 100)
  const breached = elapsedHours > slaHours
  const warning = !breached && pct >= SLA_WARNING_THRESHOLD * 100
  return {
    pct,
    breached,
    warning,
    ...(breached ? SLA_COLORS.breached : warning ? SLA_COLORS.warning : SLA_COLORS.onTrack),
  }
}

export function fmtHours(h: number | null | undefined): string {
  if (h == null) return '—'
  if (h < 1) return `${Math.round(h * 60)}m`
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

export function getExpectedDeliveryDate(urgency: UrgencyLevel, fromDate: Date = new Date()): Date | null {
  const cfg = URGENCY_CONFIG[urgency]
  if (!cfg.days) return null
  const d = new Date(fromDate)
  d.setDate(d.getDate() + cfg.days)
  return d
}
