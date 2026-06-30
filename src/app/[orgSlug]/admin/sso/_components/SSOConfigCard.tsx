'use client'

import { ShieldCheck, CheckCircle, Copy } from 'lucide-react'

const ROLE_LABEL: Record<string, string> = {
  requester: 'Requester', wh_supervisor: 'WH Supervisor', exec_viewer: 'Exec Viewer',
}

interface SSOConfigCardProps {
  sso: { tenantId: string; clientId: string; allowedDomains: string[]; defaultRole: string }
  copied: string | null
  onCopy: (text: string, key: string) => void
}

export function SSOConfigCard({ sso, copied, onCopy }: SSOConfigCardProps) {
  return (
    <div className="bg-white rounded-card border border-border-default p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <ShieldCheck size={18} color="#2563EB" />
        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>Current Configuration</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Tenant ID', value: sso.tenantId, key: 'tenant' },
          { label: 'Client ID', value: sso.clientId, key: 'client' },
        ].map(field => (
          <div key={field.key}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
              {field.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{
                fontSize: 12, fontFamily: 'monospace', color: '#374151',
                background: '#F9FAFB', padding: '4px 8px', borderRadius: 4,
                border: '1px solid #E2E8F0', flex: 1, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {field.value}
              </code>
              <button
                onClick={() => onCopy(field.value, field.key)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === field.key ? '#16A34A' : '#9CA3AF', padding: 4 }}
              >
                {copied === field.key ? <CheckCircle size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        ))}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
            Allowed Domains
          </p>
          <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
            {sso.allowedDomains.join(', ') || 'All domains'}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
            Default Role
          </p>
          <span style={{
            background: '#F1F5F9', color: '#475569',
            fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 9999,
          }}>
            {ROLE_LABEL[sso.defaultRole] ?? sso.defaultRole}
          </span>
        </div>
      </div>
    </div>
  )
}
