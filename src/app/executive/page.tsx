'use client'

import { useState, useMemo } from 'react'
import { Timer, Package, CheckCircle2, AlertTriangle, TrendingUp, Users, Settings } from 'lucide-react'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { BottleneckHeatmap } from '@/components/domain/BottleneckHeatmap'
import { ChartCard, TrendChart, BarChart, LoadBars, DonutChart } from '@/components/domain/Charts'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { WORK_ORDERS, PERSONNEL } from '@/lib/mock-data'
import { LIFECYCLE, STAGE_DEPARTMENT } from '@/lib/lifecycle'
import { STAGE_SLA_HOURS, fmtHours, getSlaStatus } from '@/config/sla'

// ── Derived metrics ──────────────────────────────────────────────────────────

const allOrders = WORK_ORDERS
const activeOrders = allOrders.filter(o => !['Shipped', 'Completed'].includes(o.stage))

const shippedThisWeek = allOrders.filter(o =>
  o.stage === 'Shipped' || o.stage === 'Completed'
).length

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
function buildHeatmapData() {
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

// ── Trend data (mocked 7-day) ───────────────────────────────────────────────
const TREND_DATA = [
  { day: 'Mon', submitted: 8,  shipped: 5  },
  { day: 'Tue', submitted: 12, shipped: 9  },
  { day: 'Wed', submitted: 7,  shipped: 11 },
  { day: 'Thu', submitted: 15, shipped: 8  },
  { day: 'Fri', submitted: 10, shipped: 13 },
  { day: 'Sat', submitted: 6,  shipped: 7  },
  { day: 'Sun', submitted: 9,  shipped: 6  },
]

const BAR_DATA = TREND_DATA.map(d => ({
  label: d.day,
  value: d.submitted,
}))

// ── Personnel load data ──────────────────────────────────────────────────────
const ALL_PERSONNEL = [
  ...PERSONNEL.filter(p => p.dept === 'warehouse'),
  ...PERSONNEL.filter(p => p.dept === 'dispatch'),
  ...PERSONNEL.filter(p => p.dept === 'qaqc'),
]

// ── Supervisor performance ──────────────────────────────────────────────────
const SUPERVISOR_PERF = [
  {
    name: 'Yinka Adeyemi',
    team: 'Warehouse',
    activeOrders: allOrders.filter(o => ['warehouse'].includes(STAGE_DEPARTMENT[o.stage])).length,
    avgStageTime: '3h 45m',
    slaCompliance: 87,
    trend: 'up' as const,
  },
  {
    name: 'Chika Obi',
    team: 'Dispatch',
    activeOrders: allOrders.filter(o => STAGE_DEPARTMENT[o.stage] === 'dispatch').length,
    avgStageTime: '2h 20m',
    slaCompliance: 94,
    trend: 'up' as const,
  },
  {
    name: 'Femi Emmanuel',
    team: 'QAQC',
    activeOrders: allOrders.filter(o => STAGE_DEPARTMENT[o.stage] === 'qaqc').length,
    avgStageTime: '4h 10m',
    slaCompliance: 72,
    trend: 'down' as const,
  },
]

function SlaComplianceBadge({ pct }: { pct: number }) {
  const isGood = pct >= 90
  const isWarn = pct >= 75 && pct < 90
  const className = isGood ? 'bg-status-success-bg text-status-success' : isWarn ? 'bg-status-medium-bg text-status-medium' : 'bg-status-critical-bg text-status-critical'
  return (
    <span className={['text-xs font-bold px-2.5 py-0.5 rounded-badge', className].join(' ')}>
      {pct}%
    </span>
  )
}

function TrendArrow({ direction }: { direction: 'up' | 'down' }) {
  return direction === 'up'
    ? <span className="text-status-success font-bold text-lg">&uarr;</span>
    : <span className="text-status-critical font-bold text-lg">&darr;</span>
}

export default function ExecutivePage() {
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [sortCol, setSortCol]       = useState<'id' | 'stage' | 'elapsed'>('elapsed')

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
      actionLabel="Bottleneck Analysis"
      actionHref="/executive/bottlenecks"
    >
      {/* ── Admin quick links ────────────────────────────────────────────── */}
      <div className="bg-white rounded-card border border-border-default shadow-sm p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 m-0">Organization Administration</h2>
          <p className="text-xs text-neutral-500 m-0 mt-0.5">Manage your team, settings, and integrations</p>
        </div>
        <div className="flex gap-3">
          <Link href="/executive/users" className="bg-brand-50 text-brand-500 hover:bg-brand-100 px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors">
            <Users size={14} />
            User Management
          </Link>
          <Link href="/executive/settings" className="bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-border-default px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors">
            <Settings size={14} />
            Org Settings
          </Link>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Avg Cycle Time"
          value={fmtCycleTime(avgCycleHours)}
          color={avgCycleHours > TARGET_CYCLE_HOURS ? '#EF4444' : '#22C55E'}
          trend={{ direction: avgCycleHours > TARGET_CYCLE_HOURS ? 'up' : 'down', value: 'Target: ' + fmtCycleTime(TARGET_CYCLE_HOURS), positive: avgCycleHours <= TARGET_CYCLE_HOURS }}
          icon={Timer}
        />
        <StatCard label="Active Requests"   value={activeOrders.length} color="#3B82F6" icon={Package} />
        <StatCard label="Shipped This Week" value={shippedThisWeek}     color="#10B981" icon={CheckCircle2} />
        <StatCard
          label="SLA Breach Rate"
          value={slaBreachRate + '%'}
          color={slaBreachRate > 10 ? '#EF4444' : '#22C55E'}
          trend={{ direction: slaBreachRate > 10 ? 'up' : 'down', value: breachedCount + ' orders', positive: slaBreachRate <= 10 }}
          icon={AlertTriangle}
        />
        <StatCard
          label="On-Time Delivery"
          value={(100 - slaBreachRate) + '%'}
          color={100 - slaBreachRate >= 90 ? '#22C55E' : '#F59E0B'}
          icon={TrendingUp}
        />
      </div>

      {/* BOTTLENECK HEATMAP */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 tracking-wide m-0">Department Dwell Time</h2>
            <p className="text-xs text-neutral-500 mt-0.5 m-0">Avg hours per stage vs SLA target — color indicates breach severity</p>
          </div>
          <Link href="/executive/bottlenecks" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline transition-colors">
            View detailed analysis &rarr;
          </Link>
        </div>
        <BottleneckHeatmap data={heatmapData} />
      </section>

      {/* ANALYTICS */}
      <h2 className="text-[15px] font-bold text-neutral-900 mb-4">Analytics</h2>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Requests Submitted vs Shipped" subtitle="Last 7 days">
          <TrendChart
            series={[
              { label: 'Submitted', values: TREND_DATA.map(d => d.submitted), color: '#3B82F6' },
              { label: 'Shipped',   values: TREND_DATA.map(d => d.shipped),   color: '#10B981' },
            ]}
            labels={TREND_DATA.map(d => d.day)}
            height={160}
          />
        </ChartCard>
        <ChartCard title="Orders by Department" subtitle="Current active requests">
          <DonutChart data={donutData} size={160} />
        </ChartCard>
      </div>

      {/* CHARTS ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <ChartCard title="Weekly Volume" subtitle="Requests processed per day">
          <BarChart data={BAR_DATA} height={160} color="#8B5CF6" />
        </ChartCard>
        <ChartCard title="Team Load" subtitle="Active orders vs capacity">
          <LoadBars data={loadBarsData} />
        </ChartCard>
      </div>

      {/* PERFORMANCE TABLE */}
      <section className="mb-8">
        <SectionTitle title="Performance by Supervisor" count={SUPERVISOR_PERF.length} />
        <div className="mt-3 bg-white border border-border-default rounded-card shadow-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-border-default">
              <tr>
                {['Supervisor', 'Team', 'Active Orders', 'Avg Stage Time', 'SLA Compliance', 'Trend'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {SUPERVISOR_PERF.map(sup => (
                <tr key={sup.name} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-neutral-900">{sup.name}</td>
                  <td className="px-4 py-3 text-neutral-600 font-medium">{sup.team}</td>
                  <td className="px-4 py-3 font-bold text-neutral-900">{sup.activeOrders}</td>
                  <td className="px-4 py-3 text-neutral-600 font-medium">{sup.avgStageTime}</td>
                  <td className="px-4 py-3"><SlaComplianceBadge pct={sup.slaCompliance} /></td>
                  <td className="px-4 py-3"><TrendArrow direction={sup.trend} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ALL ORDERS TABLE */}
      <section>
        <button
          onClick={() => setOrdersOpen(o => !o)}
          className="flex items-center gap-2 mb-3 text-sm font-semibold text-neutral-700 hover:text-neutral-900 focus:outline-none"
        >
          <span>All Active Orders ({activeOrders.length})</span>
          <span className="text-neutral-400 text-xs">{ordersOpen ? '▲' : '▼'}</span>
        </button>

        {ordersOpen && (
          <div className="bg-white border border-border-default rounded-card shadow-card overflow-x-auto animate-fade-in">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-border-default">
                <tr>
                  {[
                    { key: 'id',      label: 'Delivery No.' },
                    { key: 'stage',   label: 'Stage' },
                    { key: 'elapsed', label: 'Elapsed' },
                    { key: null,      label: 'Destination' },
                    { key: null,      label: 'Urgency' },
                    { key: null,      label: 'Responsible' },
                  ].map(col => (
                    <th
                      key={col.label}
                      onClick={() => col.key && setSortCol(col.key as 'id' | 'stage' | 'elapsed')}
                      className={['text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 py-3', col.key ? 'cursor-pointer hover:text-neutral-700' : ''].join(' ')}
                    >
                      {col.label}
                      {col.key && sortCol === col.key && <span className="ml-1 text-brand-500">&darr;</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {sortedOrders.map(o => {
                  const sla     = STAGE_SLA_HOURS[o.stage]
                  const status  = getSlaStatus(o.elapsedHours, sla)
                  return (
                    <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-brand-500 text-xs">{o.id}</td>
                      <td className="px-4 py-3"><StagePill stage={o.stage} /></td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold" style={{ color: status.color }}>
                          {fmtHours(o.elapsedHours)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-700 text-xs truncate max-w-[140px] font-medium">{o.destination}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-badge">{o.urgency}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 text-xs font-medium">{o.assignedToName ?? 'Unassigned'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  )
}
