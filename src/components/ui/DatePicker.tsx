'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function toISO(d: Date) {
  return d.toISOString().split('T')[0]
}

function parseISO(str: string): Date | null {
  if (!str) return null
  const d = new Date(str + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function fmtDisplay(iso: string): string {
  const d = parseISO(iso)
  if (!d) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface DatePickerProps {
  value: string
  onChange: (iso: string) => void
  min?: string
  max?: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value, onChange, min, max,
  placeholder = 'Select date',
  error, disabled, className = '',
}: DatePickerProps) {
  const parsed      = parseISO(value)
  const [open, setOpen]           = useState(false)
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth()    ?? new Date().getMonth())
  const [viewYear,  setViewYear]  = useState(parsed?.getFullYear() ?? new Date().getFullYear())
  const containerRef = useRef<HTMLDivElement>(null)
  const today        = toISO(new Date())

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    const p = parseISO(value)
    if (p) { setViewMonth(p.getMonth()); setViewYear(p.getFullYear()) }
  }, [value])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function isOff(iso: string) {
    if (min && iso < min) return true
    if (max && iso > max) return true
    return false
  }

  function selectDay(day: number) {
    const iso = toISO(new Date(viewYear, viewMonth, day))
    onChange(iso)
    setOpen(false)
  }

  const firstDOW    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className={[
          'h-12 w-full rounded-card border bg-neutral-50 px-4 text-sm',
          'flex items-center justify-between gap-2 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          error   ? 'border-status-critical' :
          open    ? 'border-brand-500 ring-2 ring-brand-500' :
                    'border-neutral-200 hover:border-border-strong',
          disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
          value ? 'text-gray-900' : 'text-gray-400',
        ].join(' ')}
      >
        <span>{value ? fmtDisplay(value) : placeholder}</span>
        <Calendar size={15} className={open ? 'text-brand-500 shrink-0' : 'text-gray-400 shrink-0'} />
      </button>

      {/* Calendar popup */}
      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-350 w-72 bg-white rounded-xl border border-border-default shadow-overlay p-3">

          {/* Month / Year nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-bold text-neutral-800">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-neutral-400 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDOW }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const iso = toISO(new Date(viewYear, viewMonth, day))
              const isSelected = iso === value
              const isToday    = iso === today
              const off        = isOff(iso)
              return (
                <button
                  key={day}
                  type="button"
                  disabled={off}
                  onClick={() => selectDay(day)}
                  className={[
                    'relative h-8 w-full rounded-lg text-sm font-medium transition-colors duration-100',
                    isSelected ? 'bg-brand-500 text-white font-bold' :
                    isToday    ? 'bg-brand-50 text-brand-600 font-bold' :
                    off        ? 'text-neutral-300 cursor-not-allowed' :
                                 'text-neutral-700 hover:bg-neutral-100',
                  ].join(' ')}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Today shortcut */}
          {!isOff(today) && (
            <div className="mt-2 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => { onChange(today); setOpen(false) }}
                className="w-full text-center text-xs font-semibold text-brand-500 hover:text-brand-600 py-1 transition-colors"
              >
                Today
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
