import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  slaBreached?: boolean
  selected?: boolean
  hoverable?: boolean
}

export function Card({
  children,
  className = '',
  onClick,
  slaBreached = false,
  selected = false,
  hoverable = false,
}: CardProps) {
  const base = 'relative bg-white rounded-card shadow-card overflow-hidden'

  const borderClass = selected
    ? 'border border-brand-500'
    : slaBreached
    ? 'border border-red-200'
    : 'border border-border-default'

  const glowClass = slaBreached ? 'shadow-sla-breach' : ''

  const hoverClass =
    hoverable || onClick
      ? 'cursor-pointer transition-shadow duration-150 hover:shadow-raised'
      : ''

  const selectedBg = selected ? 'bg-red-50/30' : ''

  return (
    <div
      onClick={onClick}
      className={[base, borderClass, glowClass, hoverClass, selectedBg, className].join(' ')}
    >
      {slaBreached && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-status-critical rounded-t-card" />
      )}
      {children}
    </div>
  )
}
