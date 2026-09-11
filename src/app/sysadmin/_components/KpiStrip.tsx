'use client'

import { Building2, CheckCircle2, Users, DollarSign, Clock } from 'lucide-react'
import { StatCard } from '@/components/domain/StatCard'
import { PLATFORM_STATS } from '@/lib/mock-platform'
import { fmtMRR } from './styleMaps'

interface KpiStripProps {
  pendingWaitlistCount: number
}

export function KpiStrip({ pendingWaitlistCount }: KpiStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Total Organisations"
        value={PLATFORM_STATS.totalOrgs}
        icon={Building2}
        color="#1A6FBF"
        trend="+3 this month"
        trendPositive
      />
      <StatCard
        label="Active Orgs"
        value={PLATFORM_STATS.activeOrgs}
        icon={CheckCircle2}
        color="#16A34A"
        trend={`${PLATFORM_STATS.activeOrgs}/${PLATFORM_STATS.totalOrgs} orgs`}
      />
      <StatCard
        label="Total Users"
        value={PLATFORM_STATS.totalUsers}
        icon={Users}
        color="#8B5CF6"
        trend="+5 this month"
        trendPositive
      />
      <StatCard
        label="Monthly Revenue"
        value={fmtMRR(PLATFORM_STATS.mrr)}
        icon={DollarSign}
        color="#1A6FBF"
        trend="+12.4% MoM"
        trendPositive
      />
      <StatCard
        label="Waitlist Pending"
        value={pendingWaitlistCount}
        icon={Clock}
        color="#D97706"
        trend={`${PLATFORM_STATS.waitlistCount} total`}
      />
    </div>
  )
}
