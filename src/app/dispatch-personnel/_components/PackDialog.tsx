'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { WorkOrder } from '@/lib/mock-data'

interface PackDialogProps {
  orders: WorkOrder[]
  onConfirm: (orderIds: string[]) => void
  onClose: () => void
}

export function PackDialog({ orders, onConfirm, onClose }: PackDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  function toggle(id: string) {
    setError(null)
    const order = orders.find(o => o.id === id)!
    const newSet = new Set(selected)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      if (newSet.size > 0) {
        const existingDest = orders.find(o => newSet.has(o.id))?.destination
        if (order.destination !== existingDest) {
          setError(`Cannot mix destinations - selected orders go to "${existingDest}". This order goes to "${order.destination}".`)
          return
        }
      }
      newSet.add(id)
    }
    setSelected(newSet)
  }

  function handleConfirm() {
    if (selected.size === 0) {
      setError('Select at least one order to pack.')
      return
    }
    onConfirm(Array.from(selected))
  }

  const destinations = [...new Set(orders.map(o => o.destination))]
  const selectedDest = selected.size > 0 ? orders.find(o => selected.has(o.id))?.destination : null

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-lg mx-4 animate-fade-in overflow-hidden">
        <div className="px-6 py-5 border-b border-border-default">
          <h2 className="text-base font-semibold text-gray-900">Pack into Container</h2>
          <p className="text-xs text-gray-500 mt-0.5">Select orders going to the same destination to pack together.</p>
        </div>

        {destinations.length > 1 && (
          <div className="px-6 pt-4">
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              Orders are going to multiple destinations. Only orders with matching destinations can share a container.
            </p>
          </div>
        )}

        <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-2">
          {orders.map(o => {
            const isSelected = selected.has(o.id)
            const isDisabled = !isSelected && selectedDest != null && o.destination !== selectedDest

            return (
              <button
                key={o.id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggle(o.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md border transition-colors duration-150 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50'
                    : isDisabled
                    ? 'border-border-default bg-gray-50 opacity-40 cursor-not-allowed'
                    : 'border-border-default hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-gray-900 text-sm">{o.id}</span>
                  <span className="text-xs text-gray-500">{o.requestType} · {o.urgency}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{o.destination} · {o.items.length} item{o.items.length !== 1 ? 's' : ''}</p>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="px-6 pb-2">
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          </div>
        )}

        {selectedDest && (
          <div className="px-6 pb-2">
            <p className="text-xs text-gray-500">
              <span className="font-semibold">{selected.size}</span> order{selected.size !== 1 ? 's' : ''} selected &rarr; <span className="font-semibold text-gray-700">{selectedDest}</span>
            </p>
          </div>
        )}

        <div className="flex gap-3 px-6 py-4 border-t border-border-default">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={handleConfirm} disabled={selected.size === 0}>
            Pack {selected.size > 0 ? `${selected.size} Order${selected.size !== 1 ? 's' : ''}` : 'Orders'}
          </Button>
        </div>
      </div>
    </div>
  )
}
