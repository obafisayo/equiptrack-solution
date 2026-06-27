'use client'

import type { ReactNode } from 'react'

// ── ChartCard ─────────────────────────────────────────────
export function ChartCard({ title, subtitle, children, className = '' }: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white rounded-card shadow-card border border-border-default p-5 ${className}`}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ── TrendChart ────────────────────────────────────────────
// Supports single-series: data=[{label,value}] or multi-series: series=[{label,values,color}] + labels
interface TrendChartSingleProps {
  data: { label: string; value: number; secondValue?: number }[]
  color?: string
  height?: number
  series?: never
  labels?: never
}
interface TrendChartMultiProps {
  series: { label: string; values: number[]; color: string }[]
  labels: string[]
  height?: number
  data?: never
  color?: never
}
type TrendChartProps = TrendChartSingleProps | TrendChartMultiProps

export function TrendChart(props: TrendChartProps) {
  const w = 300
  const h = props.height ?? 80
  const pad = 4

  // Normalise to multi-series format
  let seriesList: { label: string; values: number[]; color: string }[]
  let labels: string[]

  if (props.series) {
    seriesList = props.series
    labels = props.labels
  } else {
    const d = props.data ?? []
    seriesList = [{ label: 'Value', values: d.map(x => x.value), color: props.color ?? '#F04A4A' }]
    if (d.some(x => x.secondValue != null)) {
      seriesList.push({ label: 'Second', values: d.map(x => x.secondValue ?? 0), color: '#22C55E' })
    }
    labels = d.map(x => x.label)
  }

  if (!labels.length) return null

  const allValues = seriesList.flatMap(s => s.values)
  const max = Math.max(...allValues, 1)
  const step = labels.length > 1 ? (w - pad * 2) / (labels.length - 1) : 0

  function buildPath(values: number[]) {
    const pts = values.map((v, i) => ({
      x: pad + i * step,
      y: h - pad - ((v / max) * (h - pad * 2)),
    }))
    return {
      pts,
      line: pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '),
      area: `${pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${pts[pts.length - 1].x} ${h} L ${pad} ${h} Z`,
    }
  }

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        <defs>
          {seriesList.map((s, si) => (
            <linearGradient key={si} id={`tgrad-${si}-${s.color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {seriesList.map((s, si) => {
          const { pts, line, area } = buildPath(s.values)
          return (
            <g key={si}>
              <path d={area} fill={`url(#tgrad-${si}-${s.color.replace('#', '')})`} />
              <path d={line} stroke={s.color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill={s.color} />
              ))}
            </g>
          )
        })}
      </svg>
      <div className="flex justify-between" style={{ marginTop: 4 }}>
        {labels.map((l, i) => (
          <span key={i} style={{ fontSize: 11, color: '#9CA3AF' }}>{l}</span>
        ))}
      </div>
    </div>
  )
}

// ── BarChart ──────────────────────────────────────────────
export function BarChart({ data, color = '#3B82F6', height = 120 }: {
  data: { label: string; value: number; target?: number }[]
  color?: string
  height?: number
}) {
  const max = Math.max(...data.map(d => Math.max(d.value, d.target ?? 0)), 1)

  const chartH = height - 28
  return (
    <div style={{ height }}>
      {/* Grid lines */}
      <div className="relative w-full" style={{ height: chartH, marginBottom: 4 }}>
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <div
            key={t}
            className="absolute w-full"
            style={{ bottom: `${t * 100}%`, height: 1, background: '#F3F4F6' }}
          />
        ))}
        {/* Bars */}
        <div className="absolute inset-0 flex items-end gap-2">
          {data.map((d, i) => {
            const barH = (d.value / max) * chartH
            const targetH = d.target ? (d.target / max) * chartH : null
            return (
              <div key={i} className="flex-1 relative flex items-end justify-center h-full">
                <div
                  className="relative w-full"
                  style={{ height: barH }}
                >
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm transition-all duration-300"
                    style={{ height: '100%', background: color + 'CC' }}
                  />
                  {targetH && (
                    <div
                      className="absolute w-full border-t-2 border-dashed"
                      style={{ bottom: targetH - barH, borderColor: color }}
                    />
                  )}
                </div>
                <span
                  className="absolute"
                  style={{ bottom: barH + 2, fontSize: 11, color: '#9CA3AF', fontWeight: 500, left: 0, right: 0, textAlign: 'center' }}
                >
                  {d.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {/* Axis labels */}
      <div className="flex gap-2">
        {data.map((d, i) => (
          <span key={i} className="flex-1 text-center leading-tight" style={{ fontSize: 11, color: '#9CA3AF' }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── LoadBars ──────────────────────────────────────────────
// Accepts either { label, value, max } or { name, active, capacity }
type LoadBarItem =
  | { label: string; value: number; max: number; name?: never; active?: never; capacity?: never }
  | { name: string; active: number; capacity: number; label?: never; value?: never; max?: never }

export function LoadBars({ data }: { data: LoadBarItem[] }) {
  return (
    <div className="space-y-3">
      {data.map((p, i) => {
        const name = p.label ?? p.name ?? '?'
        const active = p.value ?? p.active ?? 0
        const cap = p.max ?? p.capacity ?? 1
        const pct = cap > 0 ? (active / cap) * 100 : 0
        const color = pct > 80 ? '#F59E0B' : pct > 60 ? '#3B82F6' : '#22C55E'
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700">{name}</span>
              <span className="text-xs font-semibold" style={{ color }}>
                {active}/{cap}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(pct, 100)}%`, background: color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── DonutChart ────────────────────────────────────────────
export function DonutChart({ data, size = 120 }: {
  data: { label: string; value: number; color: string }[]
  size?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <div className="text-xs text-gray-400 text-center py-4">No data</div>

  const r = 40
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r

  let offset = 0
  const slices = data.map(d => {
    const pct = d.value / total
    const len = pct * circumference
    const slice = { ...d, pct, len, offset }
    offset += len
    return slice
  })

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F3F5" strokeWidth="18" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="18"
            strokeDasharray={`${s.len} ${circumference - s.len}`}
            strokeDashoffset={-(s.offset - circumference / 4)}
            strokeLinecap="butt"
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-xl font-bold fill-gray-900" fontSize="14" fontWeight="700">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-gray-400" fontSize="9">total</text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-gray-600 font-medium">{s.label}</span>
            </div>
            <span className="text-gray-800 font-semibold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
