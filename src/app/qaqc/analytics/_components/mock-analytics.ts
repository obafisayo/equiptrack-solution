import { WORK_ORDERS } from '@/lib/mock-data'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { INIT_CONTAINERS } from '@/app/qaqc/containers/_components/types'

const QAQC_STAGES = ['Preload QAQC', 'Containerization', 'Post QAQC'] as const

// Seeded pseudo-random — same values every render
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

// ── KPI derivations ───────────────────────────────────────────────────────────

export function computeKpis() {
  const completedQaqcHistory = WORK_ORDERS.flatMap(o =>
    o.stageHistory.filter(
      sh => QAQC_STAGES.includes(sh.stage as typeof QAQC_STAGES[number]) && sh.durationHours != null
    )
  )

  const inspectionHistory = completedQaqcHistory.filter(
    sh => sh.stage === 'Preload QAQC' || sh.stage === 'Post QAQC'
  )

  // SLA compliance: % of completed QAQC stage entries within their SLA target
  const onTime = completedQaqcHistory.filter(sh => {
    const sla = STAGE_SLA_HOURS[sh.stage as keyof typeof STAGE_SLA_HOURS]
    return sla != null && (sh.durationHours ?? 0) <= sla
  })
  const slaCompliancePct = completedQaqcHistory.length > 0
    ? Math.round((onTime.length / completedQaqcHistory.length) * 100)
    : 91 // fallback mock

  // Avg Preload QAQC time
  const preloadHistory = completedQaqcHistory.filter(sh => sh.stage === 'Preload QAQC')
  const avgPreloadHours = preloadHistory.length > 0
    ? preloadHistory.reduce((sum, sh) => sum + (sh.durationHours ?? 0), 0) / preloadHistory.length
    : 1.4

  // Container utilisation from CCU fleet
  const notAvailable = INIT_CONTAINERS.filter(c => c.status !== 'Available').length
  const utilisationPct = Math.round((notAvailable / INIT_CONTAINERS.length) * 100)

  return {
    inspectionsThisMonth: Math.max(inspectionHistory.length, 24), // floor for demo richness
    slaCompliancePct: slaCompliancePct || 91,
    avgPreloadHours: parseFloat(avgPreloadHours.toFixed(1)) || 1.4,
    rejectionRatePct: 12, // not tracked in mock data — representative value
    containerUtilisationPct: utilisationPct || 67,
  }
}

// ── Time-series: daily throughput ─────────────────────────────────────────────

function generateDailyLabels(days: number): string[] {
  const labels: string[] = []
  const now = new Date('2026-07-22')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`)
  }
  return labels
}

function generateDailyValues(days: number, seed: number): number[] {
  const rng = makeRng(seed)
  const values: number[] = []
  let base = 8
  for (let i = 0; i < days; i++) {
    const isWeekend = i % 7 >= 5
    const delta = (rng() - 0.42) * 4
    base = Math.max(2, Math.min(18, base + delta))
    values.push(isWeekend ? Math.round(base * 0.35) : Math.round(base))
  }
  return values
}

export function getThroughputData(period: '7d' | '30d' | '90d') {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
  return {
    labels: generateDailyLabels(days),
    values: generateDailyValues(days, 42),
  }
}

// ── Time-series: weekly SLA compliance ────────────────────────────────────────

export function getSlaComplianceWeekly() {
  const rng = makeRng(99)
  const weeks = 12
  const labels: string[] = []
  const values: number[] = []
  const now = new Date('2026-07-22')
  let compliance = 88
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    labels.push(`W${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`)
    const delta = (rng() - 0.35) * 6
    compliance = Math.max(72, Math.min(99, compliance + delta))
    values.push(Math.round(compliance))
  }
  return { labels, values }
}

// ── Orders by type breakdown ──────────────────────────────────────────────────

export function getOrdersByType() {
  const counts: Record<string, number> = { SAP: 0, TR: 0, VENDOR: 0, NON_STOCK: 0 }
  WORK_ORDERS.forEach(o => { counts[o.requestType] = (counts[o.requestType] ?? 0) + 1 })
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1
  return [
    { label: 'SAP',       value: Math.round((counts.SAP      / total) * 100), color: '#3B82F6' },
    { label: 'TR',        value: Math.round((counts.TR       / total) * 100), color: '#8B5CF6' },
    { label: 'Vendor',    value: Math.round((counts.VENDOR   / total) * 100), color: '#F59E0B' },
    { label: 'Non-Stock', value: Math.round((counts.NON_STOCK / total) * 100), color: '#10B981' },
  ]
}

// ── Orders by urgency breakdown ───────────────────────────────────────────────

export function getOrdersByUrgency() {
  const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Urgent: 0 }
  WORK_ORDERS.forEach(o => { counts[o.urgency] = (counts[o.urgency] ?? 0) + 1 })
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1
  return [
    { label: 'Low',    value: Math.round((counts.Low    / total) * 100), color: '#22C55E' },
    { label: 'Medium', value: Math.round((counts.Medium / total) * 100), color: '#F59E0B' },
    { label: 'High',   value: Math.round((counts.High   / total) * 100), color: '#F97316' },
    { label: 'Urgent', value: Math.round((counts.Urgent / total) * 100), color: '#EF4444' },
  ]
}

// ── Stage timing vs SLA target ────────────────────────────────────────────────

export function getStageTimingData() {
  const stages = ['Preload QAQC', 'Containerization', 'Post QAQC'] as const
  return stages.map(stage => {
    const history = WORK_ORDERS.flatMap(o =>
      o.stageHistory.filter(sh => sh.stage === stage && sh.durationHours != null)
    )
    const slaTarget = STAGE_SLA_HOURS[stage] ?? 2
    const avgActual = history.length > 0
      ? history.reduce((sum, sh) => sum + (sh.durationHours ?? 0), 0) / history.length
      : slaTarget * 0.8 // fallback: 80% of SLA

    return {
      stage,
      slaTarget,
      avgActual: parseFloat(avgActual.toFixed(2)),
      pctOfSla: Math.round((avgActual / slaTarget) * 100),
    }
  })
}

// ── Top destinations ──────────────────────────────────────────────────────────

export function getTopDestinations() {
  const counts: Record<string, number> = {}
  WORK_ORDERS.forEach(o => {
    counts[o.destination] = (counts[o.destination] ?? 0) + 1
  })
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const max = sorted[0]?.[1] ?? 1
  return sorted.map(([destination, count]) => ({
    destination,
    count,
    sharePct: Math.round((count / max) * 100),
  }))
}
