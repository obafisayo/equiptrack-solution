'use client'

import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import { Dropdown } from '@/components/ui/Dropdown'
import { DatePicker } from '@/components/ui/DatePicker'
import { SEV_CLASS } from './styleMaps'
import { INC_TYPE_OPTIONS, LOCATION_OPTIONS, SEV_OPTIONS, SEV_LABELS } from './mockData'
import type { Incident, IncType, Severity } from './types'

interface ReportIncidentPanelProps {
  incidentCount: number
  onSubmit: (incident: Incident) => void
  onClose: () => void
}

export function ReportIncidentPanel({ incidentCount, onSubmit, onClose }: ReportIncidentPanelProps) {
  const [form, setForm] = useState({
    type: '', location: '', severity: '' as Severity | '',
    date: '', time: '', description: '', immediateAction: '',
    witnesses: '', equipment: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string,string>>({})
  const [submitOk, setSubmitOk] = useState(false)

  function validateReport() {
    const e: Record<string,string> = {}
    if (!form.type)            e.type        = 'Required'
    if (!form.location)        e.location    = 'Required'
    if (!form.severity)        e.severity    = 'Required'
    if (!form.date)            e.date        = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  function submitReport(e: React.FormEvent) {
    e.preventDefault()
    if (!validateReport()) return
    const id = `INC-2026-${String(incidentCount + 1).padStart(3, '0')}`
    const newInc: Incident = {
      id, type: form.type as IncType, location: form.location,
      severity: form.severity as Severity, reportedBy: 'Current User',
      date: form.date, time: form.time || '00:00',
      status: 'open', description: form.description,
      immediateAction: form.immediateAction, witnesses: form.witnesses,
      equipment: form.equipment, daysOpen: 0,
    }
    onSubmit(newInc)
    setSubmitOk(true)
    setTimeout(() => { onClose(); setSubmitOk(false); setForm({ type:'',location:'',severity:'',date:'',time:'',description:'',immediateAction:'',witnesses:'',equipment:'' }) }, 1600)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white shadow-overlay flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Report Incident</h2>
            <p className="text-xs text-neutral-400 mt-0.5">All fields marked * are required</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
            <X size={17}/>
          </button>
        </div>

        {submitOk ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-500"/>
            </div>
            <p className="text-base font-bold text-neutral-900">Incident Reported</p>
            <p className="text-sm text-neutral-500">The incident has been logged and assigned for review.</p>
          </div>
        ) : (
          <form onSubmit={submitReport} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Incident Type <span className="text-status-critical">*</span></label>
              <Dropdown options={INC_TYPE_OPTIONS} value={form.type}
                onChange={v => { setForm(f => ({...f, type: v})); setFormErrors(e => ({...e, type:''})) }}
                placeholder="Select type..." error={!!formErrors.type}/>
              {formErrors.type && <p className="text-xs text-status-critical">{formErrors.type}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Location <span className="text-status-critical">*</span></label>
              <Dropdown options={LOCATION_OPTIONS} value={form.location}
                onChange={v => { setForm(f => ({...f, location: v})); setFormErrors(e => ({...e, location:''})) }}
                placeholder="Select location..." error={!!formErrors.location}/>
              {formErrors.location && <p className="text-xs text-status-critical">{formErrors.location}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Severity <span className="text-status-critical">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {SEV_OPTIONS.map(s => (
                  <button key={s} type="button"
                    onClick={() => { setForm(f => ({...f, severity: s})); setFormErrors(e => ({...e, severity:''})) }}
                    className={[
                      'py-2.5 rounded-lg border-2 text-xs font-bold capitalize transition-all',
                      form.severity === s ? SEV_CLASS[s].badge + ' border-current' : 'border-border-default text-neutral-500 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    {SEV_LABELS[s]}
                  </button>
                ))}
              </div>
              {formErrors.severity && <p className="text-xs text-status-critical">{formErrors.severity}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Date <span className="text-status-critical">*</span></label>
                <DatePicker value={form.date}
                  onChange={v => { setForm(f => ({...f, date: v})); setFormErrors(e => ({...e, date:''})) }}
                  max={new Date().toISOString().split('T')[0]}
                  placeholder="Incident date" error={!!formErrors.date}/>
                {formErrors.date && <p className="text-xs text-status-critical">{formErrors.date}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Time</label>
                <Input type="time" value={form.time}
                  onChange={e => setForm(f => ({...f, time: e.target.value}))}/>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Description <span className="text-status-critical">*</span></label>
              <Textarea rows={3} placeholder="Describe exactly what happened..."
                value={form.description} error={!!formErrors.description}
                onChange={e => { setForm(f => ({...f, description: e.target.value})); setFormErrors(err => ({...err, description:''})) }}/>
              {formErrors.description && <p className="text-xs text-status-critical">{formErrors.description}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Immediate Actions Taken</label>
              <Textarea rows={2} placeholder="What immediate steps were taken to control the situation?"
                value={form.immediateAction}
                onChange={e => setForm(f => ({...f, immediateAction: e.target.value}))}/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Witnesses</label>
                <Input placeholder="Name(s)" value={form.witnesses}
                  onChange={e => setForm(f => ({...f, witnesses: e.target.value}))}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Equipment Involved</label>
                <Input placeholder="Equipment ID / name" value={form.equipment}
                  onChange={e => setForm(f => ({...f, equipment: e.target.value}))}/>
              </div>
            </div>

            <div className="pt-2 border-t border-border-default">
              <Button type="submit" variant="brand" fullWidth size="md">Submit Report</Button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
