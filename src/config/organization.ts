/**
 * Per-organisation branding used on generated documents (TR, waybill) and
 * client-facing copy.
 *
 * NEVER hard-code a customer's name, legal entity, or logo in a component.
 * Read it from here. Until organisation settings are served by the API, values
 * come from NEXT_PUBLIC_ORG_* environment variables, defaulting to a neutral
 * demo operator so the product can be shown to any prospect.
 *
 * Only use a customer's logo with their written permission (trademark).
 */

export interface OrganizationBranding {
  /** Short display name, e.g. on approval lines: "<shortName> Approval". */
  shortName: string
  /** Registered legal entity printed on documents. */
  legalName: string
  /** Optional logo URL (served from /public or the API). null → no logo. */
  logoUrl: string | null
  /** Accent colour for the wordmark on documents. */
  accentColor: string
  /** Default origin printed on waybills when the order has none. */
  defaultOrigin: string
}

// Note: each variable must be referenced literally (process.env.NEXT_PUBLIC_X)
// so Next.js can inline it into client bundles.
function orDefault(value: string | undefined, fallback: string): string {
  return value && value.trim() !== '' ? value.trim() : fallback
}

export const ORG_BRANDING: OrganizationBranding = {
  shortName:     orDefault(process.env.NEXT_PUBLIC_ORG_SHORT_NAME, 'Demo Operator'),
  legalName:     orDefault(process.env.NEXT_PUBLIC_ORG_LEGAL_NAME, 'Demo Operator Ltd.'),
  logoUrl:       process.env.NEXT_PUBLIC_ORG_LOGO_URL?.trim() || null,
  accentColor:   orDefault(process.env.NEXT_PUBLIC_ORG_ACCENT_COLOR, '#131722'),
  defaultOrigin: orDefault(process.env.NEXT_PUBLIC_ORG_DEFAULT_ORIGIN, 'MAIN BASE'),
}
