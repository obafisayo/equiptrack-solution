'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { Plus, Clock, CheckCircle2, MessageSquare, Package, AlertTriangle } from 'lucide-react'
import { MOCK_REQUESTS, REQUEST_STATUS_BADGE, type ContainerRequest, type RequestStatus } from './_components/types'
import { NewRequestDialog } from './_components/NewRequestDialog'
import { ResponseDialog } from './_components/ResponseDialog'

export default function CCURequestsPage() {
  const [requests, setRequests]       = useState<ContainerRequest[]>(MOCK_REQUESTS)
  const [showNew, setShowNew]         = useState(false)
  const [responseId, setResponseId]   = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const stats = useMemo(() => ({
    total:     requests.length,
    sent:      requests.filter(r => r.status === 'Sent' || r.status === 'Awaiting Response').length,
    completed: requests.filter(r => r.status === 'Completed').length,
    pending:   requests.filter(r => r.status === 'Awaiting Response').length,
  }), [requests])

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return requests
    return requests.filter(r => r.status === statusFilter)
  }, [requests, statusFilter])

  function handleNewRequest(req: Omit<ContainerRequest, 'id' | 'createdAt' | 'auditLog'>) {
    const newReq: ContainerRequest = {
      ...req,
      id: 'REQ-CCU-' + String(requests.length + 1).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      auditLog: [
        { timestamp: new Date().toISOString(), action: 'Request created', performedBy: 'Femi Emmanuel' },
        { timestamp: new Date().toISOString(), action: 'Request sent to contractor', performedBy: 'Femi Emmanuel' },
      ],
    }
    setRequests(prev => [newReq, ...prev])
    setShowNew(false)
  }

  function handleResponseConfirm(updated: ContainerRequest) {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r))
    setResponseId(null)
  }

  const responseRequest = responseId ? requests.find(r => r.id === responseId) : null

  const STATUS_FILTERS: RequestStatus[] = ['Sent', 'Awaiting Response', 'Partially Accepted', 'Completed', 'Rejected']

  return (
    <AppShell
      role="qaqc"
      currentPath="/qaqc/ccu-requests"
      title="CCU Container Requests"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC' }, { label: 'CCU Requests' }]}
      actions={
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
        >
          <Plus size={14} />
          New Request
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Requests"    value={stats.total}     color="#10B981" icon={Package} />
        <StatCard label="Sent / In Progress" value={stats.sent}     color="#F59E0B" icon={MessageSquare} />
        <StatCard label="Awaiting Response" value={stats.pending}   color="#F59E0B" icon={Clock} />
        <StatCard label="Completed"          value={stats.completed} color="#22C55E" icon={CheckCircle2} />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['All', ...STATUS_FILTERS] as const).map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={[
              'text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors duration-150',
              statusFilter === f
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-border-default hover:bg-gray-50',
            ].join(' ')}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Request list */}
      <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border-default">
            <tr>
              {['Request ID', 'Contractor', 'CCU Types', 'Status', 'Created By', 'Date', 'Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">No requests</td></tr>
            )}
            {filtered.map(req => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-[12px] font-semibold text-gray-800">{req.id}</td>
                <td className="px-4 py-3 text-[13px] text-gray-700">{req.contractorName}</td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    {req.lineItems.map((li, i) => (
                      <p key={i} className="text-[11px] text-gray-600">{li.quantity}× {li.type}</p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${REQUEST_STATUS_BADGE[req.status]}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-600">{req.createdBy}</td>
                <td className="px-4 py-3 text-[12px] text-gray-500">{req.createdAt.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  {(req.status === 'Sent' || req.status === 'Awaiting Response') && (
                    <button
                      onClick={() => setResponseId(req.id)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 transition-colors"
                    >
                      Record Response
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Anti-gaming notice */}
      <div className="mt-4 flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-800">
        <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
        <span>
          <strong>System integrity:</strong> Request messages are auto-composed and locked once sent. Billing starts only after Loadout QAQC physically inspects and passes each container. Serial numbers must be unique system-wide.
        </span>
      </div>

      {/* Dialogs */}
      {showNew && (
        <NewRequestDialog
          onConfirm={handleNewRequest}
          onClose={() => setShowNew(false)}
        />
      )}
      {responseRequest && (
        <ResponseDialog
          request={responseRequest}
          onConfirm={handleResponseConfirm}
          onClose={() => setResponseId(null)}
        />
      )}
    </AppShell>
  )
}
