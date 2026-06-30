'use client'

import { useState } from 'react'
import { Select } from '@/components/ui/Form'
import { type WorkOrder, type Personnel } from '@/lib/mock-data'
import { fmtHours } from '@/config/sla'

interface ReassignModalProps {
  source: Personnel
  targets: Personnel[]
  orders: WorkOrder[]
  onConfirm: (selectedIds: string[], targetId: string, targetName: string) => void
  onClose: () => void
}

export function ReassignModal({ source, targets, orders, onConfirm, onClose }: ReassignModalProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(orders.map(o => o.id))
  const [targetId, setTargetId] = useState<string>(targets[0]?.id ?? '')

  const toggleOrder = (id: string) =>
    setSelectedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const target = targets.find(p => p.id === targetId)

  return (
    <div className="fixed inset-0 bg-black/45 z-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-modal shadow-overlay w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div>
            <h2 className="font-semibold text-gray-900">Reassign Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">From {source.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Reassign to</label>
            <Select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              size="sm"
            >
              {targets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.active} / {p.capacity} active)
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Select orders to reassign ({selectedOrderIds.length} of {orders.length})
            </label>
            <div className="max-h-48 overflow-y-auto border border-border-default rounded-md divide-y divide-border-subtle">
              {orders.map(o => (
                <label
                  key={o.id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.includes(o.id)}
                    onChange={() => toggleOrder(o.id)}
                    className="accent-brand-500"
                  />
                  <span className="font-mono-id text-brand-500 text-xs font-semibold">{o.id}</span>
                  <span className="text-sm text-gray-700 flex-1 truncate">{o.destination}</span>
                  <span className="text-xs text-gray-400">{fmtHours(o.elapsedHours)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border-default">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-button border border-border-default text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (target) onConfirm(selectedOrderIds, target.id, target.name)
            }}
            disabled={selectedOrderIds.length === 0 || !targetId}
            className="flex-1 h-9 rounded-button bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold disabled:opacity-45 transition-colors"
          >
            Reassign {selectedOrderIds.length} Order{selectedOrderIds.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
