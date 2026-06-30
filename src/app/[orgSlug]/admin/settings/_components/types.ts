export type Tab = 'general' | 'sla' | 'notifications' | 'danger'

export const TABS: { id: Tab; label: string }[] = [
  { id: 'general',       label: 'General' },
  { id: 'sla',           label: 'SLA Config' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'danger',        label: 'Danger Zone' },
]
