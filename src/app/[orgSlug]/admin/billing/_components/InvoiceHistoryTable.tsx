'use client'

import { CreditCard } from 'lucide-react'
import { formatCurrency, type mockInvoices } from './constants'

interface InvoiceHistoryTableProps {
  invoices: ReturnType<typeof mockInvoices>
}

export function InvoiceHistoryTable({ invoices }: InvoiceHistoryTableProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 8 }}>
        <CreditCard size={15} color="#6B7280" />
        <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Invoice History</p>
      </div>
      <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E2E8F0' }}>
            {['Invoice', 'Period', 'Amount', 'Status', ''].map(h => (
              <th key={h} style={{
                padding: '9px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600,
                color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontSize: 11, color: '#374151' }}>{inv.id}</td>
              <td style={{ padding: '11px 16px', color: '#374151' }}>{inv.period}</td>
              <td style={{ padding: '11px 16px', fontWeight: 600, color: '#111827' }}>{formatCurrency(inv.amount)}</td>
              <td style={{ padding: '11px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: '#F0FDF4', color: '#16A34A' }}>
                  Paid
                </span>
              </td>
              <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                <button style={{
                  background: 'none', border: 'none', fontSize: 12, color: '#F04A4A',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
