'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { type CCUContainer, STATUS_BADGE, getExpiryState } from './types'
import { StatusDot } from './StatusDot'
import { ExpiryChip } from './ExpiryChip'

interface ContainerDetailPanelProps {
  detail: CCUContainer
  onClose: () => void
  onToggleAvailable: (sn: string) => void
}

export function ContainerDetailPanel({ detail, onClose, onToggleAvailable }: ContainerDetailPanelProps) {
  const physicalSpecs: [string, string][] = [
    ['Footprint', `${detail.footprintM2} m²`],
    ['Length', `${detail.lengthM} m`],
    ['Width', `${detail.widthM} m`],
    ['Max Gross Wt', `${detail.maxGrossWeightKg.toLocaleString()} kg`],
  ]
  const registrationDetails: [string, string][] = [
    ['Cert. No.', detail.certNo ?? '-'],
    ['Owner', detail.owner ?? '-'],
    ['Location', detail.location ?? '-'],
    ['Insp. Expiry', detail.inspectionExpiry],
  ]
  const expiryState = getExpiryState(detail.inspectionExpiry)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusDot c={detail} />
              <span className="font-mono font-bold text-lg text-neutral-900">{detail.serialNumber}</span>
            </div>
            <p className="text-sm text-neutral-500">{detail.type}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <ExpiryChip expiry={detail.inspectionExpiry} />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_BADGE[detail.status]}`}>{detail.status}</span>
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Physical Specifications</p>
            <div className="grid grid-cols-2 gap-2.5">
              {physicalSpecs.map(([l, v]) => (
                <div key={l} className="bg-neutral-50 rounded-lg border border-border-default p-3">
                  <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">{l}</p>
                  <p className="text-sm font-bold text-neutral-900">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Registration Details</p>
            <div className="grid grid-cols-2 gap-2.5">
              {registrationDetails.map(([l, v]) => (
                <div key={l} className="bg-neutral-50 rounded-lg border border-border-default p-3">
                  <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">{l}</p>
                  <p className="text-xs font-semibold text-neutral-800">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-border-default space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-700">Available in pool</span>
              <button type="button" role="switch" aria-checked={detail.available}
                onClick={() => onToggleAvailable(detail.serialNumber)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${detail.available ? 'bg-brand-500' : 'bg-neutral-200'}`}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${detail.available ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {(expiryState === 'expired' || expiryState === 'locked') && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
                Inspection overdue or critical. Schedule renewal before deploying.
              </div>
            )}
            <Button variant="secondary" fullWidth size="sm">Schedule Inspection</Button>
            <Button variant="secondary" fullWidth size="sm">Update Location</Button>
          </div>
        </div>
      </aside>
    </>
  )
}
