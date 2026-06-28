'use client'

import AppShell from '@/components/layout/AppShell'
import Image from 'next/image'

export default function SafetyIncidentsPage() {
  return (
    <AppShell
      role="safety"
      currentPath="/safety/incidents"
      title="Safety Incidents"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Safety Dashboard', href: '/safety' },
        { label: 'Incidents' }
      ]}
      actionLabel="Report Incident"
      actionHref="#"
    >
      <div className="max-w-4xl mx-auto mt-12 flex flex-col items-center justify-center text-center">
        <div className="relative w-64 h-64 mb-6">
          <Image 
            src="/images/safety_empty_state.png" 
            alt="No safety incidents" 
            fill 
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Zero Active Incidents</h2>
        <p className="text-neutral-500 max-w-md">
          Great job! There are currently no unresolved safety hazards, near-misses, or active incidents reported in the system.
        </p>
      </div>
    </AppShell>
  )
}
