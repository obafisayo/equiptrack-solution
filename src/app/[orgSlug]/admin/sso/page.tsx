/* eslint-disable */
'use client'

import { use, useState } from 'react'
import { ShieldCheck, AlertTriangle, CheckCircle, Copy, RefreshCw } from 'lucide-react'
import { ORGANISATIONS, SSO_CONFIGS } from '@/lib/mock-platform'
import { Input } from '@/components/ui/Form'

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function SSOPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)

  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const sso = SSO_CONFIGS.find(s => s.orgId === org?.id)

  const [copied, setCopied]   = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [form, setForm]       = useState({
    tenantId:  sso?.tenantId  ?? '',
    clientId:  sso?.clientId  ?? '',
    domain:    sso?.allowedDomains[0] ?? '',
    autoProvision: sso?.autoProvision ?? true,
  })

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000) }, 1200)
  }

  /* ── State: Not configured ─────────────────────────────────────────────── */

  if (!sso) {
    return (
      <div className="space-y-5">
        {/* Banner */}
        <div style={{
          background: '#FFFBEB', borderRadius: 8, border: '1px solid #FCD34D',
          padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#92400E', margin: 0 }}>
              SSO not configured
            </p>
            <p style={{ fontSize: 12, color: '#B45309', margin: '3px 0 0' }}>
              Your team is signing in with email and password. Configure Microsoft SSO to enable
              single sign-on across your organisation.
            </p>
          </div>
        </div>

        {/* Setup instructions */}
        <div className="bg-white rounded-card border border-border-default p-5"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>
            Set up Microsoft Azure AD SSO
          </p>
          <ol style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'In Azure AD, create a new Enterprise Application.',
              'Set the redirect URI to: https://app.equiptrack.io/auth/sso/microsoft',
              'Copy the Application (client) ID and Directory (tenant) ID.',
              'Enter them below and click Save.',
            ].map((step, i) => (
              <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{step}</li>
            ))}
          </ol>
        </div>

        <SSOForm form={form} setForm={setForm} onSave={handleSave} saving={saving} saved={saved} />
      </div>
    )
  }

  /* ── State: Error ──────────────────────────────────────────────────────── */

  if (sso.status === 'error') {
    return (
      <div className="space-y-5">
        <div style={{
          background: '#FEF2F2', borderRadius: 8, border: '1px solid #FCA5A5',
          padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#991B1B', margin: 0 }}>
              SSO configuration error
            </p>
            <p style={{ fontSize: 12, color: '#B91C1C', margin: '3px 0 0' }}>
              Authentication is failing. Verify your Tenant ID and Client ID in Azure AD.
            </p>
          </div>
        </div>
        <SSOConfigCard sso={sso} copied={copied} onCopy={copyToClipboard} />
        <SSOForm form={form} setForm={setForm} onSave={handleSave} saving={saving} saved={saved} />
      </div>
    )
  }

  /* ── State: Verified ───────────────────────────────────────────────────── */

  return (
    <div className="space-y-5">
      <div style={{
        background: '#F0FDF4', borderRadius: 8, border: '1px solid #86EFAC',
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <CheckCircle size={18} color="#16A34A" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#14532D', margin: 0 }}>
            SSO active and verified
          </p>
          <p style={{ fontSize: 12, color: '#166534', margin: '3px 0 0' }}>
            {sso.verifiedAt
              ? `Verified on ${new Date(sso.verifiedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.`
              : 'Your organisation is using Microsoft SSO.'}{' '}
            {sso.autoProvision ? 'Auto-provisioning is enabled.' : ''}
          </p>
        </div>
      </div>

      <SSOConfigCard sso={sso} copied={copied} onCopy={copyToClipboard} />
      <SSOForm form={form} setForm={setForm} onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

/* ── Shared sub-components ────────────────────────────────────────────────── */

function SSOConfigCard({ sso, copied, onCopy }: {
  sso: { tenantId: string; clientId: string; allowedDomains: string[]; defaultRole: string }
  copied: string | null
  onCopy: (text: string, key: string) => void
}) {
  const ROLE_LABEL: Record<string, string> = {
    requester: 'Requester', wh_supervisor: 'WH Supervisor', exec_viewer: 'Exec Viewer',
  }

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

function SSOForm({ form, setForm, onSave, saving, saved }: {
  form: { tenantId: string; clientId: string; domain: string; autoProvision: boolean }
  setForm: (f: typeof form) => void
  onSave: (e: React.FormEvent) => void
  saving: boolean
  saved: boolean
}) {
  return (
    <div className="bg-white rounded-card border border-border-default p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>Update Configuration</p>
      <form onSubmit={onSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
              Directory (Tenant) ID *
            </label>
            <Input
              required
              value={form.tenantId}
              onChange={e => setForm({ ...form, tenantId: e.target.value })}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="font-mono"
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
              Application (Client) ID *
            </label>
            <Input
              required
              value={form.clientId}
              onChange={e => setForm({ ...form, clientId: e.target.value })}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="font-mono"
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>
              Allowed Email Domain
            </label>
            <Input
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
              placeholder="e.g. shell.com"
            />
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>
              Leave blank to allow all Microsoft accounts.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, autoProvision: !form.autoProvision })}
              style={{
                width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: form.autoProvision ? '#F04A4A' : '#D1D5DB',
                position: 'relative', transition: 'background 150ms',
              }}
            >
              <span style={{
                position: 'absolute', top: 2, left: form.autoProvision ? 18 : 2,
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                transition: 'left 150ms',
              }} />
            </button>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: 0 }}>Auto-provision accounts</p>
              <p style={{ fontSize: 11, color: '#6B7280', margin: '1px 0 0' }}>
                Automatically create user accounts on first SSO login.
              </p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 20, width: '100%', padding: '10px 0',
            border: 'none', borderRadius: 7, cursor: saving ? 'not-allowed' : 'pointer',
            background: saved ? '#16A34A' : '#F04A4A',
            fontSize: 13, fontWeight: 600, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 150ms',
          }}
        >
          {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : saved ? <><CheckCircle size={14} /> Saved</> : 'Save Configuration'}
        </button>
      </form>
    </div>
  )
}
