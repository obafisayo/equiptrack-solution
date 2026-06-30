'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { Input, Select } from '@/components/ui/Form'

type OrgType = NonNullable<ReturnType<typeof ORGANISATIONS.find>>

interface GeneralTabProps {
  org: OrgType
}

export function GeneralTab({ org }: GeneralTabProps) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Organisation Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Industry</label>
          <Input value={industry} onChange={e => setIndustry(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Timezone</label>
          <Select aria-label="Timezone" value={timezone} onChange={e => setTimezone(e.target.value)}>
            {['Africa/Lagos', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore'].map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </Select>
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <Input value={country} onChange={e => setCountry(e.target.value)} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Admin Email</label>
        <Input value={org.adminEmail} disabled className="font-normal text-gray-400 bg-neutral-100" />
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>
          Contact Sysadmin to change the admin email address.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Organisation Slug</label>
        <Input value={org.slug} disabled className="font-mono text-xs text-gray-400 bg-neutral-100" />
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
