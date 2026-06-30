'use client'

import { CheckCircle, XCircle, Clock } from 'lucide-react'

interface StatCardsRowProps {
  counts: {
    pending: number
    approved: number
    rejected: number
    converted: number
  }
}

export function StatCardsRow({ counts }: StatCardsRowProps) {
  const cards = [
    { label: 'Pending Review', value: counts.pending,   icon: Clock,       color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Approved',       value: counts.approved,  icon: CheckCircle, color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Rejected',       value: counts.rejected,  icon: XCircle,     color: '#DC2626', bg: '#FEF2F2' },
    { label: 'Converted',      value: counts.converted, icon: CheckCircle, color: '#2563EB', bg: '#EFF6FF' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <div key={card.label} style={{
            background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
            padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: card.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={18} color={card.color} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1 }}>
                {card.value}
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>{card.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
