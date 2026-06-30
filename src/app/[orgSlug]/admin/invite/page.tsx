'use client'

import { use, useState } from 'react'
import type { OrgRole } from '@/lib/types'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { StepIndicator } from './_components/StepIndicator'
import { Step1Method } from './_components/Step1Method'
import { Step2Details } from './_components/Step2Details'
import { Step3Review } from './_components/Step3Review'
import { SentConfirmation } from './_components/SentConfirmation'
import type { InviteMethod, InviteRow } from './_components/types'

export default function InvitePage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const tier = org?.subscription.tier ?? 'starter'

  const [step, setStep]         = useState(1)
  const [method, setMethod]     = useState<InviteMethod>('email')
  const [selectedRole, setSelectedRole] = useState<OrgRole>('requester')
  const [rows, setRows]         = useState<InviteRow[]>([{ email: '', role: 'requester' }])
  const [sent, setSent]         = useState(false)

  function handleSend() {
    setSent(true)
  }

  function handleInviteMore() {
    setSent(false)
    setStep(1)
    setRows([{ email: '', role: 'requester' }])
  }

  if (sent) {
    return <SentConfirmation rows={rows} method={method} onInviteMore={handleInviteMore} />
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
        padding: '28px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <StepIndicator step={step} />

        {step === 1 && (
          <Step1Method method={method} onSelect={setMethod} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2Details
            rows={rows}
            onChangeRows={setRows}
            selectedRole={selectedRole}
            onSelectRole={r => { setSelectedRole(r); setRows(rows.map(row => ({ ...row, role: r }))) }}
            method={method}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            tier={tier}
          />
        )}
        {step === 3 && (
          <Step3Review rows={rows} method={method} onBack={() => setStep(2)} onSend={handleSend} />
        )}
      </div>
    </div>
  )
}
