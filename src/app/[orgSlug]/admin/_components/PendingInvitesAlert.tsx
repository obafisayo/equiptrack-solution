'use client'

import Link from 'next/link'
import { Clock } from 'lucide-react'

interface PendingInvitesAlertProps {
  orgSlug: string
  count: number
}

export function PendingInvitesAlert({ orgSlug, count }: PendingInvitesAlertProps) {
  return (
    <div style={{
      background: '#FFFBEB', borderRadius: 8, border: '1px solid #FCD34D',
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <Clock size={18} color="#D97706" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#92400E', margin: 0 }}>
          {count} pending invitation{count > 1 ? 's' : ''}
        </p>
        <p style={{ fontSize: 12, color: '#B45309', margin: '2px 0 0' }}>
          These invites will expire if not accepted.
        </p>
      </div>
      <Link
        href={`/${orgSlug}/admin/team`}
        style={{
          fontSize: 12, fontWeight: 600, color: '#D97706',
          textDecoration: 'none', padding: '5px 12px',
          border: '1px solid #FCD34D', borderRadius: 6,
          background: '#FEF3C7', flexShrink: 0,
        }}
      >
        Review
      </Link>
    </div>
  )
}
