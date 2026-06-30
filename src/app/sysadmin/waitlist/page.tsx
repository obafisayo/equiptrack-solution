'use client'

import { useState } from 'react'
import { WAITLIST } from '@/lib/mock-platform'
import type { WaitlistEntry } from '@/lib/types'
import { ApproveModal } from './_components/ApproveModal'
import { RejectModal } from './_components/RejectModal'
import { StatCardsRow } from './_components/StatCardsRow'
import { FilterBar, type StatusFilter, type PriorityFilter } from './_components/FilterBar'
import { WaitlistTable } from './_components/WaitlistTable'
import { Toast } from './_components/Toast'

export default function WaitlistPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [approveEntry, setApproveEntry] = useState<WaitlistEntry | null>(null)
  const [rejectEntry, setRejectEntry]   = useState<WaitlistEntry | null>(null)
  const [localStatus, setLocalStatus]   = useState<Record<string, WaitlistEntry['status']>>({})
  const [toast, setToast]               = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleApprove(note: string) {
    if (!approveEntry) return
    setLocalStatus(s => ({ ...s, [approveEntry.id]: 'approved' }))
    setApproveEntry(null)
    showToast(`Invitation sent to ${approveEntry.contactEmail}${note ? ' with note' : ''}.`)
  }

  function handleReject(_reason: string) {
    if (!rejectEntry) return
    setLocalStatus(s => ({ ...s, [rejectEntry.id]: 'rejected' }))
    setRejectEntry(null)
    showToast(`Application from ${rejectEntry.companyName} rejected.`)
  }

  const entries = WAITLIST.map(e => ({
    ...e,
    status: (localStatus[e.id] ?? e.status) as WaitlistEntry['status'],
  }))

  const filtered = entries.filter(e => {
    const matchSearch = !search ||
      e.companyName.toLowerCase().includes(search.toLowerCase()) ||
      e.contactEmail.toLowerCase().includes(search.toLowerCase()) ||
      e.industry.toLowerCase().includes(search.toLowerCase())
    const matchStatus   = statusFilter === 'all'   || e.status   === statusFilter
    const matchPriority = priorityFilter === 'all' || e.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const counts = {
    pending:   entries.filter(e => e.status === 'pending').length,
    approved:  entries.filter(e => e.status === 'approved').length,
    rejected:  entries.filter(e => e.status === 'rejected').length,
    converted: entries.filter(e => e.status === 'converted').length,
  }

  return (
    <>
      {approveEntry && (
        <ApproveModal entry={approveEntry} onConfirm={handleApprove} onCancel={() => setApproveEntry(null)} />
      )}
      {rejectEntry && (
        <RejectModal entry={rejectEntry} onConfirm={handleReject} onCancel={() => setRejectEntry(null)} />
      )}

      {toast && <Toast message={toast} />}

      <div className="space-y-5">
        <StatCardsRow counts={counts} />

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        <WaitlistTable entries={filtered} onApprove={setApproveEntry} onReject={setRejectEntry} />
      </div>
    </>
  )
}
