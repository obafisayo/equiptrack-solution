'use client'

import { AUDIT_EVENTS } from '@/lib/mock-platform'
import { relativeTime } from './styleMaps'

interface AuditTabProps {
  orgId: string
}

export function AuditTab({ orgId }: AuditTabProps) {
  const events = AUDIT_EVENTS.filter(e => e.orgId === orgId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-card border border-border-default p-10 text-center"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>No audit events for this organisation.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-card border border-border-default overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              {['Time', 'Actor', 'Action', 'Target', 'IP'].map(h => (
                <th key={h} className="text-left whitespace-nowrap" style={{
                  padding: '10px 16px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={e.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#F9FAFB' }}>
                <td style={{ padding: '11px 16px', color: '#6B7280', whiteSpace: 'nowrap', fontSize: 12 }}>
                  {relativeTime(e.createdAt)}
                </td>
                <td style={{ padding: '11px 16px', fontWeight: 500, color: '#111827' }}>{e.actorName}</td>
                <td style={{ padding: '11px 16px' }}>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151' }}>{e.action}</code>
                </td>
                <td style={{ padding: '11px 16px', color: '#374151' }}>{e.targetLabel}</td>
                <td style={{ padding: '11px 16px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11 }}>
                  {e.ipAddress ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
