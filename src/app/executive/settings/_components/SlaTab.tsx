'use client'

import { Input } from '@/components/ui/Form'

interface SlaTabProps {
  onSave: () => void
}

const DEPARTMENT_SLAS = [
  { dept: 'Warehouse (Processing to GI)', hours: 24 },
  { dept: 'Dispatch (Queue to Preload)', hours: 12 },
  { dept: 'QAQC (Preload to Post QAQC)', hours: 8 },
  { dept: 'Final (Waybill to Shipped)', hours: 24 },
]

export function SlaTab({ onSave }: SlaTabProps) {
  return (
    <div className="bg-white border border-border-default rounded-card shadow-sm animate-fade-in">
      <div className="px-6 py-5 border-b border-border-default">
        <h2 className="text-lg font-bold text-neutral-900 m-0">SLA & Alerts</h2>
        <p className="text-sm text-neutral-500 mt-1 m-0">Configure target cycle times and escalation rules for your operational workflows.</p>
      </div>
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Overall Target Cycle Time (Hours)</label>
          <Input type="number" defaultValue="72" size="sm" className="w-32" />
          <p className="text-xs text-neutral-500 mt-1">Total time from Request Submission to Shipped status.</p>
        </div>

        <div className="h-px bg-border-default my-2" />

        <h3 className="font-bold text-neutral-900 text-sm">Department-Level SLA Targets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEPARTMENT_SLAS.map(sla => (
            <div key={sla.dept} className="bg-neutral-50 border border-border-default rounded-lg p-4 flex justify-between items-center">
              <span className="text-sm font-semibold text-neutral-700">{sla.dept}</span>
              <div className="flex items-center gap-2">
                <Input type="number" defaultValue={sla.hours} size="sm" className="w-16 text-center" />
                <span className="text-xs text-neutral-500 font-bold">hrs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 bg-neutral-50 border-t border-border-default flex justify-end rounded-b-card">
        <button onClick={onSave} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-5 rounded-button text-sm transition-colors shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  )
}
