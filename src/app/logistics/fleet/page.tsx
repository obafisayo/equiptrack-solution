'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { FLEET_VESSELS, getDocExpiryState, type FleetVessel } from './_components/types'
import { FleetStats } from './_components/FleetStats'
import { FilterBar } from './_components/FilterBar'
import { VesselTable } from './_components/VesselTable'
import { VesselDetailPanel } from './_components/VesselDetailPanel'

export default function VesselFleetPage() {
  const [vessels] = useState<FleetVessel[]>(FLEET_VESSELS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detail, setDetail] = useState<FleetVessel | null>(null)

  const total       = vessels.length
  const active      = vessels.filter(v => v.status === 'Active').length
  const inDrydock   = vessels.filter(v => v.status === 'Drydock' || v.status === 'Maintenance').length
  const docsExpiring = vessels.filter(v =>
    v.documents.some(d => {
      const s = getDocExpiryState(d.expiryDate)
      return s === 'expired' || s === 'critical' || s === 'warning'
    })
  ).length

  const filtered = useMemo(() => vessels.filter(v => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !v.name.toLowerCase().includes(q) &&
        !v.imoNumber.toLowerCase().includes(q) &&
        !v.owner.toLowerCase().includes(q) &&
        !v.currentLocation.toLowerCase().includes(q)
      ) return false
    }
    if (typeFilter !== 'all' && v.type !== typeFilter) return false
    if (statusFilter !== 'all' && v.status !== statusFilter) return false
    return true
  }), [vessels, search, typeFilter, statusFilter])

  function clearFilters() {
    setSearch('')
    setTypeFilter('all')
    setStatusFilter('all')
  }

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics/fleet"
      title="Vessel Fleet"
      breadcrumb={[{ label: 'Logistics', href: '/logistics' }, { label: 'Vessel Fleet' }]}
    >
      <FleetStats
        total={total}
        active={active}
        inDrydock={inDrydock}
        docsExpiring={docsExpiring}
      />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Vessel Fleet Management</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {total} vessels registered · {active} currently active at sea
          </p>
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        filteredCount={filtered.length}
        onClear={clearFilters}
      />

      <VesselTable vessels={filtered} onSelect={setDetail} />

      {detail && (
        <VesselDetailPanel vessel={detail} onClose={() => setDetail(null)} />
      )}
    </AppShell>
  )
}
