import type { Severity, IncStatus, InspStatus, PTWStatus } from './types'

export const SEV_CLASS: Record<Severity, { badge: string; bar: string }> = {
  low:      { badge: 'bg-green-50  text-green-700  border-green-200',  bar: 'bg-green-500'  },
  medium:   { badge: 'bg-amber-50  text-amber-700  border-amber-200',  bar: 'bg-amber-500'  },
  high:     { badge: 'bg-orange-50 text-orange-700 border-orange-200', bar: 'bg-orange-500' },
  critical: { badge: 'bg-red-50    text-red-700    border-red-200',    bar: 'bg-red-500'    },
}

export const STATUS_CLASS: Record<IncStatus, { badge: string; label: string }> = {
  open:         { badge: 'bg-red-50    text-red-700    border-red-200',    label: 'Open'         },
  under_review: { badge: 'bg-amber-50  text-amber-700  border-amber-200',  label: 'Under Review' },
  closed:       { badge: 'bg-green-50  text-green-700  border-green-200',  label: 'Closed'       },
  escalated:    { badge: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Escalated'    },
}

export const INS_CLASS: Record<InspStatus, { badge: string; label: string }> = {
  passed:  { badge: 'bg-green-50  text-green-700  border-green-200',  label: 'Passed'  },
  failed:  { badge: 'bg-red-50    text-red-700    border-red-200',    label: 'Failed'  },
  pending: { badge: 'bg-neutral-50 text-neutral-600 border-neutral-200', label: 'Pending' },
  overdue: { badge: 'bg-orange-50 text-orange-700 border-orange-200', label: 'Overdue' },
}

export const PTW_CLASS: Record<PTWStatus, { badge: string; label: string }> = {
  pending:   { badge: 'bg-blue-50   text-blue-700   border-blue-200',   label: 'Pending'   },
  active:    { badge: 'bg-green-50  text-green-700  border-green-200',  label: 'Active'    },
  closed:    { badge: 'bg-neutral-50 text-neutral-600 border-neutral-200', label: 'Closed' },
  suspended: { badge: 'bg-amber-50  text-amber-700  border-amber-200',  label: 'Suspended' },
}
