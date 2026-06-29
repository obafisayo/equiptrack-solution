/* eslint-disable */
'use client'

import { useState } from 'react'
import { X, UserCheck } from 'lucide-react'
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-450 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right-sliding panel */}
      <aside className="fixed right-0 top-0 bottom-0 z-460 w-full sm:w-[440px] bg-white shadow-overlay flex flex-col animate-slide-in">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 shrink-0 px-6 py-5 border-b border-border-default">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck size={16} className="text-brand-500 shrink-0" />
              <h2 className="text-base font-bold text-gray-900">
                {order.assignedTo ? 'Reassign' : 'Assign'} Work Order
              </h2>
            </div>
            <p className="font-mono text-xs text-brand-500 font-bold tracking-wider">{order.id}</p>
            {order.destination && (
              <p className="text-xs text-neutral-500 mt-0.5 truncate">
                {order.destination} &middot; {order.stage}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Currently assigned notice */}
        {order.assignedTo && order.assignedToName && (
          <div className="mx-6 mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg shrink-0">
            <p className="text-xs font-semibold text-amber-800">
              Currently assigned to{' '}
              <span className="font-bold">{order.assignedToName}</span>
            </p>
            <p className="text-xs text-amber-600 mt-0.5">Selecting a new person will reassign this order.</p>
          </div>
        )}

        {/* Section label */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Select Personnel
          </p>
        </div>

        {/* Personnel list */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-2">
          {personnel.length === 0 && (
            <div className="text-center py-10 text-sm text-neutral-400">No personnel available</div>
          )}
          {personnel.map(p => {
            const loadPct  = p.capacity > 0 ? (p.active / p.capacity) * 100 : 0
            const isOver   = loadPct > 80
            const isSel    = p.id === selectedId
            const isCurrent = p.id === order.assignedTo

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={[
                  'w-full text-left rounded-xl border p-3.5 transition-all duration-150',
                  isSel
                    ? 'border-brand-500 bg-brand-50 shadow-sm'
                    : isOver
                    ? 'border-amber-200 bg-amber-50/40 hover:border-amber-300'
                    : 'border-border-default hover:border-gray-300 hover:bg-gray-50',
                ].join(' ')}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Avatar initial */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSel ? 'bg-brand-500 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-gray-900 truncate block">{p.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Current assignee</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-bold shrink-0 ${isOver ? 'text-amber-700' : 'text-green-700'}`}>
                    {p.active}/{p.capacity} orders
                  </span>
                </div>

                {/* Load bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(loadPct, 100)}%` }}
                  />
                </div>
                {isOver && (
                  <p className="text-[10px] font-bold text-amber-700 mt-1.5 uppercase tracking-wider">High load — may impact delivery time</p>
                )}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 shrink-0 px-6 py-4 border-t border-border-default bg-white">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 bg-white text-gray-700 border border-border-default rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => selected && onConfirm(selected.id, selected.name)}
            disabled={!selectedId || selectedId === order.assignedTo}
            className="h-10 px-5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-bold disabled:opacity-45 disabled:cursor-not-allowed transition-colors duration-150 flex items-center gap-2"
          >
            <UserCheck size={15} />
            {order.assignedTo ? 'Reassign' : 'Confirm Assignment'}
          </button>
        </div>
      </aside>
    </>
  )
}
