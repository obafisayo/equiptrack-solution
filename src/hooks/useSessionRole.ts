'use client'

import { useState, useEffect } from 'react'
import type { Role } from '@/lib/lifecycle'
import { getSessionRole } from '@/lib/session'

export function useSessionRole(): { role: Role | null; loading: boolean } {
  const [role, setRole]       = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setRole(getSessionRole())
    setLoading(false)
  }, [])

  return { role, loading }
}
