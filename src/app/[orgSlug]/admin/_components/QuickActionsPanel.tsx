'use client'

import { UserPlus, ShieldCheck } from 'lucide-react'
import { QuickAction } from './QuickAction'

interface QuickActionsPanelProps {
  orgSlug: string
}

export function QuickActionsPanel({ orgSlug }: QuickActionsPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <QuickAction
        href={`/${orgSlug}/admin/invite`}
        icon={<UserPlus size={17} color="#1A6FBF" />}
        label="Invite Member"
        description="Add a new team member"
        color="#1A6FBF"
      />
      <QuickAction
        href={`/${orgSlug}/admin/sso`}
        icon={<ShieldCheck size={17} color="#2563EB" />}
        label="SSO Settings"
        description="Configure Microsoft SSO"
        color="#2563EB"
      />
    </div>
  )
}
