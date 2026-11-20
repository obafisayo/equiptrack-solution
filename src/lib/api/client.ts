'use client'

import { authClient } from '@/lib/auth/client'

/**
 * Authenticated client for the EquipTrack API (equiptrack-backend).
 * Attaches the Neon Auth JWT (15-minute lifetime; refreshed by the SDK) as a
 * Bearer token. The API checks it and looks up the caller's role in its own
 * database — nothing here is trusted for authorisation.
 */

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5080').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly body?: unknown) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function getAccessToken(): Promise<string | null> {
  const { data } = await authClient.getSession()
  return data?.session?.token ?? null
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken()
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
