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

export const SUB_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  active:   { bg: '#F0FDF4', color: '#16A34A', label: 'Active'    },
  trialing: { bg: '#F5F3FF', color: '#7C3AED', label: 'Trialing'  },
  past_due: { bg: '#FEF2F2', color: '#DC2626', label: 'Past Due'  },
  cancelled:{ bg: '#F9FAFB', color: '#6B7280', label: 'Cancelled' },
  suspended:{ bg: '#FEF2F2', color: '#DC2626', label: 'Suspended' },
}

export const INDUSTRIES = ['Oil & Gas', 'Mining', 'Construction', 'Logistics', 'Manufacturing', 'Other']
export const COUNTRIES  = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Angola', 'Egypt', 'Other']

export const TIER_DETAILS = {
  starter:      { label:'Starter',      price:'$120/mo', seats:'Up to 15 seats',  color:'#6B7280', desc:'For small teams just getting started' },
  professional: { label:'Professional', price:'$480/mo', seats:'Up to 50 seats',  color:'#2563EB', desc:'For mid-sized operations with full module access' },
  enterprise:   { label:'Enterprise',   price:'$1,800/mo', seats:'Unlimited seats', color:'#F04A4A', desc:'For large operations with custom SLAs and priority support' },
}

export const STEPS = ['Organisation', 'Admin Account', 'Subscription', 'Review']
