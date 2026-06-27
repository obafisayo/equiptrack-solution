'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react'
import { WAITLIST } from '@/lib/mock-platform'
import type { WaitlistEntry } from '@/lib/types'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#FEF3C7', color: '#D97706', label: 'Pending'   },
  approved:  { bg: '#F0FDF4', color: '#16A34A', label: 'Approved'  },
  rejected:  { bg: '#FEF2F2', color: '#DC2626', label: 'Rejected'  },
  converted: { bg: '#EFF6FF', color: '#2563EB', label: 'Converted' },
}

const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  high:   { bg: '#FEF2F2', color: '#DC2626' },
  medium: { bg: '#FEF3C7', color: '#D97706' },
  low:    { bg: '#F9FAFB', color: '#6B7280' },
}

/* ── Approval Modal ───────────────────────────────────────────────────────── */

function ApproveModal({ entry, onConfirm, onCancel }: {
  entry: WaitlistEntry
  onConfirm: (note: string) => void
  onCancel: () => void
}) {
  const [note, setNote] = useState('')
  const textareaStyle = {
    width: '100%', padding: '8px 10px', border: '1px solid #D1D5DB',
    borderRadius: 6, fontSize: 13, color: '#111827', resize: 'vertical' as const,
    minHeight: 70, outline: 'none', boxSizing: 'border-box' as const,
  }
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
        width: 440, boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: '#F0FDF4', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle size={20} color="#16A34A" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Approve Application</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{entry.companyName}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginBottom: 14 }}>
          An onboarding invitation will be sent to <strong>{entry.contactEmail}</strong>.
          They will have 7 days to accept before the invite expires.
        </p>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
          Internal note (optional)
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Enterprise deal via partnership team…"
          style={textareaStyle}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '9px 0', border: '1px solid #D1D5DB',
            borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600,
            color: '#374151', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={() => onConfirm(note)} style={{
            flex: 2, padding: '9px 0', border: 'none',
            borderRadius: 6, background: '#16A34A', fontSize: 13, fontWeight: 600,
            color: '#fff', cursor: 'pointer',
          }}>
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Reject Modal ─────────────────────────────────────────────────────────── */

const REJECT_REASONS = [
  'Not in target market',
  'Insufficient company size',
  'Duplicate application',
  'Failed background check',
  'Budget does not match pricing',
  'Other',
]

function RejectModal({ entry, onConfirm, onCancel }: {
  entry: WaitlistEntry
  onConfirm: (reason: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState('')
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 28px 24px',
        width: 440, boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: '#FEF2F2', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <XCircle size={20} color="#DC2626" />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Reject Application</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>{entry.companyName}</p>
          </div>
        </div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
          Rejection reason
        </label>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={{
              width: '100%', padding: '8px 28px 8px 10px',
              border: '1px solid #D1D5DB', borderRadius: 6,
              fontSize: 13, color: '#111827', background: '#fff',
              appearance: 'none', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="">Select a reason…</option>
            {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '9px 0', border: '1px solid #D1D5DB',
            borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600,
            color: '#374151', cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button
            onClick={() => { if (reason) onConfirm(reason) }}
            disabled={!reason}
            style={{
              flex: 2, padding: '9px 0', border: 'none',
              borderRadius: 6, background: reason ? '#EF4444' : '#F3F4F6',
              fontSize: 13, fontWeight: 600,
              color: reason ? '#fff' : '#9CA3AF', cursor: reason ? 'pointer' : 'not-allowed',
            }}
          >
            Reject Application
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

type StatusFilter = 'all' | WaitlistEntry['status']
type PriorityFilter = 'all' | WaitlistEntry['priority']

export default function WaitlistPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [approveEntry, setApproveEntry] = useState<WaitlistEntry | null>(null)
  const [rejectEntry, setRejectEntry]   = useState<WaitlistEntry | null>(null)
  const [localStatus, setLocalStatus]   = useState<Record<string, WaitlistEntry['status']>>({})
  const [toast, setToast]               = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleApprove(note: string) {
    if (!approveEntry) return
    setLocalStatus(s => ({ ...s, [approveEntry.id]: 'approved' }))
    setApproveEntry(null)
    showToast(`Invitation sent to ${approveEntry.contactEmail}${note ? ' with note' : ''}.`)
  }

  function handleReject(_reason: string) {
    if (!rejectEntry) return
    setLocalStatus(s => ({ ...s, [rejectEntry.id]: 'rejected' }))
    setRejectEntry(null)
    showToast(`Application from ${rejectEntry.companyName} rejected.`)
  }

  const entries = WAITLIST.map(e => ({
    ...e,
    status: (localStatus[e.id] ?? e.status) as WaitlistEntry['status'],
  }))

  const filtered = entries.filter(e => {
    const matchSearch = !search ||
      e.companyName.toLowerCase().includes(search.toLowerCase()) ||
      e.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.industry.toLowerCase().includes(search.toLowerCase())
    const matchStatus   = statusFilter === 'all'   || e.status   === statusFilter
    const matchPriority = priorityFilter === 'all' || e.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const counts = {
    pending:   entries.filter(e => e.status === 'pending').length,
    approved:  entries.filter(e => e.status === 'approved').length,
    rejected:  entries.filter(e => e.status === 'rejected').length,
    converted: entries.filter(e => e.status === 'converted').length,
  }

  const selectStyle = {
    padding: '7px 28px 7px 10px',
    border: '1px solid #D1D5DB', borderRadius: 6,
    fontSize: 13, color: '#374151', background: '#fff',
    appearance: 'none' as const, cursor: 'pointer', outline: 'none',
  }

  return (
    <>
      {approveEntry && (
        <ApproveModal entry={approveEntry} onConfirm={handleApprove} onCancel={() => setApproveEntry(null)} />
      )}
      {rejectEntry && (
        <RejectModal entry={rejectEntry} onConfirm={handleReject} onCancel={() => setRejectEntry(null)} />
      )}

      {/* Toast */}
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
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Pending Review', value: counts.pending,  icon: Clock,        color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'Approved',       value: counts.approved,  icon: CheckCircle,  color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Rejected',       value: counts.rejected,  icon: XCircle,      color: '#DC2626', bg: '#FEF2F2' },
            { label: 'Converted',      value: counts.converted, icon: CheckCircle,  color: '#2563EB', bg: '#EFF6FF' },
          ].map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} style={{
                background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
                padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: card.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} color={card.color} />
                </div>
                <div>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1 }}>
                    {card.value}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>{card.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company, email, industry…"
              style={{
                width: '100%', padding: '8px 12px 8px 32px',
                border: '1px solid #D1D5DB', borderRadius: 7,
                fontSize: 13, color: '#111827', background: '#fff',
                outline: 'none', boxSizing: 'border-box' as const,
              }}
            />
          </div>

          {/* Status filter */}
          <div style={{ position: 'relative' }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)} style={selectStyle}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="converted">Converted</option>
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>

          {/* Priority filter */}
          <div style={{ position: 'relative' }}>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as PriorityFilter)} style={selectStyle}>
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden"
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                      No waitlist entries match your filter.
                    </td>
                  </tr>
                )}
                {filtered.map(entry => {
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
                              onClick={() => setApproveEntry(entry)}
                              style={{
                                fontSize: 11, fontWeight: 600, color: '#16A34A',
                                padding: '4px 10px', background: '#F0FDF4',
                                border: 'none', borderRadius: 5, cursor: 'pointer',
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectEntry(entry)}
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
                          <span style={{ fontSize: 12, color: '#9CA3AF' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
