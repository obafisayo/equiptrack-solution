'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient, authCall } from '@/lib/auth/client'
import { destinationAfterSignIn } from '@/lib/auth/after-sign-in'
import { AuthFrame, Field, FormError, FormNotice } from '@/components/auth/AuthFrame'

function VerifyForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState(params?.get('email') ?? '')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setNotice(null)

    const { data, error } = await authCall(() => authClient.emailOtp.verifyEmail({ email: email.trim(), otp: code.trim() }))
    if (error) {
      setError(error.code === 'TOO_MANY_ATTEMPTS' || /attempt/i.test(error.message)
        ? 'Too many attempts. Request a new code.'
        : 'That code is not valid or has expired. Check the latest email or request a new code.')
      setLoading(false)
      return
    }

    // Auto sign-in after verification is on, so a session usually exists now.
    if (data && typeof data === 'object' && 'session' in data && data.session) {
      try {
        router.replace(await destinationAfterSignIn())
        return
      } catch {
        /* fall through to sign-in */
      }
    }
    router.replace(`/login?email=${encodeURIComponent(email.trim())}`)
  }

  async function resend() {
    if (!email.trim()) {
      setError('Enter your email address first.')
      return
    }
    setResending(true)
    setError(null)
    const { error } = await authCall(() => authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: 'email-verification' }))
    setResending(false)
    if (error) setError(error.status === 429 ? 'Please wait a minute before requesting another code.' : error.message)
    else setNotice('A new code is on its way. It expires in 15 minutes.')
  }

  return (
    <AuthFrame
      title="Check your email"
      subtitle={<>We sent a verification code to {email ? <strong className="text-neutral-800">{email}</strong> : 'your email'}. Enter it below to activate your account.</>}
    >
      <form onSubmit={verify} className="space-y-5">
        {!params?.get('email') && (
          <Field label="Email Address">
            <input className="et-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email" />
          </Field>
        )}
        <Field label="Verification Code">
          <input
            className="et-input font-mono tracking-[0.4em] text-center text-lg"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            required
            minLength={4}
          />
        </Field>

        <FormNotice message={notice} />
        <FormError message={error} />

        <button type="submit" className="et-btn-dark w-full" disabled={loading || code.length < 4}>
          {loading ? 'Verifying…' : 'Verify email'}
        </button>
      </form>

      <div className="flex items-center justify-between mt-6 text-[13px]">
        <button type="button" onClick={resend} disabled={resending}
          className="bg-transparent border-none p-0 text-brand-500 font-semibold cursor-pointer hover:text-brand-600 disabled:opacity-60">
          {resending ? 'Sending…' : 'Send a new code'}
        </button>
        <Link href="/login" className="text-neutral-500 no-underline hover:text-neutral-700">Back to sign in</Link>
      </div>
      <p className="text-[12px] text-neutral-400 mt-4 mb-0">Not in your inbox? Check spam or junk.</p>
    </AuthFrame>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
