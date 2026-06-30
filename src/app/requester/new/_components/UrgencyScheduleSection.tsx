'use client'

import { DatePicker } from '@/components/ui/DatePicker'
import { URGENCY_CONFIG } from '@/config/sla'
import type { UrgencyLevel } from '@/config/sla'
import { URGENCY_STYLE } from './constants'
import { getExpectedDate, today } from './helpers'
import { SectionHeader, Label, FieldError } from './FormHelpers'

interface UrgencyScheduleSectionProps {
  urgency: UrgencyLevel | ''
  requiredDate: string
  returnDate: string
  errors: Record<string, string>
  onUrgencyChange: (value: UrgencyLevel) => void
  onRequiredDateChange: (value: string) => void
  onReturnDateChange: (value: string) => void
}

const URGENCY_LEVELS: UrgencyLevel[] = ['Low', 'Medium', 'High', 'Urgent']

export function UrgencyScheduleSection({
  urgency, requiredDate, returnDate, errors,
  onUrgencyChange, onRequiredDateChange, onReturnDateChange,
}: UrgencyScheduleSectionProps) {
  return (
    <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-5">
      <SectionHeader step={3} title="Urgency & Schedule" required />

      {/* Urgency buttons */}
      <div className="flex flex-col gap-1.5">
        <Label text="Urgency Level" required />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {URGENCY_LEVELS.map(lvl => {
            const cfg = URGENCY_CONFIG[lvl]
            const sty = URGENCY_STYLE[lvl]
            const sel = urgency === lvl
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onUrgencyChange(lvl)}
                className={[
                  'flex flex-col items-center p-3.5 rounded-xl border-2 transition-all duration-150',
                  sel ? sty.active : 'border-border-default hover:border-gray-300 hover:bg-neutral-50',
                ].join(' ')}
              >
                <div className={`w-3 h-3 rounded-full mb-2 ${sty.dot}`} />
                <span className={`text-xs font-bold ${sel ? sty.text : 'text-gray-700'}`}>{lvl}</span>
                <span className="text-[11px] text-gray-500 mt-0.5 text-center leading-tight">{cfg.label}</span>
              </button>
            )
          })}
        </div>
        {urgency && (
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            Expected SLA: <span className="font-semibold text-gray-800">{getExpectedDate(urgency)}</span>
          </div>
        )}
        {errors.urgency && <FieldError msg={errors.urgency} />}
      </div>

      {/* Date fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <Label text="Required On-Site Date" required />
          <DatePicker
            value={requiredDate}
            onChange={onRequiredDateChange}
            min={today()}
            placeholder="When is it needed offshore?"
            error={!!errors.requiredDate}
          />
          {errors.requiredDate && <FieldError msg={errors.requiredDate} />}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label text="Expected Return Date" required />
          <DatePicker
            value={returnDate}
            onChange={onReturnDateChange}
            min={requiredDate || today()}
            placeholder="When will it return?"
            error={!!errors.returnDate}
          />
          {errors.returnDate && <FieldError msg={errors.returnDate} />}
        </div>
      </div>
    </div>
  )
}
