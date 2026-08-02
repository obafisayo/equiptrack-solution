'use client'

import AppShell from '@/components/layout/AppShell'
import { AnalyticsKpiStrip }  from './_components/AnalyticsKpiStrip'
import { ThroughputChart }    from './_components/ThroughputChart'
import { SlaComplianceChart } from './_components/SlaComplianceChart'
import { OrderBreakdownRow }  from './_components/OrderBreakdownRow'
import { StageTimingSection } from './_components/StageTimingSection'
import { TopDestinationsCard } from './_components/TopDestinationsCard'

export default function QaqcAnalyticsPage() {
  return (
    <AppShell
      role="qaqc"
      currentPath="/qaqc/analytics"
      title="QAQC Analytics"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC', href: '/qaqc' }, { label: 'Analytics' }]}
    >
      <AnalyticsKpiStrip />

      {/* Throughput & SLA trend side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ThroughputChart />
        <SlaComplianceChart />
      </div>

      {/* Order breakdowns */}
      <div className="mb-4">
        <OrderBreakdownRow />
      </div>

      {/* Stage timing */}
      <div className="mb-4">
        <StageTimingSection />
      </div>

      {/* Top destinations */}
      <TopDestinationsCard />
    </AppShell>
  )
}
