/* ── Subscription & Billing ──────────────────────────────────────────────── */

export type SubscriptionTier = 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'suspended'

export type PlanFeature =
  | 'sso_microsoft'
  | 'sso_google'
  | 'api_access'
  | 'advanced_analytics'
  | 'custom_sla'
  | 'audit_log'
  | 'priority_support'
  | 'white_label'
  | 'bulk_import'
  | 'webhooks'

export interface SubscriptionPlan {
  tier: SubscriptionTier
  status: SubscriptionStatus
  seats: number
  seatsUsed: number
  monthlyPrice: number
  billingCycleStart: string
  billingCycleEnd: string
  trialEndsAt?: string
  features: PlanFeature[]
}

/* ── Organisation ────────────────────────────────────────────────────────── */

export type OrgStatus = 'waitlist' | 'onboarding' | 'active' | 'suspended' | 'churned'

export interface Organisation {
  id: string
  name: string
  slug: string
  industry: string
  logoUrl?: string
  country: string
  timezone: string
  status: OrgStatus
  subscription: SubscriptionPlan
  microsoftTenantId?: string
  googleWorkspaceDomain?: string
  adminEmail: string
  createdAt: string
  onboardedAt?: string
  memberCount: number
  activeWorkOrders: number
  healthScore: number
}

/* ── Waitlist ─────────────────────────────────────────────────────────────── */

export type WaitlistStatus = 'pending' | 'approved' | 'rejected' | 'converted'

export interface WaitlistEntry {
  id: string
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  industry: string
  estimatedTeamSize: number
  useCaseDescription: string
  status: WaitlistStatus
  priority: 'low' | 'medium' | 'high'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  convertedToOrgId?: string
}

/* ── Users & Roles ───────────────────────────────────────────────────────── */

export type SystemRole = 'sysadmin'
export type OrgRole =
  | 'org_admin'
  | 'requester'
  | 'wh_supervisor'
  | 'wh_personnel'
  | 'dsp_supervisor'
  | 'dsp_personnel'
  | 'qaqc_officer'
  | 'exec_viewer'
  | 'safety_officer'
  | 'logistics_coordinator'
  | 'inventory_manager'
  | 'rig_manager'
  | 'crane_operator'
  | 'maintenance_tech'

export type UserRole = SystemRole | OrgRole

export type AuthProvider = 'email' | 'microsoft_sso' | 'google_sso'
export type UserStatus = 'invited' | 'active' | 'suspended' | 'deactivated'

export type Permission =
  | 'org:read'
  | 'org:write'
  | 'org:delete'
  | 'users:invite'
  | 'users:suspend'
  | 'users:read'
  | 'workorders:read'
  | 'workorders:write'
  | 'workorders:approve'
  | 'workorders:close'
  | 'sla:configure'
  | 'reports:read'
  | 'reports:export'
  | 'billing:read'
  | 'billing:write'
  | 'audit:read'
  | 'sso:configure'
  | 'platform:read'
  | 'platform:write'

export interface User {
  id: string
  orgId: string | null
  email: string
  displayName: string
  avatarUrl?: string
  role: UserRole
  status: UserStatus
  authProvider: AuthProvider
  microsoftId?: string
  department?: string
  jobTitle?: string
  phoneNumber?: string
  createdAt: string
  lastActiveAt?: string
  invitedBy?: string
  permissions: Permission[]
}

/* ── Audit Log ───────────────────────────────────────────────────────────── */

export interface AuditEvent {
  id: string
  orgId: string | null
  actorId: string
  actorName: string
  actorRole: UserRole
  action: string
  targetType: 'user' | 'org' | 'workorder' | 'subscription' | 'sso'
  targetId: string
  targetLabel: string
  metadata: Record<string, unknown>
  ipAddress?: string
  createdAt: string
}

/* ── Invitation ──────────────────────────────────────────────────────────── */

export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked'

export interface Invitation {
  id: string
  orgId: string
  email: string
  role: OrgRole
  department?: string
  status: InviteStatus
  token: string
  invitedBy: string
  expiresAt: string
  acceptedAt?: string
  authMethod: 'email' | 'microsoft_sso'
}

/* ── SSO Configuration ───────────────────────────────────────────────────── */

export interface SSOConfig {
  orgId: string
  provider: 'microsoft' | 'google'
  tenantId: string
  clientId: string
  status: 'pending' | 'verified' | 'error'
  allowedDomains: string[]
  autoProvision: boolean
  defaultRole: OrgRole
  verifiedAt?: string
}

/* ── Platform Stats ──────────────────────────────────────────────────────── */

export interface PlatformStats {
  totalOrgs: number
  activeOrgs: number
  totalUsers: number
  activeUsers: number
  waitlistCount: number
  mrr: number
  churnedThisMonth: number
  newOrgsThisMonth: number
  avgHealthScore: number
}
