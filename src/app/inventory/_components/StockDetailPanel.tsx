'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { STATUS_CFG, MOV_CFG } from './styleMaps'
import type { StockItem, Movement } from './types'

interface StockDetailPanelProps {
  item: StockItem
  movements: Movement[]
  onClose: () => void
  onIssue: (item: StockItem) => void
}

export function StockDetailPanel({ item, movements, onClose, onIssue }: StockDetailPanelProps) {
  const itemMovements = movements.filter(m => m.itemId === item.id)
  const pct = Math.min(100, Math.round((item.qty / Math.max(item.reorderAt * 2, item.qty)) * 100))

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <p className="font-mono text-xs font-bold text-neutral-400 mb-1">{item.id}</p>
            <h2 className="text-base font-bold text-neutral-900">{item.name}</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-badge text-[11px] font-bold border mt-1 ${STATUS_CFG[item.status].badge}`}>
              {STATUS_CFG[item.status].label}
            </span>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Category',    item.category],
              ['Location',    item.location],
              ['Current Qty', `${item.qty} ${item.unit}`],
              ['Reorder At',  `${item.reorderAt} ${item.unit}`],
              ['Supplier',    item.supplier ?? '-'],
              ['Lead Time',   item.leadDays ? `${item.leadDays} days` : '-'],
              ['Last Updated',item.lastUpdated],
            ].map(([label, value]) => (
              <div key={label} className="bg-neutral-50 rounded-lg p-3 border border-border-default">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-neutral-800">{value}</p>
              </div>
            ))}
          </div>
          {/* Stock bar */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-border-default">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-bold text-neutral-600">Stock Level</span>
              <span className="font-bold">{item.qty} / {item.reorderAt * 2} {item.unit}</span>
            </div>
            <div className="h-3 w-full bg-neutral-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${STATUS_CFG[item.status].bar}`}
                style={{width:`${pct}%`}}/>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>0</span><span className="text-red-500">Reorder: {item.reorderAt}</span><span>{item.reorderAt*2}</span>
            </div>
          </div>
          {/* Recent movements */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Recent Movements</p>
            <div className="space-y-2">
              {itemMovements.slice(0,4).map(m=>{
                const mc=MOV_CFG[m.type]; const Icon=mc.icon
                const isNeg = m.type==='Issue'||(m.type==='Adjustment'&&m.qty<0)
                return (
                  <div key={m.id} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-neutral-50 border border-border-default">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${mc.badge}`}><Icon size={9}/>{mc.label}</span>
                    <span className={`font-bold ${isNeg?'text-red-600':'text-green-600'}`}>{isNeg?'-':'+'}{Math.abs(m.qty)} {item.unit}</span>
                    <span className="text-neutral-400 ml-auto">{m.date}</span>
                  </div>
                )
              })}
              {itemMovements.length === 0 && (
                <p className="text-xs text-neutral-400 text-center py-4">No movements recorded</p>
              )}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border-default flex gap-3">
          <Button variant="secondary" fullWidth size="sm" onClick={() => onIssue(item)}>Issue Equipment</Button>
          <Button variant="brand" fullWidth size="sm">Raise PO</Button>
        </div>
      </aside>
    </>
  )
}
