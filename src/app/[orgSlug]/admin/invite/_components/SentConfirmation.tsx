'use client'

import { Check } from 'lucide-react'
import type { InviteMethod, InviteRow } from './types'

interface SentConfirmationProps {
  rows: InviteRow[]
  method: InviteMethod
  onInviteMore: () => void
}

export function SentConfirmation({ rows, method, onInviteMore }: SentConfirmationProps) {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', paddingTop: 40 }}>
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
        padding: '48px 32px', textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#F0FDF4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <Check size={26} color="#16A34A" />
        </div>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Invitations sent</p>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>
          {rows.length} invitation{rows.length > 1 ? 's' : ''} sent via {method === 'microsoft_sso' ? 'Microsoft SSO' : 'email'}.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((r, i) => (
            <div key={i} style={{
              padding: '8px 12px', background: '#F9FAFB', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, color: '#374151', fontFamily: 'monospace' }}>{r.email}</span>
              <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 600 }}>Sent</span>
            </div>
          ))}
        </div>
        <button
          onClick={onInviteMore}
          style={{
            marginTop: 24, padding: '9px 20px', border: 'none',
            borderRadius: 7, background: '#F04A4A', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Invite more members
        </button>
      </div>
    </div>
  )
}
