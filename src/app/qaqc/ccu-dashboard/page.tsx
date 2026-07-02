'use client'

import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard } from '@/components/domain/StatCard'
import { Package, MapPin, AlertTriangle, CheckCircle2, Wifi } from 'lucide-react'
import { INIT_CONTAINERS } from '@/app/qaqc/containers/_components/types'
import { getExpiryState } from '@/app/qaqc/containers/_components/types'
import type { CCUSite } from '@/config/ccu'
import { ColorCodeBanner } from './_components/ColorCodeBanner'
import { SiteDistributionGrid } from './_components/SiteDistributionGrid'
import { FleetHealthChart } from './_components/FleetHealthChart'

export default function CCUDashboardPage() {
  const containers = INIT_CONTAINERS
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  const stats = useMemo(() => {
    const atBase    = containers.filter(c => !c.currentSite).length
    const atSite    = containers.filter(c => !!c.currentSite).length
    const awaitingInspection = containers.filter(c => {
      const s = getExpiryState(c.inspectionExpiry)
      return s === 'expired' || s === 'soon' || s === 'warning' || s === 'locked' || s === 'today'
    }).length
    return { total: containers.length, atBase, atSite, awaitingInspection }
  }, [containers])

  const filteredForSite = useMemo(() => {
    if (!selectedSite) return []
    if (selectedSite === 'base' || selectedSite === 'Onne Base') {
      return containers.filter(c => !c.currentSite)
    }
    return containers.filter(c => c.location === selectedSite || c.currentSite === selectedSite)
  }, [containers, selectedSite])

  function handleSiteClick(site: CCUSite | 'base') {
    const key = site === 'base' ? 'Onne Base' : site
    setSelectedSite(prev => prev === key ? null : key)
  }

  return (
    <AppShell
      role="qaqc"
      currentPath="/qaqc/ccu-dashboard"
      title="CCU Dashboard"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'QAQC' }, { label: 'CCU Dashboard' }]}
    >
      {/* Current color code banner */}
      <ColorCodeBanner />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total CCU in Fleet"
          value={stats.total}
          color="#10B981"
          icon={Package}
        />
        <StatCard
          label="At Base (Available)"
          value={stats.atBase}
          color="#22C55E"
          trend={{ direction: 'up', value: 'at Onne Base', positive: true }}
          icon={CheckCircle2}
        />
        <StatCard
          label="At Site (Deployed)"
          value={stats.atSite}
          color="#F59E0B"
          icon={MapPin}
        />
        <StatCard
          label="Inspection Due / Overdue"
          value={stats.awaitingInspection}
          color={stats.awaitingInspection > 3 ? '#EF4444' : '#F59E0B'}
          trend={{
            direction: stats.awaitingInspection > 3 ? 'up' : 'down',
            value: 'need attention',
            positive: stats.awaitingInspection === 0,
          }}
          icon={AlertTriangle}
        />
      </div>

      {/* GPS note */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[12px] text-slate-600 mb-6">
        <Wifi size={13} className="text-slate-400 shrink-0" />
        <span>GPS integration pending. Containers with GPS trackers fitted will show real-time location here once connected.</span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Site distribution — takes 2/3 */}
        <div className="xl:col-span-2">
          <SiteDistributionGrid
            containers={containers}
            onSiteClick={handleSiteClick}
            selectedSite={selectedSite}
          />

          {/* Site detail when selected */}
          {selectedSite && filteredForSite.length > 0 && (
            <div className="mt-4 bg-white border border-border-default rounded-card shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border-default flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-gray-800">
                  {selectedSite === 'Onne Base' ? 'Onne Base' : selectedSite} — {filteredForSite.length} containers
                </h3>
                <button
                  onClick={() => setSelectedSite(null)}
                  className="text-[11px] text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-border-default">
                  <tr>
                    {['Serial', 'Type', 'Status', 'Insp. Expiry'].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold uppercase text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {filteredForSite.map(c => (
                    <tr key={c.serialNumber} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-[12px] font-semibold text-gray-800">{c.serialNumber}</td>
                      <td className="px-4 py-2 text-[12px] text-gray-600">{c.type}</td>
                      <td className="px-4 py-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          c.status === 'Available' ? 'bg-green-50 text-green-700' :
                          c.status === 'In Transit' ? 'bg-amber-50 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-2 text-[12px] text-gray-600">{c.inspectionExpiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Fleet health — takes 1/3 */}
        <div className="space-y-4">
          <FleetHealthChart containers={containers} />

          {/* Quick links */}
          <div className="bg-white border border-border-default rounded-card shadow-card p-4">
            <h3 className="text-[13px] font-bold text-gray-800 mb-3">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: 'Container Fleet Register', href: '/qaqc/containers' },
                { label: 'Loadout QAQC', href: '/qaqc/loadout' },
                { label: 'CCU Invoicing', href: '/qaqc/ccu-invoicing' },
                { label: 'CCU Requests', href: '/qaqc/ccu-requests' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors border border-border-default no-underline"
                >
                  {link.label}
                  <span className="text-gray-400">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
