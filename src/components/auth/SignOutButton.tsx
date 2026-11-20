'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient, authCall } from '@/lib/auth/client'
import { clearSessionRole } from '@/lib/session'
import { clearCurrentUserCache } from '@/hooks/useCurrentUser'

export async function signOutEverywhere() {
  await authCall(() => authClient.signOut()) // clear local state even if the network call fails
  clearSessionRole()
  clearCurrentUserCache()
}

export function SignOutButton({ className, label = 'Sign out' }: { className?: string; label?: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        await signOutEverywhere()
        router.replace('/login')
      }}
    >
      {busy ? 'Signing out…' : label}
    </button>
  )
}
