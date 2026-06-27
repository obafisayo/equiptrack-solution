import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  compact?: boolean
}

export function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  const iconCircle = compact ? 40 : 56
  const iconSize   = compact ? 20 : 28

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? 24 : 48,
      }}
    >
      <div
        style={{
          width: iconCircle, height: iconCircle,
          borderRadius: '50%',
          background: '#F5F7FA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={iconSize} style={{ color: '#9CA3AF' }} />
      </div>

      <p
        style={{
          fontSize: compact ? 14 : 16,
          fontWeight: 600,
          color: '#111827',
          margin: `${compact ? 12 : 16}px 0 0`,
        }}
      >
        {title}
      </p>

      <p
        style={{
          fontSize: 13,
          color: '#6B7280',
          marginTop: 6,
          maxWidth: 280,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {action && (
        action.href ? (
          <Link
            href={action.href}
            style={{
              marginTop: compact ? 16 : 20,
              display: 'inline-flex', alignItems: 'center',
              height: 36, padding: '0 20px',
              background: '#111827', color: '#fff',
              borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            style={{
              marginTop: compact ? 16 : 20,
              display: 'inline-flex', alignItems: 'center',
              height: 36, padding: '0 20px',
              background: '#111827', color: '#fff',
              border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
