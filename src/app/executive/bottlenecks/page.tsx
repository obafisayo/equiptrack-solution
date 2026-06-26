'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { StagePill } from '@/components/domain/Pills'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS, PERSONNEL } from '@/lib/mock-data'
import { LIFECYCLE, STAGE_DEPARTMENT, DEPARTMENT_COLOR, type Stage } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours, getSlaStatus } from '@/config/sla'

const allOrders = WORK_ORDERS.filter(o => !['Shipped', 'Completed'].includes(o.stage))

// Per-stage stats
const stageStats = LIFECYCLE.slice(0, 14).map(stage => {
  const orders = allOrders.filter(o => o.stage === stage)
  const avgHours = orders.length > 0
    ? orders.reduce((sum, o) => sum + o.elapsedHours, 0) / orders.length
    : 0
  const slaHours  = STAGE_SLA_HOURS[stage] ?? 8
  const ratio     = avgHours / slaHours
  const dept      = STAGE_DEPARTMENT[stage]
  return { stage, avgHours, slaHours, count: orders.length, ratio, dept }
}).sort((a, b) => b.ratio - a.ratio)

// Per-person handling time from stage history
interface PersonStat {
  id: string
  name: string
  dept: string
  avgDuration: number
  totalStages: number
}

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

function BarComparison({ label, actual, sla, dept }: { label: string; actual: number; sla: number; dept: string }) {
  const maxHours = Math.max(actual, sla) * 1.2 || 1
  const actualPct = (actual / maxHours) * 100
  const slaPct    = (sla / maxHours) * 100
  const color     = DEPARTMENT_COLOR[dept as keyof typeof DEPARTMENT_COLOR] ?? '#94A3B8'
  const breached  = actual > sla

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700 truncate flex-1 mr-2">{label}</span>
        <span className={`text-xs font-semibold flex-shrink-0 ${breached ? 'text-red-600' : 'text-gray-500'}`}>
          {fmtHours(actual)} / {fmtHours(sla)}
        </span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        {/* SLA marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
          style={{ left: `${slaPct}%` }}
        />
        {/* Actual bar */}
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${actualPct}%`,
            background: breached ? '#EF4444' : color,
          }}
        />
      </div>
    </div>
  )
}

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
      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Bottleneck Stages" value={stageStats.filter(s => s.ratio > 1).length} color="#EF4444" />
        <StatCard label="Orders Breaching SLA"      value={totalBreached}                               color="#F97316" />
        <StatCard label="Avg SLA Ratio"             value={`${Math.round(avgRatio * 100)}%`}            color="#F59E0B" />
        <StatCard
          label="Worst Stage"
          value={worstStage?.stage.split(' ').slice(0, 2).join(' ') ?? '—'}
          color="#EF4444"
        />
      </div>

      {/* STAGE DWELL TIME vs SLA */}
      <section className="mb-8">
        <SectionTitle title="Stage Dwell Time vs SLA" />
        <div className="mt-3 bg-white border border-border-default rounded-card shadow-card p-4">
          <p className="text-xs text-gray-500 mb-4">
            Gray marker = SLA limit. Red bar = SLA breached. Sorted by worst ratio first.
          </p>
          <div className="divide-y divide-border-default">
            {stageStats.map(s => (
              <BarComparison
                key={s.stage}
                label={s.stage}
                actual={s.avgHours}
                sla={s.slaHours}
                dept={s.dept}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PER-PERSON AVG HANDLING TIME */}
      <section className="mb-8">
        <SectionTitle title="Avg Handling Time per Person (Top 10 Slowest)" />
        <div className="mt-3 bg-white border border-border-default rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border-default">
              <tr>
                {['Person', 'Stages Handled', 'Avg Time per Stage', 'Note'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {personStats.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.totalStages}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${p.avgDuration > 8 ? 'text-red-600' : p.avgDuration > 4 ? 'text-amber-600' : 'text-green-600'}`}>
                      {fmtHours(p.avgDuration)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {p.avgDuration > 8 ? 'Consistently slow — review workload' : p.avgDuration > 4 ? 'Approaching limit' : 'Within SLA'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TOP 10 OLDEST ACTIVE ORDERS */}
      <section className="mb-8">
        <SectionTitle title="Top 10 Oldest Active Orders" />
        <div className="mt-3 bg-white border border-border-default rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border-default">
              <tr>
                {['Delivery No.', 'Destination', 'Current Stage', 'Total Time', 'Responsible', 'Urgency'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {oldestOrders.map((o, i) => {
                const sla = STAGE_SLA_HOURS[o.stage]
                const status = getSlaStatus(o.elapsedHours, sla)
                return (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                        <span className="font-mono font-semibold text-brand-500 text-xs">{o.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs truncate max-w-[120px]">{o.destination}</td>
                    <td className="px-4 py-3"><StagePill stage={o.stage} /></td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-red-600">{fmtHours(o.totalElapsedHours)}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{o.assignedToName ?? 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${
                        o.urgency === 'Urgent' ? 'text-red-600' :
                        o.urgency === 'High'   ? 'text-orange-500' :
                        o.urgency === 'Medium' ? 'text-amber-500' : 'text-green-600'
                      }`}>{o.urgency}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* TREND NOTE */}
      <section>
        <SectionTitle title="Stage Trend (vs Last Week)" />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {[
            { stage: 'Processing',          change: +1.2, note: 'Warehouse backlog building' },
            { stage: 'Post QAQC',           change: +2.1, note: 'Inspector throughput reduced' },
            { stage: 'Dispatch Queue',       change: -0.5, note: 'Improved assignment speed' },
            { stage: 'Containerization',     change: +0.8, note: 'Container shortage' },
            { stage: 'Waybill Pending Signature', change: -1.1, note: 'Faster approvals this week' },
            { stage: 'Preload QAQC',         change: +0.3, note: 'Minor increase, monitoring' },
          ].map(t => (
            <Card key={t.stage} className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700 truncate flex-1">{t.stage}</p>
                <span className={`text-xs font-bold ml-2 flex-shrink-0 ${t.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {t.change > 0 ? '+' : ''}{t.change}h
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.note}</p>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
