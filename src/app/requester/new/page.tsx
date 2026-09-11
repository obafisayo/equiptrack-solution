/* eslint-disable */
'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import type { UrgencyLevel } from '@/config/sla'
import type { RequestType, EntityType } from '@/lib/mock-data'
import { createWorkOrder } from '@/lib/workflow-store'
import { type LineItem } from './_components/constants'
import { minDateForUrgency } from './_components/helpers'
import { SuccessScreen } from './_components/SuccessScreen'
import { RequestTypeSection } from './_components/RequestTypeSection'
import { LogisticsSection } from './_components/LogisticsSection'
import { UrgencyScheduleSection } from './_components/UrgencyScheduleSection'
import { EquipmentItemsSection } from './_components/EquipmentItemsSection'
import { NotesSection } from './_components/NotesSection'
import { FormFooter } from './_components/FormFooter'

export default function NewRequestPage() {
  const [requestType,  setRequestType]  = useState('')
  const [destination,  setDestination]  = useState('')
  const [customDest,   setCustomDest]   = useState('')
  const [urgency,      setUrgency]      = useState<UrgencyLevel | ''>('')
  const [requiredDate, setRequiredDate] = useState('')
  const [returnDate,   setReturnDate]   = useState('')
  const [cargoType,    setCargoType]    = useState('')
  const [entity,       setEntity]       = useState('')
  const [items,        setItems]        = useState<LineItem[]>([{ description: '', qty: '', unit: 'Pieces' }])
  const [notes,        setNotes]        = useState('')
  const [errors,       setErrors]       = useState<Record<string, string>>({})
  const [submitted,    setSubmitted]    = useState(false)
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

  // ── Urgency change — clear dates that would violate the new minimum ──────────

  function handleUrgencyChange(v: UrgencyLevel) {
    setUrgency(v)
    setErrors(e => ({ ...e, urgency: '' }))
    const minDate = minDateForUrgency(v)
    if (requiredDate && requiredDate < minDate) {
      setRequiredDate('')
      setReturnDate('')
    } else if (returnDate && returnDate < (requiredDate || minDate)) {
      setReturnDate('')
    }
  }

  // ── Return date change — clear if before required date ───────────────────────

  function handleRequiredDateChange(v: string) {
    setRequiredDate(v)
    setErrors(e => ({ ...e, requiredDate: '' }))
    if (returnDate && returnDate < v) {
      setReturnDate('')
    }
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!requestType)                                                errs.requestType  = 'Select a request type'
    if (!destination)                                                errs.destination  = 'Destination is required'
    if (destination === 'Other' && !customDest.trim())               errs.customDest   = 'Please specify the destination'
    if (!entity)                                                     errs.entity       = 'Entity is required'
    if (!urgency)                                                    errs.urgency      = 'Urgency level is required'
    if (!cargoType)                                                  errs.cargoType    = 'Cargo type is required'
    if (!requiredDate) {
      errs.requiredDate = 'Required on-site date is required'
    } else if (urgency && requiredDate < minDateForUrgency(urgency)) {
      errs.requiredDate = `${urgency} priority requires at least ${urgency === 'Urgent' ? 'today' : `${(({ Low: 7, Medium: 5, High: 3 } as Record<string, number>)[urgency])} days`} from today`
    }
    if (!returnDate) {
      errs.returnDate = 'Expected return date is required'
    } else if (requiredDate && returnDate < requiredDate) {
      errs.returnDate = 'Return date must be on or after the required on-site date'
    }
    if (isTR && !notes.trim())                                       errs.notes        = 'Justification is required for Temporary Requisitions'
    items.forEach((item, i) => {
      if (!item.description.trim())                                  errs[`item_desc_${i}`] = 'Description required'
      if (!item.qty || isNaN(Number(item.qty)) || Number(item.qty) <= 0) errs[`item_qty_${i}`] = 'Valid quantity required'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const order = createWorkOrder({
      requestType:     requestType as RequestType,
      destination:     destination === 'Other' ? customDest : destination,
      urgency:         urgency as UrgencyLevel,
      requiredDate,
      returnDate,
      cargoType,
      requestedByName: 'Kenneth Nwosu',
      notes,
      entity:          entity as EntityType || undefined,
      items: items.map(it => ({
        description: it.description,
        qty:         Number(it.qty),
        unit:        it.unit,
        plant:       it.plant,
        binLoc:      it.binLoc,
        partNumber:  it.prWoNumber,
      })),
    })

    setDeliveryNumber(order.id)
    setSubmitted(true)
  }

  function handleNewRequest() {
    setSubmitted(false); setRequestType(''); setDestination(''); setCustomDest('')
    setUrgency(''); setRequiredDate(''); setReturnDate(''); setCargoType('')
    setEntity(''); setItems([{ description: '', qty: '', unit: 'Pieces' }]); setNotes('')
  }

  if (submitted) {
    return (
      <SuccessScreen
        deliveryNumber={deliveryNumber}
        isTR={isTR}
        onNewRequest={handleNewRequest}
      />
    )
  }

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
          entity={entity}
          errors={errors}
          onDestinationChange={v => { setDestination(v); setErrors(e => ({ ...e, destination: '' })) }}
          onCustomDestChange={v => { setCustomDest(v); setErrors(e => ({ ...e, customDest: '' })) }}
          onCargoTypeChange={v => { setCargoType(v); setErrors(e => ({ ...e, cargoType: '' })) }}
          onEntityChange={v => { setEntity(v); setErrors(e => ({ ...e, entity: '' })) }}
        />

        <UrgencyScheduleSection
          urgency={urgency}
          requiredDate={requiredDate}
          returnDate={returnDate}
          errors={errors}
          onUrgencyChange={handleUrgencyChange}
          onRequiredDateChange={handleRequiredDateChange}
          onReturnDateChange={v => { setReturnDate(v); setErrors(e => ({ ...e, returnDate: '' })) }}
        />

        <EquipmentItemsSection
          items={items}
          isTR={isTR}
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
