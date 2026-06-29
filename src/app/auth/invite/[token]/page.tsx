'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { INVITATIONS, ORGANISATIONS } from '@/lib/mock-platform'
import { Input } from '@/components/ui/Form'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

const ROLE_LABEL: Record<string, string> = {
  org_admin:            'Organisation Admin',
  requester:            'Requester',
  wh_supervisor:        'Warehouse Supervisor',
  wh_personnel:         'Warehouse Personnel',
  dsp_supervisor:       'Dispatch Supervisor',
  dsp_personnel:        'Dispatch Personnel',
  qaqc_officer:         'QAQC Officer',
  exec_viewer:          'Executive Viewer',
  safety_officer:       'Safety Officer',
  logistics_coordinator:'Logistics Coordinator',
  inventory_manager:    'Inventory Manager',
  rig_manager:          'Rig Manager',
  crane_operator:       'Crane Operator',
  maintenance_tech:     'Maintenance Technician',
}

function LogoMark() {
  return (
    <div style={{ width: 44, height: 44, background: '#F04A4A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="23" height="23" viewBox="0 0 40 40" fill="none">
        <rect x="5" y="8"  width="30" height="5" rx="2.5" fill="white" />
        <rect x="5" y="18" width="22" height="5" rx="2.5" fill="white" />
        <rect x="5" y="28" width="26" height="5" rx="2.5" fill="white" />
      </svg>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)

  const invitation = INVITATIONS.find(i => i.token === token)
  const org = invitation ? ORGANISATIONS.find(o => o.id === invitation.orgId) : null

  const [name,        setName]        = useState('')
  const [password,    setPassword]    = useState('')
  const [accepted,    setAccepted]    = useState(false)
  const [submitting,  setSubmitting]  = useState(false)

  const isExpired = invitation?.status === 'expired'
  const isUsed    = invitation?.status === 'accepted'
  const isValid   = invitation?.status === 'pending' && !isExpired

  function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => setAccepted(true), 1000)
  }

  /* ── Wrapper ── */
  return (
    <div style={{
      minHeight: '100vh', background: '#F5F5F5', fontFamily: 'Inter, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '32px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <LogoMark />
        </div>

        {/* ── Not found ── */}
        {!invitation && (
          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
            padding: '36px 32px', textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <XCircle size={28} color="#DC2626" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Invitation not found</p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              This invitation link is invalid. Please check the link in your email or contact your administrator.
            </p>
            <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: '#F04A4A', textDecoration: 'none' }}>
              Return to login
            </Link>
          </div>
        )}

        {/* ── Expired ── */}
        {invitation && isExpired && (
          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
            padding: '36px 32px', textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={28} color="#D97706" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Invitation expired</p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 4px', lineHeight: 1.6 }}>
              This invitation to <strong>{org?.name ?? 'the organisation'}</strong> has expired.
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              Invitations are valid for 7 days. Please ask your administrator to send a new invitation.
            </p>
            <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: '#F04A4A', textDecoration: 'none' }}>
              Return to login
            </Link>
          </div>
        )}

        {/* ── Already used ── */}
        {invitation && isUsed && (
          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
            padding: '36px 32px', textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={28} color="#16A34A" />
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Already accepted</p>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
              This invitation has already been accepted. You can log in to{' '}
              <strong>{org?.name ?? 'the organisation'}</strong>.
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-block', padding: '9px 24px',
                background: '#F04A4A', color: '#fff', borderRadius: 7,
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Go to Login
            </Link>
          </div>
        )}

        {/* ── Valid / success ── */}
        {invitation && isValid && (
          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
            padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            {accepted ? (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={28} color="#16A34A" />
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Welcome aboard!</p>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.6 }}>
                  Your account has been created. You can now log in to <strong>{org?.name}</strong>.
                </p>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-block', padding: '10px 28px',
                    background: '#F04A4A', color: '#fff', borderRadius: 7,
                    fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                {/* Org badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', background: '#F9FAFB',
                  borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 24,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: '#FFF1F1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#F04A4A' }}>
                      {org?.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>
                      You&apos;re invited to <strong>{org?.name}</strong>
                    </p>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>
                      Role: {ROLE_LABEL[invitation.role] ?? invitation.role}
                      {invitation.authMethod === 'microsoft_sso' ? ' · Microsoft SSO' : ''}
                    </p>
                  </div>
                </div>

                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Create your account</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>
                  Accepting invitation for <code style={{ fontFamily: 'monospace', fontSize: 12 }}>{invitation.email}</code>
                </p>

                {invitation.authMethod === 'microsoft_sso' ? (
                  <div>
                    <p style={{ fontSize: 13, color: '#374151', marginBottom: 20, lineHeight: 1.6 }}>
                      This organisation uses Microsoft SSO. Click below to sign in with your corporate account.
                    </p>
                    <button
                      onClick={() => setAccepted(true)}
                      style={{
                        width: '100%', padding: '11px 0', border: '1px solid #D1D5DB',
                        borderRadius: 7, background: '#fff', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, color: '#374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
                        <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                        <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                        <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                        <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                      </svg>
                      Continue with Microsoft
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAccept} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Full Name *
                      </label>
                      <Input
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
                        Password *
                      </label>
                      <Input
                        required
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        minLength={8}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        padding: '11px 0', border: 'none', borderRadius: 7,
                        background: '#F04A4A', color: '#fff',
                        fontSize: 13, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.8 : 1,
                      }}
                    >
                      {submitting ? 'Creating account…' : 'Accept Invitation'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 20 }}>
          &copy; {new Date().getFullYear()} Equiptrack
        </p>
      </div>
    </div>
  )
}
