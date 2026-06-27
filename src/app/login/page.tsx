'use client'

import Link from 'next/link'
import { ROLE_LIST } from '@/lib/roles'

const ROLE_ICONS: Record<string, React.ReactNode> = {
  requester: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  'warehouse-supervisor': (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  'warehouse-personnel': (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  ),
  'dispatch-supervisor': (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  'dispatch-personnel': (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.9V17L12 22l-9-5.1V7L12 2z" />
      <path d="M12 22V12M3.27 6.96L12 12l8.73-5.04" />
    </svg>
  ),
  'qaqc-officer': (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  executive: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  safety: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-6H4a2 2 0 0 0-2 2v16z" />
      <path d="M14 2v6h6" />
      <path d="M12 11v6M9 14h6" />
    </svg>
  ),
  logistics: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="12" x2="15" y2="15" />
    </svg>
  ),
  inventory: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  ),
  maintenance: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
}

export default function LoginRoleSelectorPage() {
  return (
    <div style={{ fontFamily: 'Inter, -apple-system, sans-serif', background: '#F5F5F5', minHeight: '100vh', color: '#111827' }}>
      <style>{`
        .role-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 20px;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-decoration: none;
          transition: box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Top bar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 30, height: 30, background: '#F04A4A', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                  <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
                  <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
                  <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.06em', color: '#111827' }}>EQUIPTRACK</span>
            </div>

            <div style={{ width: 1, height: 18, background: '#E2E8F0' }} />

            <Link href="/" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to home
            </Link>
          </div>

          <Link
            href="/signup/requester"
            style={{ fontSize: 13, fontWeight: 600, color: '#F04A4A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            New to Equiptrack? Register
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 32px 80px' }}>

        {/* Heading */}
        <div style={{ marginBottom: 44, textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#111827', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
            Choose your role
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: 0 }}>
            Select your access level to continue to your dashboard
          </p>
        </div>

        {/* Role grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(276px, 1fr))',
          gap: 16,
        }}>
          {ROLE_LIST.map((role) => (
            <Link key={role.slug} href={`/login/${role.slug}`} className="role-card">

              {/* Top row: dept badge + icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: role.deptColor,
                  background: `${role.deptColor}15`,
                  border: `1px solid ${role.deptColor}25`,
                  padding: '3px 9px', borderRadius: 999,
                }}>
                  {role.dept}
                </span>

                {/* Icon in a colored circle */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${role.deptColor}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: role.deptColor, flexShrink: 0,
                }}>
                  {ROLE_ICONS[role.slug]}
                </div>
              </div>

              {/* Role name + description */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 5 }}>
                  {role.label}
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
                  {role.description}
                </div>
              </div>

              {/* Capabilities */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {role.capabilities.slice(0, 2).map((cap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: role.deptColor, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4 }}>{cap}</span>
                  </div>
                ))}
              </div>

              {/* CTA row */}
              <div style={{
                paddingTop: 10, borderTop: '1px solid #F3F4F6',
                fontSize: 12, fontWeight: 600, color: role.deptColor,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                Log in as {role.shortLabel}
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Company SSO section */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px 56px' }}>
        <div style={{
          border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px 28px',
          background: '#FFFFFF', display: 'flex', alignItems: 'center',
          gap: 20, flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
              Sign in with your company account
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
              If your organisation uses Microsoft SSO, enter your work email to sign in automatically.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
            <Link
              href="/auth/sso/microsoft"
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '10px 18px', border: '1px solid #D1D5DB', borderRadius: 8,
                background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151',
                textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              Sign in with Microsoft
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #E2E8F0', padding: '20px 32px', textAlign: 'center', fontSize: 12, color: '#9CA3AF', background: '#FFFFFF' }}>
        &copy; {new Date().getFullYear()} Equiptrack &mdash; Oil &amp; Gas Equipment Lifecycle Management
      </div>
    </div>
  )
}
