'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, Building2, ListChecks, Users,
  CreditCard, ScrollText, Menu, X, ArrowLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'

/* ── Nav items ────────────────────────────────────────────────────────────── */

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { href: '/sysadmin',                    label: 'Platform Overview',  icon: LayoutDashboard  },
  { href: '/sysadmin/organisations',      label: 'Organisations',      icon: Building2        },
  { href: '/sysadmin/waitlist',           label: 'Waitlist',           icon: ListChecks       },
  { href: '/sysadmin/users',              label: 'All Users',          icon: Users            },
  { href: '/sysadmin/billing',            label: 'Revenue & Billing',  icon: CreditCard       },
  { href: '/sysadmin/audit',              label: 'Audit Log',          icon: ScrollText       },
]

const TITLE_MAP: Record<string, string> = {
  '/sysadmin':                     'Platform Overview',
  '/sysadmin/organisations':       'Organisations',
  '/sysadmin/waitlist':            'Waitlist',
  '/sysadmin/users':               'All Users',
  '/sysadmin/billing':             'Revenue & Billing',
  '/sysadmin/audit':               'Audit Log',
}

function resolveTitle(path: string): string {
  if (TITLE_MAP[path]) return TITLE_MAP[path]
  if (path.startsWith('/sysadmin/organisations/')) return 'Organisation Detail'
  return 'Sysadmin'
}

/* ── Shell ────────────────────────────────────────────────────────────────── */

interface SysadminShellProps {
  currentPath: string
  children: ReactNode
}

export function SysadminShell({ currentPath, children }: SysadminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const title = resolveTitle(currentPath)

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
          'w-[220px] md:w-[68px] lg:w-[220px]',
          'transition-transform duration-[250ms] ease',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        ].join(' ')}
        style={{ background: '#0F172A' }}
      >
        {/* Logo area */}
        <div
          className="flex items-center h-[64px] px-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
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
            <span
              className="block md:hidden lg:block font-bold text-sm truncate"
              style={{ color: '#fff', letterSpacing: '-0.01em' }}
            >
              Equiptrack
            </span>
          </div>
        </div>

        {/* SYSADMIN badge */}
        <div className="flex md:hidden lg:flex justify-center px-4 pt-3 pb-1 shrink-0">
          <span style={{
            background: 'rgba(240,74,74,0.15)',
            color: '#F04A4A',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '3px 10px',
            borderRadius: 9999,
            border: '1px solid rgba(240,74,74,0.25)',
          }}>
            SYSADMIN
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = currentPath === item.href || currentPath.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-start md:justify-center lg:justify-start h-10 rounded-[7px] transition-colors duration-150"
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
                <span className="block md:hidden lg:block truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 flex-shrink-0" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

        {/* User area */}
        <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-start md:justify-center lg:justify-start gap-2 mb-2">
            <Avatar name="Aminu Garba" size={30} />
            <div className="block md:hidden lg:block min-w-0">
              <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0 }} className="truncate">
                Aminu Garba
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }}>
                System Administrator
              </p>
            </div>
          </div>

          <Link
            href="/shell-nigeria/admin"
            className="flex md:hidden lg:flex items-center gap-1.5 py-1 rounded transition-colors duration-150"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.38)')}
          >
            <ArrowLeft size={11} />
            Back to Org
          </Link>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen ml-0 md:ml-[68px] lg:ml-[220px]">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center bg-white px-6 flex-shrink-0"
          style={{ height: 64, borderBottom: '1px solid #E2E8F0' }}
        >
          {/* Mobile hamburger */}
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
