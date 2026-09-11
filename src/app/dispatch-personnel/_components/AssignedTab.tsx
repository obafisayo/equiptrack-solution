'use client'

import { useState } from 'react'
import { Package, CheckSquare, Square, BoxSelect } from 'lucide-react'
import { StagePill } from '@/components/domain/Pills'
import { SLABar } from '@/components/domain/SLABar'
import { Button } from '@/components/ui/Button'
import type { WorkOrder, DangerousGoodsClass } from '@/lib/mock-data'
import type { CCUContainer } from '@/app/qaqc/containers/_components/types'
import { STAGE_SLA_HOURS, fmtHours } from '@/config/sla'

interface AssignedTabProps {
  orders: WorkOrder[]
  assignedCCU: CCUContainer | undefined
  onPack: (orderIds: string[], containerId: string, cargoClass: DangerousGoodsClass) => void
}

const DG_OPTIONS: { value: DangerousGoodsClass; label: string; hint: string }[] = [
  { value: 'normal',       label: 'Normal',       hint: 'Standard goods — no special handling' },
  { value: 'dangerous',    label: 'Dangerous',    hint: 'Requires special care in transit' },
  { value: 'hazardous',    label: 'Hazardous',    hint: 'Chemical or biological hazard' },
  { value: 'explosive',    label: 'Explosive',    hint: 'IATA Class 1 — explosives' },
  { value: 'radioactive',  label: 'Radioactive',  hint: 'Requires radiation shielding' },
  { value: 'refrigerated', label: 'Refrigerated', hint: 'Temperature-controlled cargo' },
]

export function AssignedTab({ orders, assignedCCU, onPack }: AssignedTabProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set())
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null)
  const [cargoClass, setCargoClass] = useState<DangerousGoodsClass>('normal')
  const [showCargo, setShowCargo] = useState(false)
  const [destError, setDestError] = useState<string | null>(null)

  const hasContainers = !!assignedCCU
  const canPack = selectedOrderIds.size > 0 && selectedContainerId !== null

  function toggleOrder(id: string) {
    setDestError(null)
    const order = orders.find(o => o.id === id)!
    const next = new Set(selectedOrderIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      if (next.size > 0) {
        const existingDest = orders.find(o => next.has(o.id))?.destination
        if (order.destination !== existingDest) {
          setDestError(`Destinations must match. Selected orders go to "${existingDest}", this one goes to "${order.destination}".`)
          return
        }
      }
      next.add(id)
    }
    setSelectedOrderIds(next)
  }

  function handlePackClick() {
    if (!canPack) return
    setShowCargo(true)
  }

  function handleConfirmPack() {
    if (!canPack || !selectedContainerId) return
    onPack(Array.from(selectedOrderIds), selectedContainerId, cargoClass)
    setSelectedOrderIds(new Set())
    setSelectedContainerId(null)
    setCargoClass('normal')
    setShowCargo(false)
  }

  return (
    <div className="space-y-4">
      {/* Split-screen grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT — assigned orders */}
        <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border-default bg-gray-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Assigned Requests</p>
              <p className="text-xs text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''} · select to pack</p>
            </div>
            {selectedOrderIds.size > 0 && (
              <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                {selectedOrderIds.size} selected
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-400">No tasks assigned to you yet.</div>
          ) : (
            <div className="divide-y divide-border-default/60">
              {orders.map(o => {
                const isSelected = selectedOrderIds.has(o.id)
                const slaHrs = STAGE_SLA_HOURS[o.stage]
                const isDisabled = !isSelected && selectedOrderIds.size > 0 &&
                  orders.find(x => selectedOrderIds.has(x.id))?.destination !== o.destination
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={isDisabled || !hasContainers}
                    onClick={() => toggleOrder(o.id)}
                    className={[
                      'w-full text-left px-4 py-3 transition-colors duration-100',
                      isSelected ? 'bg-violet-50' : '',
                      isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50',
                      !hasContainers ? 'cursor-not-allowed opacity-50' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0 text-violet-500">
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="text-gray-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono font-bold text-brand-500 text-xs">{o.id}</span>
                          <StagePill stage={o.stage} />
                        </div>
                        <p className="text-xs font-medium text-gray-800 truncate">{o.destination}</p>
                        <p className="text-xs text-gray-400">{o.items.length} item{o.items.length !== 1 ? 's' : ''} · {o.requestType} · {fmtHours(o.elapsedHours)} in stage</p>
                        {slaHrs && (
                          <div className="mt-1.5">
                            <SLABar elapsedHours={o.elapsedHours} slaHours={slaHrs} />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {destError && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-xs text-red-700">{destError}</div>
          )}
        </div>

        {/* RIGHT — QAQC-assigned containers */}
        <div className="bg-white rounded-card border border-border-default shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border-default bg-gray-50">
            <p className="text-sm font-bold text-gray-900">Available Containers</p>
            <p className="text-xs text-gray-500">Assigned to you by QAQC · select one to pack into</p>
          </div>

          {!hasContainers ? (
            <div className="px-4 py-10 text-center">
              <BoxSelect size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-semibold text-gray-500">No container assigned</p>
              <p className="text-xs text-gray-400 mt-1">Wait for QAQC to assign a container before you can pack.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-default/60">
              {(() => {
                const ccu = assignedCCU!
                const isSelected = selectedContainerId === ccu.serialNumber
                return (
                  <button
                    key={ccu.serialNumber}
                    type="button"
                    onClick={() => setSelectedContainerId(isSelected ? null : ccu.serialNumber)}
                    className={[
                      'w-full text-left px-4 py-3 transition-colors duration-100',
                      isSelected ? 'bg-green-50' : 'hover:bg-gray-50',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0 text-green-600">
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="text-gray-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Package size={13} className="text-gray-500" />
                          <span className="font-mono font-bold text-gray-900 text-sm">{ccu.serialNumber}</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-700">{ccu.type}</p>
                        <p className="text-xs text-gray-500">{ccu.lengthM}m × {ccu.widthM}m · {ccu.footprintM2} m²</p>
                        <p className="text-xs text-green-700 font-semibold mt-0.5">In Transit — Ready to pack</p>
                      </div>
                    </div>
                  </button>
                )
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Cargo classification — appears inline when ready to pack */}
      {showCargo && canPack && (
        <div className="bg-white rounded-card border border-violet-200 shadow-card p-4">
          <p className="text-sm font-bold text-gray-900 mb-1">Cargo Classification</p>
          <p className="text-xs text-gray-500 mb-3">
            Select how this cargo should be classified. This cannot be changed after packing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {DG_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCargoClass(opt.value)}
                className={[
                  'text-left px-3 py-2.5 rounded-lg border-2 transition-colors duration-100',
                  cargoClass === opt.value
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-border-default hover:border-gray-300',
                ].join(' ')}
              >
                <p className={`text-xs font-bold ${cargoClass === opt.value ? 'text-violet-700' : 'text-gray-800'}`}>{opt.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{opt.hint}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" size="md" fullWidth onClick={() => setShowCargo(false)}>Back</Button>
            <Button variant="primary" size="md" fullWidth onClick={handleConfirmPack}>
              Pack {selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''} into {selectedContainerId}
            </Button>
          </div>
        </div>
      )}

      {/* Pack CTA — appears when both sides selected and cargo not yet shown */}
      {canPack && !showCargo && (
        <div className="flex items-center justify-between bg-violet-50 border border-violet-200 rounded-card px-4 py-3">
          <p className="text-sm text-violet-800 font-semibold">
            {selectedOrderIds.size} order{selectedOrderIds.size !== 1 ? 's' : ''} → {selectedContainerId}
          </p>
          <Button variant="primary" size="sm" onClick={handlePackClick}>
            Pack into Container
          </Button>
        </div>
      )}
    </div>
  )
}
