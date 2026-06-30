'use client'

import { X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Form'
import { Dropdown } from '@/components/ui/Dropdown'
import { DatePicker } from '@/components/ui/DatePicker'
import { COMMON_PORTS } from './constants'
import type { EventType } from './types'

export interface AgendaForm {
  vesselId: string
  type: EventType
  date: string
  time: string
  port: string
  destination: string
  notes: string
}

interface Props {
  vesselOptions: { value: string; label: string }[]
  agForm: AgendaForm
  agErrors: Record<string, string>
  agSubmitOk: boolean
  onChange: (form: AgendaForm) => void
  onClearError: (field: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export function NewAgendaPanel({ vesselOptions, agForm, agErrors, agSubmitOk, onChange, onClearError, onSubmit, onClose }: Props) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}/>
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[460px] bg-white shadow-overlay flex flex-col animate-slide-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-default shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900">New Agenda Entry</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Schedule a vessel departure or arrival event</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 transition-colors">
            <X size={17}/>
          </button>
        </div>

        {agSubmitOk ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-500"/>
            </div>
            <p className="text-base font-bold text-neutral-900">Agenda Added</p>
            <p className="text-sm text-neutral-500">The event has been added to the vessel schedule.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Vessel <span className="text-status-critical">*</span></label>
              <Dropdown
                options={vesselOptions} value={agForm.vesselId}
                onChange={v => { onChange({ ...agForm, vesselId: v }); onClearError('vesselId') }}
                placeholder="Select vessel..." error={!!agErrors.vesselId} searchable
              />
              {agErrors.vesselId && <p className="text-xs text-status-critical">{agErrors.vesselId}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Event Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Departure', 'Arrival'] as EventType[]).map(t => (
                  <button key={t} type="button"
                    onClick={() => onChange({ ...agForm, type: t })}
                    className={`py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${agForm.type === t ? (t === 'Departure' ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-blue-500 bg-blue-50 text-blue-800') : 'border-border-default text-neutral-500 hover:bg-neutral-50'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Date <span className="text-status-critical">*</span></label>
                <DatePicker value={agForm.date}
                  onChange={v => { onChange({ ...agForm, date: v }); onClearError('date') }}
                  error={!!agErrors.date}/>
                {agErrors.date && <p className="text-xs text-status-critical">{agErrors.date}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-700">Time</label>
                <Input type="time" value={agForm.time} onChange={e => onChange({ ...agForm, time: e.target.value })}/>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Port of Origin <span className="text-status-critical">*</span></label>
              <Dropdown options={COMMON_PORTS} value={agForm.port}
                onChange={v => { onChange({ ...agForm, port: v }); onClearError('port') }}
                placeholder="Select or type port..." error={!!agErrors.port} searchable/>
              {agErrors.port && <p className="text-xs text-status-critical">{agErrors.port}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Destination <span className="text-status-critical">*</span></label>
              <Dropdown options={COMMON_PORTS} value={agForm.destination}
                onChange={v => { onChange({ ...agForm, destination: v }); onClearError('destination') }}
                placeholder="Select destination..." error={!!agErrors.destination} searchable/>
              {agErrors.destination && <p className="text-xs text-status-critical">{agErrors.destination}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-700">Notes</label>
              <Textarea rows={3} placeholder="Cargo notes, berth instructions, deadlines..."
                value={agForm.notes} onChange={e => onChange({ ...agForm, notes: e.target.value })}/>
            </div>

            <div className="pt-2 border-t border-border-default">
              <Button type="submit" variant="brand" fullWidth size="md">Add to Schedule</Button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
