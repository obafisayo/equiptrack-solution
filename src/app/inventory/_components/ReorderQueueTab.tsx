'use client'

import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { STATUS_CFG } from './styleMaps'
import type { StockItem } from './types'

interface ReorderQueueTabProps {
  reorderQueue: StockItem[]
  onSelectItem: (item: StockItem) => void
}

export function ReorderQueueTab({ reorderQueue, onSelectItem }: ReorderQueueTabProps) {
  if (reorderQueue.length === 0) {
    return (
      <div className="bg-white rounded-card border border-border-default shadow-card py-16 text-center">
        <CheckCircle className="mx-auto text-green-300 mb-3" size={40} strokeWidth={1.5}/>
        <p className="text-sm font-semibold text-neutral-400">All stock levels are healthy</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reorderQueue.map(item => {
        const sc  = STATUS_CFG[item.status]
        const shortfall = item.reorderAt - item.qty
        return (
          <div key={item.id} className={`bg-white rounded-card border shadow-card p-5 ${item.status==='critical'?'border-red-200 ring-1 ring-red-100':'border-amber-200 ring-1 ring-amber-50'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-neutral-500">{item.id}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border ${sc.badge}`}>{sc.label}</span>
                </div>
                <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-neutral-500">
                  <span>Current: <strong className={item.status==='critical'?'text-red-600':'text-amber-600'}>{item.qty} {item.unit}</strong></span>
                  <span>Reorder at: <strong>{item.reorderAt} {item.unit}</strong></span>
                  <span>Shortfall: <strong className="text-red-600">{Math.max(0,shortfall)} {item.unit}</strong></span>
                </div>
                {item.supplier && (
                  <div className="flex items-center gap-4 mt-1 text-xs text-neutral-400">
                    <span>Supplier: <strong className="text-neutral-600">{item.supplier}</strong></span>
                    <span>Lead time: <strong className="text-neutral-600">{item.leadDays} days</strong></span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button variant="brand" size="sm">Raise PO</Button>
                <Button variant="secondary" size="sm" onClick={() => onSelectItem(item)}>Details</Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
