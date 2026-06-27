'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'

type Phase = 'loading' | 'success' | 'error'

const LOADING_STEPS = [
  'Verifying Microsoft identity…',
  'Checking organisation membership…',
  'Loading your permissions…',
  'Setting up your session…',
]

function MicrosoftSSOCallbackContent() {
  const searchParams  = useSearchParams()
  const hasError      = searchParams?.get('error') === 'true'
  const orgSlug       = searchParams?.get('org') ?? 'shell-nigeria'

  const [phase, setPhase]           = useState<Phase>('loading')
  const [stepIndex, setStepIndex]   = useState(0)

  useEffect(() => {
    if (hasError) {
      const t = setTimeout(() => setPhase('error'), 1400)
      return () => clearTimeout(t)
    }

    const intervals: ReturnType<typeof setTimeout>[] = []
    LOADING_STEPS.forEach((_, i) => {
      if (i === 0) return
      intervals.push(setTimeout(() => setStepIndex(i), i * 700))
    })
    intervals.push(setTimeout(() => setPhase('success'), LOADING_STEPS.length * 700 + 300))
    return () => intervals.forEach(clearTimeout)
  }, [hasError])

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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 32,
      }}>
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
          <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
          <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
        </svg>
      </div>

      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
        padding: '36px 40px', width: '100%', maxWidth: 400,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center',
      }}>

        {/* ── Loading ── */}
        {phase === 'loading' && (
          <>
            {/* Microsoft logo spinner area */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '3px solid #F3F4F6',
              borderTopColor: '#F04A4A',
              animation: 'spin 0.9s linear infinite',
              margin: '0 auto 20px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              Signing you in
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 28px' }}>
              Please wait while we verify your Microsoft account
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {LOADING_STEPS.map((step, i) => {
                const done    = i < stepIndex
                const current = i === stepIndex
                return (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: done ? '#F0FDF4' : current ? '#FFF1F1' : '#F9FAFB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid ${done ? '#86EFAC' : current ? '#F04A4A' : '#E2E8F0'}`,
                      transition: 'all 250ms ease',
                    }}>
                      {done && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <polyline points="2 6 5 9 10 3" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                      {current && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F04A4A' }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: done ? '#374151' : current ? '#111827' : '#9CA3AF',
                      fontWeight: current ? 500 : 400,
                      transition: 'color 250ms ease',
                    }}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ── Success ── */}
        {phase === 'success' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#F0FDF4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <CheckCircle size={28} color="#16A34A" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              Signed in successfully
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>
              Redirecting you to your dashboard…
            </p>
            <Link
              href={`/${orgSlug}/admin`}
              style={{
                display: 'block', padding: '10px 0', background: '#F04A4A',
                color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Go to Dashboard
            </Link>
          </>
        )}

        {/* ── Error ── */}
        {phase === 'error' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <XCircle size={28} color="#DC2626" />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              Sign-in failed
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              We could not verify your Microsoft account. Your email domain may not be authorised
              for this organisation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => { setPhase('loading'); setStepIndex(0) }}
                style={{
                  padding: '10px 0', background: '#F04A4A', color: '#fff',
                  border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Try again
              </button>
              <Link
                href="/auth/sso/error"
                style={{
                  display: 'block', padding: '10px 0', background: '#F9FAFB',
                  color: '#374151', border: '1px solid #E2E8F0',
                  borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none',
                }}
              >
                View error details
              </Link>
              <Link
                href="/login"
                style={{ display: 'block', fontSize: 12, color: '#9CA3AF', textDecoration: 'none', marginTop: 4 }}
              >
                Return to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function MicrosoftSSOCallbackPage() {
  return (
    <Suspense>
      <MicrosoftSSOCallbackContent />
    </Suspense>
  )
}
