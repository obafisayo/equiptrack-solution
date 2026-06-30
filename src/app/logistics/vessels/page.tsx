/* eslint-disable */
'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { VESSELS } from './_components/mockData'
import { KpiStrip } from './_components/KpiStrip'
import { RouteOverviewStrip } from './_components/RouteOverviewStrip'
import { StatusFilterBar } from './_components/StatusFilterBar'
import { VesselCard } from './_components/VesselCard'
import type { VesselStatus } from './_components/types'

export default function VesselSchedulePage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<VesselStatus | 'all'>('all')

  const shown = statusFilter === 'all' ? VESSELS : VESSELS.filter(v => v.status === statusFilter)

  const inTransit = VESSELS.filter(v => v.status === 'In Transit').length
  const docking = VESSELS.filter(v => v.status === 'Docking').length
  const loading = VESSELS.filter(v => v.status === 'Loading').length
  const urgent = VESSELS.filter(v => v.priority === 'urgent').length

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics/vessels"
      title="Vessel Schedule"
      breadcrumb={[
        { label: 'Logistics', href: '/logistics' },
        { label: 'Vessel Schedule' },
      ]}
    >
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <KpiStrip total={VESSELS.length} inTransit={inTransit} atPort={docking + loading} urgent={urgent} />

        <RouteOverviewStrip />

        <StatusFilterBar statusFilter={statusFilter} shownCount={shown.length} onSelect={setStatusFilter} />

        <div className="space-y-3">
          {shown.map(vessel => (
            <VesselCard
              key={vessel.id}
              vessel={vessel}
              isOpen={expanded === vessel.id}
              onToggle={() => setExpanded(expanded === vessel.id ? null : vessel.id)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
