'use client'

import { AlertTriangle } from 'lucide-react'
import { SSOConfigCard } from './SSOConfigCard'
import { SSOForm, type SSOFormState } from './SSOForm'

interface ErrorStateProps {
  sso: { tenantId: string; clientId: string; allowedDomains: string[]; defaultRole: string }
  copied: string | null
  onCopy: (text: string, key: string) => void
  form: SSOFormState
  setForm: (f: SSOFormState) => void
  onSave: (e: React.FormEvent) => void
  saving: boolean
  saved: boolean
}

export function ErrorState({ sso, copied, onCopy, form, setForm, onSave, saving, saved }: ErrorStateProps) {
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
      <SSOConfigCard sso={sso} copied={copied} onCopy={onCopy} />
      <SSOForm form={form} setForm={setForm} onSave={onSave} saving={saving} saved={saved} />
    </div>
  )
}
