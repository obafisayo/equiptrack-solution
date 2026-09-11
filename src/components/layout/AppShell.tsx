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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { role: sessionRole, loading } = useSessionRole()

  useEffect(() => {
    const stored = localStorage.getItem('et-sidebar-collapsed')
    if (stored === 'true') setSidebarCollapsed(true)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [currentPath])

  const handleToggleCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev
      localStorage.setItem('et-sidebar-collapsed', String(next))
      return next
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const effectiveAllowed = allowedRolesProp ?? getAllowedRolesForPath(currentPath)

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

      <Sidebar
        role={role}
        currentPath={currentPath}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main content — offset tracks sidebar width with smooth transition */}
      <div
        className={[
          'flex flex-col min-h-screen ml-0',
          'md:transition-[margin] md:duration-250 md:ease',
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-56',
        ].join(' ')}
      >
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
