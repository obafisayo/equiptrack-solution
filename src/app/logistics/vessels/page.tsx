'use client'

import AppShell from '@/components/layout/AppShell'
import Image from 'next/image'
import { MapPin, Ship, Clock } from 'lucide-react'

export default function VesselSchedulePage() {
  const vessels = [
    { id: 'VSL-OCEAN-STAR', status: 'In Transit', origin: 'Singapore Port', destination: 'Lagos Apapa', eta: '3 Days', progress: 65 },
    { id: 'VSL-NORDIC-SEA', status: 'Docking', origin: 'Rotterdam', destination: 'Lagos Apapa', eta: '2 Hours', progress: 98 },
  ]

  return (
    <AppShell
      role="logistics"
      currentPath="/logistics/vessels"
      title="Vessel Schedule"
      breadcrumb={[
        { label: 'Home', href: '/' },
        { label: 'Logistics', href: '/logistics' },
        { label: 'Vessel Schedule' }
      ]}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Illustration */}
        <div className="w-full h-64 relative rounded-2xl overflow-hidden shadow-sm border border-neutral-200 bg-[#0A0F1D]">
          <Image 
            src="/images/vessel_schedule_header.png" 
            alt="Vessel Route Map" 
            fill 
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] to-transparent flex items-end p-6">
            <h2 className="text-2xl font-bold text-white tracking-wide">Live Global Transit Map</h2>
          </div>
        </div>

        {/* Vessel List */}
        <div>
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Incoming Vessels</h3>
          <div className="grid gap-4">
            {vessels.map(vsl => (
              <div key={vsl.id} className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center border border-brand-100">
                  <Ship className="text-brand-500" size={24} />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="font-bold text-neutral-900">{vsl.id}</h4>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <MapPin size={12} /> {vsl.origin} &rarr; {vsl.destination}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {vsl.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2 justify-end">
                        <Clock size={12} /> ETA: {vsl.eta}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-500 transition-all duration-1000" 
                      style={{ width: `${vsl.progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
