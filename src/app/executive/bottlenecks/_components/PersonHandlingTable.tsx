'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { fmtHours } from '@/config/sla'
import type { PersonStat } from './types'

interface PersonHandlingTableProps {
  personStats: PersonStat[]
}

export function PersonHandlingTable({ personStats }: PersonHandlingTableProps) {
  return (
    <section className="mb-8">
      <SectionTitle title="Avg Handling Time per Person (Top 10 Slowest)" />
      <div className="mt-3 bg-white border border-border-default rounded-card shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border-default">
            <tr>
              {['Person', 'Stages Handled', 'Avg Time per Stage', 'Note'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {personStats.map((p, i) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.totalStages}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${p.avgDuration > 8 ? 'text-red-600' : p.avgDuration > 4 ? 'text-amber-600' : 'text-green-600'}`}>
                    {fmtHours(p.avgDuration)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {p.avgDuration > 8 ? 'Consistently slow - review workload' : p.avgDuration > 4 ? 'Approaching limit' : 'Within SLA'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
