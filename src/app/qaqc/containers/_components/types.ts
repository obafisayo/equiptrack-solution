'use client'

export type CCUType   = 'Waste Skip' | '15ft Half Height Basket' | '23ft Half Height Basket' | 'Chemical Tote Tank' | 'Open Top Basket' | 'Closed Top Basket'
export type CCUStatus = 'Available' | 'In Transit' | 'Assigned' | 'Maintenance' | 'Quarantine' | 'Pending Inspection'

export type DangerousGoodsClass = 'normal' | 'dangerous' | 'explosive' | 'radioactive' | 'refrigerated' | 'hazardous'

export interface CCUTrip {
  tripId: string
  vessel: string
  destination: string
  direction: 'to-site' | 'to-base'
  departureDate: string
  arrivalDate: string | null
  sentBy: string
  receivedBy: string | null
  manifestNumber: string
  waybillNumber: string
}

export interface CCUMovementLog {
  id: string
  timestamp: string
  action: 'dispatched' | 'arrived' | 'returned' | 'sent-to-vendor' | 'returned-from-vendor' | 'inspected' | 'quarantined' | 'added-to-fleet'
  location: string
  performedBy: string
  notes?: string
}

export interface CCUPaymentRecord {
  id: string
  date: string
  amountUSD: number
  reference: string
  notes?: string
}

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
  currentSite: string | null
  trips: CCUTrip[]
  movementLog: CCUMovementLog[]
  hiringStartDate: string | null
  contractorId: string | null
  dailyRateUSD: number | null
  payments: CCUPaymentRecord[]
  gpsTrackerId?: string
  dangerousGoodsClass?: DangerousGoodsClass
  inspectionHistory: Array<{ date: string; result: 'Passed' | 'Failed'; inspector: string; notes?: string }>
}

export const TODAY = '2026-07-01'

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
  'Available':          'bg-green-50  text-green-700  border-green-200',
  'In Transit':         'bg-amber-50  text-amber-700  border-amber-200',
  'Assigned':           'bg-violet-50 text-violet-700 border-violet-200',
  'Maintenance':        'bg-orange-50 text-orange-700 border-orange-200',
  'Quarantine':         'bg-red-50    text-red-700    border-red-200',
  'Pending Inspection': 'bg-slate-100 text-slate-700  border-slate-200',
}

export const DG_CLASS_BADGE: Record<DangerousGoodsClass, { label: string; badge: string }> = {
  normal:       { label: 'Normal',      badge: 'bg-slate-100 text-slate-600' },
  dangerous:    { label: 'Dangerous',   badge: 'bg-orange-50 text-orange-700' },
  explosive:    { label: 'Explosive',   badge: 'bg-red-50 text-red-700' },
  radioactive:  { label: 'Radioactive', badge: 'bg-red-100 text-red-800 font-bold' },
  refrigerated: { label: 'Refrigerated', badge: 'bg-slate-50 text-slate-700' },
  hazardous:    { label: 'Hazardous',   badge: 'bg-amber-50 text-amber-700' },
}

export const CCU_TYPES_OPT = ['Waste Skip','15ft Half Height Basket','23ft Half Height Basket','Chemical Tote Tank','Open Top Basket','Closed Top Basket'].map(v => ({ value: v, label: v }))
export const OWNER_OPT     = ['TotalEnergies','Schlumberger','Halliburton','Baker Hughes','Weatherford','Apex Offshore Ltd','Delta Marine Containers','Onne Container Services','Gulf Stream Logistics'].map(v => ({ value: v, label: v }))
export const LOCATION_OPT  = ['Onne Base','Bonga FPSO','Agbami FPSO','Erha FPSO','Escravos Terminal','Bonny Terminal','Egina FPSO','Usan FPSO','Forcados Terminal','Workshop','Quarantine Bay'].map(v => ({ value: v, label: v }))

export const DIMS_DEFAULT: Record<CCUType, { footprintM2: number; lengthM: number; widthM: number; maxGrossWeightKg: number }> = {
  'Waste Skip':               { footprintM2: 7.2,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300  },
  '15ft Half Height Basket':  { footprintM2: 10.7, lengthM: 4.45, widthM: 2.4,  maxGrossWeightKg: 12750 },
  '23ft Half Height Basket':  { footprintM2: 16.9, lengthM: 6.9,  widthM: 2.44, maxGrossWeightKg: 15350 },
  'Chemical Tote Tank':       { footprintM2: 4.2,  lengthM: 3.8,  widthM: 1.1,  maxGrossWeightKg: 9935  },
  'Open Top Basket':          { footprintM2: 8.4,  lengthM: 4.2,  widthM: 2.0,  maxGrossWeightKg: 9000  },
  'Closed Top Basket':        { footprintM2: 11.2, lengthM: 4.7,  widthM: 2.38, maxGrossWeightKg: 13500 },
}

export const INIT_CONTAINERS: CCUContainer[] = [
  {
    serialNumber: '13162', type: 'Waste Skip', footprintM2: 7.2, lengthM: 3.96, widthM: 1.8, maxGrossWeightKg: 6300,
    inspectionExpiry: '2026-06-04', status: 'Available', available: true, certNo: 'CERT-2024-001',
    owner: 'TotalEnergies', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-01-15', contractorId: 'CONT-001', dailyRateUSD: 85, payments: [],
    trips: [
      { tripId: 'T-001', vessel: 'MV Bonga Star', destination: 'Bonga FPSO', direction: 'to-site', departureDate: '2025-03-10', arrivalDate: '2025-03-12', sentBy: 'Biodun Adekunle', receivedBy: 'Site Ops', manifestNumber: 'MNF-2025-0310', waybillNumber: 'WB-2025-0310' },
      { tripId: 'T-002', vessel: 'MV Bonga Star', destination: 'Bonga FPSO', direction: 'to-base', departureDate: '2025-04-20', arrivalDate: '2025-04-22', sentBy: 'Site Ops', receivedBy: 'Biodun Adekunle', manifestNumber: 'MNF-2025-0420', waybillNumber: 'WB-2025-0420' },
    ],
    movementLog: [
      { id: 'ML-001', timestamp: '2024-01-15T09:00:00', action: 'added-to-fleet', location: 'Onne Base', performedBy: 'Femi Emmanuel', notes: 'Passed Loadout QAQC inspection' },
      { id: 'ML-002', timestamp: '2025-03-10T08:30:00', action: 'dispatched', location: 'Onne Base', performedBy: 'Biodun Adekunle' },
      { id: 'ML-003', timestamp: '2025-03-12T14:00:00', action: 'arrived', location: 'Bonga FPSO', performedBy: 'Site Ops' },
      { id: 'ML-004', timestamp: '2025-04-20T10:00:00', action: 'returned', location: 'Bonga FPSO', performedBy: 'Site Ops' },
      { id: 'ML-005', timestamp: '2025-04-22T16:00:00', action: 'arrived', location: 'Onne Base', performedBy: 'Biodun Adekunle' },
    ],
    inspectionHistory: [{ date: '2024-01-15', result: 'Passed', inspector: 'Femi Emmanuel' }, { date: '2025-06-04', result: 'Passed', inspector: 'Ngozi Okafor' }],
    gpsTrackerId: 'GPS-13162',
  },
  {
    serialNumber: '13164', type: 'Waste Skip', footprintM2: 7.2, lengthM: 3.96, widthM: 1.8, maxGrossWeightKg: 6300,
    inspectionExpiry: '2026-06-29', status: 'Available', available: true, certNo: 'CERT-2024-002',
    owner: 'TotalEnergies', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-02-01', contractorId: 'CONT-001', dailyRateUSD: 85, payments: [],
    trips: [], movementLog: [{ id: 'ML-010', timestamp: '2024-02-01T09:00:00', action: 'added-to-fleet', location: 'Onne Base', performedBy: 'Femi Emmanuel' }],
    inspectionHistory: [{ date: '2024-02-01', result: 'Passed', inspector: 'Femi Emmanuel' }],
  },
  {
    serialNumber: '13174', type: 'Waste Skip', footprintM2: 7.2, lengthM: 3.96, widthM: 1.8, maxGrossWeightKg: 6300,
    inspectionExpiry: '2026-06-04', status: 'In Transit', available: false, certNo: 'CERT-2024-003',
    owner: 'TotalEnergies', location: 'Bonga FPSO', currentSite: 'Bonga FPSO',
    hiringStartDate: '2024-02-15', contractorId: 'CONT-001', dailyRateUSD: 85, payments: [],
    trips: [
      { tripId: 'T-010', vessel: 'MV Agbami Venture', destination: 'Bonga FPSO', direction: 'to-site', departureDate: '2026-06-10', arrivalDate: '2026-06-12', sentBy: 'Kola Martins', receivedBy: 'Site Ops', manifestNumber: 'MNF-2026-0610', waybillNumber: 'WB-2026-0610' },
    ],
    movementLog: [
      { id: 'ML-020', timestamp: '2024-02-15T09:00:00', action: 'added-to-fleet', location: 'Onne Base', performedBy: 'Ngozi Okafor' },
      { id: 'ML-021', timestamp: '2026-06-10T07:00:00', action: 'dispatched', location: 'Onne Base', performedBy: 'Kola Martins' },
      { id: 'ML-022', timestamp: '2026-06-12T15:30:00', action: 'arrived', location: 'Bonga FPSO', performedBy: 'Site Ops' },
    ],
    inspectionHistory: [{ date: '2024-02-15', result: 'Passed', inspector: 'Ngozi Okafor' }],
  },
  {
    serialNumber: '13177', type: 'Waste Skip', footprintM2: 7.2, lengthM: 3.96, widthM: 1.8, maxGrossWeightKg: 6300,
    inspectionExpiry: '2026-06-29', status: 'Available', available: true, certNo: 'CERT-2024-004',
    owner: 'TotalEnergies', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-03-01', contractorId: 'CONT-001', dailyRateUSD: 85, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '13181', type: 'Waste Skip', footprintM2: 7.2, lengthM: 3.96, widthM: 1.8, maxGrossWeightKg: 6300,
    inspectionExpiry: '2026-07-14', status: 'Available', available: true, certNo: 'CERT-2024-005',
    owner: 'TotalEnergies', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-03-15', contractorId: 'CONT-001', dailyRateUSD: 85, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '13347', type: 'Waste Skip', footprintM2: 7.2, lengthM: 3.96, widthM: 1.8, maxGrossWeightKg: 6300,
    inspectionExpiry: '2026-07-28', status: 'Available', available: true, certNo: 'CERT-2024-006',
    owner: 'TotalEnergies', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-04-01', contractorId: 'CONT-001', dailyRateUSD: 85, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '158551', type: '15ft Half Height Basket', footprintM2: 10.7, lengthM: 4.45, widthM: 2.4, maxGrossWeightKg: 12750,
    inspectionExpiry: '2026-07-21', status: 'Available', available: true, certNo: 'CERT-2024-007',
    owner: 'Schlumberger', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-05-01', contractorId: 'CONT-002', dailyRateUSD: 120, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '23830', type: '23ft Half Height Basket', footprintM2: 16.9, lengthM: 6.9, widthM: 2.44, maxGrossWeightKg: 15350,
    inspectionExpiry: '2026-06-16', status: 'In Transit', available: false, certNo: 'CERT-2024-008',
    owner: 'TotalEnergies', location: 'Agbami FPSO', currentSite: 'Agbami FPSO',
    hiringStartDate: '2024-01-01', contractorId: 'CONT-001', dailyRateUSD: 150, payments: [],
    trips: [
      { tripId: 'T-030', vessel: 'MV Agbami Venture', destination: 'Agbami FPSO', direction: 'to-site', departureDate: '2026-05-01', arrivalDate: '2026-05-03', sentBy: 'Biodun Adekunle', receivedBy: 'Site Ops', manifestNumber: 'MNF-2026-0501', waybillNumber: 'WB-2026-0501' },
    ],
    movementLog: [
      { id: 'ML-030', timestamp: '2024-01-01T09:00:00', action: 'added-to-fleet', location: 'Onne Base', performedBy: 'Femi Emmanuel' },
      { id: 'ML-031', timestamp: '2026-05-01T07:00:00', action: 'dispatched', location: 'Onne Base', performedBy: 'Biodun Adekunle' },
      { id: 'ML-032', timestamp: '2026-05-03T14:00:00', action: 'arrived', location: 'Agbami FPSO', performedBy: 'Site Ops' },
    ],
    inspectionHistory: [{ date: '2024-01-01', result: 'Passed', inspector: 'Femi Emmanuel' }],
  },
  {
    serialNumber: '23846', type: '23ft Half Height Basket', footprintM2: 16.9, lengthM: 6.9, widthM: 2.44, maxGrossWeightKg: 15350,
    inspectionExpiry: '2026-07-02', status: 'Assigned', available: false, certNo: 'CERT-2024-009',
    owner: 'TotalEnergies', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-02-01', contractorId: 'CONT-001', dailyRateUSD: 150, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '28-MZ-75-01', type: 'Chemical Tote Tank', footprintM2: 4.2, lengthM: 3.8, widthM: 1.1, maxGrossWeightKg: 9935,
    inspectionExpiry: '2026-06-30', status: 'Available', available: true, certNo: 'CERT-2024-010',
    owner: 'Halliburton', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-06-01', contractorId: 'CONT-003', dailyRateUSD: 95, payments: [], dangerousGoodsClass: 'hazardous',
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '28-MZ-75-02', type: 'Chemical Tote Tank', footprintM2: 4.2, lengthM: 3.8, widthM: 1.1, maxGrossWeightKg: 9935,
    inspectionExpiry: '2026-07-04', status: 'Assigned', available: false, certNo: 'CERT-2024-011',
    owner: 'Halliburton', location: 'Escravos Terminal', currentSite: 'Escravos Terminal',
    hiringStartDate: '2024-06-01', contractorId: 'CONT-003', dailyRateUSD: 95, payments: [], dangerousGoodsClass: 'hazardous',
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '28-MZ-75-03', type: 'Chemical Tote Tank', footprintM2: 4.2, lengthM: 3.8, widthM: 1.1, maxGrossWeightKg: 9935,
    inspectionExpiry: '2026-06-20', status: 'Available', available: false, certNo: 'CERT-2024-012',
    owner: 'Halliburton', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-06-01', contractorId: 'CONT-003', dailyRateUSD: 95, payments: [], dangerousGoodsClass: 'hazardous',
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '40-BX-01', type: 'Open Top Basket', footprintM2: 8.4, lengthM: 4.2, widthM: 2.0, maxGrossWeightKg: 9000,
    inspectionExpiry: '2026-09-15', status: 'Available', available: true, certNo: 'CERT-2024-013',
    owner: 'Baker Hughes', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-07-01', contractorId: 'CONT-004', dailyRateUSD: 100, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: '40-BX-02', type: 'Open Top Basket', footprintM2: 8.4, lengthM: 4.2, widthM: 2.0, maxGrossWeightKg: 9000,
    inspectionExpiry: '2026-08-20', status: 'Maintenance', available: false, certNo: 'CERT-2024-014',
    owner: 'Baker Hughes', location: 'Workshop', currentSite: null,
    hiringStartDate: '2024-07-01', contractorId: 'CONT-004', dailyRateUSD: 100, payments: [],
    trips: [], movementLog: [{ id: 'ML-040', timestamp: '2026-06-15T10:00:00', action: 'sent-to-vendor', location: 'Workshop', performedBy: 'Segun Afolabi', notes: 'Structural repair needed on corner castings' }],
    inspectionHistory: [],
  },
  {
    serialNumber: 'CT-44-A', type: 'Closed Top Basket', footprintM2: 11.2, lengthM: 4.7, widthM: 2.38, maxGrossWeightKg: 13500,
    inspectionExpiry: '2026-10-01', status: 'Available', available: true, certNo: 'CERT-2024-015',
    owner: 'Weatherford', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-08-01', contractorId: 'CONT-005', dailyRateUSD: 130, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
  {
    serialNumber: 'CT-44-B', type: 'Closed Top Basket', footprintM2: 11.2, lengthM: 4.7, widthM: 2.38, maxGrossWeightKg: 13500,
    inspectionExpiry: '2026-07-07', status: 'In Transit', available: false, certNo: 'CERT-2024-016',
    owner: 'Weatherford', location: 'Erha FPSO', currentSite: 'Erha FPSO',
    hiringStartDate: '2024-08-01', contractorId: 'CONT-005', dailyRateUSD: 130, payments: [],
    trips: [
      { tripId: 'T-050', vessel: 'MV Erha Explorer', destination: 'Erha FPSO', direction: 'to-site', departureDate: '2026-06-20', arrivalDate: '2026-06-22', sentBy: 'Chika Obi', receivedBy: 'Site Ops', manifestNumber: 'MNF-2026-0620', waybillNumber: 'WB-2026-0620' },
    ],
    movementLog: [
      { id: 'ML-050', timestamp: '2024-08-01T09:00:00', action: 'added-to-fleet', location: 'Onne Base', performedBy: 'Femi Emmanuel' },
      { id: 'ML-051', timestamp: '2026-06-20T07:00:00', action: 'dispatched', location: 'Onne Base', performedBy: 'Chika Obi' },
      { id: 'ML-052', timestamp: '2026-06-22T13:00:00', action: 'arrived', location: 'Erha FPSO', performedBy: 'Site Ops' },
    ],
    inspectionHistory: [{ date: '2024-08-01', result: 'Passed', inspector: 'Femi Emmanuel' }],
  },
  {
    serialNumber: 'WS-99-01', type: 'Waste Skip', footprintM2: 7.2, lengthM: 3.96, widthM: 1.8, maxGrossWeightKg: 6300,
    inspectionExpiry: '2026-05-10', status: 'Quarantine', available: false, certNo: 'CERT-2024-017',
    owner: 'TotalEnergies', location: 'Quarantine Bay', currentSite: null,
    hiringStartDate: '2024-09-01', contractorId: 'CONT-001', dailyRateUSD: 85, payments: [],
    trips: [], movementLog: [{ id: 'ML-060', timestamp: '2026-05-10T11:00:00', action: 'quarantined', location: 'Quarantine Bay', performedBy: 'Ngozi Okafor', notes: 'Failed inspection — extensive corrosion' }],
    inspectionHistory: [{ date: '2026-05-10', result: 'Failed', inspector: 'Ngozi Okafor', notes: 'Extensive corrosion on frame' }],
  },
  {
    serialNumber: 'HHB-55-01', type: '15ft Half Height Basket', footprintM2: 10.7, lengthM: 4.45, widthM: 2.4, maxGrossWeightKg: 12750,
    inspectionExpiry: '2026-11-30', status: 'Available', available: true, certNo: 'CERT-2024-018',
    owner: 'Schlumberger', location: 'Onne Base', currentSite: null,
    hiringStartDate: '2024-10-01', contractorId: 'CONT-002', dailyRateUSD: 120, payments: [],
    trips: [], movementLog: [], inspectionHistory: [],
  },
]
