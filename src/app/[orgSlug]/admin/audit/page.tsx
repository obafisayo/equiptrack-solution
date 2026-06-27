'use client'

import { use } from 'react'
import { AuditLogTable } from '@/components/shared/AuditLogTable'
import { AUDIT_EVENTS, ORGANISATIONS } from '@/lib/mock-platform'

export default function OrgAdminAuditPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const org = ORGANISATIONS.find(o => o.slug === orgSlug)

  const events = AUDIT_EVENTS.filter(e => e.orgId === org?.id)

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Audit Log
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          All activity within {org?.name ?? 'this organisation'}
        </p>
      </div>

      {events.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
          padding: '56px 32px', textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: 0 }}>
            No audit events recorded yet for this organisation.
          </p>
        </div>
      ) : (
        <AuditLogTable events={events} />
      )}
    </div>
  )
}
