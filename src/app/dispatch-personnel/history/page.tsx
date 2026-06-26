'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { StagePill } from '@/components/domain/Pills'
import { Card } from '@/components/ui/Card'
import { WORK_ORDERS } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'

const MY_ID = 'DP1'

const COMPLETED_STAGES = ['Shipped', 'Completed', 'Awaiting Deckspace']

export default function DispatchPersonnelHistoryPage() {
  const [search, setSearch] = useState('')

  const history = WORK_ORDERS.filter(o =>
    COMPLETED_STAGES.includes(o.stage) &&
    o.stageHistory.some(h => h.personId === MY_ID)
  )

  const filtered = history.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.destination.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell
      role="dsp_per"
      currentPath="/dispatch-personnel/history"
      title="My History"
      breadcrumb={[{ label: 'My Tasks', href: '/dispatch-personnel' }]}
      search={{ placeholder: 'Search history...', value: search, onChange: setSearch }}
    >
      <SectionTitle title="Completed Dispatch Tasks" count={filtered.length} />

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">No completed tasks found.</div>
      )}

      <div className="mt-4 space-y-3">
        {filtered.map(o => {
          const myStages = o.stageHistory.filter(h => h.personId === MY_ID)
          return (
            <Card key={o.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <StagePill stage={o.stage} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500 mt-1">{o.requestType} Â· {o.urgency}</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{new Date(o.createdAt).toLocaleDateString('en-GB')}</p>
                  <p className="font-medium text-gray-700 mt-0.5">
                    {fmtHours(o.totalElapsedHours)} total
                  </p>
                </div>
              </div>

              {myStages.length > 0 && (
                <div className="mt-3 border-t border-border-default pt-3 space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">My Stages</p>
                  {myStages.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700">{h.stage}</span>
                      <span className="text-gray-500">{h.durationHours != null ? fmtHours(h.durationHours) : 'â€”'}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </AppShell>
  )
}
