'use client'
import AppShell from '@/components/layout/AppShell'
import { MessagesView } from '@/components/features/MessagesView'

export default function DispatchMessagesPage() {
  return (
    <AppShell role="dsp_sup" currentPath="/dispatch/messages" title="Messages"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Dispatch', href: '/dispatch' }, { label: 'Messages' }]}
    >
      <MessagesView />
    </AppShell>
  )
}
