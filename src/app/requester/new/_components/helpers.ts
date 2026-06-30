import { URGENCY_CONFIG } from '@/config/sla'
import type { UrgencyLevel } from '@/config/sla'

export function getExpectedDate(urgency: UrgencyLevel | ''): string {
  if (!urgency) return ''
  const cfg = URGENCY_CONFIG[urgency]
  if (!cfg.days) return 'Next available boat departure'
  const d = new Date()
  d.setDate(d.getDate() + cfg.days)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export function generateDeliveryNumber(): string {
  return `DEL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

export function today() {
  return new Date().toISOString().split('T')[0]
}
