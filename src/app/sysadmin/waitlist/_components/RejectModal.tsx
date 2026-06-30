'use client'

import { useState } from 'react'
import { XCircle } from 'lucide-react'
import { Select } from '@/components/ui/Form'
import type { WaitlistEntry } from '@/lib/types'

const REJECT_REASONS = [
  'Not in target market',
  'Insufficient company size',
  'Duplicate application',
  'Failed background check',
  'Budget does not match pricing',
  'Other',
]

interface RejectModalProps {
  entry: WaitlistEntry
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function RejectModal({ entry, onConfirm, onCancel }: RejectModalProps) {
  const [reason, setReason] = useState('')

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
            width: 40, height: 40, borderRadius: '50%', background: '#FEF2F2', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <XCircle size={20} color="#DC2626" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Reject Application</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{entry.companyName}</p>
          </div>
        </div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
          Rejection reason
        </label>
        <div style={{ marginBottom: 20 }}>
          <Select
            aria-label="Rejection reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            size="sm"
          >
            <option value="">Select a reason...</option>
            {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '9px 0', border: '1px solid #D1D5DB',
            borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600,
            color: '#374151', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button
            onClick={() => { if (reason) onConfirm(reason) }}
            disabled={!reason}
            style={{
              flex: 2, padding: '9px 0', border: 'none',
              borderRadius: 6, background: reason ? '#EF4444' : '#F3F4F6',
              fontSize: 13, fontWeight: 600,
              color: reason ? '#fff' : '#9CA3AF', cursor: reason ? 'pointer' : 'not-allowed',
            }}
          >
            Reject Application
          </button>
        </div>
      </div>
    </div>
  )
}
