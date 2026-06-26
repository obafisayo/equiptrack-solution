import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'blue' | 'purple' | 'amber' | 'green' | 'red' | 'orange'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-600',
  blue:    'bg-status-info-bg text-blue-700',
  purple:  'bg-purple-50 text-purple-700',
  amber:   'bg-status-medium-bg text-amber-700',
  green:   'bg-status-low-bg text-green-700',
  red:     'bg-status-critical-bg text-red-700',
  orange:  'bg-status-high-bg text-orange-700',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-neutral-400',
  blue:    'bg-status-info',
  purple:  'bg-purple-500',
  amber:   'bg-status-medium',
  green:   'bg-status-low',
  red:     'bg-status-critical',
  orange:  'bg-status-high',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-2xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
}

export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  )
}
