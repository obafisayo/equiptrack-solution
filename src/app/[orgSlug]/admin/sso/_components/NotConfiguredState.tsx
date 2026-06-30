'use client'

import { AlertTriangle } from 'lucide-react'
import { SSOForm, type SSOFormState } from './SSOForm'

const SETUP_STEPS = [
  'In Azure AD, create a new Enterprise Application.',
  'Set the redirect URI to: https://app.equiptrack.io/auth/sso/microsoft',
  'Copy the Application (client) ID and Directory (tenant) ID.',
  'Enter them below and click Save.',
]

interface NotConfiguredStateProps {
  form: SSOFormState
  setForm: (f: SSOFormState) => void
  onSave: (e: React.FormEvent) => void
  saving: boolean
  saved: boolean
}

export function NotConfiguredState({ form, setForm, onSave, saving, saved }: NotConfiguredStateProps) {
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
          {SETUP_STEPS.map((step, i) => (
            <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{step}</li>
          ))}
        </ol>
      </div>

      <SSOForm form={form} setForm={setForm} onSave={onSave} saving={saving} saved={saved} />
    </div>
  )
}
