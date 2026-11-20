'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient, authCall } from '@/lib/auth/client'
import { AuthFrame, Divider, Field, FormError, MicrosoftButton, PasswordInput } from '@/components/auth/AuthFrame'

const MIN_PASSWORD = 8

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters for your password.`)
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await authCall(() => authClient.signUp.email({ name: name.trim(), email: email.trim(), password }))
    if (error) {
      setError(error.code?.includes('EXIST') || /exist/i.test(error.message)
        ? 'An account with this email already exists. Sign in instead.'
        : error.code === 'PASSWORD_TOO_SHORT' ? `Use at least ${MIN_PASSWORD} characters for your password.`
        : error.message)
      setLoading(false)
      return
    }
    // A 6-digit code has been emailed; verification is required before sign-in.
    router.push(`/auth/verify?email=${encodeURIComponent(email.trim())}`)
  }

  return (
    <AuthFrame
      title="Create your account"
      subtitle="Use the email address your organisation invited. Your role is set by your administrator."
    >
      <MicrosoftButton label="Continue with Microsoft" />
      <Divider text="or sign up with email" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Full Name">
          <input className="et-input" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Ada Obi" required maxLength={200} autoComplete="name" />
        </Field>
        <Field label="Work Email">
          <input className="et-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com" required autoComplete="email" />
        </Field>
        <Field label="Password">
          <PasswordInput value={password} onChange={setPassword} autoComplete="new-password"
            placeholder={`At least ${MIN_PASSWORD} characters`} minLength={MIN_PASSWORD} />
        </Field>

        <FormError message={error} />

        <button type="submit" className="et-btn-dark w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-[13px] text-neutral-500 text-center mt-6 mb-0">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-500 font-semibold no-underline hover:text-brand-600">Sign in</Link>
      </p>
    </AuthFrame>
  )
}
