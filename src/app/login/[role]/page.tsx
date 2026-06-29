/* eslint-disable */
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ROLE_META } from '@/lib/roles'
import { AuthLeftPanel } from '@/components/layout/AuthLeftPanel'

function LogoMark({ size = 40 }: { size?: number }) {
  const r = Math.round(size * 0.22)
  return (
    <div
      className="flex items-center justify-center shrink-0 bg-brand-500"
      style={{ width: size, height: size, borderRadius: r }}
    >
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 40 40" fill="none">
        <rect x="5"  y="8"  width="30" height="5" rx="2.5" fill="white" />
        <rect x="5"  y="18" width="22" height="5" rx="2.5" fill="white" />
        <rect x="5"  y="28" width="26" height="5" rx="2.5" fill="white" />
      </svg>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function LoginPage() {
  const params   = useParams()
  const router   = useRouter()
  const roleSlug = params?.role as string
  const meta     = ROLE_META[roleSlug]

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe,   setRememberMe]   = useState(false)
  const [loading,      setLoading]      = useState(false)

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <p className="text-lg text-neutral-900 mb-4">Role not found.</p>
          <Link href="/login" className="text-brand-500 font-semibold no-underline hover:text-brand-600">
            ← Back to role selection
          </Link>
        </div>
      </div>
    )
  }

  const { deptColor } = meta

  function handleUseDemoCredentials() {
    setEmail(meta.demoEmail)
    setPassword(meta.demoPassword)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push(meta.dashboardPath), 800)
  }

  return (
    <div className="min-h-screen flex">
      <AuthLeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-8 py-12 min-h-screen">
        <div className="w-full max-w-[400px]">

          {/* Logo */}
          <div className="flex justify-center mb-7">
            <LogoMark size={44} />
          </div>

          {/* Heading */}
          <h1 className="text-[26px] font-bold text-neutral-900 text-center tracking-tight m-0 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-neutral-500 text-center mb-6 leading-relaxed m-0">
            Log in to continue managing your equipment operations with Equiptrack
          </p>

          {/* Role badge — uses deptColor so must be inline */}
          <div className="flex justify-center mb-7">
            <span
              className="text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{
                color: deptColor,
                background: `${deptColor}16`,
                border: `1px solid ${deptColor}30`,
              }}
            >
              {meta.shortLabel} &mdash; {meta.dept}
            </span>
          </div>

          {/* Microsoft SSO */}
          <button
            type="button"
            onClick={() => router.push('/auth/sso/microsoft')}
            className="flex items-center justify-center gap-2.5 w-full py-2.5 mb-1.5 border border-neutral-300 rounded-[7px] bg-white text-sm font-semibold text-neutral-700 cursor-pointer hover:bg-neutral-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            Sign in with Microsoft
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1.5">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-xs text-neutral-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
                Email Address
              </label>
              <input
                className="et-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter a valid email address"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  className="et-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-neutral-400 cursor-pointer p-0 flex items-center"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="et-checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span className="text-[13px] text-neutral-700">Remember Me</span>
              </label>
              <button
                type="button"
                className="bg-transparent border-none text-[13px] text-brand-500 font-semibold cursor-pointer p-0 hover:text-brand-600 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Demo credentials */}
            <details className="bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-3">
              <summary className="text-[12px] font-semibold text-neutral-500 tracking-wider uppercase cursor-pointer select-none flex justify-between items-center">
                Demo Credentials
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); handleUseDemoCredentials() }}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded cursor-pointer border"
                  style={{
                    color: deptColor,
                    background: `${deptColor}14`,
                    borderColor: `${deptColor}30`,
                  }}
                >
                  Use these
                </button>
              </summary>
              <div className="mt-2.5 flex flex-col gap-1.5">
                <div className="flex gap-2.5 items-baseline">
                  <span className="text-[11px] text-neutral-400 w-14 shrink-0">Email</span>
                  <span className="font-mono text-[11px] text-neutral-700">{meta.demoEmail}</span>
                </div>
                <div className="flex gap-2.5 items-baseline">
                  <span className="text-[11px] text-neutral-400 w-14 shrink-0">Password</span>
                  <span className="font-mono text-[11px] text-neutral-700">{meta.demoPassword}</span>
                </div>
              </div>
            </details>

            {/* Submit */}
            <button type="submit" className="et-btn-dark" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <p className="text-[13px] text-neutral-500 text-center mt-6 mb-0">
            Don&apos;t have an account?{' '}
            <Link href={`/signup/${meta.slug}`} className="text-brand-500 font-semibold no-underline hover:text-brand-600">
              Register
            </Link>
          </p>

          <p className="text-xs text-neutral-400 text-center mt-3.5">
            <Link href="/login" className="text-neutral-400 no-underline hover:text-neutral-600">
              ← Choose a different role
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
