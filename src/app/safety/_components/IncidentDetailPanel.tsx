'use client'

import { X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SEV_CLASS, STATUS_CLASS } from './styleMaps'
import type { Incident, IncStatus } from './types'

interface IncidentDetailPanelProps {
  incident: Incident
  newStatus: IncStatus
  onStatusChange: (status: IncStatus) => void
  onUpdateStatus: () => void
  onClose: () => void
}

export function IncidentDetailPanel({
  incident,
  newStatus,
  onStatusChange,
  onUpdateStatus,
  onClose,
}: IncidentDetailPanelProps) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{incident.type}</p>
            <h2 className="text-base font-bold text-neutral-900">{incident.id}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border capitalize ${SEV_CLASS[incident.severity].badge}`}>
                {incident.severity}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${STATUS_CLASS[incident.status].badge}`}>
                {STATUS_CLASS[incident.status].label}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X size={17}/>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Date',         value: `${incident.date} ${incident.time}` },
              { label: 'Location',     value: incident.location },
              { label: 'Reported By',  value: incident.reportedBy },
              { label: 'Investigator', value: incident.investigator ?? 'Unassigned' },
              { label: 'Witnesses',    value: incident.witnesses ?? 'None recorded' },
              { label: 'Equipment',    value: incident.equipment ?? 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-neutral-50 rounded-lg p-3 border border-border-default">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-neutral-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Description</p>
            <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 rounded-lg p-3 border border-border-default">
              {incident.description}
            </p>
          </div>

          {/* Immediate action */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Immediate Actions Taken</p>
            <p className="text-sm text-neutral-700 leading-relaxed bg-green-50 rounded-lg p-3 border border-green-100">
              {incident.immediateAction}
            </p>
          </div>

          {/* Update status */}
          <div className="bg-white border border-border-default rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Update Status</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(['open','under_review','escalated','closed'] as IncStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStatusChange(s)}
                  className={[
                    'px-3 py-2 text-xs font-bold rounded-lg border transition-all',
                    newStatus === s
                      ? STATUS_CLASS[s].badge + ' ring-1 ring-current'
                      : 'border-border-default text-neutral-500 hover:bg-neutral-50',
                  ].join(' ')}
                >
                  {STATUS_CLASS[s].label}
                </button>
              ))}
            </div>
            <Button
              variant="brand"
              fullWidth
              size="sm"
              icon={<RefreshCw size={13}/>}
              onClick={onUpdateStatus}
              disabled={newStatus === incident.status}
            >
              Update Status
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
