'use client'

import { ChevronLeft } from 'lucide-react'
import { ROLE_OPTIONS, type InviteMethod, type InviteRow } from './types'

interface Step3ReviewProps {
  rows: InviteRow[]
  method: InviteMethod
  onBack: () => void
  onSend: () => void
}

export function Step3Review({ rows, method, onBack, onSend }: Step3ReviewProps) {
  const ROLE_LABEL: Record<string, string> = Object.fromEntries(ROLE_OPTIONS.map(r => [r.role, r.label]))
  return (
    <div>
      <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
        Review and confirm - {rows.length} invitation{rows.length > 1 ? 's' : ''} will be sent.
      </p>

      <div style={{
        background: '#F9FAFB', border: '1px solid #E2E8F0', borderRadius: 8,
        overflow: 'hidden', marginBottom: 20,
      }}>
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Auth Method: {method === 'microsoft_sso' ? 'Microsoft SSO' : 'Email & Password'}
          </span>
        </div>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 14px', borderBottom: i < rows.length - 1 ? '1px solid #E2E8F0' : 'none',
          }}>
            <span style={{ fontSize: 13, color: '#111827', fontFamily: 'monospace' }}>{row.email}</span>
            <span style={{
              background: '#F1F5F9', color: '#475569',
              fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
            }}>{ROLE_LABEL[row.role] ?? row.role}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          flex: 1, padding: '9px 0', border: '1px solid #D1D5DB', borderRadius: 7,
          background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <ChevronLeft size={15} /> Back
        </button>
        <button onClick={onSend} style={{
          flex: 2, padding: '9px 0', border: 'none', borderRadius: 7,
          background: '#F04A4A', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
        }}>
          Send {rows.length} Invitation{rows.length > 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}
