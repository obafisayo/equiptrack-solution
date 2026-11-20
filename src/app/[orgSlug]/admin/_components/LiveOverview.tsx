'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LiveTeam } from '@/components/orgadmin/LiveTeam'
import { useCurrentUser } from '@/hooks/useCurrentUser'

/** Admin overview for a real organisation, backed by the EquipTrack API. */
export function LiveOverview({ orgSlug }: { orgSlug: string }) {
  const { me, error, loading } = useCurrentUser()
  const membership = me?.memberships.find(m => m.organizationSlug === orgSlug)

  if (loading) return <p className="text-sm text-neutral-500">Loading your organisation…</p>

  if (error || !membership || membership.role !== 'org_admin') {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-8 text-center">
        <p className="text-sm text-neutral-600 m-0">
          {error ? error.message : 'You are not an administrator of this organisation.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-neutral-900 m-0">{membership.organizationName}</h2>
        <p className="text-sm text-neutral-500 mt-1 mb-0">Invite your team and assign each person a role. Roles decide what they can see and do.</p>
      </div>

      <LiveTeam compact />

      <Link href={`/${orgSlug}/admin/team`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 no-underline hover:text-brand-600">
        Manage team and invitations <ArrowRight size={14} />
      </Link>
    </div>
  )
}
