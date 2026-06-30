'use client'

import { Bell, Search, Menu, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Role } from '@/lib/lifecycle'
import { Avatar } from '@/components/ui/Avatar'

const ROLE_USER: Record<Role, string> = {
  requester:   'Kenneth Nwosu',
  wh_sup:      'Yinka Adeyemi',
  wh_per:      'Emeka Okonkwo',
  dsp_sup:     'Chika Obi',
  dsp_per:     'Biodun Adekunle',
  qaqc:        'Femi Emmanuel',
  exec:        'O. Bello',
  safety:      'Aisha Musa',
  logistics:   'Danjuma Yusuf',
  inventory:   'Ngozi Eze',
  maintenance: 'Segun Folarin',
  sysadmin:    'System Admin',
}

interface TopbarProps {
  title: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: ReactNode
  search?: {
    placeholder?: string
    value: string
    onChange: (v: string) => void
  }
  role: Role
  onMobileMenuToggle: () => void
}

export function Topbar({
  title,
  breadcrumb,
  actions,
  search,
  role,
  onMobileMenuToggle,
}: TopbarProps) {
  const userName = ROLE_USER[role]

  return (
    <header className="bg-white border-b border-border-default h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">

      {/* Left side: Mobile menu toggle + Breadcrumbs/Title */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 -ml-2 text-neutral-500 hover:bg-neutral-100 rounded-md focus:outline-none"
        >
          <Menu size={20} />
        </button>

        {/* Brand mark — visible on mobile only, since the sidebar (which normally carries it) is hidden behind the drawer */}
        <div className="md:hidden flex items-center justify-center shrink-0 rounded-[7px] w-7 h-7 bg-brand-500">
          <svg width="13" height="13" viewBox="0 0 40 40" fill="none">
            <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
            <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
            <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
          </svg>
        </div>

        {breadcrumb ? (
          <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
            {breadcrumb.map((b, i) => {
              const isLast = i === breadcrumb.length - 1
              return (
                <div key={i} className="flex items-center gap-2">
                  {b.href && !isLast ? (
                    <Link href={b.href} className="text-neutral-500 hover:text-neutral-900 transition-colors">
                      {b.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-neutral-900' : 'text-neutral-500'}>
                      {b.label}
                    </span>
                  )}
                  {!isLast && <ChevronRight size={14} className="text-neutral-400" />}
                </div>
              )
            })}
          </nav>
        ) : (
          <h1 className="text-lg font-bold text-neutral-900 m-0">{title}</h1>
        )}
      </div>

      {/* Right side: Search, Actions, Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {search && (
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder={search.placeholder || 'Search...'}
              value={search.value}
              onChange={e => search.onChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-neutral-50 border border-border-default rounded-[7px] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {actions}

        <div className="flex items-center gap-3 border-l border-border-default pl-3 sm:pl-5 ml-1">
          <button className="relative p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-critical rounded-full border-2 border-white" />
          </button>
          
          {/* Avatar (mobile & desktop) */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <Avatar name={userName} size={32} />
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-neutral-900 group-hover:text-brand-500 transition-colors m-0 leading-tight">
                {userName}
              </p>
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}
