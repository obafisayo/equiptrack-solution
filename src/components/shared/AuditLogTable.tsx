/* eslint-disable */
'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import type { AuditEvent } from '@/lib/types'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins  = Math.floor(diff / 60000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
}

const TARGET_TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  user:         { bg: '#F5F3FF', color: '#7C3AED' },
  org:          { bg: '#EFF6FF', color: '#2563EB' },
  workorder:    { bg: '#FEF3C7', color: '#D97706' },
  subscription: { bg: '#F0FDF4', color: '#16A34A' },
  sso:          { bg: '#ECFEFF', color: '#0891B2' },
}

const ROLE_LABEL: Record<string, string> = {
  sysadmin:             'Sysadmin',
  org_admin:            'Org Admin',
  requester:            'Requester',
  wh_supervisor:        'WH Supervisor',
  wh_personnel:         'WH Personnel',
  dsp_supervisor:       'DSP Supervisor',
  dsp_personnel:        'DSP Personnel',
  qaqc_officer:         'QAQC Officer',
  exec_viewer:          'Exec Viewer',
  safety_officer:       'Safety Officer',
  logistics_coordinator:'Logistics',
  inventory_manager:    'Inventory',
  rig_manager:          'Rig Manager',
  crane_operator:       'Crane Op.',
  maintenance_tech:     'Maintenance',
}

/* ── Component ────────────────────────────────────────────────────────────── */

interface AuditLogTableProps {
  events: AuditEvent[]
  showOrgColumn?: boolean
}

export function AuditLogTable({ events, showOrgColumn = false }: AuditLogTableProps) {
  const [search, setSearch]           = useState('')
  const [targetFilter, setTargetFilter] = useState('all')
  const [page, setPage]               = useState(1)
  const PER_PAGE = 10

  const filtered = events
    .filter(e => {
      const matchSearch = !search ||
        e.actorName.toLowerCase().includes(search.toLowerCase()) ||
        e.action.toLowerCase().includes(search.toLowerCase()) ||
        e.targetLabel.toLowerCase().includes(search.toLowerCase())
      const matchTarget = targetFilter === 'all' || e.targetType === targetFilter
      return matchSearch && matchTarget
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const selectStyle = {
    padding: '7px 28px 7px 10px',
    border: '1px solid #D1D5DB', borderRadius: 6,
    fontSize: 13, color: '#374151', background: '#fff',
    appearance: 'none' as const, cursor: 'pointer', outline: 'none',
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search actor, action, target…"
            style={{
              width: '100%', padding: '8px 12px 8px 32px',
              border: '1px solid #D1D5DB', borderRadius: 7,
              fontSize: 13, color: '#111827', background: '#fff',
              outline: 'none', boxSizing: 'border-box' as const,
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select
            aria-label="Filter by target"
            value={targetFilter}
            onChange={e => { setTargetFilter(e.target.value); setPage(1) }}
            style={selectStyle}
          >
            <option value="all">All targets</option>
            <option value="user">User</option>
            <option value="org">Organisation</option>
            <option value="workorder">Work Order</option>
            <option value="subscription">Subscription</option>
            <option value="sso">SSO</option>
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
        </div>
        <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card border border-border-default overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
                {[
                  'Time', 'Actor', 'Role', 'Action', 'Target',
                  ...(showOrgColumn ? ['Organisation'] : []),
                  'IP Address',
                ].map(h => (
                  <th key={h} className="text-left whitespace-nowrap" style={{
                    padding: '10px 16px', fontSize: 11, fontWeight: 600,
                    color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={showOrgColumn ? 7 : 6}
                    style={{ padding: '48px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}
                  >
                    No audit events match your filter.
                  </td>
                </tr>
              )}
              {paginated.map((event, i) => {
                const tt = TARGET_TYPE_STYLE[event.targetType] ?? TARGET_TYPE_STYLE.org
                return (
                  <tr
                    key={event.id}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#fff' : '#FAFAFA')}
                  >
                    <td style={{ padding: '11px 16px', color: '#6B7280', whiteSpace: 'nowrap', fontSize: 12 }}
                      title={new Date(event.createdAt).toLocaleString()}>
                      {relativeTime(event.createdAt)}
                    </td>
                    <td style={{ padding: '11px 16px', fontWeight: 500, color: '#111827' }}>
                      {event.actorName}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        background: '#F1F5F9', color: '#475569',
                        fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 9999,
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}>
                        {ROLE_LABEL[event.actorRole] ?? event.actorRole}
                      </span>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151' }}>
                        {event.action}
                      </code>
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                          display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                          background: tt.color, flexShrink: 0,
                        }} />
                        <span style={{ color: '#374151' }} className="max-w-40 truncate">
                          {event.targetLabel}
                        </span>
                      </div>
                    </td>
                    {showOrgColumn && (
                      <td style={{ padding: '11px 16px', color: '#6B7280', fontSize: 12 }}>
                        {event.orgId ?? '—'}
                      </td>
                    )}
                    <td style={{ padding: '11px 16px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11 }}>
                      {event.ipAddress ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#6B7280' }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '5px 12px', border: '1px solid #E2E8F0', borderRadius: 5,
                background: '#fff', fontSize: 12, fontWeight: 600,
                color: page === 1 ? '#D1D5DB' : '#374151',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '5px 12px', border: '1px solid #E2E8F0', borderRadius: 5,
                background: '#fff', fontSize: 12, fontWeight: 600,
                color: page === totalPages ? '#D1D5DB' : '#374151',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
