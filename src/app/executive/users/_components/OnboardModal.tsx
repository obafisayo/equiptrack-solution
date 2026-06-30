'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Form'
import { type OrgUser } from '@/lib/mock-data'
import { ALL_ROLES } from './constants'

export interface OnboardModalProps {
  onClose: () => void
  onSave: (user: OrgUser) => void
}

export function OnboardModal({ onClose, onSave }: OnboardModalProps) {
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
