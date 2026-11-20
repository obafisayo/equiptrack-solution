'use client'

import { useState, type ReactNode } from 'react'
import { AuthLeftPanel } from '@/components/layout/AuthLeftPanel'
import { authClient, authCall } from '@/lib/auth/client'

/** Two-column auth layout: brand panel left, form right (matches the original login design). */
export function AuthFrame({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden">
      <AuthLeftPanel />
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex flex-col items-center justify-center px-6 sm:px-10 py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-neutral-900 tracking-tight mb-2">{title}</h1>
              {subtitle && <p className="text-sm text-neutral-500 leading-relaxed m-0">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 m-0">
      {message}
    </p>
  )
}

export function FormNotice({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="status" className="text-[13px] text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2 m-0">
      {message}
    </p>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-neutral-700 mb-2">{label}</label>
      {children}
    </div>
  )
}

export function PasswordInput(props: {
  value: string
  onChange: (v: string) => void
  autoComplete: 'current-password' | 'new-password'
  placeholder?: string
  minLength?: number
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        className="et-input"
        type={show ? 'text' : 'password'}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        placeholder={props.placeholder ?? 'Enter your password'}
        required
        minLength={props.minLength}
        autoComplete={props.autoComplete}
        style={{ paddingRight: 48 }}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-neutral-400 cursor-pointer p-0 flex items-center hover:text-neutral-600 transition-colors"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          {show ? (
            <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
          ) : (
            <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
          )}
        </svg>
      </button>
    </div>
  )
}

/** Starts Microsoft (Entra ID) sign-in through Neon Auth. */
export function MicrosoftButton({ label = 'Sign in with Microsoft' }: { label?: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function start() {
    setBusy(true)
    setError(null)
    const origin = window.location.origin
    const { error } = await authCall(() => authClient.signIn.social({
      provider: 'microsoft',
      callbackURL: `${origin}/auth/continue`,
      errorCallbackURL: `${origin}/auth/sso/error`,
    }))
    if (error) {
      // Neon returns code PROVIDER_NOT_SUPPORTED ("Provider is not supported or enabled for this project").
      const detail = `${error.code ?? ''} ${error.message}`
      setError(/PROVIDER_NOT_SUPPORTED|not (found|configured|enabled|supported)/i.test(detail)
        ? 'Microsoft sign-in is not set up yet. Please sign in with your email and password.'
        : error.message)
      setBusy(false)
    }
  }

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={start}
        disabled={busy}
        className="flex items-center justify-center gap-2.5 w-full h-11 border border-neutral-300 rounded-lg bg-white text-sm font-semibold text-neutral-700 cursor-pointer hover:bg-neutral-50 disabled:opacity-60 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="9" height="9" fill="#F25022" />
          <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
          <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
          <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
        </svg>
        {busy ? 'Redirecting to Microsoft…' : label}
      </button>
      {error && <p className="text-[12px] text-red-600 mt-2 mb-0">{error}</p>}
    </div>
  )
}

export function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px bg-neutral-200" />
      <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">{text}</span>
      <div className="flex-1 h-px bg-neutral-200" />
    </div>
  )
}
