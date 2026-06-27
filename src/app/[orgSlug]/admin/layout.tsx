'use client'

import { use } from 'react'
import { usePathname } from 'next/navigation'
import { OrgAdminShell } from '@/components/orgadmin/OrgAdminShell'

export default function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = use(params)
  const pathname = usePathname() ?? `/${orgSlug}/admin`
  return (
    <OrgAdminShell orgSlug={orgSlug} currentPath={pathname}>
      {children}
    </OrgAdminShell>
  )
}
