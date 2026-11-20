'use client'

import { apiFetch } from '@/lib/api/client'
import type { OrgRole } from '@/lib/domain/roles'

export interface Member {
  id: string
  email: string
  name: string
  role: string
  status: 'invited' | 'active' | 'suspended'
  userId: string | null
  invitedAt: string
  joinedAt: string | null
}

export function listMembers(role?: string): Promise<Member[]> {
  return apiFetch<Member[]>(`/api/org/members${role ? `?role=${encodeURIComponent(role)}` : ''}`)
}

export function inviteMember(input: { email: string; name: string; role: OrgRole }): Promise<Member> {
  return apiFetch<Member>('/api/org/members', { method: 'POST', body: JSON.stringify(input) })
}

export function updateMember(id: string, change: { role?: OrgRole; status?: 'active' | 'suspended' }): Promise<Member> {
  return apiFetch<Member>(`/api/org/members/${id}`, { method: 'PATCH', body: JSON.stringify(change) })
}
