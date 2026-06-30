'use client'

import type { Organisation } from '@/lib/types'

interface PaymentSummaryCardProps {
  org: Organisation
}

export function PaymentSummaryCard({ org }: PaymentSummaryCardProps) {
  return (
    <div style={{
      background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
      padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      position: 'sticky', top: 16,
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Payment Method</p>

      <div style={{ padding: '12px 14px', background: '#F9FAFB', borderRadius: 7, border: '1px solid #E2E8F0', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 24, background: '#1A1F71', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 8, fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>VISA</span>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', margin: 0 }}>Visa ending in 4242</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0' }}>Expires 09/28</p>
          </div>
        </div>
      </div>

      <button style={{
        width: '100%', padding: '9px 0', border: '1px solid #E2E8F0', borderRadius: 7,
        background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151',
        cursor: 'pointer', marginBottom: 20,
      }}>
        Update payment method
      </button>

      <div style={{ paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
          Billing Contact
        </p>
        <p style={{ fontSize: 12, color: '#374151', margin: '0 0 4px', fontWeight: 500 }}>{org.name}</p>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{org.adminEmail}</p>
      </div>
    </div>
  )
}
