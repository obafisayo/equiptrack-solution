'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserPlus, Users, Clock, ShieldCheck } from 'lucide-react'
import { ROLES, ROLE_LABEL, type OrgRole } from '@/lib/domain/roles'
import { listMembers, inviteMember, updateMember, type Member } from '@/lib/api/members'
import { ApiError } from '@/lib/api/client'
import { useCurrentUser } from '@/hooks/useCurrentUser'

/** Roles an org admin can assign (everything except the platform-level sysadmin). */
const ASSIGNABLE: OrgRole[] = ROLES.filter((r): r is OrgRole => r !== 'sysadmin')

const STATUS_STYLE: Record<Member['status'], string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  invited: 'bg-blue-50 text-blue-700 border-blue-200',
  suspended: 'bg-neutral-100 text-neutral-500 border-neutral-200',
}

function fmtDate(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
}

/**
 * Real organisation team management backed by the EquipTrack API
 * (GET/POST /api/org/members, PATCH /api/org/members/{id}).
 * `compact` renders the summary used on the admin overview.
 */
export function LiveTeam({ compact = false }: { compact?: boolean }) {
  const { me } = useCurrentUser()
  const [members, setMembers] = useState<Member[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<OrgRole>('requester')
  const [inviting, setInviting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setMembers(await listMembers())
      setError(null)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load your team.')
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const counts = useMemo(() => ({
    active: members?.filter(m => m.status === 'active').length ?? 0,
    invited: members?.filter(m => m.status === 'invited').length ?? 0,
    suspended: members?.filter(m => m.status === 'suspended').length ?? 0,
  }), [members])

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    setError(null)
    setNotice(null)
    try {
      const m = await inviteMember({ email: email.trim(), name: name.trim(), role })
      setNotice(`${m.name} invited as ${ROLE_LABEL[role]}. Ask them to sign up at /auth/sign-up with ${m.email}.`)
      setEmail('')
      setName('')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send the invitation.')
    } finally {
      setInviting(false)
    }
  }

  async function change(m: Member, update: { role?: OrgRole; status?: 'active' | 'suspended' }) {
    setBusyId(m.id)
    setError(null)
    setNotice(null)
    try {
      await updateMember(m.id, update)
      setNotice(update.status
        ? `${m.name} is now ${update.status}.`
        : `${m.name} is now ${ROLE_LABEL[update.role!]}.`)
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update this member.')
    } finally {
      setBusyId(null)
    }
  }

  const card = 'bg-white border border-[#E2E8F0] rounded-lg shadow-sm'

  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active members', value: counts.active, icon: Users, color: '#16A34A' },
          { label: 'Pending invitations', value: counts.invited, icon: Clock, color: '#2563EB' },
          { label: 'Suspended', value: counts.suspended, icon: ShieldCheck, color: '#64748B' },
        ].map(s => (
          <div key={s.label} className={`${card} p-4 flex items-center gap-3`}>
            <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}14`, color: s.color }}>
              <s.icon size={18} />
            </span>
            <div>
              <p className="text-2xl font-bold text-neutral-900 m-0">{members ? s.value : '–'}</p>
              <p className="text-xs text-neutral-500 m-0">{s.label}</p>
            </div>
          </div>
        ))}
        {error && <p className="sm:col-span-3 text-[13px] text-red-700 m-0">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Invite */}
      <form onSubmit={invite} className={`${card} p-5`}>
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={16} className="text-brand-500" />
          <h2 className="text-sm font-bold text-neutral-900 m-0">Invite a team member</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="et-input" type="email" placeholder="Work email" value={email}
            onChange={e => setEmail(e.target.value)} required aria-label="Email" />
          <input className="et-input" placeholder="Full name" value={name}
            onChange={e => setName(e.target.value)} required maxLength={200} aria-label="Full name" />
          <select className="et-input" value={role} onChange={e => setRole(e.target.value as OrgRole)} aria-label="Role">
            {ASSIGNABLE.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </select>
          <button type="submit" className="et-btn-dark" disabled={inviting}>
            {inviting ? 'Inviting…' : 'Send invitation'}
          </button>
        </div>
        <p className="text-[12px] text-neutral-500 mt-3 mb-0">
          They sign up with this exact email and verify it; access is granted automatically. The role decides what they can see and do.
        </p>
      </form>

      {notice && <p role="status" className="text-[13px] text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2 m-0">{notice}</p>}
      {error && <p role="alert" className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 m-0">{error}</p>}

      {/* Members */}
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-neutral-500 border-b border-[#E2E8F0]">
              <th className="px-4 py-3 font-semibold">Member</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Invited</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members === null && !error && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-400">Loading team…</td></tr>
            )}
            {members?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-400">No members yet. Invite your first team member above.</td></tr>
            )}
            {members?.map(m => {
              const isMe = m.userId !== null && m.userId === me?.userId
              return (
                <tr key={m.id} className="border-b border-[#F1F5F9] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-neutral-900 m-0">{m.name}{isMe && <span className="text-neutral-400 font-normal"> (you)</span>}</p>
                    <p className="text-xs text-neutral-500 m-0">{m.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {isMe ? ROLE_LABEL[m.role as OrgRole] ?? m.role : (
                      <select className="et-input !h-8 !py-0 text-[13px]" value={m.role} disabled={busyId === m.id}
                        onChange={e => change(m, { role: e.target.value as OrgRole })} aria-label={`Role for ${m.name}`}>
                        {ASSIGNABLE.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[m.status]}`}>{m.status}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{fmtDate(m.invitedAt)}</td>
                  <td className="px-4 py-3 text-neutral-600">{fmtDate(m.joinedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {!isMe && m.status !== 'suspended' && (
                      <button type="button" disabled={busyId === m.id} onClick={() => change(m, { status: 'suspended' })}
                        className="text-[12px] font-semibold text-red-600 bg-transparent border-none cursor-pointer hover:text-red-700">
                        Suspend
                      </button>
                    )}
                    {!isMe && m.status === 'suspended' && m.userId && (
                      <button type="button" disabled={busyId === m.id} onClick={() => change(m, { status: 'active' })}
                        className="text-[12px] font-semibold text-brand-500 bg-transparent border-none cursor-pointer hover:text-brand-600">
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
