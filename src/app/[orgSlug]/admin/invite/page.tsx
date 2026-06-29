/* eslint-disable */
'use client'

import { use, useState } from 'react'
import { ChevronRight, ChevronLeft, Mail, Shield, Check, Plus, Trash2 } from 'lucide-react'
import type { OrgRole, SubscriptionTier } from '@/lib/types'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { Input, Select } from '@/components/ui/Form'

/* ── Role definitions ─────────────────────────────────────────────────────── */

interface RoleOption {
  role: OrgRole
  label: string
  description: string
  department: string
  color: string
}

const ROLE_OPTIONS: RoleOption[] = [
  { role: 'requester',             label: 'Requester',            description: 'Creates work order requests',           department: 'Field',      color: '#3B82F6' },
  { role: 'wh_supervisor',         label: 'WH Supervisor',        description: 'Manages warehouse operations',          department: 'Warehouse',  color: '#3B82F6' },
  { role: 'wh_personnel',          label: 'WH Personnel',         description: 'Executes warehouse tasks',              department: 'Warehouse',  color: '#3B82F6' },
  { role: 'dsp_supervisor',        label: 'DSP Supervisor',       description: 'Oversees dispatch scheduling',          department: 'Dispatch',   color: '#8B5CF6' },
  { role: 'dsp_personnel',         label: 'DSP Personnel',        description: 'Handles dispatch execution',            department: 'Dispatch',   color: '#8B5CF6' },
  { role: 'qaqc_officer',          label: 'QAQC Officer',         description: 'Inspects and certifies containers',     department: 'QAQC',       color: '#F59E0B' },
  { role: 'exec_viewer',           label: 'Exec Viewer',          description: 'Read-only executive dashboard',         department: 'Executive',  color: '#10B981' },
  { role: 'safety_officer',        label: 'Safety Officer',       description: 'Monitors safety compliance',            department: 'Safety',     color: '#EF4444' },
  { role: 'logistics_coordinator', label: 'Logistics Coord.',     description: 'Coordinates logistics planning',        department: 'Logistics',  color: '#F97316' },
  { role: 'inventory_manager',     label: 'Inventory Manager',    description: 'Manages inventory and stock',           department: 'Inventory',  color: '#06B6D4' },
  { role: 'rig_manager',           label: 'Rig Manager',          description: 'Oversees rig-site operations',          department: 'Field',      color: '#8B5CF6' },
  { role: 'crane_operator',        label: 'Crane Operator',       description: 'Operates crane lifting equipment',      department: 'Field',      color: '#64748B' },
  { role: 'maintenance_tech',      label: 'Maintenance Tech',     description: 'Performs equipment maintenance',        department: 'Maintenance',color: '#10B981' },
  { role: 'org_admin',             label: 'Org Admin',            description: 'Full admin access to this portal',      department: 'Admin',      color: '#F04A4A' },
]

/* ── Step indicator ───────────────────────────────────────────────────────── */

function StepIndicator({ step }: { step: number }) {
  const steps = ['Method', 'Details', 'Review']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((label, i) => {
        const idx     = i + 1
        const done    = idx < step
        const current = idx === step
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#F04A4A' : current ? '#FFF1F1' : '#F3F4F6',
                border: `2px solid ${done || current ? '#F04A4A' : '#E2E8F0'}`,
                fontSize: 11, fontWeight: 700,
                color: done ? '#fff' : current ? '#F04A4A' : '#9CA3AF',
              }}>
                {done ? <Check size={12} /> : idx}
              </div>
              <span style={{
                fontSize: 12, fontWeight: current ? 700 : 500,
                color: current ? '#111827' : done ? '#374151' : '#9CA3AF',
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: done ? '#F04A4A' : '#E2E8F0', margin: '0 10px' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Step 1: Method ───────────────────────────────────────────────────────── */

type InviteMethod = 'email' | 'microsoft_sso'

function Step1({ method, onSelect, onNext }: {
  method: InviteMethod
  onSelect: (m: InviteMethod) => void
  onNext: () => void
}) {
  return (
    <div>
      <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
        Choose how the invited member will sign in.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {([
          { key: 'email' as InviteMethod,         icon: <Mail size={20} color="#374151" />,   label: 'Email & Password',   description: 'Member sets their own password via the invite link.' },
          { key: 'microsoft_sso' as InviteMethod, icon: <Shield size={20} color="#2563EB" />, label: 'Microsoft SSO',      description: 'Member signs in with their corporate Microsoft account.' },
        ]).map(opt => {
          const selected = method === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 18px', border: `2px solid ${selected ? '#F04A4A' : '#E2E8F0'}`,
                borderRadius: 8, background: selected ? '#FFF1F1' : '#fff',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: selected ? '#fff' : '#F9FAFB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{opt.label}</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>{opt.description}</p>
              </div>
              {selected && (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#F04A4A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
            </button>
          )
        })}
      </div>
      <button onClick={onNext} style={{
        marginTop: 24, width: '100%', padding: '10px 0',
        background: '#F04A4A', color: '#fff', border: 'none',
        borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        Continue <ChevronRight size={15} />
      </button>
    </div>
  )
}

/* ── Step 2: Details ──────────────────────────────────────────────────────── */

interface InviteRow { email: string; role: OrgRole }

function Step2({ rows, onChangeRows, selectedRole, onSelectRole, method, onBack, onNext, tier }: {
  rows: InviteRow[]
  onChangeRows: (r: InviteRow[]) => void
  selectedRole: OrgRole
  onSelectRole: (r: OrgRole) => void
  method: InviteMethod
  onBack: () => void
  onNext: () => void
  tier: SubscriptionTier
}) {
  const availableRoles = tier === 'starter'
    ? ROLE_OPTIONS.filter(r => !['safety_officer','logistics_coordinator','inventory_manager','rig_manager','crane_operator','maintenance_tech','org_admin'].includes(r.role))
    : ROLE_OPTIONS

  function addRow() {
    onChangeRows([...rows, { email: '', role: selectedRole }])
  }

  function removeRow(i: number) {
    onChangeRows(rows.filter((_, idx) => idx !== i))
  }

  function updateRow(i: number, field: keyof InviteRow, value: string) {
    onChangeRows(rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  const valid = rows.every(r => r.email.includes('@') && r.email.includes('.'))

  const inputStyle = {
    padding: '8px 10px', border: '1px solid #D1D5DB', borderRadius: 6,
    fontSize: 13, color: '#111827', background: '#fff',
    outline: 'none', width: '100%', boxSizing: 'border-box' as const,
  }

  return (
    <div>
      <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
        Enter email addresses and assign roles.
        {method === 'microsoft_sso' && (
          <span style={{ display: 'block', fontSize: 12, color: '#2563EB', marginTop: 4 }}>
            Microsoft SSO: members will sign in with their company account.
          </span>
        )}
      </p>

      {/* Role selector */}
      <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Default Role</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 20 }}>
        {availableRoles.slice(0, 6).map(opt => {
          const sel = selectedRole === opt.role
          return (
            <button
              key={opt.role}
              onClick={() => onSelectRole(opt.role)}
              style={{
                padding: '7px 8px', border: `1.5px solid ${sel ? opt.color : '#E2E8F0'}`,
                borderRadius: 6, background: sel ? opt.color + '18' : '#fff',
                cursor: 'pointer', textAlign: 'left', fontSize: 11,
                fontWeight: sel ? 700 : 500,
                color: sel ? opt.color : '#374151',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Email rows */}
      <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Invite List</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 2 }}>
              <Input
                type="email"
                placeholder="email@company.com"
                value={row.email}
                onChange={e => updateRow(i, 'email', e.target.value)}
                size="sm"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Select
                aria-label="Assign role"
                value={row.role}
                onChange={e => updateRow(i, 'role', e.target.value as OrgRole)}
                size="sm"
              >
                {availableRoles.map(opt => (
                  <option key={opt.role} value={opt.role}>{opt.label}</option>
                ))}
              </Select>
            </div>
            {rows.length > 1 && (
              <button
                onClick={() => removeRow(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: 4, flexShrink: 0 }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600, color: '#F04A4A',
          background: 'none', border: '1px dashed #F04A4A',
          borderRadius: 6, padding: '7px 12px', cursor: 'pointer', marginBottom: 24,
        }}
      >
        <Plus size={13} /> Add another
      </button>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          flex: 1, padding: '9px 0', border: '1px solid #D1D5DB', borderRadius: 7,
          background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <ChevronLeft size={15} /> Back
        </button>
        <button onClick={onNext} disabled={!valid} style={{
          flex: 2, padding: '9px 0', border: 'none', borderRadius: 7,
          background: valid ? '#F04A4A' : '#F3F4F6',
          fontSize: 13, fontWeight: 600, color: valid ? '#fff' : '#9CA3AF',
          cursor: valid ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Review <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

/* ── Step 3: Review ───────────────────────────────────────────────────────── */

function Step3({ rows, method, onBack, onSend }: {
  rows: InviteRow[]
  method: InviteMethod
  onBack: () => void
  onSend: () => void
}) {
  const ROLE_LABEL: Record<string, string> = Object.fromEntries(ROLE_OPTIONS.map(r => [r.role, r.label]))
  return (
    <div>
      <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
        Review and confirm — {rows.length} invitation{rows.length > 1 ? 's' : ''} will be sent.
      </p>

      <div style={{
        background: '#F9FAFB', border: '1px solid #E2E8F0', borderRadius: 8,
        overflow: 'hidden', marginBottom: 20,
      }}>
        <div style={{ padding: '8px 14px', borderBottom: '1px solid #E2E8F0', background: '#fff' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Auth Method: {method === 'microsoft_sso' ? 'Microsoft SSO' : 'Email & Password'}
          </span>
        </div>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '11px 14px', borderBottom: i < rows.length - 1 ? '1px solid #E2E8F0' : 'none',
          }}>
            <span style={{ fontSize: 13, color: '#111827', fontFamily: 'monospace' }}>{row.email}</span>
            <span style={{
              background: '#F1F5F9', color: '#475569',
              fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 9999,
            }}>{ROLE_LABEL[row.role] ?? row.role}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{
          flex: 1, padding: '9px 0', border: '1px solid #D1D5DB', borderRadius: 7,
          background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <ChevronLeft size={15} /> Back
        </button>
        <button onClick={onSend} style={{
          flex: 2, padding: '9px 0', border: 'none', borderRadius: 7,
          background: '#F04A4A', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
        }}>
          Send {rows.length} Invitation{rows.length > 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function InvitePage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = use(params)
  const org = ORGANISATIONS.find(o => o.slug === orgSlug)
  const tier = org?.subscription.tier ?? 'starter'

  const [step, setStep]         = useState(1)
  const [method, setMethod]     = useState<InviteMethod>('email')
  const [selectedRole, setSelectedRole] = useState<OrgRole>('requester')
  const [rows, setRows]         = useState<InviteRow[]>([{ email: '', role: 'requester' }])
  const [sent, setSent]         = useState(false)

  function handleSend() {
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', paddingTop: 40 }}>
        <div style={{
          background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
          padding: '48px 32px', textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#F0FDF4',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Check size={26} color="#16A34A" />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Invitations sent</p>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 24px' }}>
            {rows.length} invitation{rows.length > 1 ? 's' : ''} sent via {method === 'microsoft_sso' ? 'Microsoft SSO' : 'email'}.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map((r, i) => (
              <div key={i} style={{
                padding: '8px 12px', background: '#F9FAFB', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 13, color: '#374151', fontFamily: 'monospace' }}>{r.email}</span>
                <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 600 }}>Sent</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSent(false); setStep(1); setRows([{ email: '', role: 'requester' }]) }}
            style={{
              marginTop: 24, padding: '9px 20px', border: 'none',
              borderRadius: 7, background: '#F04A4A', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Invite more members
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0',
        padding: '28px 32px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <StepIndicator step={step} />

        {step === 1 && (
          <Step1 method={method} onSelect={setMethod} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2
            rows={rows}
            onChangeRows={setRows}
            selectedRole={selectedRole}
            onSelectRole={r => { setSelectedRole(r); setRows(rows.map(row => ({ ...row, role: r }))) }}
            method={method}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            tier={tier}
          />
        )}
        {step === 3 && (
          <Step3 rows={rows} method={method} onBack={() => setStep(2)} onSend={handleSend} />
        )}
      </div>
    </div>
  )
}
