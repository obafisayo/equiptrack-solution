'use client'

import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Form'
import { DatePicker } from '@/components/ui/DatePicker'
import { Dropdown } from '@/components/ui/Dropdown'
import { type CCUType, type CCUContainer, CCU_TYPES_OPT, OWNER_OPT, LOCATION_OPT, DIMS_DEFAULT } from './types'

interface RegisterForm {
  serialNumber: string
  type: CCUType
  owner: string
  location: string
  certNo: string
  inspectionExpiry: string
  maxGrossWeightKg: string
  lengthM: string
  widthM: string
}

const INITIAL_FORM: RegisterForm = {
  serialNumber: '', type: 'Waste Skip', owner: '', location: '',
  certNo: '', inspectionExpiry: '', maxGrossWeightKg: '', lengthM: '', widthM: '',
}

interface RegisterContainerPanelProps {
  onClose: () => void
  onRegister: (container: CCUContainer) => void
}

export function RegisterContainerPanel({ onClose, onRegister }: RegisterContainerPanelProps) {
  const [regForm, setRegForm] = useState<RegisterForm>(INITIAL_FORM)
  const [regErrors, setRegErrors] = useState<Record<string, string>>({})
  const [regOk, setRegOk] = useState(false)

  function validateReg() {
    const e: Record<string, string> = {}
    if (!regForm.serialNumber.trim()) e.serialNumber = 'Required'
    if (!regForm.inspectionExpiry)   e.inspectionExpiry = 'Required'
    if (!regForm.owner)              e.owner = 'Required'
    setRegErrors(e)
    return Object.keys(e).length === 0
  }

  function submitReg(e: React.FormEvent) {
    e.preventDefault()
    if (!validateReg()) return
    const d = DIMS_DEFAULT[regForm.type]
    onRegister({
      serialNumber: regForm.serialNumber.trim(), type: regForm.type,
      footprintM2:  d.footprintM2,
      lengthM:      regForm.lengthM ? parseFloat(regForm.lengthM) : d.lengthM,
      widthM:       regForm.widthM  ? parseFloat(regForm.widthM)  : d.widthM,
      maxGrossWeightKg: regForm.maxGrossWeightKg ? parseInt(regForm.maxGrossWeightKg) : d.maxGrossWeightKg,
      inspectionExpiry: regForm.inspectionExpiry,
      status: 'Available', available: true,
      certNo: regForm.certNo || undefined, owner: regForm.owner || undefined, location: regForm.location || undefined,
    })
    setRegOk(true)
    setTimeout(() => {
      onClose()
      setRegOk(false)
      setRegForm(INITIAL_FORM)
    }, 1500)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[460px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Register New CCU</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Add a container to the fleet registry</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors"><X size={17} /></button>
        </div>
        {regOk ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle2 size={28} className="text-green-500" /></div>
            <p className="text-base font-bold text-neutral-900">CCU Registered</p>
            <p className="text-sm text-neutral-500">Container added to the fleet registry.</p>
          </div>
        ) : (
          <form onSubmit={submitReg} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Serial Number <span className="text-status-critical">*</span></label>
              <Input placeholder="e.g. 13162 or 28-MZ-75-04" value={regForm.serialNumber}
                onChange={e => { setRegForm(f => ({ ...f, serialNumber: e.target.value })); setRegErrors(x => ({ ...x, serialNumber: '' })) }}
                error={!!regErrors.serialNumber} />
              {regErrors.serialNumber && <p className="text-xs text-status-critical">{regErrors.serialNumber}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">CCU Type</label>
              <Dropdown options={CCU_TYPES_OPT} value={regForm.type} onChange={v => setRegForm(f => ({ ...f, type: v as CCUType }))} placeholder="Select type…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Owner <span className="text-status-critical">*</span></label>
                <Dropdown options={OWNER_OPT} value={regForm.owner}
                  onChange={v => { setRegForm(f => ({ ...f, owner: v })); setRegErrors(x => ({ ...x, owner: '' })) }}
                  placeholder="Select…" error={!!regErrors.owner} />
                {regErrors.owner && <p className="text-xs text-status-critical">{regErrors.owner}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Location</label>
                <Dropdown options={LOCATION_OPT} value={regForm.location} onChange={v => setRegForm(f => ({ ...f, location: v }))} placeholder="Select…" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Certificate No.</label>
              <Input placeholder="e.g. CERT-2024-019" value={regForm.certNo} onChange={e => setRegForm(f => ({ ...f, certNo: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Inspection Expiry Date <span className="text-status-critical">*</span></label>
              <DatePicker value={regForm.inspectionExpiry}
                onChange={v => { setRegForm(f => ({ ...f, inspectionExpiry: v })); setRegErrors(x => ({ ...x, inspectionExpiry: '' })) }}
                error={!!regErrors.inspectionExpiry} />
              {regErrors.inspectionExpiry && <p className="text-xs text-status-critical">{regErrors.inspectionExpiry}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500">Max Weight (kg)</label>
                <Input type="number" placeholder="Auto" value={regForm.maxGrossWeightKg} onChange={e => setRegForm(f => ({ ...f, maxGrossWeightKg: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500">Length (m)</label>
                <Input type="number" step="0.01" placeholder="Auto" value={regForm.lengthM} onChange={e => setRegForm(f => ({ ...f, lengthM: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500">Width (m)</label>
                <Input type="number" step="0.01" placeholder="Auto" value={regForm.widthM} onChange={e => setRegForm(f => ({ ...f, widthM: e.target.value }))} />
              </div>
            </div>
            <div className="pt-2 border-t border-border-default">
              <Button type="submit" variant="brand" fullWidth size="md">Register CCU</Button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
