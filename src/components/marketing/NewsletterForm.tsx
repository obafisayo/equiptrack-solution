'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-status-success">
        <Check size={16} className="shrink-0" />
        <span>You&apos;re subscribed. Watch your inbox for updates.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-row gap-2 max-w-sm">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
        className="min-w-0 flex-1 h-11 px-3 sm:px-4 rounded-button bg-white/6 border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white/8 transition-all"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-1.5 h-11 px-3 sm:px-4 rounded-button bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shrink-0 whitespace-nowrap"
      >
        Subscribe <ArrowRight size={14} className="hidden sm:inline" />
      </button>
    </form>
  )
}
