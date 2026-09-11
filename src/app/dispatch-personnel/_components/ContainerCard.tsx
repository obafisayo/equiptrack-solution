'use client'

import { useState } from 'react'
import { Package, ChevronDown, ChevronRight, History, Printer } from 'lucide-react'
import { StagePill } from '@/components/domain/Pills'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { WorkOrder } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'

interface ContainerCardProps {
  containerId: string
  orders: WorkOrder[]
  onSubmitQAQC?: () => void
  onGenerateWaybill?: (order: WorkOrder) => void
  onRequestDeckspace?: (order: WorkOrder) => void
  onPrintWaybill?: (order: WorkOrder) => void
}

export function ContainerCard({ containerId, orders, onSubmitQAQC, onGenerateWaybill, onRequestDeckspace, onPrintWaybill }: ContainerCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const destination = orders[0]?.destination ?? '-'
  const stage = orders[0]?.stage

  function toggleOrder(id: string) {
    setExpandedOrderId(prev => prev === id ? null : id)
  }

  return (
    <Card className="p-0 overflow-hidden">
      {/* Container header */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full px-4 py-3 bg-gray-50 border-b border-border-default flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Package size={14} className="text-gray-500 shrink-0" />
          <span className="font-mono font-bold text-gray-900 text-sm">{containerId}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs font-medium text-gray-700">{destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-2 py-0.5 font-medium">
            {orders.length} WO{orders.length !== 1 ? 's' : ''}
          </span>
          {expanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded: order list */}
      {expanded && (
        <div className="divide-y divide-border-default/60">
          {orders.map(o => {
            const isOrderExpanded = expandedOrderId === o.id
            return (
              <div key={o.id}>
                {/* Order row */}
                <button
                  type="button"
                  onClick={() => toggleOrder(o.id)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-brand-500">{o.id}</span>
                      <StagePill stage={o.stage} />
                      <span className="text-xs text-gray-400">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{o.requestType} · {o.requestedByName}</p>
                  </div>
                  {isOrderExpanded
                    ? <ChevronDown size={13} className="text-gray-400 shrink-0" />
                    : <ChevronRight size={13} className="text-gray-400 shrink-0" />
                  }
                </button>

                {/* Order detail — line items + traceability */}
                {isOrderExpanded && (
                  <div className="bg-gray-50 border-t border-border-default/60 px-4 py-3 space-y-4">

                    {/* Line items */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Line Items</p>
                      <div className="space-y-1">
                        {o.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs text-gray-700">
                            <span className="flex-1 truncate">{item.description}</span>
                            <span className="ml-2 text-gray-500 shrink-0 font-medium">{item.qty} {item.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Traceability — stage history */}
                    {o.stageHistory && o.stageHistory.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <History size={11} className="text-gray-400" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Chain of Custody</p>
                        </div>
                        <div className="space-y-1.5">
                          {o.stageHistory.map((h, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                              <div>
                                <p className="text-[11px] font-semibold text-gray-700">{h.stage}</p>
                                <p className="text-[10px] text-gray-400">
                                  {h.personName ?? 'System'}
                                  {h.durationHours != null ? ` · ${fmtHours(h.durationHours)}` : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {o.notes && (
                      <p className="text-[11px] text-gray-500 italic border-t border-border-default/60 pt-2">"{o.notes}"</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Footer actions */}
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap border-t border-border-default/60">
        {stage && <StagePill stage={stage} />}
        <div className="ml-auto flex gap-2">
          {onSubmitQAQC && (
            <Button variant="secondary" size="sm" onClick={onSubmitQAQC}>
              Submit for QAQC
            </Button>
          )}
          {onGenerateWaybill && orders[0] && (
            <Button variant="primary" size="sm" onClick={() => onGenerateWaybill(orders[0])}>
              Generate Waybill
            </Button>
          )}
          {onRequestDeckspace && orders[0] && (
            <Button variant="primary" size="sm" onClick={() => onRequestDeckspace(orders[0])}>
              Request Deckspace
            </Button>
          )}
          {onPrintWaybill && orders[0] && (
            <Button variant="secondary" size="sm" onClick={() => onPrintWaybill(orders[0])}>
              <Printer size={12} className="mr-1" />
              Print Waybill
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
