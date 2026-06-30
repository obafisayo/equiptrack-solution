'use client'

import { UserX, RotateCcw } from 'lucide-react'
import type { User } from '@/lib/types'
import { ROLE_LABEL, STATUS_STYLE, relativeTime } from './constants'

interface MembersTableProps {
  members: User[]
  suspendedIds: Set<string>
  onToggleSuspend: (userId: string, name: string) => void
}

export function MembersTable({ members, suspendedIds, onToggleSuspend }: MembersTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              {['Name', 'Email', 'Role', 'Auth', 'Status', 'Last Active', 'Actions'].map(h => (
                <th key={h} className="text-left whitespace-nowrap" style={{
                  padding: '9px 16px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF' }}>No members match your search.</td></tr>
            )}
            {members.map(user => {
              const isSuspended = suspendedIds.has(user.id) || user.status === 'suspended'
              const statusKey   = isSuspended ? 'suspended' : user.status
              const us = STATUS_STYLE[statusKey] ?? STATUS_STYLE.active
              const isAdmin = user.role === 'org_admin'
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                  <td style={{ padding: '11px 16px', fontWeight: 600, color: '#111827' }}>{user.displayName}</td>
                  <td style={{ padding: '11px 16px', color: '#6B7280', fontFamily: 'monospace', fontSize: 12 }}>{user.email}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      background: isAdmin ? '#FFF1F1' : '#F1F5F9',
                      color: isAdmin ? '#F04A4A' : '#475569',
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                    }}>{ROLE_LABEL[user.role] ?? user.role}</span>
                  </td>
                  <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12, textTransform: 'capitalize' }}>
                    {user.authProvider}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      background: us.bg, color: us.color,
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, textTransform: 'capitalize',
                    }}>{statusKey}</span>
                  </td>
                  <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>
                    {user.lastActiveAt ? relativeTime(user.lastActiveAt) : 'Never'}
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    {isAdmin ? (
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>-</span>
                    ) : (
                      <button
                        onClick={() => onToggleSuspend(user.id, user.displayName)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          fontSize: 11, fontWeight: 600,
                          color: isSuspended ? '#16A34A' : '#DC2626',
                          padding: '4px 9px',
                          background: isSuspended ? '#F0FDF4' : '#FEF2F2',
                          border: 'none', borderRadius: 5, cursor: 'pointer',
                        }}
                      >
                        {isSuspended ? <RotateCcw size={11} /> : <UserX size={11} />}
                        {isSuspended ? 'Activate' : 'Suspend'}
                      </button>
                    )}
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
