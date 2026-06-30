export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days  = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins  = Math.floor(diff / 60000)
  if (days > 0)  return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${Math.max(1, mins)}m ago`
}

export function fmtMRR(n: number) { return '$' + n.toLocaleString('en-US') }

export const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:     { bg: '#F0FDF4', color: '#16A34A', label: 'Active'     },
  onboarding: { bg: '#EFF6FF', color: '#2563EB', label: 'Onboarding' },
  suspended:  { bg: '#FEF2F2', color: '#DC2626', label: 'Suspended'  },
  waitlist:   { bg: '#FEF3C7', color: '#D97706', label: 'Waitlist'   },
  churned:    { bg: '#F9FAFB', color: '#6B7280', label: 'Churned'    },
}

export const TIER_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  enterprise:   { bg: '#FFF1F1', color: '#F04A4A', label: 'Enterprise'   },
  professional: { bg: '#EFF6FF', color: '#2563EB', label: 'Professional' },
  starter:      { bg: '#F9FAFB', color: '#6B7280', label: 'Starter'      },
}

export const USER_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A' },
  invited:   { bg: '#EFF6FF', color: '#2563EB' },
  suspended: { bg: '#FEF2F2', color: '#DC2626' },
  inactive:  { bg: '#F9FAFB', color: '#6B7280' },
}

export const ROLE_LABEL: Record<string, string> = {
  org_admin:            'Org Admin',
  requester:            'Requester',
  wh_supervisor:        'WH Supervisor',
  wh_personnel:         'WH Personnel',
  dsp_supervisor:       'DSP Supervisor',
  dsp_personnel:        'DSP Personnel',
  qaqc_officer:         'QAQC Officer',
  exec_viewer:          'Exec Viewer',
  safety_officer:       'Safety Officer',
  logistics_coordinator:'Logistics Coord.',
  inventory_manager:    'Inventory Mgr',
  rig_manager:          'Rig Manager',
  crane_operator:       'Crane Operator',
  maintenance_tech:     'Maintenance Tech',
}

export const SUB_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: '#F0FDF4', color: '#16A34A', label: 'Active'    },
  trialing:  { bg: '#F5F3FF', color: '#7C3AED', label: 'Trialing'  },
  past_due:  { bg: '#FEF2F2', color: '#DC2626', label: 'Past Due'  },
  cancelled: { bg: '#F9FAFB', color: '#6B7280', label: 'Cancelled' },
  suspended: { bg: '#FEF2F2', color: '#DC2626', label: 'Suspended' },
}

export const FEATURE_LABELS: Record<string, string> = {
  sso_microsoft:      'Microsoft SSO',
  sso_google:         'Google SSO',
  api_access:         'API Access',
  advanced_analytics: 'Advanced Analytics',
  custom_sla:         'Custom SLA',
  audit_log:          'Audit Log',
  priority_support:   'Priority Support',
  white_label:        'White Label',
  bulk_import:        'Bulk Import',
  webhooks:           'Webhooks',
}
