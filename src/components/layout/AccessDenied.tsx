import Link from 'next/link'
import { ShieldOff } from 'lucide-react'
import type { Role } from '@/lib/lifecycle'
import { ROLE_LABEL, ROLE_ROUTE } from '@/lib/lifecycle'

interface Props {
  sessionRole: Role | null
  allowedRoles: Role[]
}

export function AccessDenied({ sessionRole, allowedRoles }: Props) {
  const home = sessionRole ? ROLE_ROUTE[sessionRole] : '/login'

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center p-6">
      <div className="bg-white border border-border-default rounded-xl shadow-card p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <ShieldOff size={26} className="text-brand-500" />
        </div>
        <h1 className="text-[20px] font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-1">
          {sessionRole
            ? `Your role (${ROLE_LABEL[sessionRole]}) does not have permission to view this page.`
            : 'You must be logged in to view this page.'}
        </p>
        {allowedRoles.length > 0 && (
          <p className="text-[12px] text-gray-400 mb-6">
            This page is restricted to: {allowedRoles.map(r => ROLE_LABEL[r]).join(', ')}.
          </p>
        )}
        <div className="flex flex-col gap-2">
          <Link
            href={home}
            className="block w-full py-2.5 bg-brand-500 text-white text-[13px] font-semibold rounded-lg hover:bg-brand-600 transition-colors"
          >
            Go to My Dashboard
          </Link>
          <Link
            href="/login"
            className="block w-full py-2.5 border border-border-default text-gray-600 text-[13px] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Switch Role
          </Link>
        </div>
      </div>
    </div>
  )
}
