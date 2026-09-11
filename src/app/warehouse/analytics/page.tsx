'use client'

import { useState, useMemo } from 'react'
import { BarChart2, AlertTriangle, Clock, CheckCircle, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { WORK_ORDERS, getPersonnelByDept } from '@/lib/mock-data'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { Select } from '@/components/ui/Form'
import { type Stage } from '@/lib/lifecycle'

const WH_STAGES: Stage[] = [
  'Pending Base Coordinator Approval', 'New Request', 'Warehouse Assigned', 'Picking', 'GI Created', 'Transferred to Dispatch',
]

const MONTHS = [
  { value: '', label: 'All Time' },
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' },   { value: '04', label: 'April' },
  { value: '05', label: 'May' },     { value: '06', label: 'June' },
  { value: '07', label: 'July' },    { value: '08', label: 'August' },
  { value: '09', label: 'September' },{ value: '10', label: 'October' },
  { value: '11', label: 'November' },{ value: '12', label: 'December' },
]
const currentYear = new Date().getFullYear()
const YEARS = [
  { value: '', label: 'All Years' },
  ...Array.from({ length: 5 }, (_, i) => {
    const y = (currentYear - i).toString()
    return { value: y, label: y }
  }),
]

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-gray-700 w-48 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-mono font-semibold text-gray-900 w-8 text-right shrink-0">{value}</span>
    </div>
  )
}

export default function WarehouseAnalyticsPage() {
  const [monthFilter, setMonthFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  const whOrders = useMemo(() => {
    let list = WORK_ORDERS.filter(o => WH_STAGES.includes(o.stage as Stage))
    if (monthFilter || yearFilter) {
      list = list.filter(o => {
        const d = new Date(o.createdAt)
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const y = String(d.getFullYear())
        if (monthFilter && m !== monthFilter) return false
        if (yearFilter && y !== yearFilter) return false
        return true
      })
    }
    return list
  }, [monthFilter, yearFilter])

  const personnel = getPersonnelByDept('warehouse')

  const totalActive  = whOrders.length
  const slaBreached  = whOrders.filter(o => {
    const sla = STAGE_SLA_HOURS[o.stage]; return sla != null && o.elapsedHours > sla
  }).length
  const unassigned   = whOrders.filter(o => o.stage === 'New Request').length
  const transferred  = WORK_ORDERS.filter(o => o.stage === 'Transferred to Dispatch').length
  const avgElapsed   = totalActive > 0
    ? Math.round(whOrders.reduce((s, o) => s + o.totalElapsedHours, 0) / totalActive)
    : 0

  const urgencyCounts = useMemo(() => ({
    Urgent: whOrders.filter(o => o.urgency === 'Urgent').length,
    High:   whOrders.filter(o => o.urgency === 'High').length,
    Medium: whOrders.filter(o => o.urgency === 'Medium').length,
    Low:    whOrders.filter(o => o.urgency === 'Low').length,
  }), [whOrders])

  const stageCounts = useMemo(() =>
    WH_STAGES.map(stage => ({
      stage,
      count: whOrders.filter(o => o.stage === stage).length,
    })),
    [whOrders]
  )
  const maxStageCount = Math.max(...stageCounts.map(s => s.count), 1)

  const personnelLoad = useMemo(() =>
    personnel.map(p => ({
      name: p.name,
      active: whOrders.filter(o => o.assignedTo === p.id).length,
      capacity: p.capacity,
    })),
    [whOrders, personnel]
  )

  const STAGE_COLORS: Record<string, string> = {
    'Pending Base Coordinator Approval': '#94A3B8',
    'New Request': '#60A5FA',
    'Warehouse Assigned': '#3B82F6',
    'Picking': '#2563EB',
    'GI Created': '#1D4ED8',
    'Transferred to Dispatch': '#8B5CF6',
  }

  return (
    <AppShell
      role="wh_sup"
      currentPath="/warehouse/analytics"
      title="Warehouse Analytics"
      breadcrumb={[{ label: 'Dashboard', href: '/warehouse' }, { label: 'Analytics' }]}
    >
      {/* Date filters */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium text-gray-600">Period:</span>
        <Select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} size="sm" className="w-auto min-w-36">
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </Select>
        <Select value={yearFilter} onChange={e => setYearFilter(e.target.value)} size="sm" className="w-auto min-w-28">
          {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
        </Select>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Active Orders"       value={totalActive}  color="#3B82F6" icon={BarChart2}     />
        <StatCard label="Unassigned"          value={unassigned}   color="#D97706" icon={AlertTriangle} />
        <StatCard label="SLA Breaches"        value={slaBreached}  color="#EF4444" icon={AlertTriangle} />
        <StatCard label="Sent to Dispatch"    value={transferred}  color="#8B5CF6" icon={CheckCircle}   />
        <StatCard label="Avg Elapsed (h)"     value={avgElapsed}   color="#1A6FBF" icon={Clock}         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Stage breakdown */}
        <div className="bg-white rounded-card border border-border-default shadow-card p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Orders by Stage</h3>
          {stageCounts.map(({ stage, count }) => (
            <BarRow key={stage} label={stage} value={count} max={maxStageCount} color={STAGE_COLORS[stage] ?? '#3B82F6'} />
          ))}
        </div>

        {/* Urgency breakdown */}
        <div className="bg-white rounded-card border border-border-default shadow-card p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Orders by Urgency</h3>
          <BarRow label="Urgent" value={urgencyCounts.Urgent} max={totalActive || 1} color="#EF4444" />
          <BarRow label="High"   value={urgencyCounts.High}   max={totalActive || 1} color="#F97316" />
          <BarRow label="Medium" value={urgencyCounts.Medium} max={totalActive || 1} color="#F59E0B" />
          <BarRow label="Low"    value={urgencyCounts.Low}    max={totalActive || 1} color="#22C55E" />
        </div>
      </div>

      {/* Personnel load */}
      <div className="bg-white rounded-card border border-border-default shadow-card p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={15} className="text-blue-500" />
          Personnel Load
        </h3>
        <div className="space-y-1">
          {personnelLoad.map(({ name, active, capacity }) => {
            const pct = capacity > 0 ? Math.round((active / capacity) * 100) : 0
            const barColor = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#3B82F6'
            return (
              <div key={name} className="flex items-center gap-3 py-2">
                <span className="text-sm text-gray-700 w-48 shrink-0 truncate">{name}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                </div>
                <span className="text-sm font-mono font-semibold text-gray-900 w-14 text-right shrink-0">{active}/{capacity}</span>
                <span className="text-xs text-gray-400 w-10 text-right shrink-0">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
