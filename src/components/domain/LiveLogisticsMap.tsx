'use client'

import { Truck, Ship, Factory, MapPin } from 'lucide-react'

interface Shipment {
  id: string
  origin: { x: number, y: number, name: string }
  destination: { x: number, y: number, name: string }
  currentLocation: { x: number, y: number, name: string }
  progress: number // 0 to 1
  type: 'truck' | 'ship'
  status: 'En Route' | 'Delayed' | 'Delivered'
}

interface LiveLogisticsMapProps {
  selectedShipmentId?: string
}

const mockShipments: Shipment[] = [
  {
    id: 'EQT-90123',
    origin: { x: 30, y: 40, name: 'Houston' },
    destination: { x: 70, y: 60, name: 'Dubai' },
    currentLocation: { x: 50, y: 50, name: 'Mid Atlantic' },
    progress: 0.5,
    type: 'ship',
    status: 'En Route'
  },
  {
    id: 'EQT-87561',
    origin: { x: 20, y: 30, name: 'Aberdeen' },
    destination: { x: 25, y: 50, name: 'Port' },
    currentLocation: { x: 22, y: 40, name: 'In Transit' },
    progress: 0.3,
    type: 'truck',
    status: 'Delayed'
  },
  {
    id: 'EQT-99042',
    origin: { x: 80, y: 70, name: 'Singapore' },
    destination: { x: 85, y: 20, name: 'Tokyo' },
    currentLocation: { x: 85, y: 20, name: 'Tokyo' },
    progress: 1,
    type: 'ship',
    status: 'Delivered'
  }
]

export function LiveLogisticsMap({ selectedShipmentId }: LiveLogisticsMapProps) {
  const activeShipment = mockShipments.find(s => s.id === selectedShipmentId) || mockShipments[0]

  return (
    <div className="relative w-full h-[320px] bg-[#E8EDF2] rounded-xl overflow-hidden shadow-inner border border-neutral-200">
      {/* Abstract World Map Background (Simple Polygons for continents) */}
      <svg className="absolute inset-0 w-full h-full text-[#D2DCE6]" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
        {/* North America */}
        <polygon fill="currentColor" points="10,20 25,15 35,25 25,45 15,40" />
        {/* South America */}
        <polygon fill="currentColor" points="25,45 35,50 30,75 20,65" />
        {/* Europe / Africa */}
        <polygon fill="currentColor" points="45,20 60,15 65,30 55,40 50,30" />
        <polygon fill="currentColor" points="45,40 60,45 55,70 45,60" />
        {/* Asia */}
        <polygon fill="currentColor" points="60,15 85,10 90,35 70,45" />
        {/* Australia */}
        <polygon fill="currentColor" points="75,70 90,65 95,80 80,85" />
      </svg>

      {/* Grid Overlay */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>

      {/* Connection Line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d={'M ' + activeShipment.origin.x + ' ' + activeShipment.origin.y + ' Q ' + ((activeShipment.origin.x + activeShipment.destination.x)/2) + ' ' + (Math.min(activeShipment.origin.y, activeShipment.destination.y) - 20) + ' ' + activeShipment.destination.x + ' ' + activeShipment.destination.y}
          fill="none" 
          stroke="#F04A4A" 
          strokeWidth="0.5" 
          strokeDasharray="1,1" 
        />
        {/* Progress Line */}
        <path 
          d={'M ' + activeShipment.origin.x + ' ' + activeShipment.origin.y + ' Q ' + ((activeShipment.origin.x + activeShipment.destination.x)/2) + ' ' + (Math.min(activeShipment.origin.y, activeShipment.destination.y) - 20) + ' ' + activeShipment.currentLocation.x + ' ' + activeShipment.currentLocation.y}
          fill="none" 
          stroke="#F04A4A" 
          strokeWidth="0.8" 
        />
      </svg>

      {/* Pins */}
      {/* Origin */}
      <div 
        className="absolute w-4 h-4 -ml-2 -mt-2 bg-white rounded-full border-2 border-neutral-400 flex items-center justify-center shadow-md z-10"
        style={{ left: activeShipment.origin.x + '%', top: activeShipment.origin.y + '%' }}
      >
        <Factory size={8} className="text-neutral-500" />
      </div>

      {/* Destination */}
      <div 
        className="absolute w-4 h-4 -ml-2 -mt-2 bg-white rounded-full border-2 border-neutral-800 flex items-center justify-center shadow-md z-10"
        style={{ left: activeShipment.destination.x + '%', top: activeShipment.destination.y + '%' }}
      >
        <MapPin size={8} className="text-neutral-800" />
      </div>

      {/* Current Location (Vehicle) */}
      <div 
        className="absolute w-6 h-6 -ml-3 -mt-3 bg-brand-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg z-20 animate-pulse"
        style={{ left: activeShipment.currentLocation.x + '%', top: activeShipment.currentLocation.y + '%' }}
      >
        {activeShipment.type === 'ship' ? <Ship size={12} className="text-white" /> : <Truck size={12} className="text-white" />}
      </div>

      {/* Legend / Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-neutral-200 shadow-sm flex items-center gap-4 text-xs font-medium text-neutral-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500"></div>
          Active Shipments
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neutral-400"></div>
          Assets En Route
        </div>
      </div>
    </div>
  )
}
