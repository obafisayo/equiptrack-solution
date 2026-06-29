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

const ACTION_CLASS = 'inline-flex items-center h-9 px-5 bg-gray-900 text-white rounded-lg text-[13px] font-semibold no-underline'

export function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'p-6' : 'p-12'}`}>
      <div className={`flex items-center justify-center shrink-0 rounded-full bg-gray-100 ${compact ? 'w-10 h-10' : 'w-14 h-14'}`}>
        <Icon size={compact ? 20 : 28} className="text-gray-400" />
      </div>

      <p className={`font-semibold text-gray-900 ${compact ? 'text-sm mt-3' : 'text-base mt-4'}`}>
        {title}
      </p>

      <p className="text-[13px] text-gray-500 mt-1.5 max-w-[280px] leading-relaxed">
        {description}
      </p>

      {action && (
        action.href ? (
          <Link href={action.href} className={`${ACTION_CLASS} ${compact ? 'mt-4' : 'mt-5'}`}>
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className={`${ACTION_CLASS} border-none cursor-pointer ${compact ? 'mt-4' : 'mt-5'}`}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
