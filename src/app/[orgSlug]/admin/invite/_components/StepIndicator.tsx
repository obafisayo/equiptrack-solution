'use client'

import { Check } from 'lucide-react'

interface StepIndicatorProps {
  step: number
}

export function StepIndicator({ step }: StepIndicatorProps) {
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
