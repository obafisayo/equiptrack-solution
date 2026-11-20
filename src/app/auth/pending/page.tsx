'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthFrame } from '@/components/auth/AuthFrame'
import { SignOutButton } from '@/components/auth/SignOutButton'

function PendingContent() {
  const multiple = useSearchParams()?.get('reason') === 'multiple'
  return (
    <AuthFrame
      title={multiple ? 'Choose an organisation' : 'Waiting for an invitation'}
      subtitle={multiple
        ? 'Your account belongs to more than one organisation. Organisation switching is coming soon; ask your administrator which account to use.'
        : 'Your account is ready, but it has not been added to an organisation yet.'}
    >
      {!multiple && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 space-y-2 text-sm text-neutral-700">
          <p className="m-0 font-semibold">What to do next</p>
          <p className="m-0">Ask your EquipTrack administrator to invite the exact email address you signed up with. You will get access the next time you sign in.</p>
          <p className="m-0">If you used Microsoft sign-in, make sure the invitation uses your Microsoft work email.</p>
        </div>
      )}
      <SignOutButton className="et-btn-dark w-full" />
    </AuthFrame>
  )
}

export default function PendingPage() {
  return (
    <Suspense>
      <PendingContent />
    </Suspense>
  )
}
