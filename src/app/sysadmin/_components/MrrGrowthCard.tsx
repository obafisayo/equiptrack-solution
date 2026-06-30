'use client'

import { MRRBarChart } from './MRRBarChart'
import { MRR_HISTORY } from './styleMaps'

export function MrrGrowthCard() {
  return (
    <div className="bg-white rounded-card border border-border-default shadow-card p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-bold text-neutral-900">MRR Growth</p>
        <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
          +12.4% MoM
        </span>
      </div>
      <p className="text-xs text-neutral-500 mb-5">Monthly recurring revenue - last 6 months</p>
      <MRRBarChart data={MRR_HISTORY} />
    </div>
  )
}
