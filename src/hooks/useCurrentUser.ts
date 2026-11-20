'use client'

import { useEffect, useState } from 'react'
import { fetchMe, type MeResponse, ApiError } from '@/lib/api/client'

/**
 * The signed-in user as the API sees them (name, organisation, role).
 * Cached for the page session so the sidebar, topbar and guards share one call.
 */
let cached: Promise<MeResponse> | null = null

export function clearCurrentUserCache() {
  cached = null
}

export function loadCurrentUser(): Promise<MeResponse> {
  if (!cached) {
    cached = fetchMe().catch(err => {
      cached = null
      throw err
    })
  }
  return cached
}

export function useCurrentUser(): { me: MeResponse | null; error: ApiError | null; loading: boolean } {
  const [me, setMe] = useState<MeResponse | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    loadCurrentUser()
      .then(m => { if (alive) setMe(m) })
      .catch(e => { if (alive) setError(e instanceof ApiError ? e : new ApiError(String(e), 0)) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  return { me, error, loading }
}
