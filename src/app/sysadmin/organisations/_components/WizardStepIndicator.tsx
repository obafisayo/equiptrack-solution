'use client'

import { CheckCircle2 } from 'lucide-react'
import { STEPS } from './styleMaps'

interface WizardStepIndicatorProps {
  step: number
}

export function WizardStepIndicator({ step }: WizardStepIndicatorProps) {
  return (
    <div className="flex items-center gap-0 px-6 py-3 border-b border-border-default bg-neutral-50 shrink-0">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-0 flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
              i < step ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-500 text-white' : 'bg-neutral-200 text-neutral-400'
            }`}>
              {i < step ? <CheckCircle2 size={13}/> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold mt-1 whitespace-nowrap ${i === step ? 'text-brand-500' : 'text-neutral-400'}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < step ? 'bg-brand-500' : 'bg-neutral-200'}`}/>
          )}
        </div>
      ))}
    </div>
  )
}
