'use client'

import Link from 'next/link'
import { ROLE_LIST } from '@/lib/roles'

const ROLE_ICONS: Record<string, React.ReactNode> = {
  requester: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  'warehouse-supervisor': (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  'warehouse-personnel': (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  ),
  'dispatch-supervisor': (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  'dispatch-personnel': (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.9V17L12 22l-9-5.1V7L12 2z" />
      <path d="M12 22V12M3.27 6.96L12 12l8.73-5.04" />
    </svg>
  ),
  'qaqc-officer': (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  executive: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
}

export default function LoginRoleSelectorPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: '#060B14', minHeight: '100vh', color: '#DCE5F0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .role-card { transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease; }
        .role-card:hover { transform: translateY(-2px); }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid #1A2640', padding: '0 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, background: '#F04A4A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="8" width="28" height="4" rx="2" fill="white" />
                  <rect x="6" y="18" width="20" height="4" rx="2" fill="white" />
                  <rect x="6" y="28" width="24" height="4" rx="2" fill="white" />
                </svg>
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '0.05em', color: '#F0F4FF' }}>EQUIPTRACK</span>
            </div>
            <div style={{ width: 1, height: 20, background: '#1E2D45' }} />
            <Link href="/" style={{ fontSize: 13, color: '#6B7A99', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              Back to home
            </Link>
          </div>
          <Link href="/signup/requester" style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            New to Equiptrack? Sign up
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px 80px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 36, color: '#F0F4FF', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Choose your role
          </h1>
          <p style={{ fontSize: 16, color: '#6B7A99', margin: 0 }}>
            Select your access level to continue to your dashboard
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
          justifyContent: 'center',
        }}>
          {ROLE_LIST.map((role) => (
            <Link
              key={role.slug}
              href={`/login/${role.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="role-card"
                style={{
                  background: '#0D1525',
                  border: `1px solid #1E2D45`,
                  borderTop: `3px solid ${role.deptColor}`,
                  borderRadius: 10,
                  padding: '20px 20px 18px',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = role.deptColor
                  el.style.borderTopColor = role.deptColor
                  el.style.boxShadow = `0 0 0 1px ${role.deptColor}40, 0 8px 24px ${role.deptColor}18`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#1E2D45'
                  el.style.borderTopColor = role.deptColor
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Dept badge + icon row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: role.deptColor,
                    background: `${role.deptColor}18`,
                    border: `1px solid ${role.deptColor}30`,
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}>
                    {role.dept}
                  </span>
                  <div style={{ color: role.deptColor, opacity: 0.8 }}>
                    {ROLE_ICONS[role.slug]}
                  </div>
                </div>

                {/* Role name */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#F0F4FF', marginBottom: 4 }}>
                    {role.label}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7A99', lineHeight: 1.5 }}>
                    {role.description}
                  </div>
                </div>

                {/* CTA */}
                <div style={{ marginTop: 'auto', paddingTop: 8, fontSize: 12, fontWeight: 600, color: role.deptColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Login as {role.label}
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #111E30', padding: '20px 32px', textAlign: 'center', fontSize: 12, color: '#2E3F55' }}>
        &copy; {new Date().getFullYear()} Equiptrack &mdash; Oil &amp; Gas Equipment Lifecycle Management
      </div>
    </div>
  )
}
