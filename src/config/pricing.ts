import type { SubscriptionTier } from '@/lib/types'

/**
 * SINGLE SOURCE OF TRUTH for EquipTrack list pricing.
 *
 * The landing page, org-admin billing, and sysadmin billing all read from here.
 * Never hard-code a plan price anywhere else.
 *
 * `monthlyPriceUsd: null` means the plan is quoted per contract ("Custom").
 * Individual organisations may hold negotiated prices on their subscription
 * record; those are contract values, not list prices.
 */

export interface PricingPlan {
  tier: SubscriptionTier
  name: string
  monthlyPriceUsd: number | null
  seats: number | null
  tagline: string
  features: string[]
  cta: string
  highlighted: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: 'starter',
    name: 'Starter',
    monthlyPriceUsd: 249,
    seats: 10,
    tagline: 'For single-site teams getting equipment tracking under control.',
    features: [
      'Core lifecycle tracking (16 stages)',
      'Named owner and timestamp on every stage',
      'SLA alerts and breach indicators',
      'Standard reporting',
      'Email support',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
  },
  {
    tier: 'professional',
    name: 'Professional',
    monthlyPriceUsd: 699,
    seats: 50,
    tagline: 'For multi-department operations that need full visibility.',
    features: [
      'Everything in Starter',
      'Warehouse, dispatch and QAQC workspaces',
      'Executive analytics and bottleneck heatmaps',
      'Container fleet management',
      'Priority support with onboarding',
    ],
    cta: 'Join Waitlist',
    highlighted: true,
  },
  {
    tier: 'enterprise',
    name: 'Enterprise',
    monthlyPriceUsd: null,
    seats: null,
    tagline: 'For organisations running multiple yards, vessels, or regions.',
    features: [
      'Multi-site and multi-organisation support',
      'Single sign-on (SSO)',
      'Dedicated account manager',
      'Custom integrations and API access',
      'Agreed support level (SLA)',
    ],
    cta: 'Talk to Sales',
    highlighted: false,
  },
]

export const PLAN_BY_TIER: Record<SubscriptionTier, PricingPlan> = Object.fromEntries(
  PRICING_PLANS.map(p => [p.tier, p]),
) as Record<SubscriptionTier, PricingPlan>

export function formatPlanPrice(plan: PricingPlan): string {
  return plan.monthlyPriceUsd === null ? 'Custom' : `$${plan.monthlyPriceUsd.toLocaleString('en-US')}`
}
