'use client'

import { ShieldCheck } from 'lucide-react'
import { getCurrentColorCode } from '@/config/ccu'

export function ColorCodeBanner() {
  const code = getCurrentColorCode()

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-xl border-2 mb-6"
      style={{ borderColor: code.hex, backgroundColor: code.hex + '14' }}
    >
      <div
        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
        style={{ backgroundColor: code.hex }}
      >
        <ShieldCheck size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Current Inspection Color Code</p>
        <p className="text-[18px] font-bold text-gray-900" style={{ color: code.hex }}>
          {code.color}
          <span className="text-gray-500 text-[13px] font-normal ml-2">· Valid {code.label}</span>
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[11px] text-gray-400">All containers must display this color</p>
        <p className="text-[11px] font-semibold text-gray-600">Containers with other colors are expired</p>
      </div>
    </div>
  )
}
