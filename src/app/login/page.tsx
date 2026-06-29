/* eslint-disable */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROLE_LIST } from '@/lib/roles'

/* ── Demo role icons ─────────────────────────────────────────────────────── */

const ROLE_ICONS: Record<string, React.ReactNode> = {
  requester: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2"/><path d="M9 12h6M9 16h4"/></svg>,
  'warehouse-supervisor': <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  'warehouse-personnel': <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  'dispatch-supervisor': <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  'dispatch-personnel': <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l9 4.9V17L12 22l-9-5.1V7L12 2z"/><path d="M12 22V12M3.27 6.96L12 12l8.73-5.04"/></svg>,
  'qaqc-officer': <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  executive: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  safety: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  logistics: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  inventory: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  maintenance: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
}

/* ── Login form ──────────────────────────────────────────────────────────── */

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoOpen, setDemoOpen] = useState(false)

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email is required.'); return }
    if (!password) { setError('Password is required.'); return }
    setLoading(true)
    /* In production this would call the auth API. For now, demo routing by email prefix. */
    setTimeout(() => {
      const prefix = email.split('@')[0].toLowerCase()
      if (prefix.includes('exec') || prefix.includes('ceo')) router.push('/executive')
      else if (prefix.includes('safety') || prefix.includes('hse')) router.push('/safety')
      else if (prefix.includes('dispatch')) router.push('/dispatch')
      else if (prefix.includes('qaqc') || prefix.includes('qa')) router.push('/qaqc')
      else if (prefix.includes('warehouse') || prefix.includes('wh')) router.push('/warehouse')
      else if (prefix.includes('maintenance') || prefix.includes('maint')) router.push('/maintenance')
      else router.push('/requester')
    }, 900)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 40 40" fill="none">
                <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white"/>
                <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white"/>
                <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-sm tracking-widest text-neutral-900">EQUIPTRACK</span>
          </Link>
          <Link href="/signup/requester" className="text-xs font-semibold text-brand-500 no-underline hover:text-brand-600 transition-colors">
            New to Equiptrack? Register
          </Link>
        </div>
      </div>

      {/* Main — two-column on desktop */}
      <div className="flex-1 flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-4xl flex gap-12 items-start">

          {/* Left: login form */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 max-w-md mx-auto">
              <div className="mb-7">
                <h1 className="text-xl font-bold text-neutral-900 mb-1">Sign in to Equiptrack</h1>
                <p className="text-sm text-neutral-500">Enter your work email and password to continue.</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Work Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@yourcompany.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-700">Password</label>
                    <Link href="/forgot-password" className="text-xs text-brand-500 no-underline hover:text-brand-600">Forgot password?</Link>
                  </div>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-neutral-200"/>
                <span className="text-xs text-neutral-400 shrink-0">or</span>
                <div className="flex-1 h-px bg-neutral-200"/>
              </div>

              {/* SSO */}
              <Link
                href="/auth/sso/microsoft"
                className="flex items-center justify-center gap-2.5 w-full h-10 border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-700 no-underline hover:bg-neutral-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                Sign in with Microsoft
              </Link>

              {/* Demo link */}
              <p className="text-xs text-neutral-400 text-center mt-6">
                Evaluating Equiptrack?{' '}
                <button
                  type="button"
                  onClick={() => setDemoOpen(d => !d)}
                  className="text-brand-500 font-semibold underline bg-transparent border-none cursor-pointer hover:text-brand-600"
                >
                  Explore a demo dashboard
                </button>
              </p>
            </div>
          </div>

          {/* Right: product pitch — visible on md+ */}
          <div className="hidden md:flex flex-col gap-6 max-w-xs pt-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-600 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
                Oil &amp; Gas Operations
              </div>
              <h2 className="text-xl font-bold text-neutral-900 leading-snug mb-3">
                End-to-end equipment lifecycle management
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Track every piece of equipment across 16 lifecycle stages, with named accountability at every handoff.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: '16', label: 'Lifecycle Stages', sub: 'Full traceability from request to final delivery' },
                { icon: '7',  label: 'Role-Based Portals', sub: 'Each team sees exactly what they need' },
                { icon: '5',  label: 'Departments Synced', sub: 'Warehouse, Dispatch, QAQC, Safety, and more' },
              ].map(f => (
                <div key={f.icon} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm">
                  <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 text-base font-black flex items-center justify-center shrink-0">{f.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{f.label}</p>
                    <p className="text-[11px] text-neutral-400 leading-snug">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo role drawer — full-width strip below main */}
      {demoOpen && (
        <div className="border-t border-neutral-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-bold text-neutral-900">Demo Dashboards</p>
                <p className="text-xs text-neutral-400 mt-0.5">Click any role below to explore that dashboard with sample data — no login required.</p>
              </div>
              <button
                type="button"
                aria-label="Close demo panel"
                onClick={() => setDemoOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors text-lg font-light"
              >
                &times;
              </button>
            </div>
            <div className="role-card-grid">
              {ROLE_LIST.map(role => (
                <Link
                  key={role.slug}
                  href={`/login/${role.slug}`}
                  className="group bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl p-4 no-underline flex items-center gap-3 transition-all duration-150 shadow-none hover:shadow-sm"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${role.deptColor}15`, color: role.deptColor }}
                  >
                    {ROLE_ICONS[role.slug]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-900 truncate">{role.label}</p>
                    <p className="text-[10px] text-neutral-400 truncate">{role.dept}</p>
                  </div>
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-neutral-200 py-4 px-6 text-center text-xs text-neutral-400 bg-white">
        &copy; {new Date().getFullYear()} Equiptrack &mdash; Oil &amp; Gas Equipment Lifecycle Management
      </div>
    </div>
  )
}
