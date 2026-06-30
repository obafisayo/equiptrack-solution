/* eslint-disable */
'use client'

import { use, useState } from 'react'
import { ORGANISATIONS, USERS, INVITATIONS } from '@/lib/mock-platform'
import { Toast } from './_components/Toast'
import { TeamHeader } from './_components/TeamHeader'
import { TeamTabs } from './_components/TeamTabs'
import { MembersTable } from './_components/MembersTable'
import { InvitationsTable } from './_components/InvitationsTable'
import { ROLE_LABEL, type TabKey } from './_components/constants'

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function TeamPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const [activeTab, setActiveTab]       = useState<TabKey>('members')
  const [search, setSearch]             = useState('')
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set())
  const [toast, setToast]               = useState<string | null>(null)

  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const members = USERS.filter(u => u.orgId === org?.id)
  const invitations = INVITATIONS.filter(i => i.orgId === org?.id)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function toggleSuspend(userId: string, name: string) {
    setSuspendedIds(s => {
      const n = new Set(s)
      if (n.has(userId)) {
        n.delete(userId)
        showToast(`${name} has been reactivated.`)
      } else {
        n.add(userId)
        showToast(`${name} has been suspended.`)
      }
      return n
    })
  }

  function handleCSVExport() {
    const rows = members.map(u => [
      u.displayName, u.email, ROLE_LABEL[u.role] ?? u.role,
      suspendedIds.has(u.id) ? 'suspended' : u.status,
      u.lastActiveAt ? new Date(u.lastActiveAt).toISOString() : '',
    ])
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Last Active'].join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `${orgSlug}-team.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredMembers = members.filter(u =>
    !search ||
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (ROLE_LABEL[u.role] ?? u.role).toLowerCase().includes(search.toLowerCase())
  )

  const filteredInvitations = invitations.filter(i =>
    !search ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    (ROLE_LABEL[i.role] ?? i.role).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {toast && <Toast message={toast} />}

      <div className="space-y-5">
        <TeamHeader search={search} onSearchChange={setSearch} onExportCSV={handleCSVExport} />

        <TeamTabs
          active={activeTab}
          membersCount={members.length}
          invitationsCount={invitations.length}
          onSelect={setActiveTab}
        />

        {activeTab === 'members' && (
          <MembersTable members={filteredMembers} suspendedIds={suspendedIds} onToggleSuspend={toggleSuspend} />
        )}

        {activeTab === 'invitations' && (
          <InvitationsTable invitations={filteredInvitations} users={USERS} />
        )}
      </div>
    </>
  )
}
