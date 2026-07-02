/* eslint-disable */
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROLE_LIST, ROLE_META } from '@/lib/roles'
import { AuthLeftPanel } from '@/components/layout/AuthLeftPanel'
import { setSessionRole } from '@/lib/session'

/* ── Eye icon ────────────────────────────────────────────────────────────── */
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

/* ── Role icons ──────────────────────────────────────────────────────────── */
const ROLE_ICONS: Record<string, React.ReactNode> = {
  requester:              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2"/><path d="M9 12h6M9 16h4"/></svg>,
  'warehouse-supervisor': <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  'warehouse-personnel':  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  'dispatch-supervisor':  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  'dispatch-personnel':   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M12 2l9 4.9V17L12 22l-9-5.1V7L12 2z"/><path d="M12 22V12M3.27 6.96L12 12l8.73-5.04"/></svg>,
  'qaqc-officer':         <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  executive:              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  'loadout-qaqc':         <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  'site-logistics':       <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  logistics:              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  inventory:              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  maintenance:            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter()

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe,   setRememberMe]   = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [demoOpen,     setDemoOpen]     = useState(false)
  const [activeRole,   setActiveRole]   = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)

  function pickDemoRole(slug: string) {
    const meta = ROLE_META[slug]
    if (!meta) return
    setEmail(meta.demoEmail)
    setPassword(meta.demoPassword)
    setActiveRole(slug)
    setSessionRole(slug)
    setDemoOpen(false)
    setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 80)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const matchedRole = Object.values(ROLE_META).find(m => m.demoEmail === email)
    const path = matchedRole?.dashboardPath ?? '/requester'
    if (matchedRole) setSessionRole(matchedRole.slug)
    setTimeout(() => router.push(path), 800)
  }

  const activeMeta = activeRole ? ROLE_META[activeRole] : null

  return (
    <div className="h-screen flex overflow-hidden">
      <AuthLeftPanel />

      {/* Right panel — independently scrollable */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white">
        {/* min-h-full + flex col + justify-center = centers short content, scrolls tall content */}
        <div className="min-h-full flex flex-col items-center justify-center px-10 py-12">
          <div className="w-full max-w-sm">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-[28px] font-bold text-neutral-900 tracking-tight mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Log in to continue managing your equipment operations with Equiptrack
              </p>
            </div>

            {/* Active demo role badge */}
            {activeMeta && (
              <div className="mb-5">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{ color: activeMeta.deptColor, background: `${activeMeta.deptColor}14`, border: `1px solid ${activeMeta.deptColor}28` }}
                >
                  {ROLE_ICONS[activeMeta.slug]}
                  Demo: {activeMeta.shortLabel} &mdash; {activeMeta.dept}
                </span>
              </div>
            )}

            {/* Microsoft SSO */}
            <button
              type="button"
              onClick={() => router.push('/auth/sso/microsoft')}
              className="flex items-center justify-center gap-2.5 w-full h-11 mb-5 border border-neutral-300 rounded-lg bg-white text-sm font-semibold text-neutral-700 cursor-pointer hover:bg-neutral-50 transition-colors"
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
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">or sign in with email</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  className="et-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="et-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-neutral-400 cursor-pointer p-0 flex items-center hover:text-neutral-600 transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="et-checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span className="text-[13px] text-neutral-600">Remember Me</span>
                </label>
                <button
                  type="button"
                  className="bg-transparent border-none text-[13px] text-brand-500 font-semibold cursor-pointer p-0 hover:text-brand-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Explore demo dashboards */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDemoOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer border-none"
                >
                  <span className="text-[11px] font-bold text-neutral-500 tracking-widest uppercase flex items-center gap-2">
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                      <rect x="3" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="3" width="7" height="7" rx="1"/>
                      <rect x="14" y="14" width="7" height="7" rx="1"/>
                      <rect x="3" y="14" width="7" height="7" rx="1"/>
                    </svg>
                    Explore Demo Dashboards
                  </span>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
                    className={`text-neutral-400 transition-transform duration-200 ${demoOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {demoOpen && (
                  <div className="p-3 border-t border-neutral-100 bg-white">
                    <p className="text-[11px] text-neutral-400 mb-2.5 px-1">
                      Click any role to auto-fill its demo credentials
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ROLE_LIST.map(role => (
                        <button
                          key={role.slug}
                          type="button"
                          onClick={() => pickDemoRole(role.slug)}
                          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all duration-150 cursor-pointer ${
                            activeRole === role.slug
                              ? 'border-brand-400 bg-brand-50'
                              : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-white'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: `${role.deptColor}15`, color: role.deptColor }}
                          >
                            {ROLE_ICONS[role.slug]}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-neutral-800 truncate leading-tight">{role.shortLabel}</p>
                            <p className="text-[10px] text-neutral-400 truncate leading-tight">{role.dept}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="et-btn-dark w-full"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Login'}
              </button>
            </form>

            <p className="text-[13px] text-neutral-500 text-center mt-6">
              Want to get started?{' '}
              <Link href="/waitlist" className="text-brand-500 font-semibold no-underline hover:text-brand-600">
                Join the waitlist
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
