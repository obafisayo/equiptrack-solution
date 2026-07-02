import type { LucideIcon } from 'lucide-react'

interface TrendInfo {
  direction: 'up' | 'down' | 'neutral'
  value: string
  positive: boolean
}

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color?: string
  trend?: TrendInfo | string
  trendPositive?: boolean
  sub?: string
  loading?: boolean
}

type TrendVariant = 'positive' | 'negative' | 'neutral'

// Map the known runtime `color` prop values to Tailwind class pairs (bg + text).
// The icon square uses a ~10% tint of the accent color — these map to /10 opacity variants.
const ICON_CLASS: Record<string, string> = {
  '#F04A4A': 'bg-red-500/10     text-red-500',
  '#E02828': 'bg-red-600/10     text-red-600',
  '#22C55E': 'bg-green-500/10   text-green-500',
  '#10B981': 'bg-emerald-500/10 text-emerald-500',
  '#F59E0B': 'bg-amber-500/10   text-amber-500',
  '#F97316': 'bg-orange-500/10  text-orange-500',
  '#EF4444': 'bg-red-500/10     text-red-500',
  '#8B5CF6': 'bg-violet-500/10  text-violet-500',
  '#94A3B8': 'bg-slate-400/10   text-slate-400',
}

const TREND_CLASS: Record<TrendVariant, string> = {
  positive: 'bg-green-50 text-green-700',
  negative: 'bg-red-50   text-red-700',
  neutral:  'bg-gray-100 text-gray-500',
}

function resolveTrend(
  trend: TrendInfo | string | undefined,
  trendPositive?: boolean,
): { text: string; arrow: '↑' | '↓' | '→'; variant: TrendVariant } | null {
  if (!trend) return null

  if (typeof trend === 'string') {
    const isNeutral = !trend.startsWith('+') && !trend.startsWith('-')
    const positive  = trendPositive ?? trend.startsWith('+')
    const arrow: '↑' | '↓' | '→' = isNeutral ? '→' : positive ? '↑' : '↓'
    const variant: TrendVariant = isNeutral ? 'neutral' : positive ? 'positive' : 'negative'
    return { text: trend, arrow, variant }
  }

  const arrow: '↑' | '↓' | '→' = trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'
  const variant: TrendVariant = trend.direction === 'neutral' ? 'neutral' : trend.positive ? 'positive' : 'negative'
  return { text: trend.value, arrow, variant }
}

export function StatCard({
  label, value, icon: Icon, color = '#F04A4A',
  trend, trendPositive, sub, loading,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-card border border-border-default p-5 shadow-card animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  const resolved = resolveTrend(trend, trendPositive)

  return (
    <div className="bg-white rounded-card border border-border-default p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">

        {/* Left: label → value → trend */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-[28px] font-bold text-gray-900 leading-none tabular-nums">{value}</p>
          {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
          {resolved && (
            <div className="mt-2">
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${TREND_CLASS[resolved.variant]}`}>
                {resolved.arrow} {resolved.text}
              </span>
            </div>
          )}
        </div>

        {/* Right: icon in colored rounded square */}
        <div className={`shrink-0 rounded-lg flex items-center justify-center w-8 h-8 ${ICON_CLASS[color] ?? 'bg-gray-100 text-gray-500'}`}>
          <Icon size={16} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
