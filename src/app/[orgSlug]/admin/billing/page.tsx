/* eslint-disable */
'use client'

import { use, useState } from 'react'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { CurrentPlanCard } from './_components/CurrentPlanCard'
import { PlanComparisonGrid } from './_components/PlanComparisonGrid'
import { InvoiceHistoryTable } from './_components/InvoiceHistoryTable'
import { PaymentSummaryCard } from './_components/PaymentSummaryCard'
import { mockInvoices } from './_components/constants'

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function OrgAdminBillingPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const [showUpgrade, setShowUpgrade] = useState(false)

  if (!org) {
    return (
      <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#9CA3AF' }}>Organisation not found.</p>
      </div>
    )
  }

  const sub      = org.subscription
  const invoices = mockInvoices(sub.monthlyPrice)

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Billing</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Manage your subscription and view invoices</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <CurrentPlanCard sub={sub} showUpgrade={showUpgrade} onToggleUpgrade={() => setShowUpgrade(v => !v)} />

          {showUpgrade && <PlanComparisonGrid sub={sub} />}

          <InvoiceHistoryTable invoices={invoices} />
        </div>

        {/* Right column - summary card */}
        <PaymentSummaryCard org={org} />
      </div>
    </div>
  )
}
