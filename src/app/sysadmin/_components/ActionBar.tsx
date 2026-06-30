'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export function ActionBar() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-bold text-neutral-900">Platform Overview</h1>
        <p className="text-xs text-neutral-500 mt-0.5">System-wide health and activity</p>
      </div>
      <Link
        href="/sysadmin/organisations?action=onboard"
        className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3.5 h-9 rounded-lg no-underline transition-colors"
      >
        <Plus size={13}/>
        Onboard Organisation
      </Link>
    </div>
  )
}
