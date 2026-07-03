'use client'
import AppShell from '@/components/layout/AppShell'
import { MessagesView } from '@/components/features/MessagesView'

export default function ExecMessagesPage() {
  return (
    <AppShell role="exec" currentPath="/executive/messages" title="Messages"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Executive', href: '/executive' }, { label: 'Messages' }]}
    >
      <MessagesView />
    </AppShell>
  )
}
