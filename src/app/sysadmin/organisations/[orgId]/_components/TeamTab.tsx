'use client'

import { USERS, INVITATIONS } from '@/lib/mock-platform'
import { relativeTime, fmtDate, USER_STATUS_STYLE, ROLE_LABEL } from './styleMaps'

interface TeamTabProps {
  orgId: string
}

export function TeamTab({ orgId }: TeamTabProps) {
  const members = USERS.filter(u => u.orgId === orgId)
  const orgInvitations = INVITATIONS.filter(i => i.orgId === orgId)

  return (
    <div className="space-y-5">
      {/* Members table */}
      <div className="bg-white rounded-card border border-border-default overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Team Members ({members.length})</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                {['Name', 'Email', 'Role', 'Auth', 'Status', 'Last Login'].map(h => (
                  <th key={h} className="text-left whitespace-nowrap" style={{
                    padding: '9px 16px', fontSize: 11, fontWeight: 600,
                    color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map(user => {
                const us = USER_STATUS_STYLE[user.status] ?? USER_STATUS_STYLE.active
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                    <td style={{ padding: '11px 16px', fontWeight: 600, color: '#111827' }}>
                      {user.displayName}
                    </td>
                    <td style={{ padding: '11px 16px', color: '#6B7280', fontFamily: 'monospace', fontSize: 12 }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        background: '#F1F5F9', color: '#475569',
                        fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                      }}>
                        {ROLE_LABEL[user.role] ?? user.role}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12, textTransform: 'capitalize' }}>
                      {user.authProvider}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        background: us.bg, color: us.color,
                        fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, textTransform: 'capitalize',
                      }}>{user.status}</span>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>
                      {user.lastActiveAt ? relativeTime(user.lastActiveAt) : 'Never'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending invitations */}
      {orgInvitations.length > 0 && (
        <div className="bg-white rounded-card border border-border-default overflow-hidden"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Pending Invitations ({orgInvitations.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                  {['Email', 'Role', 'Invited by', 'Expires', 'Auth', 'Status'].map(h => (
                    <th key={h} className="text-left whitespace-nowrap" style={{
                      padding: '9px 16px', fontSize: 11, fontWeight: 600,
                      color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orgInvitations.map(inv => {
                  const inviterName = USERS.find(u => u.id === inv.invitedBy)?.displayName ?? inv.invitedBy
                  const invStyle = inv.status === 'pending'
                    ? { bg: '#FEF3C7', color: '#D97706' }
                    : inv.status === 'accepted'
                    ? { bg: '#F0FDF4', color: '#16A34A' }
                    : { bg: '#FEF2F2', color: '#DC2626' }
                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '11px 16px', color: '#374151', fontFamily: 'monospace', fontSize: 12 }}>{inv.email}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{
                          background: '#F1F5F9', color: '#475569',
                          fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                        }}>{ROLE_LABEL[inv.role] ?? inv.role}</span>
                      </td>
                      <td style={{ padding: '11px 16px', color: '#6B7280' }}>{inviterName}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>{fmtDate(inv.expiresAt)}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12, textTransform: 'capitalize' }}>{inv.authMethod.replace('_', ' ')}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{
                          background: invStyle.bg, color: invStyle.color,
                          fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, textTransform: 'capitalize',
                        }}>{inv.status}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
