'use client'

import type { WaitlistEntry } from '@/lib/types'
import { fmtDate, STATUS_STYLE, PRIORITY_STYLE } from './styleMaps'

interface WaitlistTableProps {
  entries: WaitlistEntry[]
  onApprove: (entry: WaitlistEntry) => void
  onReject: (entry: WaitlistEntry) => void
}

export function WaitlistTable({ entries, onApprove, onReject }: WaitlistTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              {['Company', 'Contact', 'Industry', 'Seats', 'Priority', 'Applied', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left whitespace-nowrap" style={{
                  padding: '10px 16px', fontSize: 11, fontWeight: 600,
                  color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                  No waitlist entries match your filter.
                </td>
              </tr>
            )}
            {entries.map(entry => {
              const ss = STATUS_STYLE[entry.status]
              const ps = PRIORITY_STYLE[entry.priority]
              const isPending = entry.status === 'pending'
              return (
                <tr key={entry.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{entry.companyName}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0' }}>{entry.industry}</p>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{entry.contactName}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0', fontFamily: 'monospace' }}>{entry.contactEmail}</p>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{entry.industry}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{entry.estimatedTeamSize}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: ps.bg, color: ps.color,
                      fontSize: 10, fontWeight: 700, padding: '2px 7px',
                      borderRadius: 9999, textTransform: 'uppercase',
                    }}>
                      {entry.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                    {fmtDate(entry.submittedAt)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: ss.bg, color: ss.color,
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 9999,
                    }}>
                      {ss.label}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {isPending ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => onApprove(entry)}
                          style={{
                            fontSize: 11, fontWeight: 600, color: '#16A34A',
                            padding: '4px 10px', background: '#F0FDF4',
                            border: 'none', borderRadius: 5, cursor: 'pointer',
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(entry)}
                          style={{
                            fontSize: 11, fontWeight: 600, color: '#DC2626',
                            padding: '4px 10px', background: '#FEF2F2',
                            border: 'none', borderRadius: 5, cursor: 'pointer',
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>-</span>
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
