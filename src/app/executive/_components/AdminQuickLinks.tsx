'use client'

import Link from 'next/link'
import { Users, Settings } from 'lucide-react'

export function AdminQuickLinks() {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-sm p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-sm font-bold text-neutral-900 m-0">Organization Administration</h2>
        <p className="text-xs text-neutral-500 m-0 mt-0.5">Manage your team, settings, and integrations</p>
      </div>
      <div className="flex gap-3">
        <Link href="/executive/users" className="bg-brand-50 text-brand-500 hover:bg-brand-100 px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors">
          <Users size={14} />
          User Management
        </Link>
        <Link href="/executive/settings" className="bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-border-default px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors">
          <Settings size={14} />
          Org Settings
        </Link>
      </div>
    </div>
  )
}
