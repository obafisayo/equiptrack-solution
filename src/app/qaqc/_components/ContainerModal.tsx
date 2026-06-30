'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { type WorkOrder, type Container } from '@/lib/mock-data'

interface ContainerModalProps {
  order: WorkOrder
  containers: Container[]
  allOrders: WorkOrder[]
  onAssign: (containerId: string) => void
  onClose: () => void
}

export function ContainerModal({ order, containers, allOrders, onAssign, onClose }: ContainerModalProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const eligibleContainers = containers.filter(c => {
    if (c.status === 'inspection' || c.status === 'maintenance') return false
    if (c.status === 'available') return true
    if (c.status === 'in-use') return c.destination === order.destination
    return false
  })

  function getContainerOrders(cid: string) {
    return allOrders.filter(o => o.containerId === cid)
  }

  function handleSelect(cid: string) {
    const c = containers.find(x => x.id === cid)
    if (!c) return
    if (c.status === 'in-use' && c.destination && c.destination !== order.destination) {
      setLocationError(`Container is locked to ${c.destination}, but this order is going to ${order.destination}.`)
      setSelected(null)
      return
    }
    setLocationError(null)
    setSelected(cid)
  }

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-md mx-4 p-6 animate-fade-in">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Assign Container</h2>
        <p className="text-xs text-gray-500 mb-4">
          Assigning to <span className="font-mono font-semibold text-brand-500">{order.id}</span> &mdash; {order.destination}
        </p>

        {locationError && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
            {locationError}
          </div>
        )}

        {eligibleContainers.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No containers available for this destination.</p>
        ) : (
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {eligibleContainers.map(c => {
              const existingOrders = getContainerOrders(c.id)
              const isSelected = selected === c.id
              const isInUse = c.status === 'in-use'
              const footArea = (c.lengthFt * c.widthFt).toFixed(0)

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md border transition-colors duration-150 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border-default hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-gray-900 text-sm">{c.id}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{c.size}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isInUse ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {isInUse ? 'In Use' : 'Available'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{c.yard} &middot; {c.lengthFt}ft &times; {c.widthFt}ft &middot; {footArea} sq ft</p>
                  {isInUse && existingOrders.length > 0 && (
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                        Contains {existingOrders.length} order{existingOrders.length !== 1 ? 's' : ''} &rarr; {c.destination}
                      </p>
                      {existingOrders.map(eo => (
                        <p key={eo.id} className="text-[10px] font-mono text-brand-500">{eo.id}</p>
                      ))}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            disabled={!selected}
            onClick={() => selected && onAssign(selected)}
          >
            Assign Container
          </Button>
        </div>
      </div>
    </div>
  )
}
