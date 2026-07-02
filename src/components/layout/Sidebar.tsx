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
  RotateCcw, MessageSquare, Plug, Map,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Role } from '@/lib/lifecycle'
import { ROLE_LABEL } from '@/lib/lifecycle'
import { Avatar } from '@/components/ui/Avatar'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: Partial<Record<Role, NavItem[]>> = {
  requester: [
    { href: '/requester',     label: 'My Requests',    icon: ClipboardList },
    { href: '/requester/new', label: 'Create Request', icon: Plus },
  ],
  wh_sup: [
    { href: '/warehouse',           label: 'Dashboard',       icon: AlertTriangle },
    { href: '/warehouse/orders',    label: 'All Work Orders', icon: Layers },
    { href: '/warehouse/personnel', label: 'Personnel Load',  icon: Users },
    { href: '/warehouse/returns',   label: 'Returns',         icon: RotateCcw },
  ],
  wh_per: [
    { href: '/warehouse-personnel',         label: 'My Tasks', icon: ClipboardCheck },
    { href: '/warehouse-personnel/history', label: 'History',  icon: Clock },
  ],
  dsp_sup: [
    { href: '/dispatch',           label: 'Dispatch Queue', icon: Truck },
    { href: '/dispatch/personnel', label: 'Personnel Load', icon: Users },
  ],
  dsp_per: [
    { href: '/dispatch-personnel',         label: 'My Tasks', icon: ClipboardCheck },
    { href: '/dispatch-personnel/history', label: 'History',  icon: Clock },
  ],
  qaqc: [
    { href: '/qaqc',                  label: 'QAQC Queue',      icon: ShieldCheck    },
    { href: '/qaqc/containers',       label: 'Container Fleet', icon: Package        },
    { href: '/qaqc/ccu-dashboard',    label: 'CCU Dashboard',   icon: LayoutDashboard },
    { href: '/qaqc/ccu-invoicing',    label: 'CCU Invoicing',   icon: CreditCard     },
    { href: '/qaqc/ccu-requests',     label: 'CCU Requests',    icon: MessageSquare  },
    { href: '/qaqc/loadout',          label: 'Loadout QAQC',    icon: ClipboardCheck },
    { href: '/messages',              label: 'Messages',        icon: Inbox          },
  ],
  loadout_qaqc: [
    { href: '/qaqc/loadout',          label: 'Loadout QAQC',    icon: ShieldCheck   },
    { href: '/qaqc/ccu-dashboard',    label: 'CCU Dashboard',   icon: LayoutDashboard },
    { href: '/qaqc/ccu-requests',     label: 'CCU Requests',    icon: MessageSquare },
  ],
  exec: [
    { href: '/executive',             label: 'Overview',        icon: BarChart2    },
    { href: '/executive/bottlenecks', label: 'Bottlenecks',     icon: Activity     },
    { href: '/executive/performance', label: 'Performance',     icon: TrendingUp   },
    { href: '/messages',              label: 'Messages',        icon: MessageSquare },
    { href: '/executive/users',       label: 'User Management', icon: Users        },
    { href: '/executive/settings',    label: 'Org Settings',    icon: Settings     },
  ],
  site_logistics: [
    { href: '/site-logistics', label: 'Return to Base', icon: RotateCcw },
  ],
  logistics: [
    { href: '/logistics',          label: 'Calendar',         icon: CalendarDays },
    { href: '/logistics/requests', label: 'Vessel Requests',  icon: Inbox        },
  ],
  inventory: [
    { href: '/inventory',        label: 'Stock Overview',    icon: Package    },
    { href: '/inventory/alerts', label: 'Reorder Alerts',    icon: TrendingDown },
    { href: '/inventory/ooddle', label: 'Ooddle Integration', icon: Plug },
  ],
  maintenance: [
    { href: '/maintenance',         label: 'Work Orders', icon: Wrench  },
    { href: '/maintenance/history', label: 'History',     icon: History },
  ],
  safety: [
    { href: '/safety',             label: 'Dashboard',         icon: ShieldCheck  },
    { href: '/safety/inspections', label: 'Inspections',       icon: Eye          },
    { href: '/safety/ptw',         label: 'Permit to Work',    icon: FileText     },
    { href: '/safety/near-miss',   label: 'Near Misses',       icon: FileWarning  },
  ],
  sysadmin: [
    { href: '/sysadmin',                label: 'Platform Overview',  icon: LayoutDashboard },
    { href: '/sysadmin/organisations',  label: 'Organisations',      icon: Building2       },
    { href: '/sysadmin/waitlist',       label: 'Waitlist',           icon: ListChecks      },
    { href: '/sysadmin/users',          label: 'All Users',          icon: Users           },
    { href: '/sysadmin/billing',        label: 'Revenue & Billing',  icon: CreditCard      },
    { href: '/sysadmin/audit',          label: 'Audit Log',          icon: ScrollText      },
  ],
}

const ROLE_USER: Partial<Record<Role, string>> = {
  requester: 'Kenneth Nwosu',
  wh_sup:    'Yinka Adeyemi',
  wh_per:    'Emeka Okonkwo',
  dsp_sup:   'Chika Obi',
  dsp_per:   'Biodun Adekunle',
  qaqc:      'Femi Emmanuel',
  exec:      'O. Bello',
  logistics:      'Danjuma Yusuf',
  inventory:      'Ngozi Eze',
  maintenance:    'Segun Folarin',
  loadout_qaqc:   'Ngozi Okafor',
  site_logistics: 'Chukwudi Eze',
}

interface SidebarProps {
  role: Role
  currentPath: string
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ role, currentPath, mobileOpen, onMobileClose }: SidebarProps) {
  const items     = NAV_ITEMS[role] ?? []
  const userName  = ROLE_USER[role] ?? 'User'
  const roleLabel = ROLE_LABEL[role]

  // Best-match active href: longest matching prefix wins — prevents parent routes
  // from staying highlighted when a child route has its own nav entry.
  const activeHref = [...items]
    .filter(item => currentPath === item.href || currentPath.startsWith(item.href + '/'))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null

  return (
    <aside
      className={[
        'fixed top-0 left-0 z-50 h-screen flex flex-col bg-sidebar',
        'w-[200px] md:w-16 lg:w-[200px]',
        'transition-transform duration-[250ms] ease',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ].join(' ')}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 shrink-0 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center shrink-0 rounded-[7px] w-[30px] h-[30px] bg-brand-500">
            <svg width="17" height="17" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
              <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
              <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
            </svg>
          </div>
          <span className="block md:hidden lg:block font-bold text-sm text-white truncate tracking-[-0.01em]">
            Equiptrack
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 sidebar-scroll">
        <p className="block md:hidden lg:block px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">
          {roleLabel}
        </p>

        {items.map(item => {
          const active = item.href === activeHref
          const Icon   = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={[
                'flex items-center justify-start md:justify-center lg:justify-start h-10 rounded-[7px] px-2.5 gap-2.5',
                'text-sm font-medium transition-colors duration-150 no-underline',
                active
                  ? 'bg-brand-500 text-white'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/85',
              ].join(' ')}
            >
              <Icon size={16} className="shrink-0" />
              <span className="block md:hidden lg:block truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 shrink-0 h-px bg-white/8" />

      {/* Contact support — collapsed on tablet, visible on desktop */}
      <div className="block md:hidden lg:block px-3 pt-2 pb-1 shrink-0">
        <a
          href="mailto:support@equiptrack.io"
          className="flex items-center justify-center gap-2 text-[11px] font-semibold text-white/55 bg-white/6 hover:bg-white/[0.12] hover:text-white/80 rounded-lg py-2 transition-colors duration-150 no-underline"
        >
          <HelpCircle size={13} className="shrink-0" />
          Contact Support
        </a>
      </div>

      {/* User area */}
      <div className="px-3 py-3 shrink-0 border-t border-white/[0.08]">
        <div className="flex items-center justify-start md:justify-center lg:justify-start gap-2 mb-2">
          <Avatar name={userName} size={30} />
          <div className="block md:hidden lg:block min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] text-white/45 truncate">{roleLabel}</p>
          </div>
        </div>
        <Link
          href="/login"
          className="block md:hidden lg:block text-center py-1 rounded text-[11px] text-white/[0.38] hover:text-white/65 transition-colors duration-150 no-underline"
        >
          Switch Role
        </Link>
      </div>
    </aside>
  )
}
