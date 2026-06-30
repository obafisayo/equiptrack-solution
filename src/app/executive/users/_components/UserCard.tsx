'use client'

import { UserMinus, UserCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { type OrgUser } from '@/lib/mock-data'
import { STATUS_CLASS } from './constants'

export interface UserCardProps {
  user: OrgUser
  onAssignRole: (u: OrgUser) => void
  onRemove: (u: OrgUser) => void
}

export function UserCard({ user, onAssignRole, onRemove }: UserCardProps) {
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
