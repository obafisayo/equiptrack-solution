'use client'
import AppShell from '@/components/layout/AppShell'
import { MessagesView } from '@/components/features/MessagesView'

export default function WarehouseMessagesPage() {
  return (
    <AppShell role="wh_sup" currentPath="/warehouse/messages" title="Messages"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Warehouse', href: '/warehouse' }, { label: 'Messages' }]}
    >
      <MessagesView />
    </AppShell>
  )
}
