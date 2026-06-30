'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { WaitlistEntry } from '@/lib/types'
import { PRIORITY_STYLE } from './styleMaps'

interface PendingWaitlistCardProps {
  entries: WaitlistEntry[]
}

export function PendingWaitlistCard({ entries }: PendingWaitlistCardProps) {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden flex-1">
      <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
        <p className="text-sm font-bold text-neutral-900">Pending Waitlist</p>
        <Link href="/sysadmin/waitlist" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline flex items-center gap-1">
          View all <ArrowUpRight size={11}/>
        </Link>
      </div>
      <div className="divide-y divide-border-default">
        {entries.map(entry => {
          const priorityClass = PRIORITY_STYLE[entry.priority]
          return (
            <div key={entry.id} className="px-5 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{entry.companyName}</p>
                <p className="text-xs text-neutral-500">{entry.industry}</p>
              </div>
              <span className={['text-[10px] font-bold px-2 py-0.5 rounded-badge uppercase shrink-0', priorityClass].join(' ')}>
                {entry.priority}
              </span>
              <Link
                href="/sysadmin/waitlist"
                className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 border border-border-default hover:border-border-strong px-2 py-1 rounded-md no-underline shrink-0 transition-colors"
              >
                Review
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
