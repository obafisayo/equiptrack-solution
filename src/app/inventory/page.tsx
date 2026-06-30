/* eslint-disable */
'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { CONTAINERS } from '@/lib/mock-data'
import { INIT_STOCK, INIT_MOVEMENTS } from './_components/mockData'
import { InventoryKpiStrip } from './_components/InventoryKpiStrip'
import { InventoryActionBar } from './_components/InventoryActionBar'
import { InventoryTabBar } from './_components/InventoryTabBar'
import { StockTab } from './_components/StockTab'
import { MovementsTab } from './_components/MovementsTab'
import { ReorderQueueTab } from './_components/ReorderQueueTab'
import { StockDetailPanel } from './_components/StockDetailPanel'
import { IssueEquipmentPanel } from './_components/IssueEquipmentPanel'
import { AddStockPanel, type AddForm } from './_components/AddStockPanel'
import type { StockItem, Movement, StockStatus, Tab } from './_components/types'

export default function InventoryDashboard() {
  const [stock, setStock]         = useState<StockItem[]>(INIT_STOCK)
  const [movements, setMovements] = useState<Movement[]>(INIT_MOVEMENTS)
  const [tab, setTab]             = useState<Tab>('stock')

  // Filters
  const [search,  setSearch]  = useState('')
  const [catFilter, setCat]   = useState('All')

  // Panels
  const [detailItem, setDetailItem] = useState<StockItem | null>(null)
  const [issueItem,  setIssueItem]  = useState<StockItem | null>(null)
  const [addOpen,    setAddOpen]    = useState(false)

  // Issue form
  const [issueForm, setIssueForm] = useState({ qty: '', workOrder: '', note: '' })
  const [issueOk,   setIssueOk]   = useState(false)

  // Add stock form
  const [addForm, setAddForm]   = useState<AddForm>({ name:'', category:'', qty:'', reorderAt:'', unit:'', location:'' })
  const [addOk,   setAddOk]     = useState(false)
  const [addErrors, setAddErrors] = useState<Record<string,string>>({})

  // Derived
  const okCount       = stock.filter(i => i.status === 'ok').length
  const reorderCount  = stock.filter(i => i.status === 'reorder').length
  const criticalCount = stock.filter(i => i.status === 'critical').length
  const containerCount = CONTAINERS.filter(c => c.status === 'available').length

  const reorderQueue = stock.filter(i => i.status === 'reorder' || i.status === 'critical')

  const filteredStock = useMemo(() =>
    stock.filter(item => {
      const q = search.toLowerCase()
      if (catFilter !== 'All' && item.category !== catFilter) return false
      if (q && !item.name.toLowerCase().includes(q) && !item.id.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) return false
      return true
    }),
    [stock, search, catFilter]
  )

  function submitIssue(e: React.FormEvent) {
    e.preventDefault()
    if (!issueItem || !issueForm.qty) return
    const qty = parseInt(issueForm.qty)
    if (isNaN(qty) || qty <= 0) return

    const newMov: Movement = {
      id: `MOV-${Date.now()}`, itemId: issueItem.id, itemName: issueItem.name,
      type: 'Issue', qty, date: '2026-06-29', time: '00:00',
      by: 'Ngozi Eze', reference: issueForm.workOrder || undefined, note: issueForm.note || undefined,
    }
    setMovements(prev => [newMov, ...prev])
    setStock(prev => prev.map(s => {
      if (s.id !== issueItem.id) return s
      const newQty = s.qty - qty
      const status: StockStatus = newQty <= 0 ? 'critical' : newQty <= s.reorderAt ? (newQty <= s.reorderAt / 2 ? 'critical' : 'reorder') : 'ok'
      return { ...s, qty: newQty, status, lastUpdated: '2026-06-29' }
    }))
    setIssueOk(true)
    setTimeout(() => { setIssueItem(null); setIssueOk(false); setIssueForm({ qty:'', workOrder:'', note:'' }) }, 1400)
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault()
    const err: Record<string,string> = {}
    if (!addForm.name) err.name = 'Required'
    if (!addForm.category) err.category = 'Required'
    if (!addForm.qty || isNaN(+addForm.qty)) err.qty = 'Required'
    if (!addForm.unit) err.unit = 'Required'
    setAddErrors(err)
    if (Object.keys(err).length > 0) return

    const qty = parseInt(addForm.qty)
    const ro  = parseInt(addForm.reorderAt) || Math.floor(qty * 0.3)
    const status: StockStatus = qty <= 0 ? 'critical' : qty <= ro ? 'reorder' : 'ok'
    const id = `EQ-${String(stock.length + 200).padStart(4,'0')}`
    setStock(prev => [...prev, {
      id, name: addForm.name, category: addForm.category, qty, reorderAt: ro,
      unit: addForm.unit, status, location: addForm.location || 'TBD', lastUpdated: '2026-06-29',
    }])
    setMovements(prev => [{
      id: `MOV-${Date.now()}`, itemId: id, itemName: addForm.name, type: 'Receive',
      qty, date: '2026-06-29', time: '00:00', by: 'Ngozi Eze', note: 'Initial stock entry',
    }, ...prev])
    setAddOk(true)
    setTimeout(() => { setAddOpen(false); setAddOk(false); setAddForm({name:'',category:'',qty:'',reorderAt:'',unit:'',location:''}) }, 1400)
  }

  return (
    <AppShell
      role="inventory"
      currentPath="/inventory"
      title="Stock Overview"
      breadcrumb={[{label:'Home',href:'/'},{label:'Inventory'}]}
    >
      <InventoryKpiStrip
        okCount={okCount}
        reorderCount={reorderCount}
        criticalCount={criticalCount}
        containerCount={containerCount}
      />

      <InventoryActionBar
        search={search}
        onSearchChange={setSearch}
        onAddStock={() => setAddOpen(true)}
      />

      <InventoryTabBar
        active={tab}
        stockCount={stock.length}
        movementsCount={movements.length}
        reorderCount={reorderQueue.length}
        onSelect={setTab}
      />

      {tab === 'stock' && (
        <StockTab
          stock={filteredStock}
          catFilter={catFilter}
          onCatFilterChange={setCat}
          onSelectItem={setDetailItem}
          onIssueItem={setIssueItem}
        />
      )}

      {tab === 'movements' && (
        <MovementsTab movements={movements} />
      )}

      {tab === 'reorder' && (
        <ReorderQueueTab reorderQueue={reorderQueue} onSelectItem={setDetailItem} />
      )}

      {detailItem && (
        <StockDetailPanel
          item={detailItem}
          movements={movements}
          onClose={() => setDetailItem(null)}
          onIssue={item => { setDetailItem(null); setIssueItem(item) }}
        />
      )}

      {issueItem && (
        <IssueEquipmentPanel
          item={issueItem}
          form={issueForm}
          success={issueOk}
          onFormChange={setIssueForm}
          onSubmit={submitIssue}
          onClose={() => setIssueItem(null)}
        />
      )}

      {addOpen && (
        <AddStockPanel
          form={addForm}
          errors={addErrors}
          success={addOk}
          onFormChange={setAddForm}
          onErrorsChange={setAddErrors}
          onSubmit={submitAdd}
          onClose={() => setAddOpen(false)}
        />
      )}
    </AppShell>
  )
}
