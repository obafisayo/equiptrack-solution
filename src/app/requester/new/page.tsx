'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { URGENCY_CONFIG } from '@/config/sla'
import type { UrgencyLevel } from '@/config/sla'
import Link from 'next/link'

const DESTINATIONS = [
  'Bonny Terminal',
  'Escravos Terminal',
  'Forcados Terminal',
  'Bonga FPSO',
  'Agbami FPSO',
  'Erha FPSO',
  'Egina FPSO',
  'Akpo FPSO',
  'Usan FPSO',
  'Okwori FPSO',
  'Pennington Terminal',
  'Brass Terminal',
  'Ima Field',
  'Abo FPSO',
  'Other (specify)',
]

const REQUEST_TYPES = [
  { value: 'SAP',       label: 'SAP Request',              hint: 'Standard stock item from SAP system' },
  { value: 'TR',        label: 'Temporary Requisition',    hint: 'Requires Base Coordinator email approval first' },
  { value: 'NON_STOCK', label: 'Non-Stock Item',           hint: 'Goes directly to Dispatch' },
]

const UNITS = ['Pieces', 'Sets', 'Boxes', 'Bags', 'Drums', 'Litres', 'Kg', 'Metres', 'Pairs', 'Units']

interface LineItem { description: string; qty: string; unit: string }

function getExpectedDate(urgency: UrgencyLevel | ''): string {
  if (!urgency) return ''
  const cfg = URGENCY_CONFIG[urgency]
  if (!cfg.days) return 'Next available boat departure'
  const d = new Date()
  d.setDate(d.getDate() + cfg.days)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function generateDeliveryNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `DEL-${new Date().getFullYear()}-${num}`
}

export default function NewRequestPage() {
  const [requestType, setRequestType]     = useState<string>('')
  const [destination, setDestination]     = useState<string>('')
  const [customDest, setCustomDest]       = useState<string>('')
  const [urgency, setUrgency]             = useState<UrgencyLevel | ''>('')
  const [items, setItems]                 = useState<LineItem[]>([{ description: '', qty: '', unit: 'Pieces' }])
  const [notes, setNotes]                 = useState<string>('')
  const [returnDate, setReturnDate]       = useState<string>('')
  const [errors, setErrors]               = useState<Record<string, string>>({})
  const [submitted, setSubmitted]         = useState<boolean>(false)
  const [deliveryNumber, setDeliveryNumber] = useState<string>('')

  const isTR = requestType === 'TR'

  function addItem() {
    setItems(prev => [...prev, { description: '', qty: '', unit: 'Pieces' }])
  }

  function removeItem(i: number) {
    if (items.length === 1) return
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateItem(i: number, field: keyof LineItem, value: string) {
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!requestType)   errs.requestType   = 'Request type is required'
    if (!destination)   errs.destination   = 'Destination is required'
    if (destination === 'Other (specify)' && !customDest.trim()) errs.customDest = 'Please specify the destination'
    if (!urgency)       errs.urgency       = 'Urgency level is required'
    if (!returnDate)    errs.returnDate    = 'Expected return date is required'
    items.forEach((item, i) => {
      if (!item.description.trim()) errs[`item_desc_${i}`] = 'Description required'
      if (!item.qty || isNaN(Number(item.qty)) || Number(item.qty) <= 0) errs[`item_qty_${i}`] = 'Valid qty required'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const dn = generateDeliveryNumber()
    setDeliveryNumber(dn)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppShell
        role="requester"
        currentPath="/requester/new"
        title="Request Submitted"
        breadcrumb={[{ label: 'My Requests', href: '/requester' }, { label: 'Request Submitted' }]}
        actionLabel="New Request"
        actionHref="/requester/new"
      >
        <div className="max-w-xl mx-auto mt-10">
          <div className="bg-white rounded-card shadow-card border border-border-default p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-status-success-bg flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted</h2>
            <p className="text-sm text-gray-500 mb-6">Your request has been received and entered into the system.</p>

            <div className="bg-page-bg rounded-lg px-5 py-4 mb-6 text-left">
              <div className="text-xs text-gray-500 mb-1">Delivery Number</div>
              <div className="font-mono text-lg font-bold text-brand-500 tracking-wide">{deliveryNumber}</div>
            </div>

            {isTR && (
              <div className="bg-status-info-bg border border-status-info/20 rounded-lg px-4 py-3 mb-5 text-left">
                <p className="text-xs font-semibold text-status-info mb-1">Pending Base Coordinator Approval</p>
                <p className="text-xs text-gray-600">Your Temporary Requisition has been emailed to the Base Coordinator for approval. You will be notified once reviewed.</p>
              </div>
            )}

            <p className="text-xs text-gray-500 mb-6">
              {isTR
                ? 'Once approved, your request will move to the warehouse team for processing.'
                : 'Your request has been added to the warehouse queue. You can track its progress from your dashboard.'}
            </p>

            <div className="flex gap-3 justify-center">
              <Link
                href="/requester"
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-button transition-colors"
              >
                View My Requests
              </Link>
              <button
                onClick={() => { setSubmitted(false); setRequestType(''); setDestination(''); setUrgency(''); setItems([{ description: '', qty: '', unit: 'Pieces' }]); setNotes(''); setReturnDate('') }}
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

  return (
    <AppShell
      role="requester"
      currentPath="/requester/new"
      title="Create Request"
      breadcrumb={[{ label: 'My Requests', href: '/requester' }, { label: 'New Request' }]}
      actionLabel="Back to Requests"
      actionHref="/requester"
    >
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-6">

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Type <span className="text-status-critical">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {REQUEST_TYPES.map(rt => (
                <button
                  key={rt.value}
                  type="button"
                  onClick={() => { setRequestType(rt.value); setErrors(e => ({ ...e, requestType: '' })) }}
                  className={`text-left p-3.5 rounded-lg border-2 transition-all duration-150 ${
                    requestType === rt.value
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-border-default hover:border-gray-300'
                  }`}
                >
                  <div className={`text-sm font-semibold mb-0.5 ${requestType === rt.value ? 'text-brand-600' : 'text-gray-800'}`}>
                    {rt.label}
                  </div>
                  <div className="text-xs text-gray-500">{rt.hint}</div>
                </button>
              ))}
            </div>
            {errors.requestType && <p className="mt-1.5 text-xs text-status-critical">{errors.requestType}</p>}
          </div>

          {/* TR Notice */}
          {isTR && (
            <div className="flex gap-3 bg-status-info-bg border border-status-info/20 rounded-lg px-4 py-3">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
              </svg>
              <p className="text-xs text-status-info font-medium leading-relaxed">
                Temporary Requisition requires Base Coordinator email approval before processing. Provide full justification in the notes field.
              </p>
            </div>
          )}

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Destination <span className="text-status-critical">*</span>
            </label>
            <select
              value={destination}
              onChange={e => { setDestination(e.target.value); setErrors(err => ({ ...err, destination: '' })) }}
              className={`w-full px-3 py-2.5 text-sm bg-white border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition ${
                errors.destination ? 'border-status-critical' : 'border-border-default'
              }`}
            >
              <option value="">Select destination…</option>
              {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.destination && <p className="mt-1 text-xs text-status-critical">{errors.destination}</p>}
            {destination === 'Other (specify)' && (
              <input
                type="text"
                placeholder="Specify destination"
                value={customDest}
                onChange={e => { setCustomDest(e.target.value); setErrors(err => ({ ...err, customDest: '' })) }}
                className={`mt-2 w-full px-3 py-2.5 text-sm bg-white border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                  errors.customDest ? 'border-status-critical' : 'border-border-default'
                }`}
              />
            )}
            {errors.customDest && <p className="mt-1 text-xs text-status-critical">{errors.customDest}</p>}
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Urgency Level <span className="text-status-critical">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Low','Medium','High','Urgent'] as UrgencyLevel[]).map(lvl => {
                const cfg = URGENCY_CONFIG[lvl]
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => { setUrgency(lvl); setErrors(e => ({ ...e, urgency: '' })) }}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-150 ${
                      urgency === lvl ? 'border-current' : 'border-border-default hover:border-gray-300'
                    }`}
                    style={urgency === lvl ? { borderColor: cfg.color, background: cfg.bg } : {}}
                  >
                    <div className="w-3 h-3 rounded-full mb-1.5" style={{ background: cfg.color }} />
                    <span className="text-xs font-semibold" style={{ color: urgency === lvl ? cfg.color : '#374151' }}>{lvl}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{cfg.label}</span>
                  </button>
                )
              })}
            </div>
            {urgency && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                </svg>
                Expected delivery: <span className="font-semibold text-gray-800">{getExpectedDate(urgency)}</span>
              </div>
            )}
            {errors.urgency && <p className="mt-1 text-xs text-status-critical">{errors.urgency}</p>}
          </div>

          {/* Expected Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Expected Return Date <span className="text-status-critical">*</span>
            </label>
            <input
              type="date"
              value={returnDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => { setReturnDate(e.target.value); setErrors(err => ({ ...err, returnDate: '' })) }}
              className={`w-full sm:w-64 px-3 py-2.5 text-sm bg-white border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                errors.returnDate ? 'border-status-critical' : 'border-border-default'
              }`}
            />
            {errors.returnDate && <p className="mt-1 text-xs text-status-critical">{errors.returnDate}</p>}
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Equipment Items <span className="text-status-critical">*</span>
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Equipment description"
                      value={item.description}
                      onChange={e => { updateItem(i, 'description', e.target.value); setErrors(err => ({ ...err, [`item_desc_${i}`]: '' })) }}
                      className={`w-full px-3 py-2 text-sm border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                        errors[`item_desc_${i}`] ? 'border-status-critical' : 'border-border-default'
                      }`}
                    />
                    {errors[`item_desc_${i}`] && <p className="mt-0.5 text-xs text-status-critical">{errors[`item_desc_${i}`]}</p>}
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={e => { updateItem(i, 'qty', e.target.value); setErrors(err => ({ ...err, [`item_qty_${i}`]: '' })) }}
                      className={`w-full px-3 py-2 text-sm border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 transition text-center ${
                        errors[`item_qty_${i}`] ? 'border-status-critical' : 'border-border-default'
                      }`}
                    />
                  </div>
                  <div className="w-28">
                    <select
                      value={item.unit}
                      onChange={e => updateItem(i, 'unit', e.target.value)}
                      className="w-full px-2 py-2 text-sm border border-border-default rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="mt-2 text-gray-400 hover:text-status-critical transition-colors"
                    >
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (Optional)</label>
            <textarea
              rows={3}
              placeholder={isTR ? 'Provide justification for the temporary requisition…' : 'Any additional notes or special instructions…'}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-border-default rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 transition resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-4">
          <Link href="/requester" className="text-sm text-gray-500 hover:text-gray-700 font-medium">
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-button transition-colors duration-150 flex items-center gap-2"
          >
            Submit Request
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </form>
    </AppShell>
  )
}
