/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { VESSELS, type Vessel, type VesselStatus } from '@/lib/mock-data'
import { MONTHS, DAYS_FULL, TODAY_ISO, TODAY } from './_components/constants'
import { toKey, getCalendarCells, getWeekOf } from './_components/helpers'
import { INIT_EVENTS } from './_components/initEvents'
import type { VesselEvent, EventType, CalView } from './_components/types'
import { EventDetailsPanel } from './_components/EventDetailsPanel'
import { FilterPanel } from './_components/FilterPanel'
import { KpiRow } from './_components/KpiRow'
import { CalendarToolbar } from './_components/CalendarToolbar'
import { MonthView } from './_components/MonthView'
import { WeekView } from './_components/WeekView'
import { DayView } from './_components/DayView'
import { NewAgendaPanel, type AgendaForm } from './_components/NewAgendaPanel'

export default function LogisticsCalendar() {
  const [vessels] = useState<Vessel[]>(VESSELS)
  const [events, setEvents] = useState<VesselEvent[]>(INIT_EVENTS)

  const [calView, setCalView] = useState<CalView>('Month')
  const [viewYear, setViewYear] = useState(2026)
  const [viewMonth, setViewMonth] = useState(5)
  const [focusDate, setFocusDate] = useState<Date>(TODAY)
  const [selectedId, setSelectedId] = useState<string | null>('EVT-001-DEP')
  const [filterOpen, setFilterOpen] = useState(false)

  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(new Set(['Departure', 'Arrival']))
  const [activeStatuses, setActiveStatuses] = useState<Set<VesselStatus>>(new Set(['available', 'loading', 'full', 'in-transit', 'arrived']))

  const [newOpen, setNewOpen] = useState(false)
  const [agForm, setAgForm] = useState<AgendaForm>({ vesselId: '', type: 'Departure', date: '', time: '08:00', port: '', destination: '', notes: '' })
  const [agErrors, setAgErrors] = useState<Record<string, string>>({})
  const [agSubmitOk, setAgSubmitOk] = useState(false)

  const vesselOptions = vessels.map(v => ({ value: v.id, label: v.name }))

  const filteredEvents = useMemo(
    () => events.filter(e => activeTypes.has(e.type) && activeStatuses.has(e.status)),
    [events, activeTypes, activeStatuses]
  )

  const eventsByDate = useMemo(() => {
    const map = new Map<string, VesselEvent[]>()
    for (const e of filteredEvents) {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date)!.push(e)
    }
    return map
  }, [filteredEvents])

  const calCells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth])
  const weekDates = useMemo(() => getWeekOf(focusDate), [focusDate])
  const selectedEvent = events.find(e => e.id === selectedId) ?? null

  function prevMonth() { viewMonth === 0 ? (setViewMonth(11), setViewYear(y => y - 1)) : setViewMonth(m => m - 1) }
  function nextMonth() { viewMonth === 11 ? (setViewMonth(0), setViewYear(y => y + 1)) : setViewMonth(m => m + 1) }

  function prevDay() { const d = new Date(focusDate); d.setDate(focusDate.getDate() - 1); setFocusDate(d) }
  function nextDay() { const d = new Date(focusDate); d.setDate(focusDate.getDate() + 1); setFocusDate(d) }
  function prevWeek() { const d = new Date(focusDate); d.setDate(focusDate.getDate() - 7); setFocusDate(d) }
  function nextWeek() { const d = new Date(focusDate); d.setDate(focusDate.getDate() + 7); setFocusDate(d) }

  function toggleType(t: EventType) {
    setActiveTypes(prev => { const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n })
  }
  function toggleStatus(s: VesselStatus) {
    setActiveStatuses(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n })
  }

  function validateAgenda() {
    const e: Record<string, string> = {}
    if (!agForm.vesselId) e.vesselId = 'Required'
    if (!agForm.date) e.date = 'Required'
    if (!agForm.port) e.port = 'Required'
    if (!agForm.destination) e.destination = 'Required'
    setAgErrors(e)
    return Object.keys(e).length === 0
  }

  function submitAgenda(e: React.FormEvent) {
    e.preventDefault()
    if (!validateAgenda()) return
    const vessel = vessels.find(v => v.id === agForm.vesselId)!
    const newEvt: VesselEvent = {
      id: `EVT-${Date.now()}`, vesselId: agForm.vesselId, vesselName: vessel.name,
      type: agForm.type, date: agForm.date, time: agForm.time,
      port: agForm.port, destination: agForm.destination,
      capacitySqM: vessel.capacityUnits, bookedSqM: 0,
      distribution: [], status: 'available', pic: 'Danjuma Yusuf',
      notes: agForm.notes || undefined,
    }
    setEvents(prev => [...prev, newEvt])
    setAgSubmitOk(true)
    setTimeout(() => {
      setNewOpen(false); setAgSubmitOk(false)
      setAgForm({ vesselId: '', type: 'Departure', date: '', time: '08:00', port: '', destination: '', notes: '' })
    }, 1400)
  }

  const awaitingCount = VESSELS.filter(v => v.status === 'available').length
  const loadingCount = vessels.filter(v => v.status === 'loading').length
  const inTransitCount = vessels.filter(v => v.status === 'in-transit').length

  const navLabel = calView === 'Month'
    ? `${MONTHS[viewMonth]} ${viewYear}`
    : calView === 'Week'
    ? `${weekDates[0].getDate()} ${MONTHS[weekDates[0].getMonth()].slice(0, 3)} - ${weekDates[6].getDate()} ${MONTHS[weekDates[6].getMonth()].slice(0, 3)} ${weekDates[6].getFullYear()}`
    : `${DAYS_FULL[focusDate.getDay()]}, ${focusDate.getDate()} ${MONTHS[focusDate.getMonth()]} ${focusDate.getFullYear()}`

  function onPrev() { calView === 'Month' ? prevMonth() : calView === 'Week' ? prevWeek() : prevDay() }
  function onNext() { calView === 'Month' ? nextMonth() : calView === 'Week' ? nextWeek() : nextDay() }

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics"
      title="Vessel Schedule"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Logistics' }, { label: 'Calendar' }]}
    >
      <KpiRow
        totalEvents={events.length}
        awaitingCount={awaitingCount}
        loadingCount={loadingCount}
        inTransitCount={inTransitCount}
      />

      <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
        <CalendarToolbar
          filterOpen={filterOpen}
          onToggleFilter={() => setFilterOpen(v => !v)}
          navLabel={navLabel}
          onPrev={onPrev}
          onNext={onNext}
          calView={calView}
          onSelectView={setCalView}
          onNewAgenda={() => setNewOpen(true)}
        />

        <div className="flex min-h-[520px]">
          {filterOpen && (
            <FilterPanel
              activeTypes={activeTypes} activeStatuses={activeStatuses}
              onToggleType={toggleType} onToggleStatus={toggleStatus}
              onClose={() => setFilterOpen(false)}
            />
          )}

          <div className="flex-1 overflow-hidden">
            {calView === 'Month' && (
              <MonthView
                calCells={calCells}
                viewMonth={viewMonth}
                eventsByDate={eventsByDate}
                selectedId={selectedId}
                onSelectDate={(date) => { setFocusDate(date); setCalView('Day') }}
                onSelectEvent={(id) => setSelectedId(id === selectedId ? null : id)}
              />
            )}

            {calView === 'Week' && (
              <WeekView
                weekDates={weekDates}
                eventsByDate={eventsByDate}
                selectedId={selectedId}
                onSelectDate={(date) => { setFocusDate(date); setCalView('Day') }}
                onSelectEvent={(id) => setSelectedId(id === selectedId ? null : id)}
              />
            )}

            {calView === 'Day' && (
              <DayView
                focusDate={focusDate}
                eventsByDate={eventsByDate}
                todayIso={TODAY_ISO}
                selectedId={selectedId}
                onSelectEvent={(id) => setSelectedId(id === selectedId ? null : id)}
                onNewAgenda={() => setNewOpen(true)}
              />
            )}
          </div>

          {selectedEvent && (
            <EventDetailsPanel event={selectedEvent} onClose={() => setSelectedId(null)}/>
          )}
        </div>
      </div>

      {newOpen && (
        <NewAgendaPanel
          vesselOptions={vesselOptions}
          agForm={agForm}
          agErrors={agErrors}
          agSubmitOk={agSubmitOk}
          onChange={setAgForm}
          onClearError={(field) => setAgErrors(e => ({ ...e, [field]: '' }))}
          onSubmit={submitAgenda}
          onClose={() => setNewOpen(false)}
        />
      )}
    </AppShell>
  )
}
