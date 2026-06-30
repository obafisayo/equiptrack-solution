/* eslint-disable */
'use client'

import AppShell from '@/components/layout/AppShell'
import { WORK_ORDERS } from '@/lib/mock-data'
import { LIFECYCLE, STAGE_DEPARTMENT } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { BottleneckStats } from './_components/BottleneckStats'
import { StageDwellSection } from './_components/StageDwellSection'
import { PersonHandlingTable } from './_components/PersonHandlingTable'
import { OldestOrdersTable } from './_components/OldestOrdersTable'
import { StageTrendSection } from './_components/StageTrendSection'
import type { PersonStat, StageStat } from './_components/types'

const allOrders = WORK_ORDERS.filter(o => !['Shipped', 'Completed'].includes(o.stage))

// Per-stage stats
const stageStats: StageStat[] = LIFECYCLE.slice(0, 14).map(stage => {
  const orders = allOrders.filter(o => o.stage === stage)
  const avgHours = orders.length > 0
    ? orders.reduce((sum, o) => sum + o.elapsedHours, 0) / orders.length
    : 0
  const slaHours  = STAGE_SLA_HOURS[stage] ?? 8
  const ratio     = avgHours / slaHours
  const dept      = STAGE_DEPARTMENT[stage]
  return { stage, avgHours, slaHours, count: orders.length, ratio, dept }
}).sort((a, b) => b.ratio - a.ratio)

function buildPersonStats(): PersonStat[] {
  const map: Record<string, { name: string; dept: string; totalDuration: number; stageCount: number }> = {}
  WORK_ORDERS.forEach(o => {
    o.stageHistory.forEach(h => {
      if (!h.durationHours || !h.personId) return
      if (!map[h.personId]) {
        map[h.personId] = { name: h.personName ?? '', dept: 'unknown', totalDuration: 0, stageCount: 0 }
      }
      map[h.personId].totalDuration += h.durationHours
      map[h.personId].stageCount    += 1
    })
  })
  return Object.entries(map).map(([id, v]) => ({
    id,
    name: v.name,
    dept: v.dept,
    avgDuration: v.stageCount > 0 ? v.totalDuration / v.stageCount : 0,
    totalStages: v.stageCount,
  })).sort((a, b) => b.avgDuration - a.avgDuration).slice(0, 10)
}

// Top 10 oldest active orders
const oldestOrders = [...allOrders]
  .sort((a, b) => b.totalElapsedHours - a.totalElapsedHours)
  .slice(0, 10)

export default function BottlenecksPage() {
  const personStats = buildPersonStats()

  const totalBreached = allOrders.filter(o => {
    const sla = STAGE_SLA_HOURS[o.stage]
    return sla != null && o.elapsedHours > sla
  }).length

  const avgRatio = stageStats.reduce((sum, s) => sum + s.ratio, 0) / Math.max(stageStats.length, 1)
  const worstStage = stageStats[0]

  return (
    <AppShell
      role="exec"
      currentPath="/executive/bottlenecks"
      title="Bottleneck Analysis"
      breadcrumb={[{ label: 'Executive Overview', href: '/executive' }]}
    >
      <BottleneckStats
        bottleneckCount={stageStats.filter(s => s.ratio > 1).length}
        totalBreached={totalBreached}
        avgRatio={avgRatio}
        worstStage={worstStage}
      />

      <StageDwellSection stageStats={stageStats} />

      <PersonHandlingTable personStats={personStats} />

      <OldestOrdersTable orders={oldestOrders} />

      <StageTrendSection />
    </AppShell>
  )
}
