'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ORGANISATIONS } from '@/lib/mock-platform'
import { OnboardingWizard } from './_components/OnboardingWizard'
import { ConfirmModal } from './_components/ConfirmModal'
import { SearchAndAddBar } from './_components/SearchAndAddBar'
import { FilterTabs, type FilterTab } from './_components/FilterTabs'
import { OrganisationsTable } from './_components/OrganisationsTable'

function OrganisationsPageInner() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [showPanel, setShowPanel] = useState(false)
  const [confirmFor, setConfirmFor] = useState<{ id: string; action: 'suspend' | 'activate' } | null>(null)
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (searchParams.get('action') === 'onboard') setShowPanel(true)
  }, [searchParams])

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all',        label: 'All',        count: ORGANISATIONS.length },
    { key: 'active',     label: 'Active',     count: ORGANISATIONS.filter(o => o.status === 'active').length },
    { key: 'onboarding', label: 'Onboarding', count: ORGANISATIONS.filter(o => o.status === 'onboarding').length },
    { key: 'trialing',   label: 'Trialing',   count: ORGANISATIONS.filter(o => o.subscription.status === 'trialing').length },
    { key: 'suspended',  label: 'Suspended',  count: ORGANISATIONS.filter(o => o.status === 'suspended').length },
  ]

  const filtered = ORGANISATIONS.filter(org => {
    const matchSearch = !search ||
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.adminEmail.toLowerCase().includes(search.toLowerCase())
    const matchTab =
      activeTab === 'all' ? true :
      activeTab === 'trialing' ? org.subscription.status === 'trialing' :
      org.status === activeTab
    return matchSearch && matchTab
  })

  function handleConfirm() {
    if (!confirmFor) return
    if (confirmFor.action === 'suspend') {
      setSuspendedIds(s => { const n = new Set(s); n.add(confirmFor.id); return n })
    } else {
      setSuspendedIds(s => { const n = new Set(s); n.delete(confirmFor.id); return n })
    }
    setConfirmFor(null)
  }

  const confirmOrg = confirmFor ? ORGANISATIONS.find(o => o.id === confirmFor.id) : null

  return (
    <>
      {showPanel && <OnboardingWizard onClose={() => setShowPanel(false)} />}

      {confirmFor && confirmOrg && (
        <ConfirmModal
          orgName={confirmOrg.name}
          action={confirmFor.action}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmFor(null)}
        />
      )}

      <div className="space-y-5">
        <SearchAndAddBar search={search} onSearchChange={setSearch} onAddClick={() => setShowPanel(true)} />

        <FilterTabs tabs={tabs} active={activeTab} onSelect={setActiveTab} />

        <OrganisationsTable
          organisations={filtered}
          suspendedIds={suspendedIds}
          onToggleSuspend={(id, action) => setConfirmFor({ id, action })}
        />
      </div>
    </>
  )
}

export default function OrganisationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400 text-sm">Loading...</div>}>
      <OrganisationsPageInner />
    </Suspense>
  )
}
