/* eslint-disable */
'use client'

import type { ReactNode } from 'react'
import {
  ResponsiveContainer,
  LineChart, Line, BarChart as RBarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

// ── ChartCard ─────────────────────────────────────────────────────────────────
export function ChartCard({ title, subtitle, children, className = '' }: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white rounded-card shadow-card border border-border-default p-5 flex flex-col ${className}`}>
      <div className="mb-4 shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  )
}

// ── Shared tooltip ─────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border-default rounded-lg shadow-overlay px-3 py-2 text-xs">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-medium" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

// ── TrendChart — multi-series line chart ──────────────────────────────────────
export function TrendChart({ series, labels, height = 160 }: {
  series: { label: string; values: number[]; color: string }[]
  labels: string[]
  height?: number
}) {
  const data = labels.map((day, i) => {
    const row: Record<string, any> = { day }
    series.forEach(s => { row[s.label] = s.values[i] ?? 0 })
    return row
  })

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} />
          {series.map(s => (
            <Line
              key={s.label}
              type="monotone"
              dataKey={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={600}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── BarChart — weekly volume bar chart ────────────────────────────────────────
export function BarChart({ data, color = '#8B5CF6', height = 160 }: {
  data: { label: string; value: number; target?: number }[]
  color?: string
  height?: number
}) {
  const chartData = data.map(d => ({ name: d.label, value: d.value, target: d.target }))

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Bar
            dataKey="value"
            name="Volume"
            fill={color}
            radius={[4, 4, 0, 0]}
            animationDuration={600}
          />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── LoadBars — horizontal capacity bars (unchanged — works well as-is) ─────────
type LoadBarItem =
  | { label: string; value: number; max: number; name?: never; active?: never; capacity?: never }
  | { name: string; active: number; capacity: number; label?: never; value?: never; max?: never }

export function LoadBars({ data }: { data: LoadBarItem[] }) {
  return (
    <div className="space-y-3">
      {data.map((p, i) => {
        const name   = p.label ?? p.name ?? '?'
        const active = p.value ?? p.active ?? 0
        const cap    = p.max ?? p.capacity ?? 1
        const pct    = cap > 0 ? (active / cap) * 100 : 0
        const barClass  = pct > 80 ? 'bg-amber-500' : pct > 60 ? 'bg-blue-500' : 'bg-green-500'
        const textClass = pct > 80 ? 'text-amber-600' : pct > 60 ? 'text-blue-600' : 'text-green-600'
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700 truncate pr-2">{name}</span>
              <span className={`text-xs font-semibold shrink-0 ${textClass}`}>{active}/{cap}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barClass}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── DonutChart — department distribution ──────────────────────────────────────
export function DonutChart({ data, size = 160 }: {
  data: { label: string; value: number; color: string }[]
  size?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <div className="text-xs text-gray-400 text-center py-4">No data</div>

  return (
    <div className="flex items-center gap-4 w-full">
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              dataKey="value"
              animationBegin={0}
              animationDuration={700}
              paddingAngle={2}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]
                return (
                  <div className="bg-white border border-border-default rounded-lg shadow-overlay px-3 py-2 text-xs">
                    <p className="font-semibold" style={{ color: d.payload.color }}>{d.name}</p>
                    <p className="text-gray-600">{d.value}%</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-gray-600 font-medium truncate">{d.label}</span>
            </div>
            <span className="text-gray-800 font-semibold shrink-0">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
