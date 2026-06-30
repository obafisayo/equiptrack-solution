'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ORGANISATIONS } from '@/lib/mock-platform'

interface OrgPageHeaderProps {
  org: NonNullable<ReturnType<typeof ORGANISATIONS.find>>
}

export function OrgPageHeader({ org }: OrgPageHeaderProps) {
  return (
    <div>
      <Link
        href="/sysadmin/organisations"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 12, color: '#6B7280', textDecoration: 'none', marginBottom: 12,
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#111827')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#6B7280')}
      >
        <ArrowLeft size={13} />
        All Organisations
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: '#F04A4A18', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#F04A4A' }}>
            {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{org.name}</h2>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
            {org.industry} · {org.country} · ID: <code style={{ fontFamily: 'monospace', fontSize: 11 }}>{org.id}</code>
          </p>
        </div>
      </div>
    </div>
  )
}
