'use client'

import Link from 'next/link'
import { relativeTime } from './helpers'

interface AuditEvent {
  id: string
  actorName: string
  action: string
  targetLabel: string
  createdAt: string
}

interface RecentActivityCardProps {
  orgSlug: string
  events: AuditEvent[]
}

export function RecentActivityCard({ orgSlug, events }: RecentActivityCardProps) {
  return (
    <div className="bg-white rounded-card border border-border-default overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Recent Activity</p>
        <Link href={`/${orgSlug}/admin/audit`} style={{ fontSize: 12, color: '#F04A4A', fontWeight: 600, textDecoration: 'none' }}>
          View all
        </Link>
      </div>
      <div className="divide-y divide-[#F3F4F6]">
        {events.map(e => (
          <div key={e.id} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                <strong style={{ color: '#111827' }}>{e.actorName}</strong>{' '}
                <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#6B7280' }}>{e.action}</code>{' '}
                {e.targetLabel}
              </p>
            </div>
            <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>
              {relativeTime(e.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
