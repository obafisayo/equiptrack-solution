export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins  = Math.floor(diff / 60000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
}

import { ROLE_SHORT_LABEL } from '@/lib/domain/roles'
export const ROLE_LABEL: Record<string, string> = ROLE_SHORT_LABEL

export const USER_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A' },
  invited:   { bg: '#EFF6FF', color: '#2563EB' },
  suspended: { bg: '#FEF2F2', color: '#DC2626' },
  inactive:  { bg: '#F9FAFB', color: '#6B7280' },
}
