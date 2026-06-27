'use client'

import { AuditLogTable } from '@/components/shared/AuditLogTable'
import { AUDIT_EVENTS } from '@/lib/mock-platform'

export default function SysadminAuditPage() {
  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Platform Audit Log
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
          System-wide activity across all organisations
        </p>
      </div>

      <AuditLogTable events={AUDIT_EVENTS} showOrgColumn />
    </div>
  )
}
