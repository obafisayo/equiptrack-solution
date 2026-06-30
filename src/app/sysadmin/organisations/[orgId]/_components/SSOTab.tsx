'use client'

import { ShieldCheck } from 'lucide-react'
import { SSO_CONFIGS } from '@/lib/mock-platform'
import { fmtDate, ROLE_LABEL } from './styleMaps'

interface SSOTabProps {
  orgId: string
}

export function SSOTab({ orgId }: SSOTabProps) {
  const sso = SSO_CONFIGS.find(s => s.orgId === orgId)

  if (!sso) {
    return (
      <div className="bg-white rounded-card border border-border-default p-10 text-center"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
        }}>
          <ShieldCheck size={22} color="#9CA3AF" />
        </div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 4px' }}>No SSO configured</p>
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
          This organisation has not set up Single Sign-On.
        </p>
      </div>
    )
  }

  const verifiedStyle = sso.status === 'verified'
    ? { bg: '#F0FDF4', color: '#16A34A', label: 'Verified' }
    : sso.status === 'error'
    ? { bg: '#FEF2F2', color: '#DC2626', label: 'Error' }
    : { bg: '#FEF3C7', color: '#D97706', label: 'Pending' }

  const fields = [
    { label: 'Provider',          value: sso.provider === 'microsoft' ? 'Microsoft Azure AD' : 'Google Workspace' },
    { label: 'Tenant ID',         value: sso.tenantId },
    { label: 'Client ID',         value: sso.clientId, mono: true },
    { label: 'Status',            value: null as null },
    { label: 'Auto-provision',    value: sso.autoProvision ? 'Enabled' : 'Disabled' },
    { label: 'Default Role',      value: ROLE_LABEL[sso.defaultRole] ?? sso.defaultRole },
    { label: 'Verified At',       value: sso.verifiedAt ? fmtDate(sso.verifiedAt) : '-' },
    { label: 'Allowed Domains',   value: sso.allowedDomains.join(', ') || '-' },
  ]

  return (
    <div className="bg-white rounded-card border border-border-default p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 18px' }}>SSO Configuration</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map(f => (
          <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              {f.label}
            </p>
            {f.label === 'Status' ? (
              <span style={{
                display: 'inline-block', width: 'fit-content',
                background: verifiedStyle.bg, color: verifiedStyle.color,
                fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
              }}>
                {verifiedStyle.label}
              </span>
            ) : (
              <p style={{
                fontSize: 13, color: '#111827', margin: 0,
                fontFamily: f.mono ? 'monospace' : undefined,
              }}>
                {f.value ?? '-'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
