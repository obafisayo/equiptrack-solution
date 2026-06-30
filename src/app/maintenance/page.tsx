/* eslint-disable */
'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { INIT_WOS, INIT_HISTORY, SCHEDULE } from './_components/mockData'
import { MaintenanceKpiStrip } from './_components/MaintenanceKpiStrip'
import { MaintenanceActionBar } from './_components/MaintenanceActionBar'
import { MaintenanceTabBar } from './_components/MaintenanceTabBar'
import { WorkOrdersTab } from './_components/WorkOrdersTab'
import { ScheduleTab } from './_components/ScheduleTab'
import { HistoryTab } from './_components/HistoryTab'
import { WorkOrderDetailPanel } from './_components/WorkOrderDetailPanel'
import { CreateWorkOrderPanel } from './_components/CreateWorkOrderPanel'
import type { WorkOrder, Tab, CreateForm } from './_components/types'

const TODAY = '2026-06-29'

export default function MaintenanceDashboard() {
  const [orders,  setOrders]  = useState<WorkOrder[]>(INIT_WOS)
  const [history, setHistory] = useState<WorkOrder[]>(INIT_HISTORY)
  const [tab, setTab]         = useState<Tab>('orders')

  // Detail panel
  const [detailWO, setDetailWO] = useState<WorkOrder | null>(null)
  const [noteInput, setNoteInput] = useState('')

  // Create WO panel
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState<CreateForm>({
    equipment:'', category:'', task:'', type:'Preventive',
    priority:'medium', assignedTo:'', dueDate:'', estimatedHours:'', note:'',
  })
  const [formErrors, setFormErrors] = useState<Record<string,string>>({})
  const [createOk, setCreateOk] = useState(false)

  // Completing animation
  const [completing, setCompleting] = useState<string|null>(null)

  // KPIs
  const inProgress  = orders.filter(o => o.status==='in_progress').length
  const pending     = orders.filter(o => o.status==='pending').length
  const overdue     = orders.filter(o => o.status==='overdue').length
  const completedCt = history.length

  function handleStart(id: string) {
    setOrders(prev => prev.map(o => o.id===id ? {...o, status:'in_progress', startedAt:TODAY} : o))
    if (detailWO?.id===id) setDetailWO(prev => prev ? {...prev, status:'in_progress', startedAt:TODAY} : null)
  }

  function handleComplete(id: string) {
    setCompleting(id)
    setTimeout(() => {
      const wo = orders.find(o => o.id===id)
      if (wo) {
        const done: WorkOrder = { ...wo, status:'completed', completedAt:TODAY, techNote: noteInput || wo.techNote }
        setHistory(prev => [done, ...prev])
        setOrders(prev => prev.filter(o => o.id!==id))
        setDetailWO(null)
      }
      setCompleting(null)
      setNoteInput('')
    }, 900)
  }

  function validateForm() {
    const e: Record<string,string> = {}
    if (!form.equipment) e.equipment = 'Required'
    if (!form.task.trim()) e.task = 'Required'
    if (!form.assignedTo) e.assignedTo = 'Required'
    if (!form.dueDate) e.dueDate = 'Required'
    setFormErrors(e)
    return Object.keys(e).length === 0
  }

  function submitCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return
    const id = `MNT-${String(orders.length + history.length + 10).padStart(3,'0')}`
    const newWO: WorkOrder = {
      id, equipment: form.equipment, category: form.category || 'General',
      task: form.task, type: form.type, priority: form.priority,
      status: 'pending', assignedTo: form.assignedTo, dueDate: form.dueDate,
      estimatedHours: parseFloat(form.estimatedHours) || 0,
      techNote: form.note || undefined,
    }
    setOrders(prev => [newWO, ...prev])
    setCreateOk(true)
    setTimeout(() => {
      setCreateOpen(false); setCreateOk(false)
      setForm({ equipment:'',category:'',task:'',type:'Preventive',priority:'medium',assignedTo:'',dueDate:'',estimatedHours:'',note:'' })
    }, 1400)
  }

  return (
    <AppShell
      role="maintenance"
      currentPath="/maintenance"
      title="Maintenance"
      breadcrumb={[{label:'Home',href:'/'},{label:'Maintenance'}]}
    >
      <MaintenanceKpiStrip
        inProgress={inProgress}
        pending={pending}
        overdue={overdue}
        completedCt={completedCt}
      />

      <MaintenanceActionBar onCreateWorkOrder={() => setCreateOpen(true)} />

      <MaintenanceTabBar
        active={tab}
        ordersCount={orders.length}
        scheduleCount={SCHEDULE.length}
        historyCount={history.length}
        onSelect={setTab}
      />

      {tab === 'orders' && (
        <WorkOrdersTab
          orders={orders}
          completing={completing}
          onSelectOrder={wo => { setDetailWO(wo); setNoteInput(wo.techNote??'') }}
          onStart={handleStart}
          onComplete={handleComplete}
        />
      )}

      {tab === 'schedule' && (
        <ScheduleTab orders={orders} schedule={SCHEDULE} today={TODAY} />
      )}

      {tab === 'history' && (
        <HistoryTab history={history} />
      )}

      {detailWO && (
        <WorkOrderDetailPanel
          workOrder={detailWO}
          noteInput={noteInput}
          completing={completing}
          onNoteChange={setNoteInput}
          onStart={handleStart}
          onComplete={handleComplete}
          onClose={() => setDetailWO(null)}
        />
      )}

      {createOpen && (
        <CreateWorkOrderPanel
          form={form}
          errors={formErrors}
          success={createOk}
          onFormChange={setForm}
          onErrorsChange={setFormErrors}
          onSubmit={submitCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </AppShell>
  )
}
