'use client'
import AppShell from '@/components/layout/AppShell'
import { MessagesView } from '@/components/features/MessagesView'

export default function QaqcMessagesPage() {
  return (
    <AppShell role="qaqc" currentPath="/qaqc/messages" title="Messages"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC', href: '/qaqc' }, { label: 'Messages' }]}
    >
      <MessagesView />
    </AppShell>
  )
}
