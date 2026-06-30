'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { relativeTime, ORG_STATUS_STYLE, TIER_STYLE } from './styleMaps'

export function OrganisationHealthTable() {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border-default flex items-center justify-between bg-neutral-50">
        <div>
          <p className="text-sm font-bold text-neutral-900">Organisation Health</p>
          <p className="text-xs text-neutral-500 mt-0.5">All {ORGANISATIONS.length} organisations on platform</p>
        </div>
        <Link href="/sysadmin/organisations" className="text-xs font-semibold text-brand-500 hover:text-brand-600 no-underline flex items-center gap-1">
          Manage <ChevronRight size={12}/>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              {['Organisation', 'Tier', 'Status', 'Seats', 'MRR', 'Health', 'Last Active', ''].map(h => (
                <th key={h} className="text-left whitespace-nowrap px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {ORGANISATIONS.map(org => {
              const tierStyle   = TIER_STYLE[org.subscription.tier] ?? TIER_STYLE.starter
              const statusKey   = org.subscription.status === 'trialing' ? 'trialing' : org.status
              const statusClass = ORG_STATUS_STYLE[statusKey] ?? ORG_STATUS_STYLE.active
              const scoreColor  = org.healthScore >= 80 ? '#10B981' : org.healthScore >= 50 ? '#F59E0B' : '#EF4444'
              const mrr         = org.subscription.tier === 'enterprise' ? 1800 : org.subscription.tier === 'professional' ? 480 : 120

              return (
                <tr key={org.id} className="hover:bg-neutral-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-brand-500">
                          {org.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">{org.name}</p>
                        <p className="text-[10px] text-neutral-400">{org.industry}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={['text-[11px] font-bold px-2 py-0.5 rounded-badge', tierStyle.className].join(' ')}>
                      {tierStyle.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={['text-[11px] font-bold px-2 py-0.5 rounded-badge capitalize', statusClass].join(' ')}>
                      {statusKey}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-neutral-700 font-medium text-xs">
                    {org.subscription.seatsUsed}/{org.subscription.seats}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-bold text-neutral-900">
                    ${mrr}/mo
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: org.healthScore + '%', backgroundColor: scoreColor }}/>
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: scoreColor }}>{org.healthScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-400">
                    {relativeTime(org.createdAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={'/sysadmin/organisations/' + org.id}
                      className="text-xs font-semibold text-brand-500 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-md no-underline transition-colors"
                    >
                      Details
                    </Link>
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
