import type { ReactNode } from 'react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface SearchProps {
  placeholder: string
  value: string
  onChange: (v: string) => void
}

interface TopbarProps {
  title: string
  breadcrumb?: BreadcrumbItem[]
  actions?: ReactNode
  search?: SearchProps
}

export function Topbar({ title, breadcrumb, actions, search }: TopbarProps) {
  return (
    <header
      className="flex items-center gap-4 px-6 flex-shrink-0 bg-white"
      style={{ height: 64, borderBottom: '1px solid #E2E8F0' }}
    >
      {/* Left: breadcrumb + title */}
      <div className="flex items-center gap-1 min-w-0 mr-auto">
        {breadcrumb && breadcrumb.length > 0 && (
          <>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">{crumb.label}</span>
                )}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-gray-300 flex-shrink-0"
                >
                  <path
                    d="M4.5 3L7.5 6L4.5 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ))}
          </>
        )}
        <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
      </div>

      {/* Center: search */}
      {search && (
        <div className="relative w-64 flex-shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder={search.placeholder}
            value={search.value}
            onChange={e => search.onChange(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-sm rounded-md border border-border-default bg-neutral-50 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow duration-150"
            style={{ borderColor: '#E2E8F0' }}
          />
        </div>
      )}

      {/* Right: actions */}
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}

      {/* Notification bell */}
      <button
        className="flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-neutral-100 transition-colors duration-150 flex-shrink-0"
        aria-label="Notifications"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6V9.5L2 11V12H14V11L12.5 9.5V6C12.5 3.51 10.49 1.5 8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 12.5C6.5 13.33 7.17 14 8 14C8.83 14 9.5 13.33 9.5 12.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </svg>
      </button>
    </header>
  )
}
