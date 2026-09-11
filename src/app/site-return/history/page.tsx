'use client'

import AppShell from '@/components/layout/AppShell'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { RETURN_REQUESTS } from '@/lib/return-store'
import { ReturnRequestCard } from '../_components/ReturnRequestCard'

export default function ReturnHistoryPage() {
  const all = [...RETURN_REQUESTS].reverse()
  const approved  = all.filter(r => r.status === 'approved' || r.status === 'in_transit' || r.status === 'returned')
  const pending   = all.filter(r => r.status === 'deckspace_requested')
  const rejected  = all.filter(r => r.status === 'rejected')

  return (
    <AppShell
      role="site_return"
      currentPath="/site-return/history"
      title="Return History"
      breadcrumb={[{ label: 'Returns', href: '/site-return' }, { label: 'History' }]}
    >
      {pending.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="Awaiting Deckspace" count={pending.length} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pending.map(r => <ReturnRequestCard key={r.id} request={r} />)}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="Approved / In Transit / Returned" count={approved.length} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {approved.map(r => <ReturnRequestCard key={r.id} request={r} />)}
          </div>
        </section>
      )}

      {rejected.length > 0 && (
        <section>
          <SectionTitle title="Rejected" count={rejected.length} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {rejected.map(r => <ReturnRequestCard key={r.id} request={r} />)}
          </div>
        </section>
      )}

      {all.length === 0 && (
        <p className="text-sm text-gray-400 py-12 text-center">No return requests yet.</p>
      )}
    </AppShell>
  )
}
