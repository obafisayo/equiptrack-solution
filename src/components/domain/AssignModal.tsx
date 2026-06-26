'use client'

import { useState } from 'react'
import type { WorkOrder, Personnel } from '@/lib/mock-data'

interface AssignModalProps {
  order: WorkOrder | null
  personnel: Personnel[]
  onConfirm: (personnelId: string, name: string) => void
  onClose: () => void
}

export function AssignModal({ order, personnel, onConfirm, onClose }: AssignModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(order?.assignedTo ?? null)

  if (!order) return null

  const selected = personnel.find(p => p.id === selectedId)

  return (
    <>
      <div className="fixed inset-0 bg-black/45 z-[450]" onClick={onClose} />
      <div className="fixed inset-0 z-[460] flex items-center justify-center p-4">
        <div className="bg-white rounded-modal shadow-overlay w-full max-w-md">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {order.assignedTo ? 'Reassign' : 'Assign'} Work Order
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Personnel list */}
          <div className="px-6 py-4 max-h-80 overflow-y-auto space-y-2">
            {personnel.map(p => {
              const loadPct = p.capacity > 0 ? (p.active / p.capacity) * 100 : 0
              const isOverloaded = loadPct > 80
              const isSelected = p.id === selectedId
              const isCurrentlyAssigned = p.id === order.assignedTo

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={[
                    'w-full text-left p-3 rounded-lg border transition-all duration-150',
                    isSelected
                      ? 'border-brand-500 bg-brand-50'
                      : isOverloaded
                      ? 'border-amber-200 bg-amber-50/50 hover:border-amber-300'
                      : 'border-border-default hover:border-gray-300 hover:bg-gray-50',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                      {isCurrentlyAssigned && (
                        <span className="text-xs text-brand-500 font-medium">(current)</span>
                      )}
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isOverloaded ? '#F59E0B' : '#22C55E' }}
                    >
                      {p.active}/{p.capacity}
                    </span>
                  </div>
                  {/* Load bar */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(loadPct, 100)}%`,
                        background: isOverloaded ? '#F59E0B' : '#22C55E',
                      }}
                    />
                  </div>
                  {isOverloaded && (
                    <p className="text-[10px] text-amber-600 mt-1 font-medium">HIGH LOAD</p>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border-default flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-9 border border-border-default text-gray-700 text-sm font-medium rounded-button hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => selected && onConfirm(selected.id, selected.name)}
              disabled={!selectedId}
              className="flex-1 h-9 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-button transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
