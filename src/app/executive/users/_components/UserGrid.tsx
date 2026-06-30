'use client'

import { Users } from 'lucide-react'
import { type OrgUser } from '@/lib/mock-data'
import { UserCard } from './UserCard'
import type { RoleKey } from './constants'

export interface UserGridProps {
  users: OrgUser[]
  roleTab: RoleKey
  onAssignRole: (u: OrgUser) => void
  onRemove: (u: OrgUser) => void
}

export function UserGrid({ users, roleTab, onAssignRole, onRemove }: UserGridProps) {
  return (
    <>
      {/* Role heading when filtered */}
      {roleTab !== 'all' && (
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">{roleTab}</p>
          <span className="text-xs text-gray-400">({users.length} member{users.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      {/* User Grid */}
      {users.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No users match this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onAssignRole={onAssignRole}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </>
  )
}
