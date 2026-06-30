'use client'

export type CCUType   = 'Waste Skip' | '15ft Half Height Basket' | '23ft Half Height Basket' | 'Chemical Tote Tank' | 'Open Top Basket' | 'Closed Top Basket'
export type CCUStatus = 'Available' | 'In Transit' | 'Assigned' | 'Maintenance' | 'Quarantine'

export interface CCUContainer {
  serialNumber: string
  type: CCUType
  footprintM2: number
  lengthM: number
  widthM: number
  maxGrossWeightKg: number
  inspectionExpiry: string
  status: CCUStatus
  available: boolean
  certNo?: string
  owner?: string
  location?: string
}

export const TODAY = '2026-06-29'

export type ExpiryState = 'expired' | 'today' | 'locked' | 'warning' | 'soon' | 'ok'

export function diffDays(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000)
}

export function getExpiryState(expiry: string): ExpiryState {
  const d = diffDays(TODAY, expiry)
  if (d < 0) return 'expired'
  if (d === 0) return 'today'
  if (d <= 3) return 'locked'
  if (d <= 7) return 'warning'
  if (d <= 30) return 'soon'
  return 'ok'
}

export const STATUS_BADGE: Record<CCUStatus, string> = {
  'Available':   'bg-green-50 text-green-700 border-green-200',
  'In Transit':  'bg-blue-50 text-blue-700 border-blue-200',
  'Assigned':    'bg-purple-50 text-purple-700 border-purple-200',
  'Maintenance': 'bg-amber-50 text-amber-700 border-amber-200',
  'Quarantine':  'bg-red-50 text-red-700 border-red-200',
}

export const CCU_TYPES_OPT = ['Waste Skip','15ft Half Height Basket','23ft Half Height Basket','Chemical Tote Tank','Open Top Basket','Closed Top Basket'].map(v => ({ value: v, label: v }))
export const OWNER_OPT     = ['TotalEnergies','Schlumberger','Halliburton','Baker Hughes','Weatherford'].map(v => ({ value: v, label: v }))
export const LOCATION_OPT  = ['Onne Base','Bonga FPSO','Agbami FPSO','Erha FPSO','Escravos Terminal','Workshop','Quarantine Bay'].map(v => ({ value: v, label: v }))

export const DIMS_DEFAULT: Record<CCUType, { footprintM2: number; lengthM: number; widthM: number; maxGrossWeightKg: number }> = {
  'Waste Skip':               { footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300  },
  '15ft Half Height Basket':  { footprintM2: 10.7, lengthM: 4.45, widthM: 2.4,  maxGrossWeightKg: 12750 },
  '23ft Half Height Basket':  { footprintM2: 16.9, lengthM: 6.9,  widthM: 2.44, maxGrossWeightKg: 15350 },
  'Chemical Tote Tank':       { footprintM2: 4.2,  lengthM: 3.8,  widthM: 1.1,  maxGrossWeightKg: 9935  },
  'Open Top Basket':          { footprintM2: 8.4,  lengthM: 4.2,  widthM: 2.0,  maxGrossWeightKg: 9000  },
  'Closed Top Basket':        { footprintM2: 11.2, lengthM: 4.7,  widthM: 2.38, maxGrossWeightKg: 13500 },
}

export const INIT_CONTAINERS: CCUContainer[] = [
  { serialNumber: '13162',       type: 'Waste Skip',              footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300,  inspectionExpiry: '2026-06-04', status: 'Available',   available: true,  certNo: 'CERT-2024-001', owner: 'TotalEnergies', location: 'Onne Base'         },
  { serialNumber: '13164',       type: 'Waste Skip',              footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300,  inspectionExpiry: '2026-06-29', status: 'Available',   available: true,  certNo: 'CERT-2024-002', owner: 'TotalEnergies', location: 'Onne Base'         },
  { serialNumber: '13174',       type: 'Waste Skip',              footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300,  inspectionExpiry: '2026-06-04', status: 'In Transit',  available: false, certNo: 'CERT-2024-003', owner: 'TotalEnergies', location: 'Bonga FPSO'        },
  { serialNumber: '13177',       type: 'Waste Skip',              footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300,  inspectionExpiry: '2026-06-29', status: 'Available',   available: true,  certNo: 'CERT-2024-004', owner: 'TotalEnergies', location: 'Onne Base'         },
  { serialNumber: '13181',       type: 'Waste Skip',              footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300,  inspectionExpiry: '2026-07-14', status: 'Available',   available: true,  certNo: 'CERT-2024-005', owner: 'TotalEnergies', location: 'Onne Base'         },
  { serialNumber: '13347',       type: 'Waste Skip',              footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300,  inspectionExpiry: '2026-07-28', status: 'Available',   available: true,  certNo: 'CERT-2024-006', owner: 'TotalEnergies', location: 'Onne Base'         },
  { serialNumber: '158551',      type: '15ft Half Height Basket', footprintM2: 10.7, lengthM: 4.45, widthM: 2.4,  maxGrossWeightKg: 12750, inspectionExpiry: '2026-07-21', status: 'Available',   available: true,  certNo: 'CERT-2024-007', owner: 'Schlumberger',  location: 'Onne Base'         },
  { serialNumber: '23830',       type: '23ft Half Height Basket', footprintM2: 16.9, lengthM: 6.9,  widthM: 2.44, maxGrossWeightKg: 15350, inspectionExpiry: '2026-06-16', status: 'In Transit',  available: false, certNo: 'CERT-2024-008', owner: 'TotalEnergies', location: 'Agbami FPSO'       },
  { serialNumber: '23846',       type: '23ft Half Height Basket', footprintM2: 16.9, lengthM: 6.9,  widthM: 2.44, maxGrossWeightKg: 15350, inspectionExpiry: '2026-07-02', status: 'Assigned',    available: false, certNo: 'CERT-2024-009', owner: 'TotalEnergies', location: 'Onne Base'         },
  { serialNumber: '28-MZ-75-01', type: 'Chemical Tote Tank',      footprintM2: 4.2,  lengthM: 3.8,  widthM: 1.1,  maxGrossWeightKg: 9935,  inspectionExpiry: '2026-06-30', status: 'Available',   available: true,  certNo: 'CERT-2024-010', owner: 'Halliburton',   location: 'Onne Base'         },
  { serialNumber: '28-MZ-75-02', type: 'Chemical Tote Tank',      footprintM2: 4.2,  lengthM: 3.8,  widthM: 1.1,  maxGrossWeightKg: 9935,  inspectionExpiry: '2026-07-04', status: 'Assigned',    available: false, certNo: 'CERT-2024-011', owner: 'Halliburton',   location: 'Escravos Terminal' },
  { serialNumber: '28-MZ-75-03', type: 'Chemical Tote Tank',      footprintM2: 4.2,  lengthM: 3.8,  widthM: 1.1,  maxGrossWeightKg: 9935,  inspectionExpiry: '2026-06-20', status: 'Available',   available: false, certNo: 'CERT-2024-012', owner: 'Halliburton',   location: 'Onne Base'         },
  { serialNumber: '40-BX-01',    type: 'Open Top Basket',         footprintM2: 8.4,  lengthM: 4.2,  widthM: 2.0,  maxGrossWeightKg: 9000,  inspectionExpiry: '2026-09-15', status: 'Available',   available: true,  certNo: 'CERT-2024-013', owner: 'Baker Hughes',  location: 'Onne Base'         },
  { serialNumber: '40-BX-02',    type: 'Open Top Basket',         footprintM2: 8.4,  lengthM: 4.2,  widthM: 2.0,  maxGrossWeightKg: 9000,  inspectionExpiry: '2026-08-20', status: 'Maintenance', available: false, certNo: 'CERT-2024-014', owner: 'Baker Hughes',  location: 'Workshop'          },
  { serialNumber: 'CT-44-A',     type: 'Closed Top Basket',       footprintM2: 11.2, lengthM: 4.7,  widthM: 2.38, maxGrossWeightKg: 13500, inspectionExpiry: '2026-10-01', status: 'Available',   available: true,  certNo: 'CERT-2024-015', owner: 'Weatherford',   location: 'Onne Base'         },
  { serialNumber: 'CT-44-B',     type: 'Closed Top Basket',       footprintM2: 11.2, lengthM: 4.7,  widthM: 2.38, maxGrossWeightKg: 13500, inspectionExpiry: '2026-07-07', status: 'In Transit',  available: false, certNo: 'CERT-2024-016', owner: 'Weatherford',   location: 'Erha FPSO'         },
  { serialNumber: 'WS-99-01',    type: 'Waste Skip',              footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300,  inspectionExpiry: '2026-05-10', status: 'Quarantine',  available: false, certNo: 'CERT-2024-017', owner: 'TotalEnergies', location: 'Quarantine Bay'    },
  { serialNumber: 'HHB-55-01',   type: '15ft Half Height Basket', footprintM2: 10.7, lengthM: 4.45, widthM: 2.4,  maxGrossWeightKg: 12750, inspectionExpiry: '2026-11-30', status: 'Available',   available: true,  certNo: 'CERT-2024-018', owner: 'Schlumberger',  location: 'Onne Base'         },
]
