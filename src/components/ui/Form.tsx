'use client'

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

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

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  className?: string
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={[
        'h-12 w-full rounded-[8px] border bg-[#F5F7FA] px-4 text-sm text-gray-900',
        'placeholder:text-gray-400 transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0 focus:border-brand-500',
        error
          ? 'border-status-critical focus:ring-status-critical'
          : 'border-[#E5E7EB] hover:border-border-strong',
        props.disabled ? 'opacity-45 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

/* ── Select ────────────────────────────────────────────── */

interface SelectComponentProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  className?: string
}

export function Select({ error, className = '', children, ...props }: SelectComponentProps) {
  return (
    <div className="relative">
      <select
        className={[
          'h-12 w-full rounded-[8px] border bg-[#F5F7FA] px-4 pr-9 text-sm text-gray-900',
          'transition-colors duration-150 cursor-pointer appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          error
            ? 'border-status-critical'
            : 'border-[#E5E7EB] hover:border-border-strong',
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
        'w-full rounded-[8px] border bg-[#F5F7FA] px-4 py-3 text-sm text-gray-900',
        'placeholder:text-gray-400 transition-colors duration-150 resize-y min-h-[96px]',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        error
          ? 'border-status-critical'
          : 'border-[#E5E7EB] hover:border-border-strong',
        props.disabled ? 'opacity-45 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
