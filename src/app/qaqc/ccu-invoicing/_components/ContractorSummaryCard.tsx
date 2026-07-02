'use client'

import { ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Contractor, Payment } from './types'
import type { CCUContainer } from '@/app/qaqc/containers/_components/types'

interface Props {
  contractor: Contractor
  containers: CCUContainer[]
  payments: Payment[]
  onViewBreakdown: (id: string) => void
  onRecordPayment: (id: string) => void
}

export function ContractorSummaryCard({ contractor, containers, payments, onViewBreakdown, onRecordPayment }: Props) {
  const owned = containers.filter(c => c.contractorId === contractor.id)
  const today = new Date()

  let totalAccrued = 0
  owned.forEach(c => {
    if (c.hiringStartDate && c.dailyRateUSD) {
      const days = Math.max(0, Math.round((today.getTime() - new Date(c.hiringStartDate).getTime()) / 86_400_000))
      totalAccrued += days * c.dailyRateUSD
    }
  })

  const totalPaid = payments.filter(p => p.contractorId === contractor.id).reduce((s, p) => s + p.amountUSD, 0)
  const balance   = totalAccrued - totalPaid
  const isOverdue = balance > 0

  return (
    <div className={`bg-white border-2 rounded-card shadow-card p-5 ${isOverdue ? 'border-amber-300' : 'border-border-default'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-gray-900">{contractor.name}</h3>
          <p className="text-[12px] text-gray-500">{contractor.contactName} · {contractor.email}</p>
        </div>
        {isOverdue
          ? <AlertCircle size={18} className="text-amber-500 shrink-0" />
          : <CheckCircle2 size={18} className="text-green-500 shrink-0" />
        }
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-[18px] font-bold text-gray-900">{owned.length}</p>
          <p className="text-[10px] text-gray-400 uppercase">Containers</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-[16px] font-bold text-gray-900">${(totalAccrued / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-gray-400 uppercase">Accrued</p>
        </div>
        <div className={`rounded-lg p-3 text-center ${isOverdue ? 'bg-amber-50' : 'bg-green-50'}`}>
          <p className={`text-[16px] font-bold ${isOverdue ? 'text-amber-700' : 'text-green-700'}`}>
            ${(balance / 1000).toFixed(0)}k
          </p>
          <p className="text-[10px] text-gray-400 uppercase">Balance</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <span>Paid: ${totalPaid.toLocaleString()}</span>
          <span>Total: ${totalAccrued.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: Math.min(100, totalAccrued > 0 ? (totalPaid / totalAccrued) * 100 : 0) + '%' }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewBreakdown(contractor.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold rounded-lg border border-border-default text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Breakdown <ChevronRight size={13} />
        </button>
        <button
          onClick={() => onRecordPayment(contractor.id)}
          className="flex-1 py-2 text-[12px] font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
        >
          Record Payment
        </button>
      </div>
    </div>
  )
}
