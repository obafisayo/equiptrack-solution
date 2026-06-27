'use client'

import { usePathname } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'

export default function SysadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/sysadmin'
  return (
    <AppShell
      role="sysadmin"
      currentPath={pathname}
      title="Platform Overview"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Sysadmin' }]}
    >
      {children}
    </AppShell>
  )
}
