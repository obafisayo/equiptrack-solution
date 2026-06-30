/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { type HeatmapCellData } from '@/components/domain/BottleneckHeatmap'
import { LIFECYCLE, STAGE_DEPARTMENT } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { AdminQuickLinks } from './_components/AdminQuickLinks'
import { KpiStrip } from './_components/KpiStrip'
import { BottleneckSection } from './_components/BottleneckSection'
import { HeatmapDetailPanel } from './_components/HeatmapDetailPanel'
import { AnalyticsCharts } from './_components/AnalyticsCharts'
import { SupervisorPerformanceTable } from './_components/SupervisorPerformanceTable'
import { AllOrdersTable } from './_components/AllOrdersTable'
import type { SortCol } from './_components/types'
import {
  allOrders,
  activeOrders,
  shippedThisWeek,
  TREND_DATA,
  BAR_DATA,
  ALL_PERSONNEL,
  SUPERVISOR_PERF,
} from './_components/mockData'

const breachedCount = allOrders.filter(o => {
  const sla = STAGE_SLA_HOURS[o.stage]
  return sla != null && o.elapsedHours > sla
}).length

const slaBreachRate = Math.round((breachedCount / Math.max(allOrders.length, 1)) * 100)

const avgCycleHours = Math.round(
  allOrders.reduce((sum, o) => sum + o.totalElapsedHours, 0) / Math.max(allOrders.length, 1)
)

const TARGET_CYCLE_HOURS = 72 // 3 days

function fmtCycleTime(h: number) {
  const d = Math.floor(h / 24)
  const hr = h % 24
  return d > 0 ? d + 'd ' + hr + 'h' : hr + 'h'
}

// ── Stage heatmap data ──────────────────────────────────────────────────────
function buildHeatmapData(): HeatmapCellData[] {
  return LIFECYCLE.slice(0, 14).map(stage => {
    const ordersInStage = allOrders.filter(o => o.stage === stage)
    const avgHours = ordersInStage.length > 0
      ? ordersInStage.reduce((sum, o) => sum + o.elapsedHours, 0) / ordersInStage.length
      : 0
    return {
      stage,
      department: STAGE_DEPARTMENT[stage],
      avgHours: Math.round(avgHours * 10) / 10,
      slaHours: STAGE_SLA_HOURS[stage] ?? 8,
      count: ordersInStage.length,
    }
  })
}

// ── Department distribution ─────────────────────────────────────────────────
function buildDonutData() {
  const counts = { pending: 0, warehouse: 0, dispatch: 0, qaqc: 0, final: 0 }
  activeOrders.forEach(o => { counts[STAGE_DEPARTMENT[o.stage]]++ })
  const total = activeOrders.length || 1
  return [
    { label: 'Warehouse', value: Math.round((counts.warehouse / total) * 100), color: '#3B82F6' },
    { label: 'Dispatch',  value: Math.round((counts.dispatch / total) * 100),  color: '#8B5CF6' },
    { label: 'QAQC',      value: Math.round((counts.qaqc / total) * 100),      color: '#F59E0B' },
    { label: 'Final',     value: Math.round((counts.final / total) * 100),     color: '#10B981' },
    { label: 'Pending',   value: Math.round((counts.pending / total) * 100),   color: '#94A3B8' },
  ]
}

export default function ExecutivePage() {
  const [ordersOpen, setOrdersOpen]     = useState(false)
  const [sortCol, setSortCol]           = useState<SortCol>('elapsed')
  const [selectedCell, setSelectedCell] = useState<HeatmapCellData | null>(null)

  const heatmapData = useMemo(() => buildHeatmapData(), [])
  const donutData   = useMemo(() => buildDonutData(), [])

  const sortedOrders = useMemo(() => {
    return [...activeOrders].sort((a, b) => {
      if (sortCol === 'id')      return a.id.localeCompare(b.id)
      if (sortCol === 'stage')   return a.stage.localeCompare(b.stage)
      if (sortCol === 'elapsed') return b.elapsedHours - a.elapsedHours
      return 0
    })
  }, [sortCol])

  const loadBarsData = ALL_PERSONNEL.map(p => ({
    label: p.name.split(' ')[0],
    value: p.active,
    max: p.capacity,
  }))

  return (
    <AppShell
      role="exec"
      currentPath="/executive"
      title="Executive Overview"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Executive' }]}
    >
      <AdminQuickLinks />

      <KpiStrip
        avgCycleHours={avgCycleHours}
        activeOrdersCount={activeOrders.length}
        shippedThisWeek={shippedThisWeek}
        slaBreachRate={slaBreachRate}
        breachedCount={breachedCount}
        targetCycleHours={TARGET_CYCLE_HOURS}
        fmtCycleTime={fmtCycleTime}
      />

      <BottleneckSection
        heatmapData={heatmapData}
        selectedStage={selectedCell?.stage ?? null}
        onSelect={setSelectedCell}
      />

      {selectedCell && (
        <HeatmapDetailPanel
          selectedCell={selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      )}

      <AnalyticsCharts
        trendData={TREND_DATA}
        donutData={donutData}
        barData={BAR_DATA}
        loadBarsData={loadBarsData}
      />

      <SupervisorPerformanceTable data={SUPERVISOR_PERF} />

      <AllOrdersTable
        orders={sortedOrders}
        isOpen={ordersOpen}
        onToggle={() => setOrdersOpen(o => !o)}
        sortCol={sortCol}
        onSortColChange={setSortCol}
      />
    </AppShell>
  )
}
