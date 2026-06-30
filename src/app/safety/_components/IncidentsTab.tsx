'use client'

import { Filter, X, MapPin, User, Calendar, ArrowRight } from 'lucide-react'
import { Select } from '@/components/ui/Form'
import { SEV_CLASS, STATUS_CLASS } from './styleMaps'
import { SEV_OPTIONS, SEV_LABELS } from './mockData'
import type { Incident } from './types'

interface IncidentsTabProps {
  incidents: Incident[]
  filterSev: string
  filterStatus: string
  onFilterSevChange: (value: string) => void
  onFilterStatusChange: (value: string) => void
  onClearFilters: () => void
  onSelectIncident: (incident: Incident) => void
}

export function IncidentsTab({
  incidents,
  filterSev,
  filterStatus,
  onFilterSevChange,
  onFilterStatusChange,
  onClearFilters,
  onSelectIncident,
}: IncidentsTabProps) {
  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
          <Filter size={13}/> Filter:
        </div>
        <Select
          aria-label="Filter by severity"
          value={filterSev}
          onChange={e => onFilterSevChange(e.target.value)}
          size="sm"
        >
          <option value="all">All Severities</option>
          {SEV_OPTIONS.map(s => <option key={s} value={s}>{SEV_LABELS[s]}</option>)}
        </Select>
        <Select
          aria-label="Filter by status"
          value={filterStatus}
          onChange={e => onFilterStatusChange(e.target.value)}
          size="sm"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="escalated">Escalated</option>
          <option value="closed">Closed</option>
        </Select>
        {(filterSev !== 'all' || filterStatus !== 'all') && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-brand-500 font-semibold hover:text-brand-600"
          >
            <X size={12}/> Clear
          </button>
        )}
        <span className="text-xs text-neutral-400 ml-auto">{incidents.length} record{incidents.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              {['ID','Type','Location','Severity','Reported By','Date','Status',''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {incidents.map(inc => {
              const sv = SEV_CLASS[inc.severity]
              const st = STATUS_CLASS[inc.status]
              return (
                <tr
                  key={inc.id}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => onSelectIncident(inc)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-bold text-brand-500">{inc.id}</td>
                  <td className="px-4 py-3 font-medium text-neutral-900 whitespace-nowrap">{inc.type}</td>
                  <td className="px-4 py-3 text-neutral-600 text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-neutral-400 shrink-0"/>{inc.location}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border capitalize ${sv.badge}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-700 text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <User size={11} className="text-neutral-400 shrink-0"/>{inc.reportedBy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-neutral-400 shrink-0"/>{inc.date}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${st.badge}`}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ArrowRight size={14} className="text-neutral-300"/>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {incidents.length === 0 && (
          <div className="py-12 text-center text-neutral-400 text-sm">No incidents match the selected filters.</div>
        )}
      </div>
    </div>
  )
}
