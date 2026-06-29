/* eslint-disable */
'use client'

import { useState } from 'react'
import { Plus, Trash2, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { Input, Textarea } from '@/components/ui/Form'
import { DatePicker } from '@/components/ui/DatePicker'
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { URGENCY_CONFIG } from '@/config/sla'
import type { UrgencyLevel } from '@/config/sla'

// ── Option lists ──────────────────────────────────────────────────────────────

const DESTINATION_OPTIONS: DropdownOption[] = [
  { value: 'Bonny Terminal',         label: 'Bonny Terminal',          hint: 'Rivers State' },
  { value: 'Escravos Terminal',      label: 'Escravos Terminal',       hint: 'Delta State' },
  { value: 'Forcados Terminal',      label: 'Forcados Terminal',       hint: 'Delta State' },
  { value: 'Bonga FPSO',            label: 'Bonga FPSO',              hint: 'Offshore OML 118' },
  { value: 'Agbami FPSO',           label: 'Agbami FPSO',             hint: 'Offshore OML 127/128' },
  { value: 'Erha FPSO',             label: 'Erha FPSO',               hint: 'Offshore OML 133' },
  { value: 'Egina FPSO',            label: 'Egina FPSO',              hint: 'Offshore OML 130' },
  { value: 'Akpo FPSO',             label: 'Akpo FPSO',               hint: 'Offshore OML 130' },
  { value: 'Usan FPSO',             label: 'Usan FPSO',               hint: 'Offshore OML 138' },
  { value: 'Okwori FPSO',           label: 'Okwori FPSO',             hint: 'Offshore OML 119' },
  { value: 'Pennington Terminal',    label: 'Pennington Terminal',     hint: 'Delta State' },
  { value: 'Brass Terminal',        label: 'Brass Terminal',           hint: 'Bayelsa State' },
  { value: 'Ima Field',             label: 'Ima Field',                hint: 'Onshore' },
  { value: 'Abo FPSO',              label: 'Abo FPSO',                 hint: 'OML 125' },
  { value: 'Other',                 label: 'Other (specify below)' },
]

const REQUEST_TYPES = [
  { value: 'SAP',       label: 'SAP Request',           hint: 'Standard stock item from SAP system' },
  { value: 'TR',        label: 'Temporary Requisition', hint: 'Requires Base Coordinator email approval first' },
  { value: 'NON_STOCK', label: 'Non-Stock Item',        hint: 'Goes directly to Dispatch — no warehouse staging' },
]

const CARGO_TYPES: DropdownOption[] = [
  { value: 'drilling',    label: 'Drilling Equipment',       hint: 'Drill bits, BHA, drilling tools' },
  { value: 'production',  label: 'Production Equipment',     hint: 'Wellhead, flowlines, valves, separators' },
  { value: 'safety',      label: 'Safety & PPE',             hint: 'PPE, fire suppression, life safety' },
  { value: 'chemical',    label: 'Chemicals & Fluids',       hint: 'Drilling fluids, treatment chemicals' },
  { value: 'electrical',  label: 'Electrical & Instruments', hint: 'Sensors, panels, instrumentation' },
  { value: 'mechanical',  label: 'Mechanical Parts',         hint: 'Pumps, compressors, rotating equipment' },
  { value: 'consumable',  label: 'Consumables',              hint: 'Gaskets, bolts, general consumables' },
  { value: 'general',     label: 'General Cargo',            hint: 'Miscellaneous / other' },
]

const WELL_FIELD_OPTIONS: DropdownOption[] = [
  { value: 'bonga_n1',       label: 'Bonga North-1' },
  { value: 'bonga_sw',       label: 'Bonga South-West' },
  { value: 'agbami_w12',     label: 'Agbami Well-12' },
  { value: 'erha_n_phase3',  label: 'Erha North Phase 3' },
  { value: 'egina_sp',       label: 'Egina South Phase' },
  { value: 'akpo_exp',       label: 'Akpo Expansion' },
  { value: 'ima_oml34',      label: 'Ima OML-34' },
  { value: 'escravos_gas',   label: 'Escravos Gas-to-Liquids' },
  { value: 'forcados_maint', label: 'Forcados Maintenance' },
  { value: 'general_ops',    label: 'General Operations' },
]

const UNIT_OPTIONS: DropdownOption[] = [
  { value: 'Pieces',  label: 'Pieces' },
  { value: 'Sets',    label: 'Sets' },
  { value: 'Boxes',   label: 'Boxes' },
  { value: 'Bags',    label: 'Bags' },
  { value: 'Drums',   label: 'Drums' },
  { value: 'Litres',  label: 'Litres' },
  { value: 'Kg',      label: 'Kg' },
  { value: 'Metres',  label: 'Metres' },
  { value: 'Pairs',   label: 'Pairs' },
  { value: 'Units',   label: 'Units' },
  { value: 'Joints',  label: 'Joints' },
  { value: 'Spools',  label: 'Spools' },
]

const URGENCY_STYLE: Record<UrgencyLevel, { active: string; dot: string; text: string }> = {
  Low:    { active: 'border-green-500 bg-green-50',   dot: 'bg-green-500',  text: 'text-green-700' },
  Medium: { active: 'border-amber-500 bg-amber-50',   dot: 'bg-amber-500',  text: 'text-amber-700' },
  High:   { active: 'border-orange-500 bg-orange-50', dot: 'bg-orange-500', text: 'text-orange-700' },
  Urgent: { active: 'border-red-500 bg-red-50',       dot: 'bg-red-500',    text: 'text-red-700' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getExpectedDate(urgency: UrgencyLevel | ''): string {
  if (!urgency) return ''
  const cfg = URGENCY_CONFIG[urgency]
  if (!cfg.days) return 'Next available boat departure'
  const d = new Date()
  d.setDate(d.getDate() + cfg.days)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function generateDeliveryNumber(): string {
  return `DEL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

function today() {
  return new Date().toISOString().split('T')[0]
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface LineItem {
  description: string
  qty:         string
  unit:        string
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function NewRequestPage() {
  // Core fields
  const [requestType,   setRequestType]   = useState('')
  const [destination,   setDestination]   = useState('')
  const [customDest,    setCustomDest]    = useState('')
  const [urgency,       setUrgency]       = useState<UrgencyLevel | ''>('')
  const [requiredDate,  setRequiredDate]  = useState('')
  const [returnDate,    setReturnDate]    = useState('')

  // Enrichment fields
  const [cargoType,     setCargoType]     = useState('')
  const [wellField,     setWellField]     = useState('')
  const [costCode,      setCostCode]      = useState('')
  const [contactPhone,  setContactPhone]  = useState('')

  // Line items
  const [items, setItems] = useState<LineItem[]>([{ description: '', qty: '', unit: 'Pieces' }])

  // Notes / justification
  const [notes, setNotes] = useState('')

  // Form state
  const [errors,    setErrors]    = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [deliveryNumber, setDeliveryNumber] = useState('')

  const isTR = requestType === 'TR'

  // ── Item helpers ────────────────────────────────────────────────────────────

  function addItem() {
    setItems(prev => [...prev, { description: '', qty: '', unit: 'Pieces' }])
  }

  function removeItem(i: number) {
    if (items.length === 1) return
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateItem(i: number, field: keyof LineItem, val: string) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item))
    setErrors(e => ({ ...e, [`item_desc_${i}`]: '', [`item_qty_${i}`]: '' }))
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!requestType)                                              errs.requestType   = 'Select a request type'
    if (!destination)                                              errs.destination   = 'Destination is required'
    if (destination === 'Other' && !customDest.trim())             errs.customDest    = 'Please specify the destination'
    if (!urgency)                                                  errs.urgency       = 'Urgency level is required'
    if (!cargoType)                                                errs.cargoType     = 'Cargo type is required'
    if (!requiredDate)                                             errs.requiredDate  = 'Required on-site date is required'
    if (!returnDate)                                               errs.returnDate    = 'Expected return date is required'
    if (isTR && !notes.trim())                                     errs.notes         = 'Justification is required for Temporary Requisitions'
    items.forEach((item, i) => {
      if (!item.description.trim())                                errs[`item_desc_${i}`] = 'Description required'
      if (!item.qty || isNaN(Number(item.qty)) || Number(item.qty) <= 0) errs[`item_qty_${i}`] = 'Valid quantity required'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setDeliveryNumber(generateDeliveryNumber())
    setSubmitted(true)
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <AppShell
        role="requester"
        currentPath="/requester/new"
        title="Request Submitted"
        breadcrumb={[{ label: 'My Requests', href: '/requester' }, { label: 'Request Submitted' }]}
      >
        <div className="max-w-xl mx-auto mt-10">
          <div className="bg-white rounded-card shadow-card border border-border-default p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted</h2>
            <p className="text-sm text-gray-500 mb-6">Your request has been entered into the system and is awaiting processing.</p>

            <div className="bg-page-bg rounded-lg px-5 py-4 mb-6 text-left">
              <div className="text-xs text-gray-500 mb-1">Delivery Number</div>
              <div className="font-mono text-lg font-bold text-brand-500 tracking-wide">{deliveryNumber}</div>
            </div>

            {isTR && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5 text-left">
                <p className="text-xs font-semibold text-blue-700 mb-1">Pending Base Coordinator Approval</p>
                <p className="text-xs text-gray-600">Your TR has been emailed to the Base Coordinator. You will be notified once reviewed.</p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Link href="/requester" className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-button transition-colors">
                View My Requests
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false); setRequestType(''); setDestination(''); setCustomDest('')
                  setUrgency(''); setRequiredDate(''); setReturnDate(''); setCargoType('')
                  setWellField(''); setCostCode(''); setContactPhone('')
                  setItems([{ description: '', qty: '', unit: 'Pieces' }]); setNotes('')
                }}
                className="px-5 py-2.5 border border-border-default text-gray-700 text-sm font-medium rounded-button hover:bg-neutral-50 transition-colors"
              >
                New Request
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <AppShell
      role="requester"
      currentPath="/requester/new"
      title="Create Request"
      breadcrumb={[{ label: 'My Requests', href: '/requester' }, { label: 'New Request' }]}
    >
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">

        {/* ── SECTION 1: Request Type ── */}
        <div className="bg-white rounded-card shadow-card border border-border-default p-6">
          <SectionHeader step={1} title="Request Type" required />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {REQUEST_TYPES.map(rt => (
              <button
                key={rt.value}
                type="button"
                onClick={() => { setRequestType(rt.value); setErrors(e => ({ ...e, requestType: '' })) }}
                className={[
                  'text-left p-4 rounded-xl border-2 transition-all duration-150',
                  requestType === rt.value
                    ? 'border-brand-500 bg-brand-50 shadow-sm'
                    : 'border-border-default hover:border-gray-300 hover:bg-neutral-50',
                ].join(' ')}
              >
                <div className={`text-sm font-bold mb-1 ${requestType === rt.value ? 'text-brand-600' : 'text-gray-800'}`}>
                  {rt.label}
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">{rt.hint}</div>
              </button>
            ))}
          </div>
          {errors.requestType && <FieldError msg={errors.requestType} />}

          {isTR && (
            <div className="mt-4 flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                Temporary Requisitions require Base Coordinator email approval before processing. Full written justification is mandatory in the notes field below.
              </p>
            </div>
          )}
        </div>

        {/* ── SECTION 2: Logistics Details ── */}
        <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-5">
          <SectionHeader step={2} title="Logistics Details" required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Destination */}
            <div className="flex flex-col gap-1.5">
              <Label text="Destination" required />
              <Dropdown
                options={DESTINATION_OPTIONS}
                value={destination}
                onChange={v => { setDestination(v); setErrors(e => ({ ...e, destination: '' })) }}
                placeholder="Select destination…"
                error={!!errors.destination}
                searchable
              />
              {errors.destination && <FieldError msg={errors.destination} />}
              {destination === 'Other' && (
                <Input
                  placeholder="Specify destination"
                  value={customDest}
                  onChange={e => { setCustomDest(e.target.value); setErrors(err => ({ ...err, customDest: '' })) }}
                  error={!!errors.customDest}
                  className="mt-1"
                />
              )}
              {errors.customDest && <FieldError msg={errors.customDest} />}
            </div>

            {/* Cargo Type */}
            <div className="flex flex-col gap-1.5">
              <Label text="Cargo Type" required />
              <Dropdown
                options={CARGO_TYPES}
                value={cargoType}
                onChange={v => { setCargoType(v); setErrors(e => ({ ...e, cargoType: '' })) }}
                placeholder="Select cargo type…"
                error={!!errors.cargoType}
              />
              {errors.cargoType && <FieldError msg={errors.cargoType} />}
            </div>

            {/* Well / Field */}
            <div className="flex flex-col gap-1.5">
              <Label text="Well / Field Name" />
              <Dropdown
                options={WELL_FIELD_OPTIONS}
                value={wellField}
                onChange={setWellField}
                placeholder="Select well or field…"
                searchable
              />
            </div>

            {/* Cost Code */}
            <div className="flex flex-col gap-1.5">
              <Label text="Cost Centre / Cost Code" />
              <Input
                placeholder="e.g. CC-4821-OPS"
                value={costCode}
                onChange={e => setCostCode(e.target.value)}
              />
            </div>
          </div>

          {/* Contact phone */}
          <div className="flex flex-col gap-1.5">
            <Label text="Requestor Contact Phone" />
            <Input
              type="tel"
              placeholder="+234 800 000 0000"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="sm:w-64"
            />
          </div>
        </div>

        {/* ── SECTION 3: Urgency & Dates ── */}
        <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-5">
          <SectionHeader step={3} title="Urgency & Schedule" required />

          {/* Urgency buttons */}
          <div className="flex flex-col gap-1.5">
            <Label text="Urgency Level" required />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Low','Medium','High','Urgent'] as UrgencyLevel[]).map(lvl => {
                const cfg = URGENCY_CONFIG[lvl]
                const sty = URGENCY_STYLE[lvl]
                const sel = urgency === lvl
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => { setUrgency(lvl); setErrors(e => ({ ...e, urgency: '' })) }}
                    className={[
                      'flex flex-col items-center p-3.5 rounded-xl border-2 transition-all duration-150',
                      sel ? sty.active : 'border-border-default hover:border-gray-300 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    <div className={`w-3 h-3 rounded-full mb-2 ${sty.dot}`} />
                    <span className={`text-xs font-bold ${sel ? sty.text : 'text-gray-700'}`}>{lvl}</span>
                    <span className="text-[11px] text-gray-500 mt-0.5 text-center leading-tight">{cfg.label}</span>
                  </button>
                )
              })}
            </div>
            {urgency && (
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                Expected SLA: <span className="font-semibold text-gray-800">{getExpectedDate(urgency)}</span>
              </div>
            )}
            {errors.urgency && <FieldError msg={errors.urgency} />}
          </div>

          {/* Date fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <Label text="Required On-Site Date" required />
              <DatePicker
                value={requiredDate}
                onChange={v => { setRequiredDate(v); setErrors(e => ({ ...e, requiredDate: '' })) }}
                min={today()}
                placeholder="When is it needed offshore?"
                error={!!errors.requiredDate}
              />
              {errors.requiredDate && <FieldError msg={errors.requiredDate} />}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label text="Expected Return Date" required />
              <DatePicker
                value={returnDate}
                onChange={v => { setReturnDate(v); setErrors(e => ({ ...e, returnDate: '' })) }}
                min={requiredDate || today()}
                placeholder="When will it return?"
                error={!!errors.returnDate}
              />
              {errors.returnDate && <FieldError msg={errors.returnDate} />}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Equipment Items ── */}
        <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader step={4} title="Equipment Items" required noMb />
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
            >
              <Plus size={14} />
              Add Item
            </button>
          </div>

          {/* Column headers */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_88px_120px_32px] gap-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-1">
            <span>Description</span>
            <span>Qty</span>
            <span>Unit</span>
            <span />
          </div>

          <div className="space-y-2.5">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_88px_120px_32px] gap-2 items-start">
                {/* Description */}
                <div>
                  <Input
                    placeholder={`Item ${i + 1} — equipment description`}
                    value={item.description}
                    onChange={e => updateItem(i, 'description', e.target.value)}
                    error={!!errors[`item_desc_${i}`]}
                  />
                  {errors[`item_desc_${i}`] && <FieldError msg={errors[`item_desc_${i}`]} />}
                </div>

                {/* Qty */}
                <div>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={e => updateItem(i, 'qty', e.target.value)}
                    error={!!errors[`item_qty_${i}`]}
                    className="text-center"
                  />
                  {errors[`item_qty_${i}`] && <FieldError msg={errors[`item_qty_${i}`]} />}
                </div>

                {/* Unit */}
                <Dropdown
                  options={UNIT_OPTIONS}
                  value={item.unit}
                  onChange={v => updateItem(i, 'unit', v)}
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  aria-label="Remove item"
                  className="flex items-center justify-center w-8 h-12 text-neutral-300 hover:text-status-critical disabled:opacity-0 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
            <span>{items.length} line item{items.length !== 1 ? 's' : ''}</span>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              <Plus size={12} />
              Add another item
            </button>
          </div>
        </div>

        {/* ── SECTION 5: Notes ── */}
        <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-3">
          <SectionHeader step={5} title={isTR ? 'Justification (Required for TR)' : 'Additional Notes'} required={isTR} noMb />
          <Textarea
            rows={4}
            placeholder={
              isTR
                ? 'Provide full written justification for the temporary requisition — describe why this equipment is needed, the operational impact if not fulfilled, and reference any relevant work orders or well programmes…'
                : 'Any special handling instructions, packaging requirements, or operational context…'
            }
            value={notes}
            onChange={e => { setNotes(e.target.value); setErrors(e2 => ({ ...e2, notes: '' })) }}
            error={!!errors.notes}
          />
          {errors.notes && <FieldError msg={errors.notes} />}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between py-2">
          <Link href="/requester" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            Cancel
          </Link>
          <Button
            type="submit"
            variant="brand"
            size="lg"
            icon={<ArrowRight size={15} />}
            iconPosition="right"
          >
            Submit Request
          </Button>
        </div>

      </form>
    </AppShell>
  )
}

// ── Small UI helpers ──────────────────────────────────────────────────────────

function SectionHeader({ step, title, required, noMb }: { step: number; title: string; required?: boolean; noMb?: boolean }) {
  return (
    <div className={noMb ? '' : 'mb-4'}>
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
        <h2 className="text-sm font-bold text-neutral-900">
          {title}
          {required && <span className="text-status-critical ml-0.5">*</span>}
        </h2>
      </div>
    </div>
  )
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium text-gray-700">
      {text}
      {required && <span className="text-status-critical ml-0.5">*</span>}
    </label>
  )
}

function FieldError({ msg }: { msg: string }) {
  return <p className="text-xs text-status-critical mt-0.5">{msg}</p>
}
