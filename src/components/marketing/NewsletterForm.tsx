'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { subscribeNewsletter, LeadSubmissionError } from '@/lib/api/leads'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await subscribeNewsletter(value)
      setSubmitted(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof LeadSubmissionError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-sm text-status-success" role="status">
        <Check size={16} className="shrink-0" />
        <span>You&apos;re subscribed. Watch your inbox for updates.</span>
      </div>
    )
  }

  return (
    <div className="max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          aria-invalid={error ? true : undefined}
          disabled={submitting}
          className="min-w-0 flex-1 h-11 px-3 sm:px-4 rounded-button bg-white/6 border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white/8 transition-all"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-1.5 h-11 px-3 sm:px-4 rounded-button bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shrink-0 whitespace-nowrap"
        >
          {submitting ? 'Subscribing…' : <>Subscribe <ArrowRight size={14} className="hidden sm:inline" /></>}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-400" role="alert">{error}</p>}
    </div>
  )
}
