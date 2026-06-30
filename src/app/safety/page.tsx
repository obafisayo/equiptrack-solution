/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { SafetyKpiStrip } from './_components/SafetyKpiStrip'
import { SafetyActionBar } from './_components/SafetyActionBar'
import { TabBar } from './_components/TabBar'
import { IncidentsTab } from './_components/IncidentsTab'
import { InspectionsTab } from './_components/InspectionsTab'
import { PTWTab } from './_components/PTWTab'
import { IncidentDetailPanel } from './_components/IncidentDetailPanel'
import { ReportIncidentPanel } from './_components/ReportIncidentPanel'
import { INIT_INCIDENTS, INSPECTIONS, PTWS } from './_components/mockData'
import type { Incident, IncStatus, Tab } from './_components/types'

export default function SafetyDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>(INIT_INCIDENTS)
  const [tab, setTab]             = useState<Tab>('incidents')

  // Filters
  const [filterSev,    setFilterSev]    = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Detail panel
  const [detailInc, setDetailInc] = useState<Incident | null>(null)
  const [newStatus, setNewStatus] = useState<IncStatus>('open')

  // Report panel
  const [reportOpen, setReportOpen] = useState(false)

  // ── Derived ──────────────────────────────────────────────────────────────────

  const openCount     = incidents.filter(i => i.status === 'open').length
  const highCount     = incidents.filter(i => i.severity === 'high' || i.severity === 'critical').length
  const closedCount   = incidents.filter(i => i.status === 'closed').length
  const escalated     = incidents.filter(i => i.status === 'escalated').length
  const activeInspFail = INSPECTIONS.filter(i => i.status === 'failed' || i.status === 'overdue').length

  const filteredInc = useMemo(() => incidents.filter(i => {
    if (filterSev    !== 'all' && i.severity !== filterSev)    return false
    if (filterStatus !== 'all' && i.status   !== filterStatus) return false
    return true
  }), [incidents, filterSev, filterStatus])

  // ── Actions ───────────────────────────────────────────────────────────────────

  function updateStatus() {
    if (!detailInc) return
    setIncidents(prev => prev.map(i => i.id === detailInc.id ? { ...i, status: newStatus } : i))
    setDetailInc(prev => prev ? { ...prev, status: newStatus } : null)
  }

  function handleSelectIncident(incident: Incident) {
    setDetailInc(incident)
    setNewStatus(incident.status)
  }

  function handleSubmitReport(newInc: Incident) {
    setIncidents(prev => [newInc, ...prev])
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <AppShell
      role="safety"
      currentPath="/safety"
      title="Safety Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Safety' }]}
    >
      <SafetyKpiStrip
        openCount={openCount}
        highCount={highCount}
        closedCount={closedCount}
        escalated={escalated}
        activeInspFail={activeInspFail}
      />

      <SafetyActionBar onReportIncident={() => setReportOpen(true)} />

      <TabBar
        active={tab}
        incidentsCount={incidents.length}
        inspectionsCount={INSPECTIONS.length}
        ptwCount={PTWS.length}
        onSelect={setTab}
      />

      {tab === 'incidents' && (
        <IncidentsTab
          incidents={filteredInc}
          filterSev={filterSev}
          filterStatus={filterStatus}
          onFilterSevChange={setFilterSev}
          onFilterStatusChange={setFilterStatus}
          onClearFilters={() => { setFilterSev('all'); setFilterStatus('all') }}
          onSelectIncident={handleSelectIncident}
        />
      )}

      {tab === 'inspections' && <InspectionsTab />}

      {tab === 'ptw' && <PTWTab />}

      {detailInc && (
        <IncidentDetailPanel
          incident={detailInc}
          newStatus={newStatus}
          onStatusChange={setNewStatus}
          onUpdateStatus={updateStatus}
          onClose={() => setDetailInc(null)}
        />
      )}

      {reportOpen && (
        <ReportIncidentPanel
          incidentCount={incidents.length}
          onSubmit={handleSubmitReport}
          onClose={() => setReportOpen(false)}
        />
      )}
    </AppShell>
  )
}
