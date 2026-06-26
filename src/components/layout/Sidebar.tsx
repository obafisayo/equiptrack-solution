'use client'

import Link from 'next/link'
import type { Role } from '@/lib/lifecycle'
import { ROLE_LABEL } from '@/lib/lifecycle'

interface NavItem {
  href: string
  label: string
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  requester: [
    { href: '/requester',     label: 'My Requests' },
    { href: '/requester/new', label: 'Create Request' },
  ],
  wh_sup: [
    { href: '/warehouse',            label: 'SLA Breaches' },
    { href: '/warehouse/orders',     label: 'All Work Orders' },
    { href: '/warehouse/personnel',  label: 'Personnel Load' },
  ],
  wh_per: [
    { href: '/warehouse-personnel',          label: 'My Tasks' },
    { href: '/warehouse-personnel/history',  label: 'History' },
  ],
  dsp_sup: [
    { href: '/dispatch',            label: 'Dispatch Queue' },
    { href: '/dispatch/personnel',  label: 'Personnel Load' },
  ],
  dsp_per: [
    { href: '/dispatch-personnel',          label: 'My Tasks' },
    { href: '/dispatch-personnel/history',  label: 'History' },
  ],
  qaqc: [
    { href: '/qaqc',             label: 'QAQC Queue' },
    { href: '/qaqc/containers',  label: 'Container Fleet' },
  ],
  exec: [
    { href: '/executive',              label: 'Overview' },
    { href: '/executive/bottlenecks',  label: 'Bottlenecks' },
  ],
}

const ROLE_USER: Record<Role, string> = {
  requester: 'Kenneth Nwosu',
  wh_sup:    'Yinka Adeyemi',
  wh_per:    'Emeka Okonkwo',
  dsp_sup:   'Chika Obi',
  dsp_per:   'Biodun Adekunle',
  qaqc:      'Femi Emmanuel',
  exec:      'O. Bello (Director)',
}

function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const palette = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']
  const color = palette[name.charCodeAt(0) % palette.length]
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size / 2.8,
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

interface SidebarProps {
  role: Role
  currentPath: string
}

export function Sidebar({ role, currentPath }: SidebarProps) {
  const items = NAV_ITEMS[role]
  const userName = ROLE_USER[role]
  const roleLabel = ROLE_LABEL[role]

  return (
    <aside
      className="flex flex-col h-screen flex-shrink-0"
      style={{ width: 200, background: '#131722', color: '#fff' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-4 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex items-center justify-center rounded-md flex-shrink-0"
          style={{ width: 30, height: 30, background: '#F04A4A' }}
        >
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
            <rect x="4" y="10" width="32" height="4" rx="2" fill="white" />
            <rect x="4" y="18" width="24" height="4" rx="2" fill="white" />
            <rect x="4" y="26" width="28" height="4" rx="2" fill="white" />
          </svg>
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: '#fff', letterSpacing: '-0.01em' }}>
          Equiptrack
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <p
          className="px-2 mb-2 text-2xs font-semibold uppercase tracking-wider"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}
        >
          {roleLabel}
        </p>
        {items.map(item => {
          const active = currentPath === item.href || currentPath.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center h-9 px-2 rounded-md text-sm font-medium transition-colors duration-150"
              style={{
                background: active ? '#F04A4A' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.75)',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div
        className="px-3 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <UserAvatar name={userName} size={30} />
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#fff' }}>
              {userName}
            </p>
            <p className="text-2xs truncate" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>
              {roleLabel}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="block text-center py-1 rounded text-xs transition-colors duration-150"
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
        >
          Switch Role
        </Link>
      </div>
    </aside>
  )
}
