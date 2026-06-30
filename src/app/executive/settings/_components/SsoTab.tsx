'use client'

import { CheckCircle2, Save } from 'lucide-react'
import { Input } from '@/components/ui/Form'

interface SsoTabProps {
  saved: boolean
  onSave: () => void
}

export function SsoTab({ saved, onSave }: SsoTabProps) {
  return (
    <div className="bg-white border border-border-default rounded-card shadow-sm animate-fade-in">
      <div className="px-6 py-5 border-b border-border-default">
        <h2 className="text-lg font-bold text-neutral-900 m-0">Single Sign-On (SSO)</h2>
        <p className="text-sm text-neutral-500 mt-1 m-0">Configure Microsoft Entra ID (Office 365) to allow your employees to log in securely.</p>
      </div>
      <div className="p-6 space-y-6">

        <div className="bg-neutral-50 border border-border-default rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="mt-1 shrink-0">
              <svg width="24" height="24" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <path fill="#f3f3f3" d="M0 0h21v21H0z"/><path fill="#f35325" d="M1 1h9v9H1z"/><path fill="#81bc06" d="M11 1h9v9h-9z"/><path fill="#05a6f0" d="M1 11h9v9H1z"/><path fill="#ffba08" d="M11 11h9v9h-9z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm">Microsoft Entra ID Connection</h3>
              <p className="text-sm text-neutral-600 mt-1">Connect your Equiptrack organization to your Microsoft tenant. This enables automatic user provisioning and secure authentication.</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Tenant ID</label>
                  <Input type="text" defaultValue="a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6" size="sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Client ID (Application ID)</label>
                  <Input type="text" defaultValue="x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4" size="sm" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Client Secret</label>
                <Input type="password" defaultValue="********" size="sm" className="max-w-md" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="enforce" className="w-4 h-4 text-brand-500 border-border-default rounded focus:ring-brand-500" defaultChecked />
          <label htmlFor="enforce" className="text-sm font-medium text-neutral-900">Enforce SSO login for all organization members</label>
        </div>

      </div>
      <div className="px-6 py-4 bg-neutral-50 border-t border-border-default flex justify-between items-center rounded-b-card">
        <span className="text-xs text-status-success font-semibold flex items-center gap-1.5">
          {saved && <><CheckCircle2 size={14} /> Saved successfully</>}
        </span>
        <button onClick={onSave} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-5 rounded-button text-sm transition-colors shadow-sm flex items-center gap-2">
          <Save size={16} /> Save Configuration
        </button>
      </div>
    </div>
  )
}
