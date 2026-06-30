'use client'

import { REQUEST_TYPES } from './constants'
import { SectionHeader, FieldError } from './FormHelpers'

interface RequestTypeSectionProps {
  requestType: string
  isTR: boolean
  error?: string
  onSelect: (value: string) => void
}

export function RequestTypeSection({ requestType, isTR, error, onSelect }: RequestTypeSectionProps) {
  return (
    <div className="bg-white rounded-card shadow-card border border-border-default p-6">
      <SectionHeader step={1} title="Request Type" required />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {REQUEST_TYPES.map(rt => (
          <button
            key={rt.value}
            type="button"
            onClick={() => onSelect(rt.value)}
            className={[
              'text-left p-4 rounded-xl border-2 transition-all duration-150',
              requestType === rt.value
                ? 'border-brand-500 bg-brand-50 shadow-sm'
                : 'border-border-default hover:border-gray-300 hover:bg-neutral-50',
            ].join(' ')}
          >
            <div className={`text-sm font-bold mb-1 ${requestType === rt.value ? 'text-brand-600' : 'text-gray-800'}`}>
              {rt.label}
            </div>
            <div className="text-xs text-gray-500 leading-relaxed">{rt.hint}</div>
          </button>
        ))}
      </div>
      {error && <FieldError msg={error} />}

      {isTR && (
        <div className="mt-4 flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Temporary Requisitions require Base Coordinator email approval before processing. Full written justification is mandatory in the notes field below.
          </p>
        </div>
      )}
    </div>
  )
}
