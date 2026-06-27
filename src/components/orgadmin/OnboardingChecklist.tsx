'use client'

import Link from 'next/link'
import { Check, Users, ShieldCheck, SlidersHorizontal, ClipboardList } from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  description: string
  href: (slug: string) => string
  icon: typeof Users
  done: boolean
}

interface OnboardingChecklistProps {
  orgSlug: string
  hasSSOConfigured: boolean
  hasMembersInvited: boolean
  hasWorkOrders: boolean
}

export function OnboardingChecklist({
  orgSlug,
  hasSSOConfigured,
  hasMembersInvited,
  hasWorkOrders,
}: OnboardingChecklistProps) {
  const items: ChecklistItem[] = [
    {
      id:          'invite',
      label:       'Invite your team',
      description: 'Add your first team members and assign roles.',
      href:        s => `/${s}/admin/invite`,
      icon:        Users,
      done:        hasMembersInvited,
    },
    {
      id:          'sso',
      label:       'Configure Microsoft SSO',
      description: 'Enable single sign-on for seamless corporate access.',
      href:        s => `/${s}/admin/sso`,
      icon:        ShieldCheck,
      done:        hasSSOConfigured,
    },
    {
      id:          'roles',
      label:       'Review roles & permissions',
      description: 'Confirm the right people have the right access.',
      href:        s => `/${s}/admin/roles`,
      icon:        SlidersHorizontal,
      done:        false,
    },
    {
      id:          'workorder',
      label:       'Create first work order',
      description: 'Submit a test request to verify the workflow.',
      href:        () => '/requester/new',
      icon:        ClipboardList,
      done:        hasWorkOrders,
    },
  ]

  const doneCount = items.filter(i => i.done).length
  const allDone   = doneCount === items.length
  const pct       = Math.round((doneCount / items.length) * 100)

  if (allDone) return null

  return (
    <div style={{
      background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0',
      padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>
            Getting started
          </p>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
            {doneCount} of {items.length} steps complete
          </p>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#F04A4A' }}>{pct}%</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: '#F04A4A', borderRadius: 3,
          transition: 'width 250ms ease',
        }} />
      </div>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(item => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 10px', borderRadius: 7,
                background: item.done ? '#F9FAFB' : '#fff',
                opacity: item.done ? 0.7 : 1,
              }}
            >
              {/* Check circle */}
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: item.done ? '#F0FDF4' : '#F9FAFB',
                border: `1.5px solid ${item.done ? '#86EFAC' : '#E2E8F0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.done ? (
                  <Check size={11} color="#16A34A" strokeWidth={2.5} />
                ) : (
                  <Icon size={11} color="#9CA3AF" />
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, margin: 0,
                  color: item.done ? '#6B7280' : '#111827',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}>
                  {item.label}
                </p>
                {!item.done && (
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0' }}>
                    {item.description}
                  </p>
                )}
              </div>

              {/* Action */}
              {!item.done && (
                <Link
                  href={item.href(orgSlug)}
                  style={{
                    fontSize: 11, fontWeight: 600, color: '#F04A4A',
                    textDecoration: 'none', padding: '4px 10px',
                    background: '#FFF1F1', borderRadius: 5, flexShrink: 0,
                  }}
                >
                  Start
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
