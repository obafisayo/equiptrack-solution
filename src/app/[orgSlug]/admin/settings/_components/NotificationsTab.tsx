'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

const NOTIFICATION_ITEMS = [
  { id: 'sla_breach',     label: 'SLA breach alerts',          description: 'Notify supervisors when a work order exceeds its stage SLA.' },
  { id: 'new_request',    label: 'New work order submitted',    description: 'Alert warehouse supervisor when a requester submits a new order.' },
  { id: 'stage_complete', label: 'Stage completion',            description: 'Notify the next department when a stage is marked complete.' },
  { id: 'invite_accept',  label: 'Invitation accepted',        description: 'Notify org admin when an invited member accepts and joins.' },
  { id: 'login_alert',    label: 'Suspicious login detected',  description: 'Alert admin on logins from new devices or unusual locations.' },
  { id: 'billing_due',    label: 'Invoice due reminder',       description: 'Remind admin 3 days before an invoice is due.' },
]

export function NotificationsTab() {
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
