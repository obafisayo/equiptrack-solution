'use client'

import Link from 'next/link'
import {
  AlertTriangle, Activity, BarChart2, ClipboardCheck,
  ClipboardList, Clock, HelpCircle, Layers, Package,
  Plus, ShieldCheck, Truck, Users, HardHat, Navigation, Archive, Wrench, Settings, Globe, DollarSign, Building2
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/lib/lifecycle'
import { ROLE_LABEL } from '@/lib/lifecycle'
import { Avatar } from '@/components/ui/Avatar'

/* ── Nav data ─────────────────────────────────────────────────────────────── */

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  requester: [
    { href: '/requester',     label: 'My Requests',    icon: ClipboardList },
    { href: '/requester/new', label: 'Create Request', icon: Plus },
  ],
  wh_sup: [
    { href: '/warehouse',            label: 'SLA Breaches',    icon: AlertTriangle },
    { href: '/warehouse/orders',     label: 'All Work Orders', icon: Layers },
    { href: '/warehouse/personnel',  label: 'Personnel Load',  icon: Users },
  ],
  wh_per: [
    { href: '/warehouse-personnel',         label: 'My Tasks', icon: ClipboardCheck },
    { href: '/warehouse-personnel/history', label: 'History',  icon: Clock },
  ],
  dsp_sup: [
    { href: '/dispatch',            label: 'Dispatch Queue',  icon: Truck },
    { href: '/dispatch/personnel',  label: 'Personnel Load',  icon: Users },
  ],
  dsp_per: [
    { href: '/dispatch-personnel',         label: 'My Tasks', icon: ClipboardCheck },
    { href: '/dispatch-personnel/history', label: 'History',  icon: Clock },
  ],
  qaqc: [
    { href: '/qaqc',            label: 'QAQC Queue',      icon: ShieldCheck },
    { href: '/qaqc/containers', label: 'Container Fleet', icon: Package },
  ],
  exec: [
    { href: '/executive',             label: 'Overview',        icon: BarChart2 },
    { href: '/executive/bottlenecks', label: 'Bottlenecks',     icon: Activity },
    { href: '/executive/users',       label: 'User Management', icon: Users },
    { href: '/executive/settings',    label: 'Org Settings',    icon: Settings },
  ],
  safety: [
    { href: '/safety',          label: 'Safety Dashboard', icon: HardHat },
    { href: '/safety/incidents', label: 'Incidents',       icon: AlertTriangle },
  ],
  logistics: [
    { href: '/logistics',          label: 'Logistics Board',  icon: Navigation },
    { href: '/logistics/vessels',  label: 'Vessel Schedule',  icon: Truck },
  ],
  inventory: [
    { href: '/inventory',        label: 'Stock Overview',  icon: Archive },
    { href: '/inventory/alerts', label: 'Reorder Alerts',  icon: AlertTriangle },
  ],
  maintenance: [
    { href: '/maintenance',         label: 'My Tasks',        icon: Wrench },
    { href: '/maintenance/history', label: 'Repair History',  icon: Clock },
  ],
  sysadmin: [
    { href: '/sysadmin',               label: 'Platform Overview', icon: Globe },
    { href: '/sysadmin/organisations', label: 'Organisations', icon: Building2 },
    { href: '/sysadmin/waitlist',      label: 'Waitlist', icon: Clock },
    { href: '/sysadmin/billing',       label: 'Billing', icon: DollarSign },
  ],
}

/* Demo user names per role (for display only) */
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

/* ── Component ────────────────────────────────────────────────────────────── */

interface SidebarProps {
  role: Role
  currentPath: string
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ role, currentPath, mobileOpen, onMobileClose }: SidebarProps) {
  const items    = NAV_ITEMS[role]
  const userName = ROLE_USER[role]
  const roleLabel = ROLE_LABEL[role]

  return (
    <aside
      className={[
        /* positioning */
        'fixed top-0 left-0 z-50 h-screen flex flex-col',
        /* responsive width: 200px mobile/lg, 64px tablet */
        'w-[200px] md:w-16 lg:w-[200px]',
        /* transition */
        'transition-transform duration-[250ms] ease',
        /* mobile: hide when closed, show when open */
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        /* tablet+: always visible */
        'md:translate-x-0',
      ].join(' ')}
      style={{ background: '#131722' }}
    >

      {/* ── Logo area ── */}
      <div
        className="flex items-center h-[64px] px-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Icon mark — always visible */}
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-[7px]"
            style={{ width: 30, height: 30, background: '#F04A4A' }}
          >
            <svg width="17" height="17" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
              <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
              <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
            </svg>
          </div>
          {/* Wordmark — desktop only */}
          <span
            className="hidden lg:block font-bold text-sm truncate"
            style={{ color: '#fff', letterSpacing: '-0.01em' }}
          >
            Equiptrack
          </span>
        </div>
      </div>

      {/* ── Nav section ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {/* Section label — desktop only */}
        <p
          className="hidden lg:block px-2 mb-2"
          style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          {roleLabel}
        </p>

        {items.map(item => {
          const active = currentPath === item.href || currentPath.startsWith(item.href + '/')
          const Icon   = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className="flex items-center justify-center lg:justify-start h-10 rounded-[7px] transition-colors duration-150"
              style={{
                gap: 9,
                paddingLeft: '10px',
                paddingRight: '8px',
                background: active ? '#F04A4A' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(255,255,255,0.08)'
                  el.style.color = 'rgba(255,255,255,0.85)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = 'rgba(255,255,255,0.55)'
                }
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span className="hidden lg:block truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-3 flex-shrink-0" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

      {/* ── "Need Help?" block — desktop only ── */}
      <div className="hidden lg:block px-3 pt-3 pb-1 flex-shrink-0">
        <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <HelpCircle size={13} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Need Help?</span>
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, margin: '0 0 10px' }}>
            Documentation, guides, and support resources for your role.
          </p>
          <a
            href="mailto:support@equiptrack.io"
            className="block text-center transition-colors duration-150"
            style={{
              fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '5px 0',
              textDecoration: 'none',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)')}
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* ── User area ── */}
      <div
        className="px-3 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
          <Avatar name={userName} size={30} />
          {/* Name + role — desktop only */}
          <div className="hidden lg:block min-w-0">
            <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0 }} className="truncate">
              {userName}
            </p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }} className="truncate">
              {roleLabel}
            </p>
          </div>
        </div>

        {/* Switch role — desktop only */}
        <Link
          href="/"
          className="hidden lg:block text-center py-1 rounded transition-colors duration-150"
          style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.38)')}
        >
          Switch Role
        </Link>
      </div>
    </aside>
  )
}
