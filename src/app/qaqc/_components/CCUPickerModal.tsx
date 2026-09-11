'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, Package, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SlideOverPanel } from '@/components/ui/SlideOverPanel'
import type { CCUContainer, CCUType } from '@/app/qaqc/containers/_components/types'

interface CCUPickerModalProps {
  open: boolean
  destination: string
  personnelName: string
  ccuFleet: CCUContainer[]
  onAssign: (serialNumber: string) => void
  onClose: () => void
}

export function CCUPickerModal({
  open, destination, personnelName, ccuFleet, onAssign, onClose,
}: CCUPickerModalProps) {
  const [selectedType, setSelectedType] = useState<CCUType | null>(null)
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null)

  // Group available CCUs by type
  const availableByType = useMemo(() => {
    const map = new Map<CCUType, CCUContainer[]>()
    for (const ccu of ccuFleet) {
      if (!ccu.available) continue
      const list = map.get(ccu.type) ?? []
      list.push(ccu)
      map.set(ccu.type, list)
    }
    return map
  }, [ccuFleet])

  const availableOfType = selectedType ? (availableByType.get(selectedType) ?? []) : []

  function handleClose() {
    setSelectedType(null)
    setSelectedSerial(null)
    onClose()
  }

  function handleAssign() {
    if (!selectedSerial) return
    onAssign(selectedSerial)
    setSelectedType(null)
    setSelectedSerial(null)
  }

  const step = selectedType ? 2 : 1

  return (
    <SlideOverPanel
      open={open}
      onClose={handleClose}
      title={`Assign Container to ${personnelName}`}
      subtitle={`Destination: ${destination}`}
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="ghost" size="md" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          {step === 2 && (
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              disabled={!selectedSerial}
              onClick={handleAssign}
            >
              Confirm Assignment
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        {/* Step 1 — pick a type */}
        {step === 1 && (
          <>
            <p className="text-xs text-slate-500 font-medium">
              {availableByType.size} container type{availableByType.size !== 1 ? 's' : ''} available — select a type
            </p>
            {availableByType.size === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center">No containers available in the fleet.</p>
            ) : (
              <div className="space-y-2">
                {Array.from(availableByType.entries()).map(([type, list]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-border-default hover:border-brand-accent hover:bg-brand-tint transition-all duration-150"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Package size={14} className="text-slate-400 shrink-0" />
                        <span className="text-sm font-semibold text-slate-900">{type}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                        {list.length} available
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 ml-[22px]">
                      {list[0].lengthM}m × {list[0].widthM}m · {list[0].footprintM2} m² · max {(list[0].maxGrossWeightKg / 1000).toFixed(1)} t
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Step 2 — pick a serial number */}
        {step === 2 && selectedType && (
          <>
            <button
              type="button"
              onClick={() => { setSelectedType(null); setSelectedSerial(null) }}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 mb-1"
            >
              <ChevronLeft size={13} />
              Back to types
            </button>

            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-border-default mb-2">
              <p className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">{selectedType}</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {availableOfType[0].lengthM}m × {availableOfType[0].widthM}m · {availableOfType[0].footprintM2} m² · max {(availableOfType[0].maxGrossWeightKg / 1000).toFixed(1)} t
              </p>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {availableOfType.length} unit{availableOfType.length !== 1 ? 's' : ''} — choose a serial number
            </p>

            <div className="space-y-2">
              {availableOfType.map(ccu => {
                const isSelected = selectedSerial === ccu.serialNumber
                const expState = new Date(ccu.inspectionExpiry) < new Date() ? 'expired' : 'ok'
                return (
                  <button
                    key={ccu.serialNumber}
                    type="button"
                    onClick={() => setSelectedSerial(ccu.serialNumber)}
                    className={[
                      'w-full text-left px-3.5 py-3 rounded-lg border transition-all duration-150',
                      isSelected
                        ? 'border-brand-accent bg-brand-tint shadow-sm'
                        : 'border-border-default hover:border-slate-300 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected && <CheckCircle2 size={12} className="text-brand-accent shrink-0" />}
                        <span className="font-mono font-bold text-slate-900 text-sm">{ccu.serialNumber}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        expState === 'expired'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-green-50 text-green-700'
                      }`}>
                        {expState === 'expired' ? 'Cert Expired' : 'Valid'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 ml-[2px]">
                      Cert expires: {new Date(ccu.inspectionExpiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </SlideOverPanel>
  )
}
