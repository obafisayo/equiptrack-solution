'use client'

import Link from 'next/link'
import type { Organisation } from '@/lib/types'
import { STATUS_STYLE, TIER_STYLE, SUB_STATUS_STYLE } from './styleMaps'

interface OrganisationsTableProps {
  organisations: Organisation[]
  suspendedIds: Set<string>
  onToggleSuspend: (id: string, action: 'suspend' | 'activate') => void
}

export function OrganisationsTable({ organisations, suspendedIds, onToggleSuspend }: OrganisationsTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              {['Organisation', 'Industry', 'Tier', 'Status', 'Billing', 'Seats', 'Health', 'Actions'].map(h => (
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
            {organisations.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                  No organisations match your filter.
                </td>
              </tr>
            )}
            {organisations.map(org => {
              const isSuspended = suspendedIds.has(org.id) || org.status === 'suspended'
              const statusKey = isSuspended ? 'suspended' : org.status
              const ss = STATUS_STYLE[statusKey] ?? STATUS_STYLE.active
              const ts = TIER_STYLE[org.subscription.tier] ?? TIER_STYLE.starter
              const bs = SUB_STATUS_STYLE[org.subscription.status] ?? SUB_STATUS_STYLE.active
              const scoreColor = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'

              return (
                <tr key={org.id} style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: '#F04A4A18',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#F04A4A' }}>
                          {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{org.name}</p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0', fontFamily: 'monospace' }}>{org.adminEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{org.industry}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: ts.bg, color: ts.color, fontSize: 11, fontWeight: 600,
                      padding: '2px 8px', borderRadius: 9999,
                    }}>{ts.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 600,
                      padding: '2px 8px', borderRadius: 9999, textTransform: 'capitalize',
                    }}>{ss.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: bs.bg, color: bs.color, fontSize: 11, fontWeight: 600,
                      padding: '2px 8px', borderRadius: 9999,
                    }}>{bs.label}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>
                    {org.subscription.seatsUsed}/{org.subscription.seats}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 52, height: 5, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${org.healthScore}%`, height: '100%', background: scoreColor, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor }}>{org.healthScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link
                        href={`/sysadmin/organisations/${org.id}`}
                        style={{
                          fontSize: 11, fontWeight: 600, color: '#F04A4A',
                          textDecoration: 'none', padding: '4px 10px',
                          background: '#FFF1F1', borderRadius: 5,
                        }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => onToggleSuspend(org.id, isSuspended ? 'activate' : 'suspend')}
                        style={{
                          fontSize: 11, fontWeight: 600,
                          color: isSuspended ? '#16A34A' : '#DC2626',
                          padding: '4px 10px',
                          background: isSuspended ? '#F0FDF4' : '#FEF2F2',
                          border: 'none', borderRadius: 5, cursor: 'pointer',
                        }}
                      >
                        {isSuspended ? 'Activate' : 'Suspend'}
                      </button>
                    </div>
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
