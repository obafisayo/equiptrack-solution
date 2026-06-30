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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
        className="flex-1 h-10 px-3.5 rounded-button bg-neutral-900 border border-neutral-700 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-button bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shrink-0 whitespace-nowrap"
      >
        Subscribe <ArrowRight size={14} />
      </button>
    </form>
  )
}
