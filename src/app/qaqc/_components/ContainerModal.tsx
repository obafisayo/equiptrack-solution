'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SlideOverPanel } from '@/components/ui/SlideOverPanel'
import { type WorkOrder, type Container } from '@/lib/mock-data'

interface ContainerModalProps {
  order: WorkOrder | null
  open: boolean
  containers: Container[]
  allOrders: WorkOrder[]
  onAssign: (containerId: string) => void
  onClose: () => void
  title?: string
}

export function ContainerModal({ order, open, containers, allOrders, onAssign, onClose, title }: ContainerModalProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  const eligibleContainers = order
    ? containers.filter(c => {
        if (c.status === 'inspection' || c.status === 'maintenance') return false
        if (c.status === 'available') return true
        if (c.status === 'in-use') return c.destination === order.destination
        return false
      })
    : []

  function getContainerOrders(cid: string) {
    return allOrders.filter(o => o.containerId === cid)
  }

  function handleSelect(cid: string) {
    const c = containers.find(x => x.id === cid)
    if (!c || !order) return
    if (c.status === 'in-use' && c.destination && c.destination !== order.destination) {
      setLocationError(`Container is locked to ${c.destination}, but this order is going to ${order.destination}.`)
      setSelected(null)
      return
    }
    setLocationError(null)
    setSelected(cid)
  }

  function handleAssign() {
    if (selected) {
      onAssign(selected)
      setSelected(null)
      setLocationError(null)
    }
  }

  function handleClose() {
    setSelected(null)
    setLocationError(null)
    onClose()
  }

  return (
    <SlideOverPanel
      open={open}
      onClose={handleClose}
      title={title ?? 'Assign Container'}
      subtitle={order && order.destination ? `Destination: ${order.destination}` : undefined}
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            disabled={!selected}
            onClick={handleAssign}
          >
            Assign Container
          </Button>
        </div>
      }
    >
      {order && (
        <div className="space-y-4">
          {locationError && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {locationError}
            </div>
          )}

          {eligibleContainers.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              No containers available for this destination.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 font-medium">
                {eligibleContainers.length} container{eligibleContainers.length !== 1 ? 's' : ''} eligible for {order.destination}
              </p>
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
                    className={[
                      'w-full text-left px-3.5 py-3 rounded-lg border transition-all duration-150',
                      isSelected
                        ? 'border-brand-accent bg-brand-tint shadow-sm'
                        : 'border-border-default hover:border-slate-300 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-slate-900 text-sm">{c.id}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{c.size}</span>
                        <span className={[
                          'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                          isInUse
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-green-50 text-green-700',
                        ].join(' ')}>
                          {isInUse ? 'In Use' : 'Available'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      {c.yard} &middot; {c.lengthFt}ft &times; {c.widthFt}ft &middot; {footArea} sq ft
                    </p>
                    {isInUse && existingOrders.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border-subtle space-y-0.5">
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                          Contains {existingOrders.length} order{existingOrders.length !== 1 ? 's' : ''} &rarr; {c.destination}
                        </p>
                        {existingOrders.map(eo => (
                          <p key={eo.id} className="text-[10px] font-mono text-brand-accent">{eo.id}</p>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </SlideOverPanel>
  )
}
