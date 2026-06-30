'use client'

import { Lock, AlertTriangle } from 'lucide-react'
import { TODAY, diffDays, getExpiryState } from './types'

export function ExpiryChip({ expiry }: { expiry: string }) {
  const days = diffDays(TODAY, expiry)
  const state = getExpiryState(expiry)
  const abs = Math.abs(days)

  const cfg = {
    expired: { label: `Expired ${abs}d ago`,     cls: 'bg-red-50 text-red-700 border-red-200',        icon: null },
    today:   { label: 'Expires today',            cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: null },
    locked:  { label: `LOCKED - ${days}d left`,    cls: 'bg-red-50 text-red-700 border-red-300',        icon: <Lock size={10} /> },
    warning: { label: `Warning - ${days}d left`,   cls: 'bg-amber-50 text-amber-700 border-amber-300', icon: <AlertTriangle size={10} /> },
    soon:    { label: `${days}d remaining`,        cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: null },
    ok:      { label: `${days}d remaining`,        cls: 'bg-green-50 text-green-700 border-green-200', icon: null },
  }[state]

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${cfg.cls}`}>
      {cfg.icon}{cfg.label}
    </span>
  )
}
