'use client'

import { useState } from 'react'
import { Package, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DispositionDialog } from './_components/DispositionDialog'
import {
  MOCK_RETURNS,
  STATUS_BADGE,
  DISPOSITION_LABEL,
  type ReturnOrder,
  type DispositionAction,
} from '@/app/site-logistics/_components/types'

export default function WarehouseReturnsPage() {
  const [returns, setReturns] = useState<ReturnOrder[]>(MOCK_RETURNS)
  const [selectedOrder, setSelectedOrder] = useState<ReturnOrder | null>(null)

  function handleReceive(orderId: string) {
    setReturns(prev => prev.map(r =>
      r.id === orderId ? { ...r, status: 'arrived', receivedBy: 'Emeka Okonkwo', receivedAt: new Date().toISOString() } : r
    ))
  }

  function handleDisposition(orderId: string, disposition: DispositionAction, notes: string) {
    setReturns(prev => prev.map(r =>
      r.id === orderId ? { ...r, status: 'disposition-assigned', disposition, dispositionNotes: notes } : r
    ))
    setSelectedOrder(null)
  }

  const arrived    = returns.filter(r => r.status === 'arrived').length
  const inTransit  = returns.filter(r => r.status === 'in-transit').length
  const disposed   = returns.filter(r => r.status === 'disposition-assigned').length
  const pending    = returns.filter(r => !['arrived', 'disposition-assigned'].includes(r.status)).length

  return (
    <AppShell
      role="wh_sup"
      currentPath="/warehouse/returns"
      title="Returned Items"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Warehouse', href: '/warehouse' }, { label: 'Returns' }]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Returns"      value={pending}   color="#F59E0B" icon={Clock}        />
        <StatCard label="In Transit"           value={inTransit} color="#F59E0B" icon={Package}      />
        <StatCard label="Arrived — Pending Disposition" value={arrived} color="#F59E0B" icon={AlertCircle} />
        <StatCard label="Disposition Assigned" value={disposed}  color="#10B981" icon={CheckCircle}  />
      </div>

      <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border-default">
          <h3 className="text-[14px] font-bold text-gray-800">All Return Orders</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-border-default">
            <tr>
              {['Return ID', 'Origin', 'Items', 'Status', 'Disposition', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {returns.map(r => {
              const badge = STATUS_BADGE[r.status]
              return (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-[12px] text-brand-500 font-semibold">{r.id}</td>
                  <td className="px-4 py-3 text-[13px] text-gray-800">
                    {r.origin === 'site' ? r.siteName : 'Vendor Return'}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-700">{r.items.length}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-[11px] font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">
                    {r.disposition ? DISPOSITION_LABEL[r.disposition] : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'in-transit' && (
                      <button
                        onClick={() => handleReceive(r.id)}
                        className="text-[12px] font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
                      >
                        Mark Received
                      </button>
                    )}
                    {r.status === 'arrived' && (
                      <button
                        onClick={() => setSelectedOrder(r)}
                        className="text-[12px] font-semibold text-brand-500 bg-red-50 border border-red-200 px-3 py-1 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Assign Disposition
                      </button>
                    )}
                    {r.status === 'disposition-assigned' && (
                      <span className="text-[12px] text-gray-400">Complete</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <DispositionDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onConfirm={handleDisposition}
        />
      )}
    </AppShell>
  )
}
