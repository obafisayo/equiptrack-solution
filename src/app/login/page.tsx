'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { destinationAfterSignIn } from '@/lib/auth/after-sign-in'
import { AuthFrame, Divider, Field, FormError, FormNotice, MicrosoftButton, PasswordInput } from '@/components/auth/AuthFrame'

function SignInForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState(params?.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const notice = params?.get('reset') === '1' ? 'Password updated. Sign in with your new password.' : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await authClient.signIn.email({ email: email.trim(), password })
    if (error) {
      // Unverified accounts get a fresh code (sent on sign-in) and go to the code screen.
      if (error.status === 403 || /verif/i.test(error.message ?? '')) {
        router.push(`/auth/verify?email=${encodeURIComponent(email.trim())}`)
        return
      }
      setError(error.status === 401 || /invalid/i.test(error.message ?? '')
        ? 'That email and password do not match.'
        : error.message ?? 'Sign-in failed. Please try again.')
      setLoading(false)
      return
    }

    try {
      const next = params?.get('next')
      const destination = await destinationAfterSignIn()
      router.replace(next && next.startsWith('/') && !next.startsWith('//') ? next : destination)
    } catch {
      setError('Signed in, but we could not reach the EquipTrack API. Please try again shortly.')
      setLoading(false)
    }
  }

  return (
    <AuthFrame title="Welcome Back" subtitle="Log in to continue managing your equipment operations with Equiptrack">
      <MicrosoftButton />
      <Divider text="or sign in with email" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormNotice message={notice} />
        <Field label="Email Address">
          <input className="et-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your work email" required autoComplete="email" />
        </Field>
        <Field label="Password">
          <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
        </Field>

        <div className="flex justify-end">
          <Link href={`/auth/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
            className="text-[13px] text-brand-500 font-semibold no-underline hover:text-brand-600 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <FormError message={error} />

        <button type="submit" className="et-btn-dark w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <p className="text-[13px] text-neutral-500 text-center mt-6 mb-0">
        Invited to EquipTrack?{' '}
        <Link href="/auth/sign-up" className="text-brand-500 font-semibold no-underline hover:text-brand-600">Create your account</Link>
      </p>
      <p className="text-[13px] text-neutral-500 text-center mt-2 mb-0">
        New organisation?{' '}
        <Link href="/waitlist" className="text-brand-500 font-semibold no-underline hover:text-brand-600">Join the waitlist</Link>
      </p>
    </AuthFrame>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
