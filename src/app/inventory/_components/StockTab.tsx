'use client'

import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { STATUS_CFG, CATEGORIES } from './styleMaps'
import type { StockItem } from './types'

interface StockTabProps {
  stock: StockItem[]
  catFilter: string
  onCatFilterChange: (cat: string) => void
  onSelectItem: (item: StockItem) => void
  onIssueItem: (item: StockItem) => void
}

export function StockTab({ stock, catFilter, onCatFilterChange, onSelectItem, onIssueItem }: StockTabProps) {
  return (
    <div>
      {/* Category filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={13} className="text-neutral-400"/>
        {CATEGORIES.map(c => (
          <button key={c} type="button" onClick={() => onCatFilterChange(c)}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${catFilter===c?'bg-brand-500 text-white border-brand-500':'border-border-default text-neutral-600 hover:bg-neutral-50'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              {['Item ID','Description','Category','Qty / Reorder','Location','Status',''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {stock.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-neutral-400 text-sm">No items match.</td></tr>
            ) : stock.map(item => {
              const sc  = STATUS_CFG[item.status]
              const pct = item.reorderAt > 0 ? Math.min(100, Math.round((item.qty / Math.max(item.reorderAt * 2, item.qty)) * 100)) : 100
              return (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => onSelectItem(item)}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-neutral-500">{item.id}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-900 max-w-52">
                    <span className="block truncate">{item.name}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{item.category}</td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${item.status==='critical'?'text-red-600':item.status==='reorder'?'text-amber-600':'text-neutral-900'}`}>
                        {item.qty}
                      </span>
                      <span className="text-xs text-neutral-400">/ {item.reorderAt} {item.unit}</span>
                    </div>
                    <div className="h-1 w-20 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                      <div className={`h-full rounded-full ${sc.bar}`} style={{width:`${pct}%`}}/>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{item.location}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <Button variant="secondary" size="sm"
                      onClick={() => onIssueItem(item)}>
                      Issue
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
