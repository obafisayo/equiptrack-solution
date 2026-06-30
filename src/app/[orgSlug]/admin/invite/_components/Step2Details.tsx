'use client'

import { ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react'
import type { OrgRole, SubscriptionTier } from '@/lib/types'
import { Input, Select } from '@/components/ui/Form'
import { ROLE_OPTIONS, type InviteMethod, type InviteRow } from './types'

interface Step2DetailsProps {
  rows: InviteRow[]
  onChangeRows: (r: InviteRow[]) => void
  selectedRole: OrgRole
  onSelectRole: (r: OrgRole) => void
  method: InviteMethod
  onBack: () => void
  onNext: () => void
  tier: SubscriptionTier
}

export function Step2Details({ rows, onChangeRows, selectedRole, onSelectRole, method, onBack, onNext, tier }: Step2DetailsProps) {
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
