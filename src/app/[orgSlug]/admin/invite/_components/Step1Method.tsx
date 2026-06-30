'use client'

import { ChevronRight, Mail, Shield, Check } from 'lucide-react'
import type { InviteMethod } from './types'

interface Step1MethodProps {
  method: InviteMethod
  onSelect: (m: InviteMethod) => void
  onNext: () => void
}

export function Step1Method({ method, onSelect, onNext }: Step1MethodProps) {
  return (
    <div>
      <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
        Choose how the invited member will sign in.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {([
          { key: 'email' as InviteMethod,         icon: <Mail size={20} color="#374151" />,   label: 'Email & Password',   description: 'Member sets their own password via the invite link.' },
          { key: 'microsoft_sso' as InviteMethod, icon: <Shield size={20} color="#2563EB" />, label: 'Microsoft SSO',      description: 'Member signs in with their corporate Microsoft account.' },
        ]).map(opt => {
          const selected = method === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 18px', border: `2px solid ${selected ? '#F04A4A' : '#E2E8F0'}`,
                borderRadius: 8, background: selected ? '#FFF1F1' : '#fff',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                background: selected ? '#fff' : '#F9FAFB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{opt.label}</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>{opt.description}</p>
              </div>
              {selected && (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#F04A4A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
            </button>
          )
        })}
      </div>
      <button onClick={onNext} style={{
        marginTop: 24, width: '100%', padding: '10px 0',
        background: '#F04A4A', color: '#fff', border: 'none',
        borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        Continue <ChevronRight size={15} />
      </button>
    </div>
  )
}
