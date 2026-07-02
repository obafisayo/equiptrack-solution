'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { DollarSign, AlertCircle, CheckCircle2, Package } from 'lucide-react'
import { INIT_CONTAINERS } from '@/app/qaqc/containers/_components/types'
import { ContractorSummaryCard } from './_components/ContractorSummaryCard'
import { PaymentDialog } from './_components/PaymentDialog'
import { CONTRACTORS, MOCK_PAYMENTS, type Payment } from './_components/types'

type Tab = 'by-contractor' | 'by-container' | 'payments'

export default function CCUInvoicingPage() {
  const [activeTab, setActiveTab]             = useState<Tab>('by-contractor')
  const [payments, setPayments]               = useState<Payment[]>(MOCK_PAYMENTS)
  const [paymentDialogId, setPaymentDialogId] = useState<string | null>(null)
  const [breakdownId, setBreakdownId]         = useState<string | null>(null)

  const containers = INIT_CONTAINERS
  const today      = new Date()

  function daysDeployed(startDate: string | null) {
    if (!startDate) return 0
    return Math.max(0, Math.round((today.getTime() - new Date(startDate).getTime()) / 86_400_000))
  }

  const allStats = useMemo(() => {
    let totalAccrued = 0
    let totalPaid    = 0
    containers.forEach(c => {
      if (c.hiringStartDate && c.dailyRateUSD) {
        totalAccrued += daysDeployed(c.hiringStartDate) * c.dailyRateUSD
      }
    })
    payments.forEach(p => { totalPaid += p.amountUSD })
    return { totalAccrued, totalPaid, balance: totalAccrued - totalPaid }
  }, [containers, payments])

  function handleRecordPayment(amount: number, date: string, reference: string, notes: string) {
    if (!paymentDialogId) return
    const newPay: Payment = {
      id: 'PAY-' + Date.now(),
      contractorId: paymentDialogId,
      date,
      amountUSD: amount,
      reference,
      notes: notes || undefined,
      recordedBy: 'Femi Emmanuel',
    }
    setPayments(prev => [...prev, newPay])
    setPaymentDialogId(null)
  }

  const payingContractor = paymentDialogId ? CONTRACTORS.find(c => c.id === paymentDialogId) : null

  const TABS: { id: Tab; label: string }[] = [
    { id: 'by-contractor', label: 'By Contractor' },
    { id: 'by-container',  label: 'By Container'  },
    { id: 'payments',      label: 'Payment History' },
  ]

  return (
    <AppShell
      role="qaqc"
      currentPath="/qaqc/ccu-invoicing"
      title="CCU Invoicing"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC' }, { label: 'CCU Invoicing' }]}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Accrued"     value={`$${(allStats.totalAccrued / 1000).toFixed(0)}k`} color="#10B981" icon={DollarSign} />
        <StatCard label="Total Paid"        value={`$${(allStats.totalPaid / 1000).toFixed(0)}k`}    color="#22C55E" icon={CheckCircle2}
          trend={{ direction: 'up', value: 'all time', positive: true }} />
        <StatCard label="Outstanding Balance" value={`$${(allStats.balance / 1000).toFixed(0)}k`}
          color={allStats.balance > 10000 ? '#EF4444' : allStats.balance > 0 ? '#F59E0B' : '#22C55E'}
          icon={AlertCircle}
          trend={{ direction: allStats.balance > 0 ? 'up' : 'down', value: allStats.balance > 0 ? 'unpaid' : 'all clear', positive: allStats.balance === 0 }}
        />
        <StatCard label="Containers on Hire" value={containers.filter(c => c.hiringStartDate).length} color="#F59E0B" icon={Package} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-default mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={[
              'px-5 py-2.5 text-[13px] font-semibold border-b-2 transition-colors',
              activeTab === t.id
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: By Contractor */}
      {activeTab === 'by-contractor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CONTRACTORS.map(c => (
            <ContractorSummaryCard
              key={c.id}
              contractor={c}
              containers={containers}
              payments={payments}
              onViewBreakdown={id => setBreakdownId(prev => prev === id ? null : id)}
              onRecordPayment={id => setPaymentDialogId(id)}
            />
          ))}
        </div>
      )}

      {/* Tab: By Container */}
      {activeTab === 'by-container' && (
        <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border-default">
              <tr>
                {['Serial', 'Type', 'Contractor', 'Hire Start', 'Days', 'Daily Rate', 'Total Accrued'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {containers.filter(c => c.hiringStartDate).map(c => {
                const contractor = CONTRACTORS.find(ct => ct.id === c.contractorId)
                const days       = daysDeployed(c.hiringStartDate)
                const accrued    = (c.dailyRateUSD ?? 0) * days
                return (
                  <tr key={c.serialNumber} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-[12px] font-semibold text-gray-800">{c.serialNumber}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-600">{c.type}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-700">{contractor?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-600">{c.hiringStartDate ?? '—'}</td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-gray-800">{days}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-600">${c.dailyRateUSD}/day</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-gray-900">${accrued.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Payment History */}
      {activeTab === 'payments' && (
        <div className="bg-white border border-border-default rounded-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border-default">
              <tr>
                {['Date', 'Contractor', 'Amount', 'Reference', 'Notes', 'Recorded By'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {[...payments].sort((a, b) => b.date.localeCompare(a.date)).map(p => {
                const contractor = CONTRACTORS.find(c => c.id === p.contractorId)
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-[12px] text-gray-700">{p.date}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-700">{contractor?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-green-700">${p.amountUSD.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-gray-600">{p.reference}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-500">{p.notes ?? '—'}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-500">{p.recordedBy}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment dialog */}
      {payingContractor && (
        <PaymentDialog
          contractor={payingContractor}
          onConfirm={handleRecordPayment}
          onClose={() => setPaymentDialogId(null)}
        />
      )}
    </AppShell>
  )
}
