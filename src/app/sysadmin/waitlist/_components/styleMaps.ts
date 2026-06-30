export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#FEF3C7', color: '#D97706', label: 'Pending'   },
  approved:  { bg: '#F0FDF4', color: '#16A34A', label: 'Approved'  },
  rejected:  { bg: '#FEF2F2', color: '#DC2626', label: 'Rejected'  },
  converted: { bg: '#EFF6FF', color: '#2563EB', label: 'Converted' },
}

export const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  high:   { bg: '#FEF2F2', color: '#DC2626' },
  medium: { bg: '#FEF3C7', color: '#D97706' },
  low:    { bg: '#F9FAFB', color: '#6B7280' },
}
