'use client'

import Link from 'next/link'
import {
  AlertTriangle, Activity, BarChart2, ClipboardCheck,
  ClipboardList, Clock, HelpCircle, Layers,
  Package, Plus, Settings, ShieldCheck, Truck, Users,
  FileWarning, FileText, Eye,
  CalendarDays, Wrench, History,
  Inbox, TrendingDown, TrendingUp,
  LayoutDashboard, Building2, ListChecks, CreditCard, ScrollText,
  RotateCcw, MessageSquare, ChevronLeft, ChevronRight, Anchor, Ship,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/lib/lifecycle'
import { ROLE_LABEL } from '@/lib/lifecycle'
import { Avatar } from '@/components/ui/Avatar'

interface NavItem {
  type?: never
  href: string
  label: string
  icon: LucideIcon
}

interface NavSection {
  type: 'section'
  label: string
}

type NavEntry = NavItem | NavSection

const NAV_ITEMS: Partial<Record<Role, NavEntry[]>> = {
  requester: [
    { href: '/requester',         label: 'My Requests',    icon: ClipboardList },
    { href: '/requester/new',     label: 'Create Request', icon: Plus },
    { href: '/requester/history', label: 'History',        icon: History },
  ],
  wh_sup: [
    { href: '/warehouse',            label: 'Dashboard',       icon: AlertTriangle },
    { href: '/warehouse/orders',     label: 'All Work Orders', icon: Layers },
    { href: '/warehouse/analytics',  label: 'Analytics',       icon: BarChart2 },
    { href: '/warehouse/personnel',  label: 'Personnel Load',  icon: Users },
    { href: '/warehouse/returns',    label: 'Returns',         icon: RotateCcw },
    { href: '/warehouse/messages',   label: 'Messages',        icon: MessageSquare },
  ],
  wh_per: [
    { href: '/warehouse-personnel',         label: 'My Tasks', icon: ClipboardCheck },
    { href: '/warehouse-personnel/history', label: 'History',  icon: Clock },
  ],
  dsp_sup: [
    { href: '/dispatch',            label: 'Dashboard',      icon: Truck },
    { href: '/dispatch/orders',     label: 'All Work Orders',icon: Layers },
    { href: '/dispatch/analytics',  label: 'Analytics',      icon: BarChart2 },
    { href: '/dispatch/personnel',  label: 'Personnel Load', icon: Users },
    { href: '/dispatch/returns',    label: 'Returns',        icon: RotateCcw },
    { href: '/dispatch/messages',   label: 'Messages',       icon: MessageSquare },
  ],
  dsp_per: [
    { href: '/dispatch-personnel',         label: 'My Tasks', icon: ClipboardCheck },
    { href: '/dispatch-personnel/history', label: 'History',  icon: Clock },
  ],
  qaqc: [
    { type: 'section', label: 'Operations' },
    { href: '/qaqc',              label: 'QAQC Queue',      icon: ShieldCheck    },
    { href: '/qaqc/loadout',      label: 'Loadout QAQC',    icon: ClipboardCheck },
    { href: '/qaqc/ccu-requests', label: 'CCU Requests',    icon: MessageSquare  },
    { type: 'section', label: 'Analysis' },
    { href: '/qaqc/analytics',    label: 'Analytics',       icon: BarChart2      },
    { href: '/qaqc/containers',   label: 'Container Fleet', icon: Package        },
    { href: '/qaqc/ccu-dashboard', label: 'CCU Dashboard',  icon: LayoutDashboard},
    { href: '/qaqc/ccu-invoicing', label: 'CCU Invoicing',  icon: CreditCard     },
    { href: '/qaqc/messages',     label: 'Messages',        icon: Inbox          },
  ],
  exec: [
    { href: '/executive',             label: 'Overview',        icon: BarChart2     },
    { href: '/executive/bottlenecks', label: 'Bottlenecks',     icon: Activity      },
    { href: '/executive/performance', label: 'Performance',     icon: TrendingUp    },
    { href: '/executive/messages',    label: 'Messages',        icon: MessageSquare },
    { href: '/executive/users',       label: 'User Management', icon: Users         },
    { href: '/executive/settings',    label: 'Org Settings',    icon: Settings      },
  ],
  site_logistics: [
    { href: '/site-logistics', label: 'Return to Base', icon: RotateCcw },
  ],
  site_return: [
    { href: '/site-return',          label: 'Returns Dashboard', icon: RotateCcw  },
    { href: '/site-return/history',  label: 'Return History',    icon: History    },
  ],
  logistics: [
    { href: '/logistics',            label: 'Calendar',         icon: CalendarDays },
    { href: '/logistics/voyages',    label: 'Voyage Manifests', icon: Ship         },
    { href: '/logistics/deckspace',  label: 'Deck Space',       icon: Anchor       },
    { href: '/logistics/fleet',      label: 'Vessel Fleet',     icon: Layers       },
  ],
  inventory: [
    { href: '/inventory',           label: 'Stock Overview',    icon: Package      },
    { href: '/inventory/alerts',    label: 'Reorder Alerts',    icon: TrendingDown },
    { href: '/inventory/movements', label: 'Movements Log',     icon: RotateCcw    },
  ],
  maintenance: [
    { href: '/maintenance',         label: 'Work Orders', icon: Wrench  },
    { href: '/maintenance/history', label: 'History',     icon: History },
  ],
  safety: [
    { href: '/safety',             label: 'Dashboard',      icon: ShieldCheck },
    { href: '/safety/inspections', label: 'Inspections',    icon: Eye         },
    { href: '/safety/ptw',         label: 'Permit to Work', icon: FileText    },
    { href: '/safety/near-miss',   label: 'Near Misses',    icon: FileWarning },
  ],
  sysadmin: [
    { href: '/sysadmin',               label: 'Platform Overview', icon: LayoutDashboard },
    { href: '/sysadmin/organisations', label: 'Organisations',     icon: Building2       },
    { href: '/sysadmin/waitlist',      label: 'Waitlist',          icon: ListChecks      },
    { href: '/sysadmin/users',         label: 'All Users',         icon: Users           },
    { href: '/sysadmin/billing',       label: 'Revenue & Billing', icon: CreditCard      },
    { href: '/sysadmin/audit',         label: 'Audit Log',         icon: ScrollText      },
  ],
}

const ROLE_USER: Partial<Record<Role, string>> = {
  requester:      'Kenneth Nwosu',
  wh_sup:         'Yinka Adeyemi',
  wh_per:         'Emeka Okonkwo',
  dsp_sup:        'Chika Obi',
  dsp_per:        'Biodun Adekunle',
  qaqc:           'Femi Emmanuel',
  exec:           'O. Bello',
  logistics:      'Danjuma Yusuf',
  inventory:      'Ngozi Eze',
  maintenance:    'Segun Folarin',
  site_logistics: 'Chukwudi Eze',
}

interface SidebarProps {
  role: Role
  currentPath: string
  mobileOpen?: boolean
  onMobileClose?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({
  role,
  currentPath,
  mobileOpen,
  onMobileClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const items     = NAV_ITEMS[role] ?? []
  const userName  = ROLE_USER[role] ?? 'User'
  const roleLabel = ROLE_LABEL[role]

  const navItems = items.filter((e): e is NavItem => !('type' in e))

  const activeHref = [...navItems]
    .filter(item => currentPath === item.href || currentPath.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null

  return (
    <aside
      className={[
        'fixed top-0 left-0 z-50 h-screen flex flex-col bg-sidebar',
        'transition-all duration-250 ease',
        collapsed ? 'w-16' : 'w-56',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ].join(' ')}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center h-16 px-3 shrink-0 border-b border-white/8 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="flex items-center justify-center shrink-0 rounded-[7px] w-8 h-8 bg-brand-accent">
            <svg width="17" height="17" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
              <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
              <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
            </svg>
          </div>
          {!collapsed && (
            <span className="font-bold text-sm text-white truncate tracking-[-0.01em]">
              Equiptrack
            </span>
          )}
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-md text-white/35 hover:text-white/75 hover:bg-white/8 transition-colors duration-150 shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 sidebar-scroll">
        {!collapsed && (
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
            {roleLabel}
          </p>
        )}

        {items.map((entry, idx) => {
          if ('type' in entry) {
            if (collapsed) return null
            return (
              <p
                key={`section-${idx}`}
                className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-tint/45 mt-4 first:mt-0"
              >
                {entry.label}
              </p>
            )
          }

          const active = entry.href === activeHref
          const Icon   = entry.icon

          return (
            <Link
              key={entry.href}
              href={entry.href}
              onClick={onMobileClose}
              title={collapsed ? entry.label : undefined}
              className={[
                'flex items-center h-10 rounded-[7px] gap-2.5',
                'text-sm font-medium transition-colors duration-150 no-underline',
                collapsed ? 'justify-center px-2' : 'px-2.5',
                active
                  ? 'bg-brand-accent/18 text-white border-l-[3px] border-brand-accent'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/85',
              ].join(' ')}
            >
              <Icon
                size={16}
                className={['shrink-0', active && !collapsed ? 'ml-[-3px]' : ''].join(' ')}
              />
              {!collapsed && <span className="truncate">{entry.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 shrink-0 h-px bg-white/8" />

      {/* Contact support */}
      {!collapsed ? (
        <div className="px-3 pt-2 pb-1 shrink-0">
          <a
            href="mailto:support@equiptrack.io"
            className="flex items-center justify-center gap-2 text-[11px] font-semibold text-white/50 bg-white/6 hover:bg-white/12 hover:text-white/80 rounded-lg py-2 transition-colors duration-150 no-underline"
          >
            <HelpCircle size={13} className="shrink-0" />
            Contact Support
          </a>
        </div>
      ) : (
        <div className="px-2 pt-2 pb-1 shrink-0 flex justify-center">
          <a
            href="mailto:support@equiptrack.io"
            title="Contact Support"
            className="flex items-center justify-center w-8 h-8 text-white/40 hover:text-white/80 hover:bg-white/8 rounded-md transition-colors duration-150"
          >
            <HelpCircle size={14} />
          </a>
        </div>
      )}

      {/* User area */}
      <div className="px-3 py-3 shrink-0 border-t border-white/8">
        <div className={['flex items-center gap-2 mb-2', collapsed ? 'justify-center' : 'justify-start'].join(' ')}>
          <Avatar name={userName} size={30} />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[10px] text-white/45 truncate">{roleLabel}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Link
            href="/login"
            className="block text-center py-1 rounded text-[11px] text-white/38 hover:text-white/65 transition-colors duration-150 no-underline"
          >
            Switch Role
          </Link>
        )}
      </div>
    </aside>
  )
}
