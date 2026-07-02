'use client'

import { useState } from 'react'
import { Plus, RotateCcw, FileText, Ship, Package } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { ReturnToBaseForm } from './_components/ReturnToBaseForm'
import { ReturnList } from './_components/ReturnList'
import { MOCK_RETURNS, type ReturnOrder } from './_components/types'

function genManifest() {
  return `MAN-2026-${String(Math.floor(Math.random() * 9000 + 1000))}`
}

export default function SiteLogisticsPage() {
  const [returns, setReturns] = useState<ReturnOrder[]>(MOCK_RETURNS)
  const [showForm, setShowForm] = useState(false)

  function handleSubmit(order: Omit<ReturnOrder, 'id' | 'manifestNumber'>) {
    const newReturn: ReturnOrder = {
      ...order,
      id: `RTB-2026-${String(returns.length + 1).padStart(3, '0')}`,
      manifestNumber: genManifest(),
    }
    setReturns(prev => [newReturn, ...prev])
    setShowForm(false)
  }

  const initiated       = returns.filter(r => r.status === 'initiated').length
  const manifestReady   = returns.filter(r => r.status === 'manifest-ready').length
  const inTransit       = returns.filter(r => r.status === 'in-transit').length
  const awaitingVessel  = returns.filter(r => r.status === 'deckspace-requested').length

  return (
    <AppShell
      role="site_logistics"
      currentPath="/site-logistics"
      title="Return to Base"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Return to Base' }]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Items to Return"    value={initiated}      color="#F59E0B" icon={RotateCcw} />
        <StatCard label="Manifest Pending"   value={manifestReady}  color="#F59E0B" icon={FileText}  />
        <StatCard label="Awaiting Vessel"    value={awaitingVessel} color="#F59E0B" icon={Ship}      />
        <StatCard label="In Transit"         value={inTransit}      color="#10B981" icon={Package}   />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-gray-900">Return Orders</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white text-[13px] font-semibold rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
        >
          <Plus size={14} />
          New Return to Base
        </button>
      </div>

      <ReturnList returns={returns} />

      {showForm && (
        <ReturnToBaseForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />
      )}
    </AppShell>
  )
}
