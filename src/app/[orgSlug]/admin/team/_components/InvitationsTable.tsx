'use client'

import type { Invitation, User } from '@/lib/types'
import { ROLE_LABEL, INV_STATUS_STYLE, fmtDate } from './constants'

interface InvitationsTableProps {
  invitations: Invitation[]
  users: User[]
}

export function InvitationsTable({ invitations, users }: InvitationsTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              {['Email', 'Role', 'Invited by', 'Expires', 'Auth Method', 'Status'].map(h => (
                <th key={h} className="text-left whitespace-nowrap" style={{
                  padding: '9px 16px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invitations.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF' }}>No invitations found.</td></tr>
            )}
            {invitations.map(inv => {
              const is  = INV_STATUS_STYLE[inv.status] ?? INV_STATUS_STYLE.pending
              const inviterName = users.find(u => u.id === inv.invitedBy)?.displayName ?? inv.invitedBy
              return (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                  <td style={{ padding: '11px 16px', color: '#374151', fontFamily: 'monospace', fontSize: 12 }}>{inv.email}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      background: '#F1F5F9', color: '#475569',
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                    }}>{ROLE_LABEL[inv.role] ?? inv.role}</span>
                  </td>
                  <td style={{ padding: '11px 16px', color: '#6B7280' }}>{inviterName}</td>
                  <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>{fmtDate(inv.expiresAt)}</td>
                  <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12, textTransform: 'capitalize' }}>
                    {inv.authMethod.replace('_', ' ')}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      background: is.bg, color: is.color,
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                    }}>{is.label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
