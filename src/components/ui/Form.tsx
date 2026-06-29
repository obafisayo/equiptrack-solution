'use client'

import {
  InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes,
  ReactNode, useState, useRef, useEffect,
} from 'react'
import { ChevronDown, Search, X, Clock } from 'lucide-react'

/* ── Field wrapper ──────────────────────────────────────── */

interface FieldProps {
  label?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function Field({ label, error, required, children, className = '' }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-status-critical ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-status-critical">{error}</p>}
    </div>
  )
}

/* ── Input ─────────────────────────────────────────────── */

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function Input({ error, size = 'md', className = '', ...props }: InputProps) {
  return (
    <input
      className={[
        'w-full rounded-card border bg-neutral-50 px-4 text-sm text-gray-900',
        'placeholder:text-gray-400 transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0 focus:border-brand-500',
        size === 'sm' ? 'h-9' : 'h-12',
        error
          ? 'border-status-critical focus:ring-status-critical'
          : 'border-neutral-200 hover:border-border-strong',
        props.disabled ? 'opacity-45 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

/* ── SearchInput ────────────────────────────────────────── */

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  size?: 'sm' | 'md'
  className?: string
}

export function SearchInput({
  value, onChange, placeholder = 'Search…', size = 'sm', className = '',
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full rounded-card border bg-neutral-50 pl-8 pr-8 text-sm text-gray-900',
          'placeholder:text-gray-400 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0 focus:border-brand-500',
          'border-neutral-200 hover:border-border-strong',
          size === 'sm' ? 'h-9' : 'h-12',
        ].join(' ')}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

/* ── Select ────────────────────────────────────────────── */

interface SelectComponentProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  error?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function Select({ error, size = 'md', className = '', children, ...props }: SelectComponentProps) {
  return (
    <div className="relative">
      <select
        className={[
          'w-full rounded-card border bg-neutral-50 px-4 pr-9 text-sm text-gray-900',
          'transition-colors duration-150 cursor-pointer appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          size === 'sm' ? 'h-9' : 'h-12',
          error
            ? 'border-status-critical'
            : 'border-neutral-200 hover:border-border-strong',
          props.disabled ? 'opacity-45 cursor-not-allowed' : '',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  )
}

/* ── Textarea ──────────────────────────────────────────── */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  className?: string
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={[
        'w-full rounded-card border bg-neutral-50 px-4 py-3 text-sm text-gray-900',
        'placeholder:text-gray-400 transition-colors duration-150 resize-y min-h-[96px]',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        error
          ? 'border-status-critical'
          : 'border-neutral-200 hover:border-border-strong',
        props.disabled ? 'opacity-45 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

/* ── TimePicker ────────────────────────────────────────── */

interface TimePickerProps {
  value: string          // "HH:MM"
  onChange: (v: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md'
}

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '15', '30', '45']

function fmtTime(v: string) {
  if (!v) return ''
  const [h, m] = v.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12  = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export function TimePicker({
  value, onChange, placeholder = 'Select time',
  error, disabled, className = '', size = 'md',
}: TimePickerProps) {
  const [open, setOpen]       = useState(false)
  const [selHour, setSelHour] = useState(value ? value.split(':')[0] : '')
  const [selMin,  setSelMin]  = useState(value ? value.split(':')[1] ?? '00' : '00')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  function confirm(h: string, m: string) {
    if (!h) return
    onChange(`${h}:${m}`)
    setOpen(false)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className={[
          'w-full rounded-card border bg-neutral-50 px-4 text-sm',
          'flex items-center justify-between gap-2 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          size === 'sm' ? 'h-9' : 'h-12',
          error   ? 'border-status-critical' :
          open    ? 'border-brand-500 ring-2 ring-brand-500' :
                    'border-neutral-200 hover:border-border-strong',
          disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
          value ? 'text-gray-900' : 'text-gray-400',
        ].join(' ')}
      >
        <span>{value ? fmtTime(value) : placeholder}</span>
        <Clock size={15} className={open ? 'text-brand-500 shrink-0' : 'text-gray-400 shrink-0'} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-350 w-64 bg-white rounded-xl border border-border-default shadow-overlay p-3 space-y-3">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Select time</p>
          <div className="flex gap-3">
            {/* Hours */}
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase">Hour</p>
              <div className="h-40 overflow-y-auto rounded-lg border border-neutral-200 divide-y divide-neutral-100">
                {HOURS.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setSelHour(h)}
                    className={[
                      'w-full py-1.5 text-sm font-medium text-center transition-colors',
                      selHour === h
                        ? 'bg-brand-500 text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    {fmtTime(`${h}:00`).replace(':00', '')}
                  </button>
                ))}
              </div>
            </div>
            {/* Minutes */}
            <div className="w-16">
              <p className="text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase">Min</p>
              <div className="rounded-lg border border-neutral-200 divide-y divide-neutral-100">
                {MINUTES.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelMin(m)}
                    className={[
                      'w-full py-2 text-sm font-medium text-center transition-colors',
                      selMin === m
                        ? 'bg-brand-500 text-white font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50',
                    ].join(' ')}
                  >
                    :{m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled={!selHour}
            onClick={() => confirm(selHour, selMin)}
            className="w-full h-9 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  )
}
