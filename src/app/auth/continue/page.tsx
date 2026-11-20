'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { destinationAfterSignIn } from '@/lib/auth/after-sign-in'
import { AuthFrame } from '@/components/auth/AuthFrame'

/** Landing page after Microsoft sign-in: resolves the user's role and routes them. */
export default function ContinuePage() {
  const router = useRouter()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    destinationAfterSignIn()
      .then(dest => router.replace(dest))
      .catch(() => setFailed(true))
  }, [router])

  return (
    <AuthFrame title={failed ? 'Something went wrong' : 'Signing you in'}>
      {failed ? (
        <p className="text-sm text-neutral-600">
          You are signed in, but we could not load your EquipTrack account.{' '}
          <Link href="/auth/continue" className="text-brand-500 font-semibold no-underline">Try again</Link>
        </p>
      ) : (
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Loading your workspace…
        </div>
      )}
    </AuthFrame>
  )
}
