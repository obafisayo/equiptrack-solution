'use client'

import AppShell from '@/components/layout/AppShell'
import Image from 'next/image'

export default function InventoryAlertsPage() {
  return (
    <AppShell
      role="inventory"
      currentPath="/inventory/alerts"
      title="Reorder Alerts"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Stock Overview', href: '/inventory' },
        { label: 'Reorder Alerts' }
      ]}
    >
      <div className="max-w-4xl mx-auto mt-16 flex flex-col items-center justify-center text-center">
        <div className="relative w-72 h-72 mb-8">
          <Image 
            src="/images/inventory_optimal.png" 
            alt="Inventory Optimal" 
            fill 
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <h2 className="text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">Stock Levels Optimal</h2>
        <p className="text-neutral-500 text-lg max-w-lg">
          No reorder alerts at this time. All tracked inventory, parts, and safety equipment are currently above their minimum threshold levels.
        </p>
      </div>
    </AppShell>
  )
}
