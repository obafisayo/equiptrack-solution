'use client'

import { MapPin, Package, Clock } from 'lucide-react'
import { CCU_SITES, CCU_SITE_COUNTS, CCU_SITE_LAST_MOVEMENT, type CCUSite } from '@/config/ccu'
import type { CCUContainer } from '@/app/qaqc/containers/_components/types'

interface Props {
  containers: CCUContainer[]
  onSiteClick: (site: CCUSite | 'base') => void
  selectedSite: string | null
}

export function SiteDistributionGrid({ containers, onSiteClick, selectedSite }: Props) {
  function countBySite(site: string) {
    return containers.filter(c => c.location === site || c.currentSite === site).length
  }

  function typesBySite(site: string): string {
    const types = [...new Set(containers.filter(c => c.location === site || c.currentSite === site).map(c => c.type.split(' ')[0]))]
    return types.slice(0, 3).join(', ') || '—'
  }

  const baseSites = CCU_SITES.filter(s => s === 'Onne Base')
  const remoteSites = CCU_SITES.filter(s => s !== 'Onne Base')

  return (
    <div>
      <h2 className="text-[15px] font-bold text-gray-900 mb-3">Site Distribution</h2>

      {/* Base */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Base</p>
        {baseSites.map(site => {
          const count = countBySite(site)
          const isSelected = selectedSite === site
          return (
            <button
              key={site}
              onClick={() => onSiteClick('base')}
              className={[
                'w-full text-left p-4 rounded-xl border-2 transition-colors duration-150',
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-transparent bg-white hover:border-green-300',
                'shadow-card',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[14px] font-bold text-gray-800">{site}</span>
                </div>
                <span className="text-[22px] font-bold text-green-700">{count}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Package size={10} />{typesBySite(site)}</span>
                <span className="flex items-center gap-1"><Clock size={10} />Last move: {CCU_SITE_LAST_MOVEMENT[site]}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Remote sites */}
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Offshore Sites</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {remoteSites.map(site => {
          const count = countBySite(site)
          const isSelected = selectedSite === site
          return (
            <button
              key={site}
              onClick={() => onSiteClick(site as CCUSite)}
              className={[
                'text-left p-4 rounded-xl border-2 transition-colors duration-150 shadow-card',
                count > 0
                  ? isSelected
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-transparent bg-white hover:border-amber-300'
                  : 'border-transparent bg-gray-50 opacity-60',
              ].join(' ')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-amber-500' : 'bg-gray-300'}`} />
                <span className="text-[20px] font-bold text-gray-800">{count}</span>
              </div>
              <p className="text-[12px] font-semibold text-gray-700 leading-tight">{site}</p>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5">
                <Clock size={9} />
                {CCU_SITE_LAST_MOVEMENT[site]}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
