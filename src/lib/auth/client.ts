'use client'

import { createAuthClient } from '@neon/auth/next'

/** Browser auth client. Talks to this app's /api/auth proxy (same origin), not to Neon directly. */
export const authClient = createAuthClient()

export interface AuthFailure {
  status?: number
  /** Better Auth / Neon code, e.g. INVALID_EMAIL_OR_PASSWORD, EMAIL_NOT_VERIFIED. */
  code?: string
  message: string
}

export interface AuthResult<T> {
  data: T | null
  error: AuthFailure | null
}

/**
 * Runs an auth call and always resolves to { data, error }.
 *
 * Why: @neon/auth 0.8.x documents `{ data, error }` results, but its fetch layer
 * THROWS an AuthApiError for any non-2xx response (e.g. wrong password, bad OTP).
 * Without this wrapper those become unhandled rejections and the UI never shows
 * the friendly message. Handles both behaviours so an SDK fix won't break us.
 */
export async function authCall<T>(fn: () => Promise<{ data?: T | null; error?: unknown } | null | undefined>): Promise<AuthResult<T>> {
  try {
    const result = await fn()
    if (result?.error) return { data: null, error: normalize(result.error) }
    return { data: (result?.data ?? null) as T | null, error: null }
  } catch (err) {
    return { data: null, error: normalize(err) }
  }
}

function normalize(err: unknown): AuthFailure {
  if (err && typeof err === 'object') {
    const e = err as { status?: unknown; code?: unknown; message?: unknown; error?: unknown; statusText?: unknown }
    // Thrown SDK errors keep the server's raw JSON body on `.error` ({ code, error|message, status }).
    // Its code is the precise one (e.g. PROVIDER_NOT_SUPPORTED); the outer one may be generic.
    const raw = e.error && typeof e.error === 'object'
      ? (e.error as { code?: unknown; message?: unknown; error?: unknown; status?: unknown })
      : undefined
    const str = (v: unknown) => (typeof v === 'string' && v.length > 0 ? v : undefined)
    const message =
      str(raw?.message) ?? str(raw?.error) ??
      (str(e.message) && !/^HTTP \d{3}/.test(e.message as string) ? str(e.message) : undefined) ??
      str(e.error) ?? str(e.statusText) ??
      'Something went wrong. Please try again.'
    return {
      status: typeof e.status === 'number' ? e.status : typeof raw?.status === 'number' ? raw.status : undefined,
      code: str(raw?.code) ?? str(e.code),
      message,
    }
  }
  return { message: typeof err === 'string' ? err : 'Something went wrong. Please try again.' }
}

/** True for "your email isn't verified yet" responses. */
export function isUnverifiedEmail(error: AuthFailure): boolean {
  return error.code === 'EMAIL_NOT_VERIFIED' || error.status === 403 || /verif/i.test(error.message)
}
