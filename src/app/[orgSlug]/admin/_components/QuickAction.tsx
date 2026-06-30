'use client'

import Link from 'next/link'

interface QuickActionProps {
  href: string
  icon: React.ReactNode
  label: string
  description: string
  color: string
}

export function QuickAction({ href, icon, label, description, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      style={{ textDecoration: 'none' }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)')}
    >
      <div style={{
        background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
        padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'box-shadow 150ms ease',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: color + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{label}</p>
          <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>{description}</p>
        </div>
      </div>
    </Link>
  )
}
