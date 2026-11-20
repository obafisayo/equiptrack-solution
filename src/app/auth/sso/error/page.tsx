'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AuthFrame, MicrosoftButton } from '@/components/auth/AuthFrame'

/** Error codes Neon Auth (Better Auth) passes back on the error callback URL. */
const MESSAGES: Record<string, string> = {
  account_not_linked:
    'An EquipTrack account with this email already exists, and Microsoft did not confirm the email address. Sign in with your email and password instead.',
  unable_to_link_account:
    'We could not link your Microsoft account to your existing EquipTrack account.',
  access_denied:
    'Microsoft sign-in was cancelled or your administrator has not approved EquipTrack for your organisation.',
  email_not_found:
    'Microsoft did not share an email address for this account. Ask your IT administrator, or sign in with email and password.',
  state_mismatch:
    'The sign-in session expired. Please start again.',
}

function ErrorContent() {
  const code = useSearchParams()?.get('error') ?? 'unknown'
  return (
    <AuthFrame title="Microsoft sign-in failed" subtitle={MESSAGES[code] ?? 'Something went wrong during Microsoft sign-in. Please try again.'}>
      <MicrosoftButton label="Try Microsoft again" />
      <Link href="/login" className="et-btn-dark w-full inline-flex items-center justify-center no-underline">
        Sign in with email
      </Link>
      <p className="text-[12px] text-neutral-400 mt-4 mb-0">Error code: <span className="font-mono">{code}</span></p>
    </AuthFrame>
  )
}

export default function SsoErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
