'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { WorkOrder, DangerousGoodsClass } from '@/lib/mock-data'

interface PackDialogProps {
  orders: WorkOrder[]
  onConfirm: (orderIds: string[], cargoClass: DangerousGoodsClass) => void
  onClose: () => void
}

const DG_OPTIONS: { value: DangerousGoodsClass; label: string; description: string; color: string }[] = [
  { value: 'normal',      label: 'Normal',       description: 'Standard goods — no special handling',      color: 'border-gray-200  bg-white' },
  { value: 'dangerous',   label: 'Dangerous',    description: 'Goods requiring special care during transit', color: 'border-orange-300 bg-orange-50' },
  { value: 'hazardous',   label: 'Hazardous',    description: 'Chemical or biological hazard',              color: 'border-amber-300  bg-amber-50' },
  { value: 'explosive',   label: 'Explosive',    description: 'Explosive materials — IATA Class 1',         color: 'border-red-300    bg-red-50' },
  { value: 'radioactive', label: 'Radioactive',  description: 'Radioactive material — requires shielding',  color: 'border-red-400    bg-red-100' },
  { value: 'refrigerated',label: 'Refrigerated', description: 'Temperature-controlled cargo',               color: 'border-slate-300  bg-slate-50' },
]

export function PackDialog({ orders, onConfirm, onClose }: PackDialogProps) {
  const [selected, setSelected]       = useState<Set<string>>(new Set())
  const [cargoClass, setCargoClass]   = useState<DangerousGoodsClass>('normal')
  const [step, setStep]               = useState<1 | 2>(1)
  const [error, setError]             = useState<string | null>(null)

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
          setError(`Cannot mix destinations — selected orders go to "${existingDest}". This order goes to "${order.destination}".`)
          return
        }
      }
      newSet.add(id)
    }
    setSelected(newSet)
  }

  function handleNext() {
    if (selected.size === 0) { setError('Select at least one order to pack.'); return }
    setStep(2)
  }

  function handleConfirm() {
    onConfirm(Array.from(selected), cargoClass)
  }

  const destinations  = [...new Set(orders.map(o => o.destination))]
  const selectedDest  = selected.size > 0 ? orders.find(o => selected.has(o.id))?.destination : null
  const selectedOption = DG_OPTIONS.find(o => o.value === cargoClass)!

  return (
    <div className="fixed inset-0 z-400 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative bg-white rounded-modal shadow-overlay w-full max-w-lg mx-4 animate-fade-in overflow-hidden">

        <div className="px-6 py-5 border-b border-border-default">
          <h2 className="text-base font-semibold text-gray-900">
            {step === 1 ? 'Pack into Container' : 'Cargo Classification'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {step === 1
              ? 'Select orders going to the same destination to pack together.'
              : 'Classify the cargo before moving to QAQC. This classification cannot be changed after submission.'}
          </p>
        </div>

        {step === 1 && (
          <>
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
          </>
        )}

        {step === 2 && (
          <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-2">
            {DG_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCargoClass(opt.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors duration-150 ${
                  cargoClass === opt.value
                    ? opt.color + ' border-opacity-100'
                    : 'border-border-default hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[13px] font-bold ${cargoClass === opt.value ? '' : 'text-gray-700'}`}>{opt.label}</span>
                  {cargoClass === opt.value && (
                    <span className="text-[11px] font-semibold text-brand-500">Selected</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{opt.description}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 px-6 py-4 border-t border-border-default">
          {step === 1 ? (
            <>
              <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
              <Button variant="primary" size="md" fullWidth onClick={handleNext} disabled={selected.size === 0}>
                Next: Classify Cargo →
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="md" fullWidth onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" size="md" fullWidth onClick={handleConfirm}>
                Pack as {selectedOption.label}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
