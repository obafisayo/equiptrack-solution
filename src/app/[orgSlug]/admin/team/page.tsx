'use client'

import { use, useState } from 'react'
import { Search, Download, UserX, RotateCcw } from 'lucide-react'
import { ORGANISATIONS, USERS, INVITATIONS } from '@/lib/mock-platform'

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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const ROLE_LABEL: Record<string, string> = {
  org_admin:            'Org Admin',
  requester:            'Requester',
  wh_supervisor:        'WH Supervisor',
  wh_personnel:         'WH Personnel',
  dsp_supervisor:       'DSP Supervisor',
  dsp_personnel:        'DSP Personnel',
  qaqc_officer:         'QAQC Officer',
  exec_viewer:          'Exec Viewer',
  safety_officer:       'Safety Officer',
  logistics_coordinator:'Logistics Coord.',
  inventory_manager:    'Inventory Mgr',
  rig_manager:          'Rig Manager',
  crane_operator:       'Crane Operator',
  maintenance_tech:     'Maintenance Tech',
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A' },
  invited:   { bg: '#EFF6FF', color: '#2563EB' },
  suspended: { bg: '#FEF2F2', color: '#DC2626' },
  inactive:  { bg: '#F9FAFB', color: '#6B7280' },
}

const INV_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#FEF3C7', color: '#D97706', label: 'Pending'  },
  accepted: { bg: '#F0FDF4', color: '#16A34A', label: 'Accepted' },
  expired:  { bg: '#FEF2F2', color: '#DC2626', label: 'Expired'  },
  revoked:  { bg: '#F9FAFB', color: '#6B7280', label: 'Revoked'  },
}

type TabKey = 'members' | 'invitations'

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function TeamPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const [activeTab, setActiveTab]       = useState<TabKey>('members')
  const [search, setSearch]             = useState('')
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set())
  const [toast, setToast]               = useState<string | null>(null)

  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const members = USERS.filter(u => u.orgId === org?.id)
  const invitations = INVITATIONS.filter(i => i.orgId === org?.id)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function toggleSuspend(userId: string, name: string) {
    setSuspendedIds(s => {
      const n = new Set(s)
      if (n.has(userId)) {
        n.delete(userId)
        showToast(`${name} has been reactivated.`)
      } else {
        n.add(userId)
        showToast(`${name} has been suspended.`)
      }
      return n
    })
  }

  function handleCSVExport() {
    const rows = members.map(u => [
      u.displayName, u.email, ROLE_LABEL[u.role] ?? u.role,
      suspendedIds.has(u.id) ? 'suspended' : u.status,
      u.lastActiveAt ? new Date(u.lastActiveAt).toISOString() : '',
    ])
    const csv = [
      ['Name', 'Email', 'Role', 'Status', 'Last Active'].join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `${orgSlug}-team.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredMembers = members.filter(u =>
    !search ||
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (ROLE_LABEL[u.role] ?? u.role).toLowerCase().includes(search.toLowerCase())
  )

  const filteredInvitations = invitations.filter(i =>
    !search ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    (ROLE_LABEL[i.role] ?? i.role).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 300,
          background: '#111827', color: '#fff',
          padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}>
          {toast}
        </div>
      )}

      <div className="space-y-5">
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, role…"
              style={{
                width: '100%', padding: '8px 12px 8px 32px',
                border: '1px solid #D1D5DB', borderRadius: 7,
                fontSize: 13, color: '#111827', background: '#fff',
                outline: 'none', boxSizing: 'border-box' as const,
              }}
            />
          </div>
          <button
            onClick={handleCSVExport}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', border: '1px solid #D1D5DB',
              borderRadius: 7, background: '#fff', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: '#374151',
              flexShrink: 0,
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid #E2E8F0' }}>
          {([
            { key: 'members' as TabKey,     label: 'Members',     count: members.length     },
            { key: 'invitations' as TabKey, label: 'Invitations', count: invitations.length },
          ]).map(tab => {
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '9px 14px', border: 'none',
                  borderBottom: `2px solid ${active ? '#F04A4A' : 'transparent'}`,
                  marginBottom: -1,
                  background: 'transparent', cursor: 'pointer',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? '#F04A4A' : '#6B7280',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {tab.label}
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 9999,
                  background: active ? '#FFF1F1' : '#F3F4F6',
                  color: active ? '#F04A4A' : '#9CA3AF',
                }}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Members table */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
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
                  {filteredMembers.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF' }}>No members match your search.</td></tr>
                  )}
                  {filteredMembers.map(user => {
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
                            <span style={{ fontSize: 12, color: '#9CA3AF' }}>—</span>
                          ) : (
                            <button
                              onClick={() => toggleSuspend(user.id, user.displayName)}
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
        )}

        {/* Invitations table */}
        {activeTab === 'invitations' && (
          <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
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
                  {filteredInvitations.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#9CA3AF' }}>No invitations found.</td></tr>
                  )}
                  {filteredInvitations.map(inv => {
                    const is  = INV_STATUS_STYLE[inv.status] ?? INV_STATUS_STYLE.pending
                    const inviterName = USERS.find(u => u.id === inv.invitedBy)?.displayName ?? inv.invitedBy
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
        )}
      </div>
    </>
  )
}
