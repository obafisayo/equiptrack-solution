'use client'

/**
 * Authenticated client for the EquipTrack API (equiptrack-backend).
 * Sends the Neon Auth JWT (EdDSA, 15-minute lifetime) as a Bearer token. The
 * API verifies it and looks up the caller's role in its own database — nothing
 * here is trusted for authorisation.
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5080').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly body?: unknown) {
    super(message)
    this.name = 'ApiError'
  }
}

// ── Access token ─────────────────────────────────────────────────────────────
//
// Why not getSession().session.token: the Next.js auth proxy answers
// get-session from a cached session cookie WITHOUT the `set-auth-jwt` header,
// so session.token is then Neon's opaque session id, not a JWT, and the API
// rejects it. The /token endpoint is always forwarded to Neon Auth and returns
// a fresh signed JWT for the current session.

const REFRESH_MARGIN_SECONDS = 60
let cachedToken: { value: string; expiresAt: number } | null = null
let inFlight: Promise<string | null> | null = null

export function clearAccessToken() {
  cachedToken = null
  inFlight = null
}

function jwtExpiry(token: string): number | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parts[1].length / 4) * 4, '='))
    const exp = (JSON.parse(json) as { exp?: unknown }).exp
    return typeof exp === 'number' ? exp : null
  } catch {
    return null
  }
}

async function fetchToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/token', { credentials: 'same-origin', cache: 'no-store' })
    if (!res.ok) return null
    const token = ((await res.json()) as { token?: unknown })?.token
    if (typeof token !== 'string') return null
    const exp = jwtExpiry(token)
    if (!exp) return null
    cachedToken = { value: token, expiresAt: exp }
    return token
  } catch {
    return null
  }
}

export async function getAccessToken(forceRefresh = false): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000)
  if (!forceRefresh && cachedToken && cachedToken.expiresAt - REFRESH_MARGIN_SECONDS > now) return cachedToken.value
  if (!inFlight) inFlight = fetchToken().finally(() => { inFlight = null })
  return inFlight
}

// ── Requests ─────────────────────────────────────────────────────────────────

export async function apiFetch<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const token = await getAccessToken(retried)
  if (!token) throw new ApiError('You are signed out. Please sign in again.', 401)

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError('We could not reach our servers. Check your connection and try again.', 0)
  }

  // A rejected token (expired, rotated key): get a fresh one and retry once.
  if (res.status === 401 && !retried) {
    clearAccessToken()
    return apiFetch<T>(path, init, true)
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  const body = text ? safeJson(text) : undefined

  if (!res.ok) {
    // ASP.NET problem details: { title, errors? }
    const problem = body as { title?: string; errors?: Record<string, string[]> } | undefined
    const detail = problem?.errors ? Object.values(problem.errors).flat()[0] : undefined
    throw new ApiError(detail ?? problem?.title ?? `Request failed (${res.status}).`, res.status, body)
  }
  return body as T
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text) } catch { return text }
}

// ── /api/me ──────────────────────────────────────────────────────────────────

export interface MeResponse {
  userId: string
  email: string
  emailVerified: boolean
  name: string | null
  isSysadmin: boolean
  activeOrganizationId: string | null
  role: string | null
  memberships: { organizationId: string; organizationName: string; organizationSlug: string; role: string }[]
}

export function fetchMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/me')
}
