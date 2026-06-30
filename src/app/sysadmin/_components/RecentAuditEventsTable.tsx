'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { AuditEvent } from '@/lib/types'
import { relativeTime, actionIcon, TARGET_TYPE_STYLE } from './styleMaps'

interface RecentAuditEventsTableProps {
  events: AuditEvent[]
}

export function RecentAuditEventsTable({ events }: RecentAuditEventsTableProps) {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-neutral-50">
        <div>
          <p className="text-sm font-bold text-neutral-900">Recent Audit Events</p>
          <p className="text-xs text-neutral-500 mt-0.5">Last 6 platform actions</p>
        </div>
        <Link href="/sysadmin/audit" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline flex items-center gap-1">
          Full log <ChevronRight size={12}/>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              {['Time', 'Actor', 'Action', 'Target', 'IP Address'].map(h => (
                <th key={h} className="text-left whitespace-nowrap px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {events.map(event => {
              const ttClass = TARGET_TYPE_STYLE[event.targetType] ?? TARGET_TYPE_STYLE.org
              return (
                <tr key={event.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap" title={new Date(event.createdAt).toLocaleString()}>
                    {relativeTime(event.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-xs">{event.actorName}</span>
                      <span className="bg-neutral-100 text-neutral-600 text-[10px] font-bold px-1.5 py-0.5 rounded-badge">
                        {event.actorRole}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <code className="text-[11px] font-mono text-neutral-700 bg-neutral-50 px-1.5 py-0.5 rounded border border-border-default">
                      {event.action}
                    </code>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={['inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0', ttClass].join(' ')}>
                        {actionIcon(event)}
                      </span>
                      <span className="text-neutral-700 text-xs truncate max-w-40">{event.targetLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 font-mono text-[11px] whitespace-nowrap">
                    {event.ipAddress ?? '-'}
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
