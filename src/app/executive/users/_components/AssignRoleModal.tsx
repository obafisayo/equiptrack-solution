'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Form'
import { type OrgUser } from '@/lib/mock-data'
import { ALL_ROLES } from './constants'

export interface AssignRoleModalProps {
  user: OrgUser
  onClose: () => void
  onSave: (userId: string, newRole: string) => void
}

export function AssignRoleModal({ user, onClose, onSave }: AssignRoleModalProps) {
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
