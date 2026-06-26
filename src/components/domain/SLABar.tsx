import { getSlaStatus, fmtHours } from '@/config/sla'

interface SLABarProps {
  elapsedHours: number
  slaHours: number
  showLabel?: boolean
  className?: string
}

export function SLABar({ elapsedHours, slaHours, showLabel = true, className = '' }: SLABarProps) {
  const status = getSlaStatus(elapsedHours, slaHours)

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${status.pct}%`, background: status.color }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: status.color }}>
            {status.breached ? 'SLA BREACHED' : status.warning ? 'Warning' : 'On track'}
          </span>
          <span className="text-xs text-gray-400">
            {fmtHours(elapsedHours)} / {fmtHours(slaHours)}
          </span>
        </div>
      )}
    </div>
  )
}
