'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { WORK_ORDERS } from '@/lib/mock-data'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { getCurrentRange, getPreviousRange, inRange, type ComparisonMode } from './_components/helpers'
import { PeriodComparison } from './_components/PeriodComparison'
import { IndividualPerformanceTable } from './_components/IndividualPerformanceTable'

const MODES: { value: ComparisonMode; label: string }[] = [
  { value: 'daily',   label: 'Daily'   },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly',  label: 'Yearly'  },
]

const DEPTS = ['All', 'warehouse', 'dispatch', 'qaqc']

function computeMetrics(orders: typeof WORK_ORDERS, mode: ComparisonMode, period: 'current' | 'previous') {
  const range = period === 'current' ? getCurrentRange(mode) : getPreviousRange(mode)
  const inPeriod = orders.filter(o => inRange(o.createdAt, range))

  const shipped = inPeriod.filter(o => o.status === 'completed').length
  const avgCycleHours = inPeriod.length > 0
    ? Math.round(inPeriod.reduce((s, o) => s + o.totalElapsedHours, 0) / inPeriod.length)
    : 0
  const breachedOrders = inPeriod.filter(o => {
    const sla = STAGE_SLA_HOURS[o.stage]
    return sla != null && o.elapsedHours > sla
  })
  const breached = breachedOrders.length
  const slaPerformance = inPeriod.length > 0
    ? Math.round(((inPeriod.length - breached) / inPeriod.length) * 100)
    : 100

  return { shipped, avgCycleHours, slaPerformance, breached }
}

// Simple bar chart — daily/weekly breakdown of throughput
function MiniBarChart({ mode }: { mode: ComparisonMode }) {
  const bars = useMemo(() => {
    const now = new Date()
    const items: { label: string; count: number }[] = []

    if (mode === 'daily') {
      for (let h = 0; h < 24; h += 4) {
        const label = h === 0 ? '12am' : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`
        const count = WORK_ORDERS.filter(o => {
          const d = new Date(o.createdAt)
          return d.getHours() >= h && d.getHours() < h + 4 && d.toDateString() === now.toDateString()
        }).length
        items.push({ label, count })
      }
    } else if (mode === 'weekly') {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay())
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart); day.setDate(weekStart.getDate() + i)
        const count = WORK_ORDERS.filter(o => {
          const d = new Date(o.createdAt)
          return d.toDateString() === day.toDateString()
        }).length
        items.push({ label: dayNames[i], count })
      }
    } else if (mode === 'monthly') {
      for (let w = 1; w <= 4; w++) {
        items.push({ label: `Wk ${w}`, count: Math.floor(Math.random() * 12 + 3) })
      }
    } else {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      for (let m = 0; m < 12; m++) {
        const count = WORK_ORDERS.filter(o => new Date(o.createdAt).getMonth() === m).length
        items.push({ label: months[m], count })
      }
    }
    return items
  }, [mode])

  const maxCount = Math.max(...bars.map(b => b.count), 1)

  return (
    <div className="bg-white border border-border-default rounded-card shadow-card p-5 mb-6">
      <h3 className="text-[14px] font-bold text-gray-800 mb-4">Throughput Breakdown</h3>
      <div className="flex items-end gap-2 h-32">
        {bars.map(b => (
          <div key={b.label} className="flex flex-col items-center flex-1 gap-1">
            <span className="text-[10px] text-gray-500">{b.count || ''}</span>
            <div className="w-full rounded-t-sm bg-brand-500 transition-all duration-300" style={{ height: `${(b.count / maxCount) * 100}%`, minHeight: b.count > 0 ? 4 : 0 }} />
            <span className="text-[10px] text-gray-400">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PerformancePage() {
  const [mode, setMode] = useState<ComparisonMode>('weekly')
  const [deptFilter, setDeptFilter] = useState('All')

  const current  = useMemo(() => computeMetrics(WORK_ORDERS, mode, 'current'),  [mode])
  const previous = useMemo(() => computeMetrics(WORK_ORDERS, mode, 'previous'), [mode])

  const currentRange  = getCurrentRange(mode)
  const previousRange = getPreviousRange(mode)

  return (
    <AppShell
      role="exec"
      currentPath="/executive/performance"
      title="Performance Timeline"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Executive', href: '/executive' }, { label: 'Performance' }]}
    >
      {/* Mode selector */}
      <div className="flex items-center gap-1 bg-white border border-border-default rounded-lg p-1 w-fit mb-6 shadow-card">
        {MODES.map(m => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={[
              'px-4 py-1.5 rounded-md text-[13px] font-semibold transition-colors duration-150',
              mode === m.value
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800',
            ].join(' ')}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Period comparison cards */}
      <PeriodComparison
        current={current}
        previous={previous}
        currentLabel={currentRange.label}
        previousLabel={previousRange.label}
      />

      {/* Throughput bar chart */}
      <MiniBarChart mode={mode} />

      {/* Dept filter for individual table */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">Filter:</span>
        {DEPTS.map(d => (
          <button
            key={d}
            onClick={() => setDeptFilter(d)}
            className={[
              'px-3 py-1 rounded-md text-[12px] font-semibold border transition-colors duration-150',
              deptFilter === d
                ? 'border-brand-500 text-brand-500 bg-red-50'
                : 'border-border-default text-gray-500 hover:border-gray-400',
            ].join(' ')}
          >
            {d === 'All' ? 'All Depts' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Individual performance table */}
      <IndividualPerformanceTable mode={mode} deptFilter={deptFilter} />
    </AppShell>
  )
}
