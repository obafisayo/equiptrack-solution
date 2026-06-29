'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'

export interface DropdownOption {
  value: string
  label: string
  hint?: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
  disabled?: boolean
  searchable?: boolean
  className?: string
}

export function Dropdown({
  options, value, onChange,
  placeholder = 'Select…',
  error, disabled, searchable = false, className = '',
}: DropdownProps) {
  const [open,  setOpen]  = useState(false)
  const [query, setQuery] = useState('')
  const [focusIdx, setFocusIdx] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef    = useRef<HTMLInputElement>(null)
  const listRef      = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  const filtered = searchable && query
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
        setFocusIdx(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  /* Focus search input when opening */
  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => searchRef.current?.focus(), 30)
    }
  }, [open, searchable])

  function openDropdown() {
    if (disabled) return
    setOpen(true)
    setFocusIdx(-1)
    // Scroll selected option into view after opening
    if (value) {
      const idx = filtered.findIndex(o => o.value === value)
      setFocusIdx(idx)
    }
  }

  function select(opt: DropdownOption) {
    if (opt.disabled) return
    onChange(opt.value)
    setOpen(false)
    setQuery('')
    setFocusIdx(-1)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        openDropdown()
      }
      return
    }
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusIdx(i => Math.min(i + 1, filtered.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusIdx(i => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && focusIdx >= 0) {
      e.preventDefault()
      const opt = filtered[focusIdx]
      if (opt && !opt.disabled) select(opt)
    }
  }

  /* Scroll focused option into view */
  useEffect(() => {
    if (focusIdx < 0 || !listRef.current) return
    const el = listRef.current.children[focusIdx] as HTMLElement
    el?.scrollIntoView?.({ block: 'nearest' })
  }, [focusIdx])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={openDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'h-12 w-full rounded-card border bg-neutral-50 px-4 text-sm',
          'flex items-center justify-between gap-2 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          error   ? 'border-status-critical' :
          open    ? 'border-brand-500 ring-2 ring-brand-500' :
                    'border-neutral-200 hover:border-border-strong',
          disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
          selected ? 'text-gray-900' : 'text-gray-400',
        ].join(' ')}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-150 ${open ? 'rotate-180 text-brand-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-350 w-full bg-white rounded-xl border border-border-default shadow-overlay overflow-hidden flex flex-col"
          style={{ maxHeight: 280 }}
        >
          {/* Search */}
          {searchable && (
            <div className="px-3 py-2 border-b border-neutral-100 shrink-0">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setFocusIdx(-1) }}
                  placeholder="Search…"
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div ref={listRef} className="overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-5 text-center text-sm text-neutral-400">No results</div>
            ) : filtered.map((opt, idx) => {
              const isSel     = opt.value === value
              const isFocused = idx === focusIdx
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  disabled={opt.disabled}
                  onClick={() => select(opt)}
                  onMouseEnter={() => setFocusIdx(idx)}
                  className={[
                    'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors duration-100',
                    isSel     ? 'bg-brand-50 text-brand-700' :
                    isFocused ? 'bg-neutral-50 text-neutral-900' :
                    opt.disabled ? 'text-neutral-300 cursor-not-allowed' :
                                   'text-neutral-700 hover:bg-neutral-50',
                  ].join(' ')}
                >
                  <div className="min-w-0">
                    <div className={`font-medium truncate ${isSel ? 'text-brand-600' : ''}`}>{opt.label}</div>
                    {opt.hint && <div className="text-xs text-neutral-400 mt-0.5">{opt.hint}</div>}
                  </div>
                  {isSel && <Check size={14} className="text-brand-500 shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
