'use client'

import { use } from 'react'
import { usePathname } from 'next/navigation'
import { OrgAdminShell } from '@/components/orgadmin/OrgAdminShell'
import { LiveTeam } from '@/components/orgadmin/LiveTeam'
import { ORGANISATIONS } from '@/lib/mock-platform'

/** Admin pages that already work against the API for real organisations. */
const LIVE_PATHS = ['', '/team']

export default function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = use(params)
  const pathname = usePathname() ?? `/${orgSlug}/admin`
  const isLiveOrg = !ORGANISATIONS.some(o => o.slug === orgSlug)
  const section = pathname.replace(`/${orgSlug}/admin`, '').replace(/\/$/, '')

  let content = children
  if (isLiveOrg && !LIVE_PATHS.includes(section)) {
    // Invite lives on the Team page for real organisations; other sections are not built yet
    // (they still read demo fixtures, which would show "Organisation not found" or fake data).
    content = section === '/invite' ? <LiveTeam /> : <NotAvailableYet />
  }

  return (
    <OrgAdminShell orgSlug={orgSlug} currentPath={pathname}>
      {content}
    </OrgAdminShell>
  )
}

function NotAvailableYet() {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 max-w-xl">
      <h2 className="text-base font-bold text-neutral-900 mt-0 mb-2">Not available yet</h2>
      <p className="text-sm text-neutral-600 m-0">
        This section is not part of the pilot yet. You can manage your team and invitations from Team Members.
      </p>
    </div>
  )
}
