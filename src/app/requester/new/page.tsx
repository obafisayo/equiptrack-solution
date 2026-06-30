/* eslint-disable */
'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import type { UrgencyLevel } from '@/config/sla'
import { type LineItem } from './_components/constants'
import { generateDeliveryNumber } from './_components/helpers'
import { SuccessScreen } from './_components/SuccessScreen'
import { RequestTypeSection } from './_components/RequestTypeSection'
import { LogisticsSection } from './_components/LogisticsSection'
import { UrgencyScheduleSection } from './_components/UrgencyScheduleSection'
import { EquipmentItemsSection } from './_components/EquipmentItemsSection'
import { NotesSection } from './_components/NotesSection'
import { FormFooter } from './_components/FormFooter'

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

  function handleNewRequest() {
    setSubmitted(false); setRequestType(''); setDestination(''); setCustomDest('')
    setUrgency(''); setRequiredDate(''); setReturnDate(''); setCargoType('')
    setWellField(''); setCostCode(''); setContactPhone('')
    setItems([{ description: '', qty: '', unit: 'Pieces' }]); setNotes('')
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <SuccessScreen
        deliveryNumber={deliveryNumber}
        isTR={isTR}
        onNewRequest={handleNewRequest}
      />
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

        <RequestTypeSection
          requestType={requestType}
          isTR={isTR}
          error={errors.requestType}
          onSelect={value => { setRequestType(value); setErrors(e => ({ ...e, requestType: '' })) }}
        />

        <LogisticsSection
          destination={destination}
          customDest={customDest}
          cargoType={cargoType}
          wellField={wellField}
          costCode={costCode}
          contactPhone={contactPhone}
          errors={errors}
          onDestinationChange={v => { setDestination(v); setErrors(e => ({ ...e, destination: '' })) }}
          onCustomDestChange={v => { setCustomDest(v); setErrors(e => ({ ...e, customDest: '' })) }}
          onCargoTypeChange={v => { setCargoType(v); setErrors(e => ({ ...e, cargoType: '' })) }}
          onWellFieldChange={setWellField}
          onCostCodeChange={setCostCode}
          onContactPhoneChange={setContactPhone}
        />

        <UrgencyScheduleSection
          urgency={urgency}
          requiredDate={requiredDate}
          returnDate={returnDate}
          errors={errors}
          onUrgencyChange={v => { setUrgency(v); setErrors(e => ({ ...e, urgency: '' })) }}
          onRequiredDateChange={v => { setRequiredDate(v); setErrors(e => ({ ...e, requiredDate: '' })) }}
          onReturnDateChange={v => { setReturnDate(v); setErrors(e => ({ ...e, returnDate: '' })) }}
        />

        <EquipmentItemsSection
          items={items}
          errors={errors}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
        />

        <NotesSection
          isTR={isTR}
          notes={notes}
          error={errors.notes}
          onChange={v => { setNotes(v); setErrors(e2 => ({ ...e2, notes: '' })) }}
        />

        <FormFooter />

      </form>
    </AppShell>
  )
}
