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
   * The role used to render the sidebar nav when no session is present.
   * For pages accessible to only one role this is the only prop needed.
   * For pages shared across multiple roles, omit this and rely on the
   * session role — the sidebar will auto-adapt.
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
  children: ReactNode
}

export function AppShell({
  role,
  currentPath,
  title,
  breadcrumb,
  actions,
  search,
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

  // Determine which roles are allowed to view this path
  const allowedRoles = getAllowedRolesForPath(currentPath)

  // While we're reading localStorage, render nothing to avoid flicker
  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Enforce access: if a session role exists and this path is restricted,
  // block access if the session role isn't in the allowed list.
  if (sessionRole && allowedRoles && !allowedRoles.includes(sessionRole)) {
    return <AccessDenied sessionRole={sessionRole} allowedRoles={allowedRoles} />
  }

  // The sidebar renders for the session role when available, falling back to
  // the prop-declared role (used in prototype when navigating directly).
  const sidebarRole: Role = sessionRole ?? role

  return (
    <div className="min-h-screen bg-page-bg">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/45"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        role={sidebarRole}
        currentPath={currentPath}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col min-h-screen ml-0 md:ml-16 lg:ml-[200px]">
        <div className="sticky top-0 z-30">
          <Topbar
            title={title}
            breadcrumb={breadcrumb}
            actions={actions}
            search={search}
            role={sidebarRole}
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
