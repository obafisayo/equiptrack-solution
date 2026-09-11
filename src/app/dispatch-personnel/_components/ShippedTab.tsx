'use client'

import { Ship, Package, FileText, Printer } from 'lucide-react'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { Card } from '@/components/ui/Card'
import type { WorkOrder } from '@/lib/mock-data'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface ShippedTabProps {
  orders: WorkOrder[]
  onPrintWaybill?: (order: WorkOrder) => void
}

export function ShippedTab({ orders, onPrintWaybill }: ShippedTabProps) {
  return (
    <section>
      <SectionTitle title="Shipped Orders" count={orders.length} className="mb-3" />
      {orders.length === 0 ? (
        <p className="text-sm text-gray-400 mt-3">No shipped orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <Card key={o.id} className="p-0 overflow-hidden border-green-200">
              <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold text-brand-500 text-sm">{o.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">Shipped</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{o.destination}</p>
                  <p className="text-xs text-gray-500">{o.requestType} · {o.urgency} · {fmtDate(o.createdAt)}</p>
                </div>
                {onPrintWaybill && o.waybillNumber && (
                  <button
                    type="button"
                    onClick={() => onPrintWaybill(o)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-button bg-gray-800 hover:bg-black text-white text-xs font-semibold transition-colors shrink-0"
                  >
                    <Printer size={12} />
                    Waybill
                  </button>
                )}
              </div>

              <div className="px-4 py-2 border-b border-border-default/60 bg-gray-50 flex flex-wrap gap-3 text-xs">
                {o.containerId && (
                  <span className="flex items-center gap-1 font-mono font-semibold text-gray-700">
                    <Package size={11} className="text-gray-400" />
                    {o.containerId}
                  </span>
                )}
                {o.allocatedVessel && (
                  <span className="flex items-center gap-1 text-green-700 font-semibold">
                    <Ship size={11} />
                    {o.allocatedVessel}
                  </span>
                )}
                {o.waybillNumber && (
                  <span className="flex items-center gap-1 font-mono text-gray-500">
                    <FileText size={11} className="text-gray-400" />
                    {o.waybillNumber}
                  </span>
                )}
              </div>

              <div className="px-4 py-2 space-y-0.5">
                {o.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Package size={9} className="text-gray-300 shrink-0" />
                      {item.description}
                    </span>
                    <span className="text-gray-400 ml-2 shrink-0">{item.qty} {item.unit}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
