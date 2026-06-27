'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShieldX, ArrowLeft, Mail } from 'lucide-react'

const ERROR_MESSAGES: Record<string, { title: string; detail: string }> = {
  domain_not_allowed:  { title: 'Domain not authorised',      detail: 'Your email domain is not allowed to access this organisation. Contact your administrator to add your domain.' },
  tenant_mismatch:     { title: 'Tenant mismatch',            detail: 'Your Microsoft account belongs to a different tenant than the one configured for this organisation.' },
  account_disabled:    { title: 'Account disabled',           detail: 'Your account has been suspended. Please contact your organisation administrator.' },
  sso_not_configured:  { title: 'SSO not configured',         detail: 'This organisation has not set up Microsoft SSO. Please sign in with email and password.' },
  token_expired:       { title: 'Session expired',            detail: 'Your authentication session has expired. Please try signing in again.' },
  user_not_found:      { title: 'Account not found',          detail: 'No Equiptrack account is linked to your Microsoft identity. You may need an invitation.' },
}

function SSOErrorContent() {
  const searchParams = useSearchParams()
  const code         = searchParams?.get('code') ?? 'unknown'
  const orgSlug      = searchParams?.get('org')

  const errorInfo = ERROR_MESSAGES[code] ?? {
    title:  'Authentication failed',
    detail: 'An unexpected error occurred during Microsoft sign-in. Please try again or contact support.',
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#F5F5F5',
      fontFamily: 'Inter, sans-serif',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      {/* Logo */}
      <div style={{
        width: 48, height: 48, background: '#F04A4A', borderRadius: 11,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32,
      }}>
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
          <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
          <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
        </svg>
      </div>

      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
        padding: '36px 40px', width: '100%', maxWidth: 440,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        {/* Error icon */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%', background: '#FEF2F2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <ShieldX size={30} color="#DC2626" />
        </div>

        {/* Error code badge */}
        {code !== 'unknown' && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <code style={{
              fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
              background: '#FEF2F2', color: '#DC2626',
              padding: '2px 8px', borderRadius: 9999,
              border: '1px solid #FCA5A5',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {code}
            </code>
          </div>
        )}

        <h1 style={{ fontSize: 19, fontWeight: 700, color: '#111827', textAlign: 'center', margin: '0 0 10px' }}>
          {errorInfo.title}
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 1.65, margin: '0 0 28px' }}>
          {errorInfo.detail}
        </p>

        {/* Recovery actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/auth/sso/microsoft"
            style={{
              display: 'block', padding: '10px 0', background: '#F04A4A',
              color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 600,
              textDecoration: 'none', textAlign: 'center',
            }}
          >
            Try signing in again
          </Link>

          <Link
            href="/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 0', background: '#F9FAFB', color: '#374151',
              border: '1px solid #E2E8F0', borderRadius: 7, fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} />
            Return to login
          </Link>

          {orgSlug && (
            <Link
              href={`/${orgSlug}/admin`}
              style={{
                display: 'block', padding: '10px 0', background: '#F9FAFB',
                color: '#374151', border: '1px solid #E2E8F0',
                borderRadius: 7, fontSize: 13, fontWeight: 600,
                textDecoration: 'none', textAlign: 'center',
              }}
            >
              Sign in with email instead
            </Link>
          )}
        </div>

        {/* Support link */}
        <div style={{
          marginTop: 24, paddingTop: 20, borderTop: '1px solid #F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Mail size={13} color="#9CA3AF" />
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
            Need help?{' '}
            <a href="mailto:support@equiptrack.io" style={{ color: '#6B7280', fontWeight: 600 }}>
              support@equiptrack.io
            </a>
          </p>
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 20 }}>
        &copy; {new Date().getFullYear()} Equiptrack
      </p>
    </div>
  )
}

export default function SSOErrorPage() {
  return (
    <Suspense>
      <SSOErrorContent />
    </Suspense>
  )
}
