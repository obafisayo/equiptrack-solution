'use client'

import { useState } from 'react'
import { Users, AlertTriangle, BarChart2, Layers } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DetailPanel } from '@/components/domain/DetailPanel'
import { SectionTitle } from '@/components/domain/OrderGrid'
import { WORK_ORDERS, PERSONNEL, type WorkOrder, type Personnel } from '@/lib/mock-data'
import { type Stage } from '@/lib/lifecycle'
import { PersonnelCard } from './_components/PersonnelCard'
import { ReassignModal } from './_components/ReassignModal'

const WAREHOUSE_STAGES: Stage[] = [
  'New Request', 'Warehouse Assigned', 'Processing', 'GI Created', 'Transferred to Dispatch',
]

export default function PersonnelLoadPage() {
  const warehousePersonnel = PERSONNEL.filter(p => p.dept === 'warehouse')
  const [orders, setOrders] = useState<WorkOrder[]>(() =>
    WORK_ORDERS.filter(o => WAREHOUSE_STAGES.includes(o.stage as Stage))
  )
  const [reassigningFrom, setReassigningFrom] = useState<Personnel | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const ordersForPerson = (personId: string) =>
    orders.filter(o => o.assignedTo === personId)

  const overloaded = warehousePersonnel.filter(p => {
    const active = ordersForPerson(p.id).length
    return active / p.capacity > 0.8
  })

  const totalActive = orders.filter(o => o.assignedTo != null).length
  const totalCap = warehousePersonnel.reduce((s, p) => s + p.capacity, 0)
  const avgLoad = warehousePersonnel.length
    ? Math.round(totalActive / warehousePersonnel.length)
    : 0

  function handleReassign(selectedOrderIds: string[], targetId: string, targetName: string) {
    setOrders(prev =>
      prev.map(o =>
        selectedOrderIds.includes(o.id)
          ? { ...o, assignedTo: targetId, assignedToName: targetName }
          : o
      )
    )
    setReassigningFrom(null)
  }

  const selectedOrder = orders.find(o => o.id === selectedOrderId) ?? null

  return (
    <AppShell
      role="wh_sup"
      currentPath="/warehouse/personnel"
      title="Personnel Load"
      breadcrumb={[{ label: 'Dashboard', href: '/warehouse' }]}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Personnel"   value={warehousePersonnel.length} icon={Users} />
        <StatCard
          label="Overloaded"
          value={overloaded.length}
          color={overloaded.length > 0 ? '#EF4444' : '#22C55E'}
          icon={AlertTriangle}
        />
        <StatCard label="Avg Active Orders" value={avgLoad}    icon={BarChart2} />
        <StatCard label="Total Capacity"    value={totalCap}   icon={Layers} />
      </div>

      {/* Personnel cards */}
      <SectionTitle title="Warehouse Team" count={warehousePersonnel.length} className="mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {warehousePersonnel.map(person => (
          <PersonnelCard
            key={person.id}
            person={person}
            orders={ordersForPerson(person.id)}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
            onReassign={setReassigningFrom}
          />
        ))}
      </div>

      {/* Reassign Modal */}
      {reassigningFrom && (
        <ReassignModal
          source={reassigningFrom}
          targets={warehousePersonnel.filter(p => p.id !== reassigningFrom.id)}
          orders={ordersForPerson(reassigningFrom.id)}
          onConfirm={handleReassign}
          onClose={() => setReassigningFrom(null)}
        />
      )}

      {/* Detail panel */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          role="wh_sup"
        />
      )}
    </AppShell>
  )
}
