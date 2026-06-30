'use client'

import { INSPECTIONS } from './mockData'
import { INS_CLASS } from './styleMaps'

export function InspectionsTab() {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b border-border-default">
          <tr>
            {['ID','Equipment','Category','Inspector','Last Checked','Next Due','Status','Findings'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {INSPECTIONS.map(ins => {
            const sc = INS_CLASS[ins.status]
            const isUrgent = ins.status === 'failed' || ins.status === 'overdue'
            return (
              <tr key={ins.id} className={`hover:bg-neutral-50 transition-colors ${isUrgent ? 'bg-red-50/30' : ''}`}>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-neutral-500">{ins.id}</td>
                <td className="px-4 py-3 font-semibold text-neutral-900">{ins.equipment}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{ins.category}</td>
                <td className="px-4 py-3 text-xs text-neutral-700">{ins.inspector}</td>
                <td className="px-4 py-3 text-xs text-neutral-500">{ins.lastDate}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={isUrgent ? 'text-red-600 font-bold' : 'text-neutral-500'}>{ins.nextDate}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>
                    {sc.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500 max-w-48 truncate">{ins.findings ?? '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
