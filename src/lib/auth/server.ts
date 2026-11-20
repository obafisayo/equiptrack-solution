import { createNeonAuth } from '@neon/auth/next/server'

/**
 * Neon Auth (Managed Better Auth) server instance. Sessions live in the
 * neon_auth schema of the EquipTrack database; this app only proxies to it.
 *
 * NEON_AUTH_BASE_URL     — from `neon neon-auth status` (…/equiptrack/auth)
 * NEON_AUTH_COOKIE_SECRET — 32+ random characters (openssl rand -base64 32)
 */
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
})
