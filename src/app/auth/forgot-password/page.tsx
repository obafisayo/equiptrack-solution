'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient, authCall } from '@/lib/auth/client'
import { AuthFrame, Field, FormError, FormNotice, PasswordInput } from '@/components/auth/AuthFrame'

const MIN_PASSWORD = 8

function ForgotPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState(params?.get('email') ?? '')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await authCall(() => authClient.forgetPassword.emailOtp({ email: email.trim() }))
    setLoading(false)
    if (error) {
      setError(error.status === 429 ? 'Please wait a minute before requesting another code.' : error.message)
      return
    }
    // Same message whether or not the account exists (no account discovery).
    setNotice('If an account exists for this email, a reset code is on its way. It expires in 15 minutes.')
    setStep('reset')
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters for your new password.`)
      return
    }
    setLoading(true)
    setError(null)
    const { error } = await authCall(() => authClient.emailOtp.resetPassword({ email: email.trim(), otp: code.trim(), password }))
    setLoading(false)
    if (error) {
      setError('That code is not valid or has expired. Request a new one.')
      return
    }
    router.replace(`/login?reset=1&email=${encodeURIComponent(email.trim())}`)
  }

  return (
    <AuthFrame title="Reset your password" subtitle="We will email you a code to set a new password.">
      {step === 'email' ? (
        <form onSubmit={sendCode} className="space-y-5">
          <Field label="Email Address">
            <input className="et-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email" placeholder="you@company.com" />
          </Field>
          <FormError message={error} />
          <button type="submit" className="et-btn-dark w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset code'}
          </button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-5">
          <FormNotice message={notice} />
          <Field label="Reset Code">
            <input className="et-input font-mono tracking-[0.4em] text-center text-lg" value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
              inputMode="numeric" autoComplete="one-time-code" placeholder="000000" required minLength={4} />
          </Field>
          <Field label="New Password">
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password"
              placeholder={`At least ${MIN_PASSWORD} characters`} minLength={MIN_PASSWORD} />
          </Field>
          <FormError message={error} />
          <button type="submit" className="et-btn-dark w-full" disabled={loading}>
            {loading ? 'Saving…' : 'Set new password'}
          </button>
          <button type="button" onClick={() => sendCode()} disabled={loading}
            className="w-full bg-transparent border-none p-0 text-[13px] text-brand-500 font-semibold cursor-pointer hover:text-brand-600">
            Send a new code
          </button>
        </form>
      )}

      <p className="text-[13px] text-neutral-500 text-center mt-6 mb-0">
        <Link href="/login" className="text-neutral-500 no-underline hover:text-neutral-700">Back to sign in</Link>
      </p>
    </AuthFrame>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  )
}
