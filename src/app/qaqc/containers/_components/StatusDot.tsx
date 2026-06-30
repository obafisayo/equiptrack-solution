'use client'

import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { type CCUContainer, getExpiryState } from './types'

export function StatusDot({ c }: { c: CCUContainer }) {
  const s = getExpiryState(c.inspectionExpiry)
  if (s === 'expired' || s === 'locked')
    return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100"><AlertTriangle size={12} className="text-red-500" /></span>
  if (s === 'warning' || s === 'today' || c.status !== 'Available')
    return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100"><Clock size={12} className="text-amber-500" /></span>
  return <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100"><CheckCircle size={12} className="text-green-500" /></span>
}
