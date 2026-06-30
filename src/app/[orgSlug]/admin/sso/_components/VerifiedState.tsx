'use client'

import { CheckCircle } from 'lucide-react'
import { SSOConfigCard } from './SSOConfigCard'
import { SSOForm, type SSOFormState } from './SSOForm'

interface VerifiedStateProps {
  sso: { tenantId: string; clientId: string; allowedDomains: string[]; defaultRole: string; verifiedAt?: string; autoProvision: boolean }
  copied: string | null
  onCopy: (text: string, key: string) => void
  form: SSOFormState
  setForm: (f: SSOFormState) => void
  onSave: (e: React.FormEvent) => void
  saving: boolean
  saved: boolean
}

export function VerifiedState({ sso, copied, onCopy, form, setForm, onSave, saving, saved }: VerifiedStateProps) {
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

      <SSOConfigCard sso={sso} copied={copied} onCopy={onCopy} />
      <SSOForm form={form} setForm={setForm} onSave={onSave} saving={saving} saved={saved} />
    </div>
  )
}
