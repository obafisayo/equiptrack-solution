'use client'

import { Button } from '@/components/ui/Button'
import type { WorkOrder } from '@/lib/mock-data'

interface WaybillDialogProps {
  order: WorkOrder
  onConfirm: () => void
  onClose: () => void
}

export function WaybillDialog({ order, onConfirm, onClose }: WaybillDialogProps) {
  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-md mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Generate Waybill</h2>
        <p className="text-xs text-gray-500 mb-4">Review details before generating the official waybill document.</p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery No.</span>
            <span className="font-mono font-semibold text-brand-500">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Destination</span>
            <span className="font-medium text-gray-900">{order.destination}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Container</span>
            <span className="font-mono font-semibold text-gray-700">{order.containerId ?? '-'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Request Type</span>
            <span className="font-medium text-gray-900">{order.requestType}</span>
          </div>
        </div>

        {order.items.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-700">
                  <span className="truncate flex-1">{item.description}</span>
                  <span className="ml-2 text-gray-500">{item.qty} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={onConfirm}>Generate &amp; Print</Button>
        </div>
      </div>
    </div>
  )
}
