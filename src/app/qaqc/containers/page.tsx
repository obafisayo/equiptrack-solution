'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { type CCUContainer, INIT_CONTAINERS, getExpiryState } from './_components/types'
import { ContainerStats } from './_components/ContainerStats'
import { FilterBar } from './_components/FilterBar'
import { ContainerTable } from './_components/ContainerTable'
import { ContainerDetailPanel } from './_components/ContainerDetailPanel'
import { RegisterContainerPanel } from './_components/RegisterContainerPanel'

export default function ContainerFleetPage() {
  const [containers, setContainers] = useState<CCUContainer[]>(INIT_CONTAINERS)
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('all')
  const [expiryFilter, setExpiryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detail,       setDetail]       = useState<CCUContainer | null>(null)

  // Register panel
  const [regOpen, setRegOpen] = useState(false)

  // KPIs
  const total     = containers.length
  const available = containers.filter(c => c.status === 'Available').length
  const locked    = containers.filter(c => getExpiryState(c.inspectionExpiry) === 'locked').length
  const expired   = containers.filter(c => getExpiryState(c.inspectionExpiry) === 'expired').length

  const filtered = useMemo(() => containers.filter(c => {
    if (search) {
      const q = search.toLowerCase()
      if (!c.serialNumber.toLowerCase().includes(q) && !c.type.toLowerCase().includes(q) && !(c.owner ?? '').toLowerCase().includes(q)) return false
    }
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (expiryFilter !== 'all' && getExpiryState(c.inspectionExpiry) !== expiryFilter) return false
    return true
  }), [containers, search, typeFilter, expiryFilter, statusFilter])

  function toggle(sn: string) {
    setContainers(prev => prev.map(c => c.serialNumber === sn ? { ...c, available: !c.available } : c))
    if (detail?.serialNumber === sn) setDetail(p => p ? { ...p, available: !p.available } : null)
  }

  function handleRegister(container: CCUContainer) {
    setContainers(prev => [container, ...prev])
  }

  return (
    <AppShell role="qaqc" currentPath="/qaqc/containers" title="Fleet Management"
      breadcrumb={[{ label: 'QAQC', href: '/qaqc' }, { label: 'CCU Fleet Management' }]}>

      <ContainerStats total={total} available={available} locked={locked} expired={expired} />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">CCU Fleet Management</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {total} total containers &bull; {available} available &bull; {locked} locked &bull; {expired} expired
          </p>
        </div>
        <Button variant="brand" size="sm" icon={<Plus size={13} />} onClick={() => setRegOpen(true)}>
          Register New CCU
        </Button>
      </div>

      <FilterBar
        search={search} onSearchChange={setSearch}
        typeFilter={typeFilter} onTypeFilterChange={setTypeFilter}
        expiryFilter={expiryFilter} onExpiryFilterChange={setExpiryFilter}
        statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
        filteredCount={filtered.length}
        onClear={() => { setSearch(''); setTypeFilter('all'); setExpiryFilter('all'); setStatusFilter('all') }}
      />

      <ContainerTable containers={filtered} onSelect={setDetail} onToggleAvailable={toggle} />

      {detail && (
        <ContainerDetailPanel detail={detail} onClose={() => setDetail(null)} onToggleAvailable={toggle} />
      )}

      {regOpen && (
        <RegisterContainerPanel onClose={() => setRegOpen(false)} onRegister={handleRegister} />
      )}
    </AppShell>
  )
}
