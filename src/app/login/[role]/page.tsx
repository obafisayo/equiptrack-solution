'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ROLE_META } from '@/lib/roles'
import { AuthLeftPanel } from '@/components/layout/AuthLeftPanel'

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, background: '#F04A4A', borderRadius: Math.round(size * 0.22),
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
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
  const params  = useParams()
  const router  = useRouter()
  const roleSlug = params?.role as string
  const meta     = ROLE_META[roleSlug]

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe,   setRememberMe]   = useState(false)
  const [loading,      setLoading]      = useState(false)

  if (!meta) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F5', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, color: '#111827', marginBottom: 16 }}>Role not found.</p>
          <Link href="/login" style={{ color: '#F04A4A', textDecoration: 'none', fontWeight: 600 }}>
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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Left panel (red) ── */}
      <AuthLeftPanel />

      {/* ── Right panel (white) ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        padding: '48px 32px',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo mark — centered above form */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <LogoMark size={44} />
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>
            Log in to continue managing your equipment operations with Equiptrack
          </p>

          {/* Role badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: deptColor, background: `${deptColor}16`,
              border: `1px solid ${deptColor}30`,
              padding: '4px 12px', borderRadius: 999,
            }}>
              {meta.shortLabel} &mdash; {meta.dept}
            </span>
          </div>

          {/* Microsoft SSO */}
          <button
            type="button"
            onClick={() => router.push('/auth/sso/microsoft')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '10px 0', marginBottom: 6,
              border: '1px solid #D1D5DB', borderRadius: 7,
              background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              color: '#374151', fontFamily: 'Inter, sans-serif',
            }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
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
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
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
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  className="et-checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <span style={{ fontSize: 13, color: '#374151' }}>Remember Me</span>
              </label>
              <button
                type="button"
                style={{ background: 'none', border: 'none', fontSize: 13, color: '#F04A4A', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Demo credentials */}
            <details style={{
              background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 14px',
            }}>
              <summary style={{
                fontSize: 12, fontWeight: 600, color: '#6B7280', letterSpacing: '0.04em', textTransform: 'uppercase',
                cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                Demo Credentials
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); handleUseDemoCredentials() }}
                  style={{
                    fontSize: 11, fontWeight: 600, color: deptColor, background: `${deptColor}14`,
                    border: `1px solid ${deptColor}30`, padding: '2px 10px', borderRadius: 5,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Use these
                </button>
              </summary>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: '#9CA3AF', width: 56, flexShrink: 0 }}>Email</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#374151' }}>
                    {meta.demoEmail}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: '#9CA3AF', width: 56, flexShrink: 0 }}>Password</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#374151' }}>
                    {meta.demoPassword}
                  </span>
                </div>
              </div>
            </details>

            {/* Submit */}
            <button type="submit" className="et-btn-dark" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          {/* Footer link */}
          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 24 }}>
            Don&apos;t have an account?{' '}
            <Link href={`/signup/${meta.slug}`} style={{ color: '#F04A4A', fontWeight: 600, textDecoration: 'none' }}>
              Register
            </Link>
          </p>

          {/* Back link */}
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 14 }}>
            <Link href="/login" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
              ← Choose a different role
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
