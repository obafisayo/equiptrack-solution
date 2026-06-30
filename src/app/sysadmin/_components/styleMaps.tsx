import type { AuditEvent } from '@/lib/types'
import { Building2, User, DollarSign, Globe, Package } from 'lucide-react'

export function fmtMRR(n: number) {
  return '$' + n.toLocaleString('en-US')
}

export function relativeTime(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
}

export const ORG_STATUS_STYLE: Record<string, string> = {
  active:     'bg-status-success-bg text-status-success',
  onboarding: 'bg-status-info-bg text-status-info',
  suspended:  'bg-status-critical-bg text-status-critical',
  waitlist:   'bg-status-medium-bg text-status-medium',
  trialing:   'bg-brand-50 text-brand-500',
  churned:    'bg-neutral-100 text-neutral-500',
}

export const TIER_STYLE: Record<string, { className: string; label: string }> = {
  enterprise:    { className: 'bg-brand-50 text-brand-500',          label: 'Enterprise'   },
  professional:  { className: 'bg-status-info-bg text-status-info',  label: 'Professional' },
  starter:       { className: 'bg-neutral-100 text-neutral-500',     label: 'Starter'      },
}

export const PRIORITY_STYLE: Record<string, string> = {
  high:   'bg-status-critical-bg text-status-critical',
  medium: 'bg-status-medium-bg text-status-medium',
  low:    'bg-neutral-100 text-neutral-500',
}

export function actionIcon(event: AuditEvent) {
  if (event.targetType === 'user')         return <User size={13} />
  if (event.targetType === 'org')          return <Building2 size={13} />
  if (event.targetType === 'subscription') return <DollarSign size={13} />
  if (event.targetType === 'sso')         return <Globe size={13} />
  return <Package size={13} />
}

export const TARGET_TYPE_STYLE: Record<string, string> = {
  user:         'bg-brand-50 text-brand-500',
  org:          'bg-status-info-bg text-status-info',
  workorder:    'bg-status-medium-bg text-status-medium',
  subscription: 'bg-status-success-bg text-status-success',
  sso:          'bg-neutral-100 text-neutral-600',
}

export const MRR_HISTORY = [
  { label: 'Jan', value: 2840 },
  { label: 'Feb', value: 3120 },
  { label: 'Mar', value: 3450 },
  { label: 'Apr', value: 3780 },
  { label: 'May', value: 4310 },
  { label: 'Jun', value: 4844 },
]
