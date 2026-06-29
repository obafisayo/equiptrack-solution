/* eslint-disable */
'use client'

import { use, useState } from 'react'
import { Save, AlertTriangle, Trash2 } from 'lucide-react'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { STAGE_SLA_HOURS } from '@/config/sla'

type Tab = 'general' | 'sla' | 'notifications' | 'danger'

const TABS: { id: Tab; label: string }[] = [
  { id: 'general',       label: 'General' },
  { id: 'sla',           label: 'SLA Config' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'danger',        label: 'Danger Zone' },
]

/* ── General tab ──────────────────────────────────────────────────────────── */

function GeneralTab({ org }: { org: NonNullable<ReturnType<typeof ORGANISATIONS.find>> }) {
  const [name,     setName]     = useState(org.name)
  const [industry, setIndustry] = useState(org.industry)
  const [timezone, setTimezone] = useState(org.timezone)
  const [country,  setCountry]  = useState(org.country)
  const [saved,    setSaved]    = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const labelStyle = { fontSize: 12, fontWeight: 600 as const, color: '#374151', display: 'block' as const, marginBottom: 5 }
  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #D1D5DB', borderRadius: 7,
    fontSize: 13, color: '#111827', background: '#fff', outline: 'none',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Organisation Name</label>
          <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Industry</label>
          <input value={industry} onChange={e => setIndustry(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Timezone</label>
          <select aria-label="Timezone" value={timezone} onChange={e => setTimezone(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            {['Africa/Lagos', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore'].map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input value={country} onChange={e => setCountry(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Admin Email</label>
        <input value={org.adminEmail} disabled style={{ ...inputStyle, background: '#F9FAFB', color: '#9CA3AF' }} />
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>
          Contact Sysadmin to change the admin email address.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Organisation Slug</label>
        <input value={org.slug} disabled style={{ ...inputStyle, background: '#F9FAFB', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 12 }} />
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>
          Used in URLs. Cannot be changed after setup.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 20px', border: 'none', borderRadius: 7,
            background: saved ? '#16A34A' : '#F04A4A', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
        >
          <Save size={14} />
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

/* ── SLA Config tab ───────────────────────────────────────────────────────── */

function SLAConfigTab() {
  const stages = Object.entries(STAGE_SLA_HOURS) as [string, number][]
  const [hours, setHours] = useState<Record<string, number>>(Object.fromEntries(stages))
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '12px 16px', background: '#FFFBEB', border: '1px solid #FEF08A', borderRadius: 7 }}>
        <p style={{ fontSize: 12, color: '#854D0E', margin: 0, lineHeight: 1.5 }}>
          SLA hours define the maximum time allowed at each lifecycle stage before an alert is triggered.
          Changes apply to new work orders only.
        </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', width: 140 }}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {stages.map(([stage]) => (
              <tr key={stage} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '10px 16px', color: '#374151' }}>{stage}</td>
                <td style={{ padding: '8px 16px' }}>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={hours[stage] ?? 4}
                    onChange={e => setHours(h => ({ ...h, [stage]: parseInt(e.target.value) || 1 }))}
                    style={{
                      width: 80, padding: '5px 10px', border: '1px solid #D1D5DB', borderRadius: 6,
                      fontSize: 13, color: '#111827', outline: 'none', textAlign: 'center',
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 6 }}>hrs</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 20px', border: 'none', borderRadius: 7,
            background: saved ? '#16A34A' : '#F04A4A', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
        >
          <Save size={14} />
          {saved ? 'Saved' : 'Save SLA config'}
        </button>
      </div>
    </div>
  )
}

/* ── Notifications tab ────────────────────────────────────────────────────── */

const NOTIFICATION_ITEMS = [
  { id: 'sla_breach',     label: 'SLA breach alerts',          description: 'Notify supervisors when a work order exceeds its stage SLA.' },
  { id: 'new_request',    label: 'New work order submitted',    description: 'Alert warehouse supervisor when a requester submits a new order.' },
  { id: 'stage_complete', label: 'Stage completion',            description: 'Notify the next department when a stage is marked complete.' },
  { id: 'invite_accept',  label: 'Invitation accepted',        description: 'Notify org admin when an invited member accepts and joins.' },
  { id: 'login_alert',    label: 'Suspicious login detected',  description: 'Alert admin on logins from new devices or unusual locations.' },
  { id: 'billing_due',    label: 'Invoice due reminder',       description: 'Remind admin 3 days before an invoice is due.' },
]

function NotificationsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_ITEMS.map(n => [n.id, true]))
  )
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        {NOTIFICATION_ITEMS.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: i < NOTIFICATION_ITEMS.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}
          >
            <div style={{ flex: 1, marginRight: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>{item.label}</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{item.description}</p>
            </div>
            <button
              onClick={() => setEnabled(e => ({ ...e, [item.id]: !e[item.id] }))}
              style={{
                width: 40, height: 22, borderRadius: 11, border: 'none',
                background: enabled[item.id] ? '#F04A4A' : '#D1D5DB',
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 150ms ease',
              }}
              role="switch"
              aria-checked={enabled[item.id]}
            >
              <span style={{
                position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%',
                background: '#fff', transition: 'left 150ms ease',
                left: enabled[item.id] ? 21 : 3,
              }} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 20px', border: 'none', borderRadius: 7,
            background: saved ? '#16A34A' : '#F04A4A', color: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
        >
          <Save size={14} />
          {saved ? 'Saved' : 'Save preferences'}
        </button>
      </div>
    </div>
  )
}

/* ── Danger Zone tab ──────────────────────────────────────────────────────── */

function DangerZoneTab({ orgName }: { orgName: string }) {
  const [confirmText, setConfirmText] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const DANGER_ACTIONS = [
    {
      title:       'Export all data',
      description: 'Download a full export of all work orders, users, and audit logs as CSV.',
      buttonLabel: 'Request export',
      buttonStyle: { background: '#fff', color: '#374151', border: '1px solid #D1D5DB' },
      action:      () => alert('Data export requested. You will receive an email when ready.'),
    },
    {
      title:       'Suspend organisation',
      description: 'Temporarily prevent all members from logging in. Work orders are preserved.',
      buttonLabel: 'Suspend org',
      buttonStyle: { background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' },
      action:      () => alert('Contact your Sysadmin to suspend the organisation.'),
    },
    {
      title:       'Delete organisation',
      description: 'Permanently delete this organisation and all associated data. This cannot be undone.',
      buttonLabel: 'Delete organisation',
      buttonStyle: { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' },
      action:      () => setShowConfirm(true),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {DANGER_ACTIONS.map(da => (
        <div key={da.title} style={{
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
          padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{da.title}</p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{da.description}</p>
          </div>
          <button
            onClick={da.action}
            style={{
              padding: '8px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit',
              ...da.buttonStyle,
            }}
          >
            {da.buttonLabel}
          </button>
        </div>
      ))}

      {/* Delete confirm modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 16,
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: '32px',
            width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trash2 size={18} color="#DC2626" />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Delete organisation</p>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
                  This will permanently delete <strong>{orgName}</strong> and all associated data.
                  Type the organisation name to confirm.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '8px 12px', marginBottom: 16 }}>
              <AlertTriangle size={13} color="#DC2626" />
              <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>This action cannot be undone.</span>
            </div>

            <input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder={orgName}
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid #D1D5DB', borderRadius: 7,
                fontSize: 13, outline: 'none', marginBottom: 16, boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowConfirm(false); setConfirmText('') }}
                style={{ padding: '8px 16px', border: '1px solid #E2E8F0', borderRadius: 7, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                disabled={confirmText !== orgName}
                style={{
                  padding: '8px 16px', border: 'none', borderRadius: 7,
                  background: confirmText === orgName ? '#DC2626' : '#F3F4F6',
                  color: confirmText === orgName ? '#fff' : '#9CA3AF',
                  fontSize: 13, fontWeight: 600,
                  cursor: confirmText === orgName ? 'pointer' : 'not-allowed',
                }}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function OrgAdminSettingsPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const [activeTab, setActiveTab] = useState<Tab>('general')

  if (!org) {
    return (
      <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#9CA3AF' }}>Organisation not found.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Manage organisation configuration and preferences</p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 4, borderBottom: '1px solid #E2E8F0',
        marginBottom: 24, overflowX: 'auto',
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          const isDanger = tab.id === 'danger'
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 16px', border: 'none', background: 'none',
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? (isDanger ? '#DC2626' : '#F04A4A') : isDanger ? '#DC2626' : '#6B7280',
                borderBottom: isActive ? `2px solid ${isDanger ? '#DC2626' : '#F04A4A'}` : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'general'       && <GeneralTab org={org} />}
      {activeTab === 'sla'           && <SLAConfigTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'danger'        && <DangerZoneTab orgName={org.name} />}
    </div>
  )
}
