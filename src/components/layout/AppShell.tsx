'use client'

import type { ReactNode } from 'react'
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
    placeholder: string
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
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={role} currentPath={currentPath} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title={title}
          breadcrumb={breadcrumb}
          actions={actions}
          search={search}
        />
        <main className="flex-1 overflow-y-auto bg-page-bg p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell
