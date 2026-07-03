'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionRole } from '@/hooks/useSessionRole'
import { ROLE_ROUTE } from '@/lib/lifecycle'

const MESSAGES_ROUTE: Partial<Record<string, string>> = {
  exec:          '/executive/messages',
  qaqc:          '/qaqc/messages',
  wh_sup:        '/warehouse/messages',
  dsp_sup:       '/dispatch/messages',
}

export default function MessagesRedirect() {
  const { role, loading } = useSessionRole()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    const target = role ? (MESSAGES_ROUTE[role] ?? ROLE_ROUTE[role]) : '/login'
    router.replace(target)
  }, [role, loading, router])

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
