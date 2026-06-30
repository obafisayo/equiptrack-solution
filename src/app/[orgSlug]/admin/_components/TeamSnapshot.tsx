'use client'

import Link from 'next/link'
import { relativeTime, ROLE_LABEL, USER_STATUS_STYLE } from './helpers'

interface User {
  id: string
  displayName: string
  role: string
  status: string
  lastActiveAt?: string | null
}

interface TeamSnapshotProps {
  orgSlug: string
  members: User[]
}

export function TeamSnapshot({ orgSlug, members }: TeamSnapshotProps) {
  return (
    <div className="flex-[2] bg-white rounded-card border border-border-default overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Team ({members.length})</p>
        <Link href={`/${orgSlug}/admin/team`} style={{ fontSize: 12, color: '#F04A4A', fontWeight: 600, textDecoration: 'none' }}>
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              {['Name', 'Role', 'Status', 'Last Active'].map(h => (
                <th key={h} className="text-left whitespace-nowrap" style={{
                  padding: '9px 16px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.slice(0, 6).map(user => {
              const us = USER_STATUS_STYLE[user.status] ?? USER_STATUS_STYLE.active
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#111827' }}>{user.displayName}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{
                      background: '#F1F5F9', color: '#475569',
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
                    }}>{ROLE_LABEL[user.role] ?? user.role}</span>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{
                      background: us.bg, color: us.color,
                      fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999, textTransform: 'capitalize',
                    }}>{user.status}</span>
                  </td>
                  <td style={{ padding: '10px 16px', color: '#6B7280', fontSize: 12 }}>
                    {user.lastActiveAt ? relativeTime(user.lastActiveAt) : 'Never'}
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
