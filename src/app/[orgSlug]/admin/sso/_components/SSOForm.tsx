'use client'

import { CheckCircle, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/Form'

export interface SSOFormState {
  tenantId: string
  clientId: string
  domain: string
  autoProvision: boolean
}

interface SSOFormProps {
  form: SSOFormState
  setForm: (f: SSOFormState) => void
  onSave: (e: React.FormEvent) => void
  saving: boolean
  saved: boolean
}

export function SSOForm({ form, setForm, onSave, saving, saved }: SSOFormProps) {
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
