'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { STAGE_SLA_HOURS } from '@/config/sla'
import { Input } from '@/components/ui/Form'

export function SLAConfigTab() {
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
                  <Input
                    type="number"
                    min={1}
                    max={168}
                    value={hours[stage] ?? 4}
                    onChange={e => setHours(h => ({ ...h, [stage]: parseInt(e.target.value) || 1 }))}
                    size="sm"
                    className="w-20 text-center font-mono"
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
