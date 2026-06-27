'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import type { Role } from '@/lib/lifecycle'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface AppShellProps {
  role: Role
  currentPath: string
  title: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: ReactNode
  search?: {
    placeholder?: string
    value: string
    onChange: (v: string) => void
  }
  actionLabel?: string
  actionHref?: string
  children: ReactNode
}

export function AppShell({
  role,
  currentPath,
  title,
  breadcrumb,
  actions,
  search,
  actionLabel,
  actionHref,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  /* Close sidebar on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Close sidebar when route changes (currentPath changes) */
  useEffect(() => {
    setMobileOpen(false)
  }, [currentPath])

  return (
    <div className="min-h-screen bg-page-bg">

      {/* ── Mobile overlay — appears behind sidebar drawer ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/45"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (fixed position, responsive width) ── */}
      <Sidebar
        role={role}
        currentPath={currentPath}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main area — offset left by sidebar width ── */}
      {/*
        ml-0        → mobile (sidebar is an overlay, no margin needed)
        md:ml-16    → tablet (sidebar is 64px collapsed)
        lg:ml-[200px] → desktop (sidebar is 200px expanded)
      */}
      <div className="flex flex-col min-h-screen ml-0 md:ml-16 lg:ml-[200px]">

        {/* Topbar — sticky at top of content column */}
        <div className="sticky top-0 z-30">
          <Topbar
            title={title}
            breadcrumb={breadcrumb}
            actions={actions}
            search={search}
            actionLabel={actionLabel}
            actionHref={actionHref}
            role={role}
            onMobileMenuToggle={() => setMobileOpen(v => !v)}
          />
        </div>

        {/* Page content — independently scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
