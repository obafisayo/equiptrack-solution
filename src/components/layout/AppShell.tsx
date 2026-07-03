'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import type { Role } from '@/lib/lifecycle'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { AccessDenied } from './AccessDenied'
import { useSessionRole } from '@/hooks/useSessionRole'
import { getAllowedRolesForPath } from '@/lib/session'

interface AppShellProps {
  /**
   * The role used to render the sidebar nav. This prop ALWAYS determines the
   * sidebar — it is never overridden by the session role.
   * Each route should pass the single role that matches the URL so the nav
   * items remain deterministic regardless of who is logged in.
   */
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
  /**
   * Override the path-derived allowed-roles list for access guard checks.
   * Use this on routes like /qaqc/loadout that legitimately serve more than
   * one role. When omitted, the guard uses getAllowedRolesForPath(currentPath).
   */
  allowedRoles?: Role[]
  children: ReactNode
}

export function AppShell({
  role,
  currentPath,
  title,
  breadcrumb,
  actions,
  search,
  allowedRoles: allowedRolesProp,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { role: sessionRole, loading } = useSessionRole()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [currentPath])

  // While reading localStorage, render nothing to avoid flicker
  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Determine allowed roles: caller can override via prop, otherwise derive from path
  const effectiveAllowed = allowedRolesProp ?? getAllowedRolesForPath(currentPath)

  // Enforce access: block if a session role exists and is not in the allowed list
  if (sessionRole && effectiveAllowed && !effectiveAllowed.includes(sessionRole)) {
    return <AccessDenied sessionRole={sessionRole} allowedRoles={effectiveAllowed} />
  }

  return (
    <div className="min-h-screen bg-page-bg">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/45"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar always uses the prop role — never the session role */}
      <Sidebar
        role={role}
        currentPath={currentPath}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col min-h-screen ml-0 md:ml-16 lg:ml-50">
        <div className="sticky top-0 z-30">
          <Topbar
            title={title}
            breadcrumb={breadcrumb}
            actions={actions}
            search={search}
            role={role}
            onMobileMenuToggle={() => setMobileOpen(v => !v)}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
