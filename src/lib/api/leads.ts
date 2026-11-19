/**
 * Lead capture client — talks to the EquipTrack API (equiptrack-backend repo).
 * Leads are persisted server-side first, then synced to Brevo.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5080').replace(/\/$/, '')

export interface WaitlistLead {
  companyName: string
  industry: string
  country: string
  companySize: string
  website?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  jobTitle?: string
  useCases: string[]
  additionalInfo?: string
}

export class LeadSubmissionError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message)
    this.name = 'LeadSubmissionError'
  }
}

async function post(path: string, body: unknown): Promise<void> {
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new LeadSubmissionError('We could not reach our servers. Check your connection and try again.')
  }

  if (res.ok) return

  if (res.status === 400) {
    throw new LeadSubmissionError('Some details look invalid. Please check the form and try again.', 400)
  }
  if (res.status === 429) {
    throw new LeadSubmissionError('Too many attempts. Please wait a minute and try again.', 429)
  }
  throw new LeadSubmissionError('Something went wrong on our side. Please try again shortly.', res.status)
}

export function submitWaitlist(lead: WaitlistLead): Promise<void> {
  return post('/api/leads/waitlist', lead)
}

export function subscribeNewsletter(email: string): Promise<void> {
  return post('/api/leads/newsletter', { email })
}
