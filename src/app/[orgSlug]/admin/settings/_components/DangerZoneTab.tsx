'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Form'

interface DangerZoneTabProps {
  orgName: string
}

export function DangerZoneTab({ orgName }: DangerZoneTabProps) {
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const DANGER_ACTIONS = [
    {
      title:       'Export all data',
      description: 'Download a full export of all work orders, users, and audit logs as CSV.',
      buttonLabel: 'Request export',
      buttonStyle: { background: '#fff', color: '#374151', border: '1px solid #D1D5DB' },
      action:      () => alert('Data export requested. You will receive an email when ready.'),
    },
    {
      title:       'Suspend organisation',
      description: 'Temporarily prevent all members from logging in. Work orders are preserved.',
      buttonLabel: 'Suspend org',
      buttonStyle: { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
      action:      () => alert('Contact your Sysadmin to suspend the organisation.'),
    },
    {
      title:       'Delete organisation',
      description: 'Permanently delete this organisation and all associated data. This cannot be undone.',
      buttonLabel: 'Delete organisation',
      buttonStyle: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' },
      action:      () => setShowConfirm(true),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {DANGER_ACTIONS.map(da => (
        <div key={da.title} style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
          padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{da.title}</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{da.description}</p>
          </div>
          <button
            onClick={da.action}
            style={{
              padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
              ...da.buttonStyle,
            }}
          >
            {da.buttonLabel}
          </button>
        </div>
      ))}

      {/* Delete confirm modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 16,
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '32px',
            width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trash2 size={18} color="#DC2626" />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Delete organisation</p>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                  This will permanently delete <strong>{orgName}</strong> and all associated data.
                  Type the organisation name to confirm.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '8px 12px', marginBottom: 16 }}>
              <AlertTriangle size={13} color="#DC2626" />
              <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>This action cannot be undone.</span>
            </div>

            <div className="mb-4">
              <Input
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder={orgName}
                error={confirmText.length > 0 && confirmText !== orgName}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowConfirm(false); setConfirmText('') }}
                style={{ padding: '8px 16px', border: '1px solid #E2E8F0', borderRadius: 7, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={confirmText !== orgName}
                style={{
                  padding: '8px 16px', border: 'none', borderRadius: 7,
                  background: confirmText === orgName ? '#DC2626' : '#F3F4F6',
                  color: confirmText === orgName ? '#fff' : '#9CA3AF',
                  fontSize: 13, fontWeight: 600,
                  cursor: confirmText === orgName ? 'pointer' : 'not-allowed',
                }}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
