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

type FieldErrors = {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export default function SignupPage() {
  const params   = useParams()
  const router   = useRouter()
  const roleSlug = params?.role as string
  const meta     = ROLE_META[roleSlug]

  const [name,            setName]            = useState('')
  const [email,           setEmail]           = useState('')
  const [phone,           setPhone]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword,    setShowPassword]    = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [agreedToTerms,   setAgreedToTerms]   = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [errors,          setErrors]          = useState<FieldErrors>({})

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

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!name.trim())                   next.name = 'Full name is required'
    if (!email.includes('@'))           next.email = 'Enter a valid email address'
    if (password.length < 8)            next.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword)   next.confirmPassword = 'Passwords do not match'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => router.push(meta.dashboardPath), 900)
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
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Logo mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <LogoMark size={44} />
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', margin: '0 0 20px', lineHeight: 1.5 }}>
            Set up your Equiptrack access to start managing equipment operations
          </p>

          {/* Role badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: deptColor, background: `${deptColor}16`,
              border: `1px solid ${deptColor}30`,
              padding: '4px 12px', borderRadius: 999,
            }}>
              {meta.shortLabel} &mdash; {meta.dept}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                className={`et-input${errors.name ? ' et-input-error' : ''}`}
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })) }}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
              {errors.name && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className={`et-input${errors.email ? ' et-input-error' : ''}`}
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
                placeholder="Enter a valid email address"
                required
                autoComplete="email"
              />
              {errors.email && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.email}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Phone Number{' '}
                <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span>
              </label>
              <input
                className="et-input"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className={`et-input${errors.password ? ' et-input-error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
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
              {errors.password && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className={`et-input${errors.confirmPassword ? ' et-input-error' : ''}`}
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: undefined })) }}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, display: 'flex' }}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ margin: '4px 0 0', fontSize: 11, color: '#EF4444' }}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                className="et-checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                required
                style={{ marginTop: 1 }}
              />
              <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                I agree to Equiptrack&apos;s{' '}
                <button type="button" style={{ background: 'none', border: 'none', padding: 0, color: '#F04A4A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Terms &amp; Conditions
                </button>
                {' '}and{' '}
                <button type="button" style={{ background: 'none', border: 'none', padding: 0, color: '#F04A4A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="et-btn-dark"
              disabled={loading || !agreedToTerms}
              style={{ marginTop: 4 }}
            >
              {loading ? 'Creating account…' : 'Register Now'}
            </button>
          </form>

          {/* Footer */}
          <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href={`/login/${meta.slug}`} style={{ color: '#F04A4A', fontWeight: 600, textDecoration: 'none' }}>
              Login
            </Link>
          </p>

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
