'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/Form'
import type { WaitlistEntry } from '@/lib/types'

interface ApproveModalProps {
  entry: WaitlistEntry
  onConfirm: (note: string) => void
  onCancel: () => void
}

export function ApproveModal({ entry, onConfirm, onCancel }: ApproveModalProps) {
  const [note, setNote] = useState('')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
        width: 440, boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: '#F0FDF4', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={20} color="#16A34A" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Approve Application</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{entry.companyName}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 14 }}>
          An onboarding invitation will be sent to <strong>{entry.contactEmail}</strong>.
          They will have 7 days to accept before the invite expires.
        </p>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
          Internal note (optional)
        </label>
        <Textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Enterprise deal via partnership team..."
          rows={3}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '9px 0', border: '1px solid #D1D5DB',
            borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600,
            color: '#374151', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={() => onConfirm(note)} style={{
            flex: 2, padding: '9px 0', border: 'none',
            borderRadius: 6, background: '#16A34A', fontSize: 13, fontWeight: 600,
            color: '#fff', cursor: 'pointer',
          }}>
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  )
}
