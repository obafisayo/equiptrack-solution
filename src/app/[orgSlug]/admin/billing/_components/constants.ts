import type { SubscriptionTier } from '@/lib/types'
import { PRICING_PLANS } from '@/config/pricing'

export const TIER_LABEL: Record<SubscriptionTier, string> = {
  starter:      'Starter',
  professional: 'Professional',
  enterprise:   'Enterprise',
}

export const TIER_COLOR: Record<SubscriptionTier, { bg: string; color: string; border: string }> = {
  starter:      { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  professional: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  enterprise:   { bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
}

export const FEATURE_LABEL: Record<string, string> = {
  sso_microsoft:       'Microsoft SSO',
  sso_google:          'Google Workspace SSO',
  api_access:          'API Access',
  advanced_analytics:  'Advanced Analytics',
  custom_sla:          'Custom SLA Config',
  audit_log:           'Audit Log',
  priority_support:    'Priority Support',
  white_label:         'White Label',
  bulk_import:         'Bulk Import',
  webhooks:            'Webhooks',
}

export function formatCurrency(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Mock invoices (no invoices in types - generated here) ─────────────────── */

export function mockInvoices(monthlyPrice: number) {
  return [
    { id: 'INV-2026-06', period: 'Jun 2026', amount: monthlyPrice, status: 'paid',    date: '2026-06-01' },
    { id: 'INV-2026-05', period: 'May 2026', amount: monthlyPrice, status: 'paid',    date: '2026-05-01' },
    { id: 'INV-2026-04', period: 'Apr 2026', amount: monthlyPrice, status: 'paid',    date: '2026-04-01' },
    { id: 'INV-2026-03', period: 'Mar 2026', amount: monthlyPrice, status: 'paid',    date: '2026-03-01' },
  ]
}

// List prices come from the single pricing source — never hard-code them here.
export const PLANS: { tier: SubscriptionTier; price: number | null; seats: number | null; description: string }[] =
  PRICING_PLANS.map(p => ({ tier: p.tier, price: p.monthlyPriceUsd, seats: p.seats, description: p.tagline }))
