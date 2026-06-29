import { getSlaStatus, fmtHours } from '@/config/sla'

interface SLABarProps {
  elapsedHours: number
  slaHours: number
  showLabel?: boolean
  className?: string
}

const SLA_BAR_CLASS = {
  breached: { bar: 'bg-red-500',   text: 'text-red-600' },
  warning:  { bar: 'bg-amber-500', text: 'text-amber-600' },
  ontrack:  { bar: 'bg-green-500', text: 'text-green-600' },
}

export function SLABar({ elapsedHours, slaHours, showLabel = true, className = '' }: SLABarProps) {
  const status = getSlaStatus(elapsedHours, slaHours)
  const cls = status.breached ? SLA_BAR_CLASS.breached : status.warning ? SLA_BAR_CLASS.warning : SLA_BAR_CLASS.ontrack

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${cls.bar}`}
          style={{ width: `${status.pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className={`text-[11px] font-medium ${cls.text}`}>
            {status.breached ? 'SLA BREACHED' : status.warning ? 'Warning' : 'On track'}
          </span>
          <span className="text-[11px] text-gray-500">
            {fmtHours(elapsedHours)} / {fmtHours(slaHours)}
          </span>
        </div>
      )}
    </div>
  )
}
