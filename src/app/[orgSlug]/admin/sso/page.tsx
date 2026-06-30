/* eslint-disable */
'use client'

import { use, useState } from 'react'
import { ORGANISATIONS, SSO_CONFIGS } from '@/lib/mock-platform'
import { NotConfiguredState } from './_components/NotConfiguredState'
import { ErrorState } from './_components/ErrorState'
import { VerifiedState } from './_components/VerifiedState'
import type { SSOFormState } from './_components/SSOForm'

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function SSOPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)

  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const sso = SSO_CONFIGS.find(s => s.orgId === org?.id)

  const [copied, setCopied]   = useState<string | null>(null)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [form, setForm]       = useState<SSOFormState>({
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

  if (!sso) {
    return <NotConfiguredState form={form} setForm={setForm} onSave={handleSave} saving={saving} saved={saved} />
  }

  if (sso.status === 'error') {
    return (
      <ErrorState
        sso={sso}
        copied={copied}
        onCopy={copyToClipboard}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        saving={saving}
        saved={saved}
      />
    )
  }

  return (
    <VerifiedState
      sso={sso}
      copied={copied}
      onCopy={copyToClipboard}
      form={form}
      setForm={setForm}
      onSave={handleSave}
      saving={saving}
      saved={saved}
    />
  )
}
