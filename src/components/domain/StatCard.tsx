import type { LucideIcon } from 'lucide-react'

/* Backwards-compatible trend format (used by executive/page.tsx) */
interface TrendInfo {
  direction: 'up' | 'down' | 'neutral'
  value: string
  positive: boolean
}

interface StatCardProps {
  label: string
  value: string | number
  /** Lucide icon component — mandatory for every StatCard */
  icon: LucideIcon
  /** Accent color for the icon bg/stroke. Defaults to brand red. */
  color?: string
  /** Trend display. Accepts a formatted string ('+4.6%') or the legacy TrendInfo object. */
  trend?: TrendInfo | string
  /** Determines pill color when `trend` is a plain string. Auto-detected from +/- prefix if omitted. */
  trendPositive?: boolean
  /** Optional small subtext below the value */
  sub?: string
  /** Show skeleton loading state */
  loading?: boolean
}

const PILL = {
  positive: { bg: '#F0FDF4', color: '#16A34A' },
  negative: { bg: '#FEF2F2', color: '#DC2626' },
  neutral:  { bg: '#F1F5F9', color: '#64748B' },
} as const

function resolveTrend(
  trend: TrendInfo | string | undefined,
  trendPositive?: boolean,
): { text: string; arrow: '↑' | '↓' | '→'; style: { bg: string; color: string } } | null {
  if (!trend) return null

  if (typeof trend === 'string') {
    const positive  = trendPositive ?? trend.startsWith('+')
    const isNeutral = !trend.startsWith('+') && !trend.startsWith('-')
    const arrow: '↑' | '↓' | '→' = isNeutral ? '→' : positive ? '↑' : '↓'
    const style = isNeutral ? PILL.neutral : positive ? PILL.positive : PILL.negative
    return { text: trend, arrow, style }
  }

  /* Legacy TrendInfo format */
  const arrow: '↑' | '↓' | '→' = trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'
  const style = trend.direction === 'neutral' ? PILL.neutral : trend.positive ? PILL.positive : PILL.negative
  return { text: trend.value, arrow, style }
}

export function StatCard({
  label, value, icon: Icon, color = '#F04A4A',
  trend, trendPositive, sub, loading,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-card border border-border-default p-5 animate-pulse"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  const resolved = resolveTrend(trend, trendPositive)

  return (
    <div
      className="bg-white rounded-card border border-border-default p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-start justify-between gap-3">

        {/* Left: label → value → trend pill */}
        <div className="min-w-0 flex-1">
          <p style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', margin: '0 0 4px' }}>
            {label}
          </p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums', margin: 0 }}>
            {value}
          </p>
          {sub && (
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '3px 0 0' }}>{sub}</p>
          )}
          {resolved && (
            <div style={{ marginTop: 8 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                background: resolved.style.bg, color: resolved.style.color,
                borderRadius: 9999, padding: '2px 8px',
                fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
              }}>
                {resolved.arrow} {resolved.text}
              </span>
            </div>
          )}
        </div>

        {/* Right: 32×32 colored icon square */}
        <div
          className="flex-shrink-0 rounded-lg flex items-center justify-center"
          style={{ width: 32, height: 32, background: color + '18', color }}
        >
          <Icon size={16} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
