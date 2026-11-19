export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins  = Math.floor(diff / 60000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

import { ROLE_SHORT_LABEL } from '@/lib/domain/roles'
export const ROLE_LABEL: Record<string, string> = ROLE_SHORT_LABEL

export const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A' },
  invited:   { bg: '#EFF6FF', color: '#2563EB' },
  suspended: { bg: '#FEF2F2', color: '#DC2626' },
  inactive:  { bg: '#F9FAFB', color: '#6B7280' },
}

export const INV_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#FEF3C7', color: '#D97706', label: 'Pending'  },
  accepted: { bg: '#F0FDF4', color: '#16A34A', label: 'Accepted' },
  expired:  { bg: '#FEF2F2', color: '#DC2626', label: 'Expired'  },
  revoked:  { bg: '#F9FAFB', color: '#6B7280', label: 'Revoked'  },
}

export type TabKey = 'members' | 'invitations'
