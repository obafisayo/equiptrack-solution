'use client'

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface SlideOverPanelProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  /** 'default' = 480px, 'wide' = 640px */
  size?: 'default' | 'wide'
  children: ReactNode
  /** Sticky footer content (action buttons) */
  footer?: ReactNode
}

export function SlideOverPanel({
  open,
  onClose,
  title,
  subtitle,
  size = 'default',
  children,
  footer,
}: SlideOverPanelProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const widthClass = size === 'wide' ? 'w-full max-w-2xl' : 'w-full max-w-lg'

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] transition-opacity duration-250',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          'fixed top-0 right-0 z-50 h-screen flex flex-col',
          'bg-white shadow-overlay',
          widthClass,
          'transition-transform duration-250 ease',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border-default shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 leading-snug">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 mt-0.5"
            aria-label="Close panel"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer — sticky action buttons */}
        {footer && (
          <div className="shrink-0 border-t border-border-default px-6 py-4 bg-slate-50">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
