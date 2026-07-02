'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { Clock, CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react'
import { IncomingDeliveryTable } from './_components/IncomingDeliveryTable'
import { AnomalyPanel } from './_components/AnomalyPanel'
import type { IncomingDelivery, AnomalyRecord } from './_components/types'
import { MOCK_DELIVERIES } from './_components/types'

export default function LoadoutQaqcPage() {
  const [deliveries, setDeliveries] = useState<IncomingDelivery[]>(MOCK_DELIVERIES)
  const [selected, setSelected]     = useState<IncomingDelivery | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const today = new Date().toISOString().slice(0, 10)

  const stats = useMemo(() => ({
    pending:    deliveries.filter(d => d.status === 'Pending').length,
    inspecting: deliveries.filter(d => d.status === 'Inspecting').length,
    passedToday: deliveries.filter(d => d.status === 'Passed' && d.inspectedAt?.startsWith(today)).length,
    anomalyCount: deliveries.reduce((sum, d) => sum + d.anomalies.length, 0),
    rejected:   deliveries.filter(d => d.status === 'Rejected' || d.status === 'Quarantined').length,
  }), [deliveries, today])

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return deliveries
    return deliveries.filter(d => d.status === statusFilter)
  }, [deliveries, statusFilter])

  function handlePass(id: string) {
    setDeliveries(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: 'Passed', inspectedBy: 'Femi Emmanuel', inspectedAt: new Date().toISOString() }
        : d
    ))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'Passed', inspectedBy: 'Femi Emmanuel', inspectedAt: new Date().toISOString() } : null)
  }

  function handleReject(id: string, _reason: string) {
    setDeliveries(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: 'Rejected', inspectedBy: 'Femi Emmanuel', inspectedAt: new Date().toISOString(), notes: _reason }
        : d
    ))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'Rejected', inspectedBy: 'Femi Emmanuel', inspectedAt: new Date().toISOString() } : null)
  }

  function handleQuarantine(id: string, _reason: string) {
    setDeliveries(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: 'Quarantined', inspectedBy: 'Femi Emmanuel', inspectedAt: new Date().toISOString(), notes: _reason }
        : d
    ))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: 'Quarantined', inspectedBy: 'Femi Emmanuel', inspectedAt: new Date().toISOString() } : null)
  }

  function handleAddAnomaly(deliveryId: string, anomaly: Omit<AnomalyRecord, 'id' | 'recordedAt' | 'recordedBy'>) {
    const newAnomaly: AnomalyRecord = {
      ...anomaly,
      id: 'ANM-' + Date.now(),
      recordedAt: new Date().toISOString(),
      recordedBy: 'Femi Emmanuel',
    }
    setDeliveries(prev => prev.map(d =>
      d.id === deliveryId
        ? { ...d, anomalies: [...d.anomalies, newAnomaly], status: d.status === 'Pending' ? 'Inspecting' : d.status }
        : d
    ))
    setSelected(prev =>
      prev?.id === deliveryId
        ? { ...prev, anomalies: [...prev.anomalies, newAnomaly], status: prev.status === 'Pending' ? 'Inspecting' : prev.status }
        : prev
    )
  }

  const FILTERS = ['All', 'Pending', 'Inspecting', 'Passed', 'Rejected', 'Quarantined']

  return (
    <AppShell
      role="loadout_qaqc"
      currentPath="/qaqc/loadout"
      title="Loadout QAQC"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC' }, { label: 'Loadout QAQC' }]}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Inspection" value={stats.pending}    color="#F59E0B" icon={Clock} />
        <StatCard label="In Inspection"       value={stats.inspecting} color="#F59E0B" icon={AlertTriangle} />
        <StatCard label="Passed Today"         value={stats.passedToday} color="#22C55E" icon={CheckCircle2} />
        <StatCard label="Rejected / Quarantined" value={stats.rejected} color="#EF4444" icon={XCircle} />
      </div>

      {/* Anomaly count banner */}
      {stats.anomalyCount > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <AlertTriangle size={15} className="shrink-0 text-amber-600" />
          <span><span className="font-semibold">{stats.anomalyCount} anomalies</span> recorded across all deliveries. Review and action each before passing containers to fleet.</span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
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
            {f !== 'All' && (
              <span className="ml-1.5 text-[10px] opacity-70">
                ({deliveries.filter(d => d.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <IncomingDeliveryTable
        deliveries={filtered}
        selectedId={selected?.id ?? null}
        onSelect={setSelected}
      />

      {/* Panel */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelected(null)} />
          <AnomalyPanel
            delivery={selected}
            onClose={() => setSelected(null)}
            onPass={handlePass}
            onReject={handleReject}
            onQuarantine={handleQuarantine}
            onAddAnomaly={handleAddAnomaly}
          />
        </>
      )}
    </AppShell>
  )
}
