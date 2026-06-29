'use client'

import { useState, useMemo } from 'react'
import { Plus, UserMinus, UserCheck, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Select, SearchInput } from '@/components/ui/Form'
import { ORG_USERS, type OrgUser } from '@/lib/mock-data'

// ── Role definitions ──────────────────────────────────────────────────────────

const ROLE_TABS = [
  { key: 'all',                  label: 'All Users' },
  { key: 'Executive',            label: 'Executive' },
  { key: 'Warehouse Supervisor', label: 'WH Supervisor' },
  { key: 'Warehouse Personnel',  label: 'WH Personnel' },
  { key: 'Dispatch Supervisor',  label: 'DSP Supervisor' },
  { key: 'Dispatch Personnel',   label: 'DSP Personnel' },
  { key: 'QAQC Officer',         label: 'QAQC' },
  { key: 'Logistics Coordinator',label: 'Logistics' },
  { key: 'Requester',            label: 'Requester' },
] as const

type RoleKey = typeof ROLE_TABS[number]['key']

const ALL_ROLES = ROLE_TABS.filter(r => r.key !== 'all').map(r => r.key)

const STATUS_CLASS = {
  active:    'bg-green-50 text-green-700 border border-green-200',
  invited:   'bg-amber-50 text-amber-700 border border-amber-200',
  suspended: 'bg-red-50 text-red-700 border border-red-200',
}

// ── Onboard Modal ─────────────────────────────────────────────────────────────

interface OnboardModalProps {
  onClose: () => void
  onSave: (user: OrgUser) => void
}

function OnboardModal({ onClose, onSave }: OnboardModalProps) {
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole]   = useState<string>(ALL_ROLES[2])

  function handleSave() {
    if (!name.trim() || !email.trim()) return
    onSave({
      id: `U-NEW-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      dept: role.toLowerCase().split(' ')[0],
      status: 'invited',
      joinedAt: new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-sm mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Onboard Team Member</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <Input
              title="Full name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Amaka Eze"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <Input
              title="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. amaka@equiptrack.ng"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Role</label>
            <Select
              title="Assign role"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              {ALL_ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            disabled={!name.trim() || !email.trim()}
            onClick={handleSave}
          >
            Send Invite
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Assign Role Modal ─────────────────────────────────────────────────────────

interface AssignRoleModalProps {
  user: OrgUser
  onClose: () => void
  onSave: (userId: string, newRole: string) => void
}

function AssignRoleModal({ user, onClose, onSave }: AssignRoleModalProps) {
  const [role, setRole] = useState(user.role)

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-sm mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Change Role</h2>
        <p className="text-xs text-gray-500 mb-4">{user.name} &middot; {user.email}</p>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">New Role</label>
          <Select
            title="New role"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            {ALL_ROLES.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </div>

        <div className="flex gap-3 mt-5">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            disabled={role === user.role}
            onClick={() => onSave(user.id, role)}
          >
            Update Role
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Remove Dialog ─────────────────────────────────────────────────────

interface ConfirmRemoveProps {
  user: OrgUser
  onConfirm: () => void
  onClose: () => void
}

function ConfirmRemove({ user, onConfirm, onClose }: ConfirmRemoveProps) {
  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-sm mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Remove User</h2>
        <p className="text-sm text-gray-600 mb-5">
          Remove <span className="font-semibold">{user.name}</span> from the organization? They will lose access immediately. This action can be undone by re-inviting them.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button type="button" variant="danger" size="md" fullWidth onClick={onConfirm}>Remove User</Button>
        </div>
      </div>
    </div>
  )
}

// ── User Card ─────────────────────────────────────────────────────────────────

interface UserCardProps {
  user: OrgUser
  onAssignRole: (u: OrgUser) => void
  onRemove: (u: OrgUser) => void
}

function UserCard({ user, onAssignRole, onRemove }: UserCardProps) {
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const statusClass = STATUS_CLASS[user.status] ?? STATUS_CLASS.active

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-brand-500">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${statusClass}`}>
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          <p className="text-[10px] text-gray-400 mt-1">Joined {user.joinedAt}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-border-default">
        <button
          type="button"
          onClick={() => onAssignRole(user)}
          className="flex items-center gap-1 text-[11px] font-medium text-brand-500 hover:text-brand-600 border border-brand-200 hover:border-brand-400 px-2 py-1 rounded transition-colors"
        >
          <UserCheck size={11} />
          Change Role
        </button>
        <button
          type="button"
          onClick={() => onRemove(user)}
          className="flex items-center gap-1 text-[11px] font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-2 py-1 rounded transition-colors"
        >
          <UserMinus size={11} />
          Remove
        </button>
      </div>
    </Card>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

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

      {/* Role Tabs */}
      <div className="mb-5 border-b border-border-default overflow-x-auto">
        <div className="flex gap-0.5 min-w-max">
          {ROLE_TABS.map(tab => {
            const count = tab.key === 'all' ? users.length : (countByRole[tab.key] ?? 0)
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRoleTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150 ${
                  roleTab === tab.key
                    ? 'border-brand-500 text-brand-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  roleTab === tab.key ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Role heading when filtered */}
      {roleTab !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">{roleTab}</p>
          <span className="text-xs text-gray-400">({filteredUsers.length} member{filteredUsers.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      {/* User Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No users match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onAssignRole={setAssigningUser}
              onRemove={setRemovingUser}
            />
          ))}
        </div>
      )}

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
        <ConfirmRemove
          user={removingUser}
          onConfirm={() => handleRemove(removingUser.id)}
          onClose={() => setRemovingUser(null)}
        />
      )}
    </AppShell>
  )
}
