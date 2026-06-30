import type { Vessel, VesselStatus } from './types'

export const VESSELS: Vessel[] = [
  {
    id: 'VSL-001', name: 'Ocean Star', type: 'PSV', flag: 'Malta',
    status: 'In Transit', origin: 'Singapore Port', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-22', eta: '2026-07-01', progress: 65,
    captain: 'Capt. Erik Lindstrom', imo: 'IMO 9876543',
    priority: 'normal',
    cargo: [
      { description: 'Drill Pipe - 5" 19.5ppf', qty: 48, unit: 'joints', ref: 'PO-2241' },
      { description: 'BOP Gasket Kit - 13.5"', qty: 12, unit: 'kits', ref: 'PO-2241' },
      { description: 'Mud Pump Liner - 6.5"', qty: 20, unit: 'pieces', ref: 'PO-2238' },
    ],
  },
  {
    id: 'VSL-002', name: 'Nordic Sea', type: 'AHTS', flag: 'Norway',
    status: 'Docking', origin: 'Rotterdam Port', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-24', eta: '2026-06-29', progress: 98,
    captain: 'Capt. Lars Bjornsen', imo: 'IMO 9123456',
    priority: 'urgent',
    cargo: [
      { description: 'Choke Manifold - 5000 PSI', qty: 2, unit: 'units', ref: 'PO-2244' },
      { description: 'Safety Valve - 4.5"', qty: 8, unit: 'units', ref: 'PO-2244' },
    ],
  },
  {
    id: 'VSL-003', name: 'Seplat Pride', type: 'PSV', flag: 'Nigeria',
    status: 'Loading', origin: 'Lagos Apapa Terminal', destination: 'Bonga FPSO Field',
    etd: '2026-07-02', eta: '2026-07-03', progress: 10,
    captain: 'Capt. Emeka Obi', imo: 'IMO 9654321',
    priority: 'normal',
    cargo: [
      { description: 'Drill Bit - 12.25" PDC', qty: 4, unit: 'pieces', ref: 'WO-0087' },
      { description: 'Flex Hose - 3" x 20ft', qty: 15, unit: 'lengths', ref: 'WO-0087' },
      { description: 'Chemical - Barite Sacks', qty: 80, unit: 'sacks', ref: 'WO-0087' },
    ],
  },
  {
    id: 'VSL-004', name: 'Gulf Carrier', type: 'RORC', flag: 'Liberia',
    status: 'Awaiting Berth', origin: 'Port Harcourt', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-28', eta: '2026-06-30', progress: 85,
    captain: 'Capt. James Adeyemi', imo: 'IMO 9234567',
    priority: 'normal',
    cargo: [
      { description: 'Generator - 250 KVA', qty: 1, unit: 'unit', ref: 'PO-2246' },
      { description: 'BOP Accumulator Unit', qty: 2, unit: 'units', ref: 'PO-2246' },
    ],
  },
  {
    id: 'VSL-005', name: 'Delta Express', type: 'PSV', flag: 'Nigeria',
    status: 'Departed', origin: 'Bonny Terminal', destination: 'Lagos Apapa Terminal',
    etd: '2026-06-27', eta: '2026-06-28', progress: 100,
    captain: 'Capt. Fatima Yusuf', imo: 'IMO 9345678',
    priority: 'normal',
    cargo: [
      { description: 'Drill Pipe - 5" 19.5ppf', qty: 24, unit: 'joints', ref: 'PO-2240' },
    ],
  },
]

export const STATUS_CFG: Record<VesselStatus, { color: string; bg: string; dot: string }> = {
  'In Transit': { color: '#3B82F6', bg: '#EFF6FF', dot: '#3B82F6' },
  'Docking': { color: '#16A34A', bg: '#F0FDF4', dot: '#16A34A' },
  'Loading': { color: '#D97706', bg: '#FFFBEB', dot: '#D97706' },
  'Awaiting Berth': { color: '#7C3AED', bg: '#F5F3FF', dot: '#7C3AED' },
  'Departed': { color: '#64748B', bg: '#F8FAFC', dot: '#94A3B8' },
}
