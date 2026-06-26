'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ROLE_META } from '@/lib/roles'

const ROLE_ICONS: Record<string, (color: string, size: number) => React.ReactNode> = {
  requester: (color, size) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  'warehouse-supervisor': (color, size) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  'warehouse-personnel': (color, size) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  ),
  'dispatch-supervisor': (color, size) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  'dispatch-personnel': (color, size) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.9V17L12 22l-9-5.1V7L12 2z" />
      <path d="M12 22V12M3.27 6.96L12 12l8.73-5.04" />
    </svg>
  ),
  'qaqc-officer': (color, size) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  executive: (color, size) => (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
}

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function SignupPage() {
  const params = useParams()
  const router = useRouter()
  const roleSlug = params?.role as string
  const meta = ROLE_META[roleSlug]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [company, setCompany] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  if (!meta) {
    return (
      <div style={{ background: '#060B14', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, Inter, sans-serif', color: '#DCE5F0' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, marginBottom: 16 }}>Role not found.</p>
          <Link href="/login" style={{ color: '#F04A4A', textDecoration: 'none' }}>← Back to role selection</Link>
        </div>
      </div>
    )
  }

  const { deptColor } = meta
  const iconFn = ROLE_ICONS[meta.slug]

  function validateField(field: keyof FieldErrors, value: string) {
    const newErrors = { ...errors }
    if (field === 'name') {
      newErrors.name = value.trim() ? undefined : 'Full name is required'
    }
    if (field === 'email') {
      newErrors.email = value.includes('@') ? undefined : 'Enter a valid email address'
    }
    if (field === 'password') {
      newErrors.password = value.length >= 8 ? undefined : 'Password must be at least 8 characters'
      if (confirmPassword && value !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      } else if (confirmPassword) {
        newErrors.confirmPassword = undefined
      }
    }
    if (field === 'confirmPassword') {
      newErrors.confirmPassword = value === password ? undefined : 'Passwords do not match'
    }
    setErrors(newErrors)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: FieldErrors = {}
    if (!name.trim()) newErrors.name = 'Full name is required'
    if (!email.includes('@')) newErrors.email = 'Enter a valid email address'
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    setTimeout(() => {
      router.push(meta.dashboardPath)
    }, 800)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: '#060B14', minHeight: '100vh', color: '#DCE5F0', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .et-input { background: #0A1628; border: 1px solid #1E2D45; border-radius: 7px; color: #DCE5F0; font-size: 14px; padding: 10px 14px; width: 100%; box-sizing: border-box; outline: none; transition: border-color 0.15s; font-family: inherit; }
        .et-input:focus { border-color: ${deptColor}; }
        .et-input::placeholder { color: #3A4A60; }
        .et-input-error { border-color: #EF4444 !important; }
        .et-btn-primary { background: #F04A4A; color: white; border: none; border-radius: 7px; padding: 12px 24px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.04em; cursor: pointer; width: 100%; transition: background 0.15s, transform 0.1s; }
        .et-btn-primary:hover:not(:disabled) { background: #E02828; }
        .et-btn-primary:active:not(:disabled) { transform: scale(0.99); }
        .et-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 768px) {
          .et-split { flex-direction: column !important; }
          .et-left { min-height: 160px !important; width: 100% !important; padding: 24px !important; }
          .et-left-caps { display: none !important; }
          .et-right { width: 100% !important; padding: 32px 20px !important; min-height: unset !important; }
        }
      `}</style>

      {/* Top nav */}
      <div style={{ borderBottom: '1px solid #111E30', padding: '0 32px', flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: '#F04A4A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="8" width="28" height="4" rx="2" fill="white" />
                <rect x="6" y="18" width="20" height="4" rx="2" fill="white" />
                <rect x="6" y="28" width="24" height="4" rx="2" fill="white" />
              </svg>
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.05em', color: '#F0F4FF' }}>EQUIPTRACK</span>
          </div>
          <Link href="/login" style={{ fontSize: 13, color: '#6B7A99', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            Back to roles
          </Link>
        </div>
      </div>

      {/* Split layout */}
      <div className="et-split" style={{ display: 'flex', flex: 1 }}>

        {/* LEFT PANEL */}
        <div
          className="et-left"
          style={{
            width: '42%',
            minHeight: 'calc(100vh - 56px)',
            padding: '48px',
            background: `linear-gradient(160deg, ${deptColor}12 0%, #070D1A 60%)`,
            borderLeft: `3px solid ${deptColor}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Link href="/login" style={{ fontSize: 12, color: '#4A5A70', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 40 }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            All Roles
          </Link>

          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: deptColor, margin: '0 0 16px', opacity: 0.8 }}>
            Join your team on Equiptrack
          </p>

          <div style={{ marginBottom: 20 }}>
            {iconFn ? iconFn(deptColor, 52) : null}
          </div>

          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: '#F0F4FF', margin: '0 0 10px', lineHeight: 1.15 }}>
            {meta.label}
          </h2>

          <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: deptColor,
            background: `${deptColor}18`,
            border: `1px solid ${deptColor}30`,
            padding: '3px 10px',
            borderRadius: 4,
            marginBottom: 20,
          }}>
            {meta.dept}
          </span>

          <p style={{ fontSize: 14, color: '#5A6A80', lineHeight: 1.65, margin: '0 0 32px' }}>
            {meta.description}
          </p>

          <div className="et-left-caps" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {meta.capabilities.map((cap, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: deptColor, fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: '#7A8A9F', lineHeight: 1.5 }}>{cap}</span>
              </div>
            ))}
          </div>

          {/* Demo credentials reminder */}
          <div style={{ marginTop: 32, background: '#0A1628', border: `1px solid ${deptColor}25`, borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#3A4A60', margin: '0 0 8px' }}>
              Demo Login Credentials
            </p>
            <p style={{ fontSize: 11, color: '#3A4A60', margin: '0 0 6px' }}>After signing up, use these to log in:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#2A3A50', width: 52, flexShrink: 0 }}>Email</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#4A5A6A' }}>{meta.demoEmail}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 10, color: '#2A3A50', width: 52, flexShrink: 0 }}>Password</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#4A5A6A' }}>{meta.demoPassword}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 32 }}>
            <p style={{ fontSize: 11, color: '#2A3A50', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>Equiptrack Operations Platform</p>
            <p style={{ fontSize: 11, color: '#1E2D40', margin: 0 }}>v2.4</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="et-right"
          style={{
            width: '58%',
            background: '#0D1525',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 40px',
            minHeight: 'calc(100vh - 56px)',
          }}
        >
          <div style={{ width: '100%', maxWidth: 420 }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, color: '#F0F4FF', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
              Create your account
            </h1>
            <div style={{ marginBottom: 28 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: deptColor,
                background: `${deptColor}18`,
                border: `1px solid ${deptColor}30`,
                padding: '3px 10px',
                borderRadius: 4,
              }}>
                {meta.shortLabel} &mdash; {meta.dept}
              </span>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8A9AB5', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <input
                  className={`et-input${errors.name ? ' et-input-error' : ''}`}
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onBlur={e => validateField('name', e.target.value)}
                  placeholder="Emeka Okonkwo"
                  autoComplete="name"
                />
                {errors.name && <p style={{ fontSize: 11, color: '#EF4444', margin: '5px 0 0' }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8A9AB5', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Email address
                </label>
                <input
                  className={`et-input${errors.email ? ' et-input-error' : ''}`}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={e => validateField('email', e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
                {errors.email && <p style={{ fontSize: 11, color: '#EF4444', margin: '5px 0 0' }}>{errors.email}</p>}
              </div>

              {/* Company */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8A9AB5', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Company / Organization <span style={{ fontWeight: 400, color: '#3A4A60', textTransform: 'none' }}>(optional)</span>
                </label>
                <input
                  className="et-input"
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="TotalEnergies EP Nigeria"
                  autoComplete="organization"
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8A9AB5', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className={`et-input${errors.password ? ' et-input-error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={e => validateField('password', e.target.value)}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4A5A70', cursor: 'pointer', padding: 0 }}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: 11, color: '#EF4444', margin: '5px 0 0' }}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8A9AB5', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className={`et-input${errors.confirmPassword ? ' et-input-error' : ''}`}
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onBlur={e => validateField('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4A5A70', cursor: 'pointer', padding: 0 }}
                  >
                    {showConfirm ? (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    ) : (
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ fontSize: 11, color: '#EF4444', margin: '5px 0 0' }}>{errors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <div style={{ paddingTop: 4 }}>
                <button type="submit" className="et-btn-primary" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account →'}
                </button>
              </div>
            </form>

            {/* Divider + login link */}
            <div style={{ margin: '24px 0 0', textAlign: 'center' }}>
              <div style={{ height: 1, background: '#111E30', marginBottom: 20 }} />
              <span style={{ fontSize: 13, color: '#4A5A70' }}>
                Already have an account?{' '}
                <Link href={`/login/${meta.slug}`} style={{ color: deptColor, textDecoration: 'none', fontWeight: 600 }}>
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
