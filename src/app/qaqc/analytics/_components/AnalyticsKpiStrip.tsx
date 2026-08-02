'use client'

import { Activity, CheckCircle, Clock, Package, XCircle } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'
import { computeKpis } from './mock-analytics'

export function AnalyticsKpiStrip() {
  const kpis = computeKpis()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        label="Inspections This Month"
        value={kpis.inspectionsThisMonth}
        icon={Activity}
        color="#F59E0B"
        trend={{ direction: 'up', value: '+14% vs last month', positive: true }}
      />
      <StatCard
        label="SLA Compliance Rate"
        value={`${kpis.slaCompliancePct}%`}
        icon={CheckCircle}
        color="#10B981"
        trend={kpis.slaCompliancePct >= 90
          ? { direction: 'up', value: 'On target', positive: true }
          : { direction: 'down', value: 'Below 90% target', positive: false }
        }
      />
      <StatCard
        label="Avg Preload QAQC Time"
        value={`${kpis.avgPreloadHours}h`}
        icon={Clock}
        color="#F59E0B"
        sub="SLA target: 2h"
        trend={kpis.avgPreloadHours <= 2
          ? { direction: 'down', value: 'Within SLA', positive: true }
          : { direction: 'up', value: 'Above SLA target', positive: false }
        }
      />
      <StatCard
        label="Post QAQC Rejection Rate"
        value={`${kpis.rejectionRatePct}%`}
        icon={XCircle}
        color="#EF4444"
        trend={{ direction: 'down', value: '-3% vs last month', positive: true }}
      />
      <StatCard
        label="Container Utilisation"
        value={`${kpis.containerUtilisationPct}%`}
        icon={Package}
        color="#8B5CF6"
        sub={`${Math.round(kpis.containerUtilisationPct * 18 / 100)} of 18 CCUs active`}
      />
    </div>
  )
}
