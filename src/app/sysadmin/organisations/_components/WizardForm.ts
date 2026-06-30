import type { SubscriptionTier } from '@/lib/types'

export interface WizardForm {
  name: string; industry: string; country: string; website: string
  adminName: string; adminEmail: string; adminPhone: string
  tier: SubscriptionTier; seats: string; billingContact: string; billingEmail: string
}

export const EMPTY_FORM: WizardForm = {
  name:'', industry:'', country:'', website:'',
  adminName:'', adminEmail:'', adminPhone:'',
  tier:'starter', seats:'10', billingContact:'', billingEmail:'',
}
