'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, Users, UserPlus, ShieldCheck,
  SlidersHorizontal, CreditCard, ScrollText,
  Menu, X, ArrowLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { ORGANISATIONS, USERS } from '@/lib/mock-platform'

/* ── Nav items ────────────────────────────────────────────────────────────── */

interface NavItem {
  href: (slug: string) => string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { href: s => `/${s}/admin`,          label: 'Overview',          icon: LayoutDashboard  },
  { href: s => `/${s}/admin/team`,     label: 'Team Members',      icon: Users            },
  { href: s => `/${s}/admin/invite`,   label: 'Invite',            icon: UserPlus         },
  { href: s => `/${s}/admin/sso`,      label: 'SSO Config',        icon: ShieldCheck      },
  { href: s => `/${s}/admin/roles`,    label: 'Roles & Perms',     icon: SlidersHorizontal},
  { href: s => `/${s}/admin/billing`,  label: 'Billing',           icon: CreditCard       },
  { href: s => `/${s}/admin/audit`,    label: 'Audit Log',         icon: ScrollText       },
]

const TITLE_MAP: Record<string, string> = {
  '/admin':         'Overview',
  '/admin/team':    'Team Members',
  '/admin/invite':  'Invite',
  '/admin/sso':     'SSO Config',
  '/admin/roles':   'Roles & Permissions',
  '/admin/billing': 'Billing',
  '/admin/audit':   'Audit Log',
  '/admin/settings':'Settings',
}

function resolveTitle(slug: string, path: string): string {
  const suffix = path.replace(`/${slug}`, '')
  return TITLE_MAP[suffix] ?? 'Org Admin'
}

/* ── Shell ────────────────────────────────────────────────────────────────── */

interface OrgAdminShellProps {
  orgSlug: string
  currentPath: string
  children: ReactNode
}

export function OrgAdminShell({ orgSlug, currentPath, children }: OrgAdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const title = resolveTitle(orgSlug, currentPath)

  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const adminUser = USERS.find(u => u.orgId === org?.id && u.role === 'org_admin')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [currentPath])

  return (
    <div className="min-h-screen" style={{ background: '#F5F5F5' }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/45"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={[
          'fixed top-0 left-0 z-50 h-screen flex flex-col',
          'w-[200px] md:w-16 lg:w-[200px]',
          'transition-transform duration-[250ms] ease',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        ].join(' ')}
        style={{ background: '#131722' }}
      >
        {/* Logo + org name */}
        <div
          className="flex flex-col justify-center px-4 flex-shrink-0"
          style={{ height: 64, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="flex items-center justify-center flex-shrink-0 rounded-[7px]"
              style={{ width: 28, height: 28, background: '#F04A4A' }}
            >
              <svg width="15" height="15" viewBox="0 0 40 40" fill="none">
                <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
                <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
                <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
              </svg>
            </div>
            <div className="block md:hidden lg:block min-w-0">
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }} className="truncate">
                {org?.name ?? 'Org Admin'}
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const href = item.href(orgSlug)
            const active = currentPath === href ||
              (currentPath.startsWith(href + '/') && href !== `/${orgSlug}/admin`)
            const exactAdmin = item.href(orgSlug) === `/${orgSlug}/admin` && currentPath === `/${orgSlug}/admin`
            const isActive = item.label === 'Overview' ? exactAdmin : active
            const Icon = item.icon
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-start md:justify-center lg:justify-start h-10 rounded-[7px] transition-colors duration-150"
                style={{
                  gap: 9,
                  paddingLeft: '10px',
                  paddingRight: '8px',
                  background: isActive ? '#F04A4A' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.07)'
                    el.style.color = 'rgba(255,255,255,0.85)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'transparent'
                    el.style.color = 'rgba(255,255,255,0.55)'
                  }
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span className="block md:hidden lg:block truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User area */}
        <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-start md:justify-center lg:justify-start gap-2 mb-2">
            <Avatar name={adminUser?.displayName ?? 'Admin'} size={28} />
            <div className="block md:hidden lg:block min-w-0">
              <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0 }} className="truncate">
                {adminUser?.displayName ?? 'Org Admin'}
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                Organisation Admin
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex md:hidden lg:flex items-center gap-1.5 py-1 rounded transition-colors duration-150"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.38)')}
          >
            <ArrowLeft size={11} />
            Back to App
          </Link>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen ml-0 md:ml-16 lg:ml-[200px]">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center bg-white px-6 flex-shrink-0"
          style={{ height: 64, borderBottom: '1px solid #E2E8F0' }}
        >
          <button
            type="button"
            className="mr-3 md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          {/* Brand mark — visible on mobile only, since the sidebar (which normally carries it) is hidden behind the drawer */}
          <div
            className="md:hidden flex items-center justify-center shrink-0 rounded-[7px] mr-2.5"
            style={{ width: 28, height: 28, background: '#F04A4A' }}
          >
            <svg width="15" height="15" viewBox="0 0 40 40" fill="none">
              <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
              <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
              <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
            </svg>
          </div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: 0 }}>
            {title}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
