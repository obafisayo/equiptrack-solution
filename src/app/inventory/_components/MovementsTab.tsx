'use client'

import { MOV_CFG } from './styleMaps'
import type { Movement } from './types'

interface MovementsTabProps {
  movements: Movement[]
}

export function MovementsTab({ movements }: MovementsTabProps) {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b border-border-default">
          <tr>
            {['ID','Item','Type','Qty','Date','By','Reference','Notes'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {movements.map(m => {
            const mc  = MOV_CFG[m.type]
            const Icon = mc.icon
            const isNeg = m.type === 'Issue' || (m.type === 'Adjustment' && m.qty < 0)
            return (
              <tr key={m.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-mono text-xs text-neutral-400">{m.id}</td>
                <td className="px-4 py-3 font-medium text-neutral-800 max-w-40 truncate">{m.itemName}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${mc.badge}`}>
                    <Icon size={10}/>{mc.label}
                  </span>
                </td>
                <td className={`px-4 py-3 font-bold text-sm ${isNeg?'text-red-600':'text-green-600'}`}>
                  {isNeg&&m.qty>0?'-':m.qty<0?'':'+' }{Math.abs(m.qty)}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">{m.date} {m.time}</td>
                <td className="px-4 py-3 text-xs text-neutral-600">{m.by}</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-500">{m.reference ?? '-'}</td>
                <td className="px-4 py-3 text-xs text-neutral-500 max-w-40 truncate">{m.note ?? '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
