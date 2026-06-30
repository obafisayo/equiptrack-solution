'use client'

import { Button } from '@/components/ui/Button'
import { type OrgUser } from '@/lib/mock-data'

export interface ConfirmRemoveModalProps {
  user: OrgUser
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmRemoveModal({ user, onConfirm, onClose }: ConfirmRemoveModalProps) {
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
