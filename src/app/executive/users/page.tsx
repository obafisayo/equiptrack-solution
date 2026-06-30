'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Form'
import { ORG_USERS, type OrgUser } from '@/lib/mock-data'
import { OnboardModal } from './_components/OnboardModal'
import { AssignRoleModal } from './_components/AssignRoleModal'
import { ConfirmRemoveModal } from './_components/ConfirmRemoveModal'
import { RoleTabBar } from './_components/RoleTabBar'
import { UserGrid } from './_components/UserGrid'
import { ROLE_TABS, type RoleKey } from './_components/constants'

export default function UserManagementPage() {
  const [users, setUsers]                 = useState<OrgUser[]>(ORG_USERS)
  const [roleTab, setRoleTab]             = useState<RoleKey>('all')
  const [search, setSearch]               = useState('')
  const [showOnboard, setShowOnboard]     = useState(false)
  const [assigningUser, setAssigningUser] = useState<OrgUser | null>(null)
  const [removingUser, setRemovingUser]   = useState<OrgUser | null>(null)

  const filteredUsers = useMemo(() => {
    let list = users
    if (roleTab !== 'all') list = list.filter(u => u.role === roleTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
      )
    }
    return list
  }, [users, roleTab, search])

  const countByRole = useMemo(() => {
    const map: Record<string, number> = {}
    for (const u of users) map[u.role] = (map[u.role] ?? 0) + 1
    return map
  }, [users])

  function handleOnboard(newUser: OrgUser) {
    setUsers(prev => [newUser, ...prev])
    setShowOnboard(false)
  }

  function handleAssignRole(userId: string, newRole: string) {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, role: newRole, dept: newRole.toLowerCase().split(' ')[0] } : u
    ))
    setAssigningUser(null)
  }

  function handleRemove(userId: string) {
    setUsers(prev => prev.filter(u => u.id !== userId))
    setRemovingUser(null)
  }

  return (
    <AppShell
      role="exec"
      currentPath="/executive/users"
      title="User Management"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Executive', href: '/executive' }, { label: 'Users' }]}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm text-gray-500">{users.length} total users across {ROLE_TABS.length - 1} roles</p>
        </div>
        <Button type="button" variant="primary" size="sm" onClick={() => setShowOnboard(true)}>
          <Plus size={14} className="mr-1" />
          Onboard User
        </Button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, or role..."
          size="sm"
        />
      </div>

      <RoleTabBar
        active={roleTab}
        countByRole={countByRole}
        totalCount={users.length}
        onSelect={setRoleTab}
      />

      <UserGrid
        users={filteredUsers}
        roleTab={roleTab}
        onAssignRole={setAssigningUser}
        onRemove={setRemovingUser}
      />

      {/* Modals */}
      {showOnboard && (
        <OnboardModal
          onClose={() => setShowOnboard(false)}
          onSave={handleOnboard}
        />
      )}
      {assigningUser && (
        <AssignRoleModal
          user={assigningUser}
          onClose={() => setAssigningUser(null)}
          onSave={handleAssignRole}
        />
      )}
      {removingUser && (
        <ConfirmRemoveModal
          user={removingUser}
          onConfirm={() => handleRemove(removingUser.id)}
          onClose={() => setRemovingUser(null)}
        />
      )}
    </AppShell>
  )
}
