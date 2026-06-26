import type { ReactNode } from 'react'

interface TrendInfo {
  direction: 'up' | 'down' | 'neutral'
  value: string
  positive: boolean
}

interface StatCardProps {
  label: string
  value: string | number
  trend?: TrendInfo
  icon?: ReactNode
  color?: string
  loading?: boolean
  sublabel?: string
}

export function StatCard({ label, value, trend, icon, color, loading, sublabel }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-card shadow-card border border-border-default p-5 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-card shadow-card border border-border-default p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-500 mb-1 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
          {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-semibold ${trend.positive ? 'text-status-low' : trend.direction === 'neutral' ? 'text-gray-400' : 'text-status-critical'}`}>
                {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
              </span>
              <span className="text-xs text-gray-400">vs last week</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: color ? color + '18' : '#F04A4A18', color: color ?? '#F04A4A' }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
export default StatCard
