'use client'

import { Building2 } from 'lucide-react'

interface ConfirmModalProps {
  orgName: string
  action: 'suspend' | 'activate'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ orgName, action, onConfirm, onCancel }: ConfirmModalProps) {
  const isSuspend = action === 'suspend'
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12,
        padding: '28px 28px 24px', width: 400,
        boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: isSuspend ? '#FEF2F2' : '#F0FDF4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={18} color={isSuspend ? '#DC2626' : '#16A34A'} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
              {isSuspend ? 'Suspend Organisation' : 'Activate Organisation'}
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{orgName}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
          {isSuspend
            ? 'All users in this organisation will lose access immediately. Their data is retained and access can be restored.'
            : 'Users in this organisation will regain access. Any in-progress work orders will resume.'}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '9px 0', border: '1px solid #D1D5DB',
              borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600,
              color: '#374151', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 2, padding: '9px 0', border: 'none',
              borderRadius: 6, background: isSuspend ? '#EF4444' : '#16A34A',
              fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
            }}
          >
            {isSuspend ? 'Suspend Access' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}
