export type CCUType =
  | 'Waste Skip'
  | '23ft Half Height Basket'
  | '15ft Half Height Basket'
  | '10ft Half Height Basket'
  | '20ft Half Height Basket'
  | 'Mini Container'
  | '8ft Cargo Basket'
  | '4ft Cargo Basket'
  | '8ft Closed Top Container'
  | '10ft Closed Top Container'
  | '20ft Closed Top Container'
  | '20ft Open Top Container'
  | 'Gas Rack'
  | 'Chemical Tote Tank'
  | 'MUD SKID'

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

export const CCU_TYPES_OPT = [
  'Waste Skip','23ft Half Height Basket','15ft Half Height Basket','10ft Half Height Basket',
  '20ft Half Height Basket','Mini Container','8ft Cargo Basket','4ft Cargo Basket',
  '8ft Closed Top Container','10ft Closed Top Container','20ft Closed Top Container',
  '20ft Open Top Container','Gas Rack','Chemical Tote Tank','MUD SKID',
].map(v => ({ value: v, label: v }))

export const OWNER_OPT = ['TotalEnergies','Schlumberger','Halliburton','Baker Hughes','Weatherford','Apex Offshore Ltd','Delta Marine Containers','Onne Container Services','Gulf Stream Logistics'].map(v => ({ value: v, label: v }))
export const LOCATION_OPT = ['Onne Base','Akpo','Amadi-Base','Egina','Hosh-1','AMQ','Odudu','Ofon','Amenam','Onne','Workshop','Quarantine Bay'].map(v => ({ value: v, label: v }))

export const DIMS_DEFAULT: Record<CCUType, { footprintM2: number; lengthM: number; widthM: number; maxGrossWeightKg: number }> = {
  'Waste Skip':               { footprintM2: 7.13,  lengthM: 3.96, widthM: 1.8,  maxGrossWeightKg: 6300  },
  '23ft Half Height Basket':  { footprintM2: 16.84, lengthM: 6.9,  widthM: 2.44, maxGrossWeightKg: 15350 },
  '15ft Half Height Basket':  { footprintM2: 10.68, lengthM: 4.45, widthM: 2.4,  maxGrossWeightKg: 12750 },
  '10ft Half Height Basket':  { footprintM2: 4.84,  lengthM: 2.2,  widthM: 2.2,  maxGrossWeightKg: 10000 },
  '20ft Half Height Basket':  { footprintM2: 14.79, lengthM: 6.06, widthM: 2.44, maxGrossWeightKg: 13600 },
  'Mini Container':           { footprintM2: 3.15,  lengthM: 1.9,  widthM: 1.66, maxGrossWeightKg: 5570  },
  '8ft Cargo Basket':         { footprintM2: 4.07,  lengthM: 2.45, widthM: 1.66, maxGrossWeightKg: 5570  },
  '4ft Cargo Basket':         { footprintM2: 1.46,  lengthM: 1.22, widthM: 1.2,  maxGrossWeightKg: 4565  },
  '8ft Closed Top Container': { footprintM2: 6.0,   lengthM: 2.45, widthM: 2.45, maxGrossWeightKg: 6200  },
  '10ft Closed Top Container':{ footprintM2: 4.84,  lengthM: 2.2,  widthM: 2.2,  maxGrossWeightKg: 10000 },
  '20ft Closed Top Container':{ footprintM2: 7.27,  lengthM: 2.98, widthM: 2.44, maxGrossWeightKg: 10115 },
  '20ft Open Top Container':  { footprintM2: 14.54, lengthM: 6.06, widthM: 2.4,  maxGrossWeightKg: 19000 },
  'Gas Rack':                 { footprintM2: 1.51,  lengthM: 1.37, widthM: 1.1,  maxGrossWeightKg: 2670  },
  'Chemical Tote Tank':       { footprintM2: 4.18,  lengthM: 3.8,  widthM: 1.1,  maxGrossWeightKg: 9935  },
  'MUD SKID':                 { footprintM2: 3.57,  lengthM: 2.11, widthM: 1.69, maxGrossWeightKg: 6000  },
}

function mkCCU(sn: string, t: CCUType, l: number, w: number, gw: number, exp: string): CCUContainer {
  return {
    serialNumber: sn, type: t,
    footprintM2: Math.round(l * w * 100) / 100,
    lengthM: l, widthM: w, maxGrossWeightKg: gw,
    inspectionExpiry: exp, status: 'Available', available: true,
    location: 'Onne', currentSite: 'Onne', hiringStartDate: null, contractorId: null,
    dailyRateUSD: null, trips: [], movementLog: [], payments: [], inspectionHistory: [],
  }
}

const WS  = (sn: string, exp: string) => mkCCU(sn, 'Waste Skip', 3.96, 1.8, 6300, exp)
const MC  = (sn: string, exp: string) => mkCCU(sn, 'Mini Container', 1.9, 1.66, 5570, exp)
const H10 = (sn: string, exp: string) => mkCCU(sn, '10ft Half Height Basket', 2.2, 2.2, 10000, exp)
const H20 = (sn: string, exp: string) => mkCCU(sn, '20ft Half Height Basket', 6.06, 2.44, 13600, exp)
const CT10= (sn: string, exp: string) => mkCCU(sn, '10ft Closed Top Container', 2.2, 2.2, 10000, exp)
const CT20= (sn: string, exp: string) => mkCCU(sn, '20ft Closed Top Container', 2.98, 2.44, 10115, exp)
const OT20= (sn: string, exp: string) => mkCCU(sn, '20ft Open Top Container', 6.06, 2.4, 19000, exp)
const CTT = (sn: string, exp: string) => mkCCU(sn, 'Chemical Tote Tank', 3.8, 1.1, 9935, exp)
const MUD = (sn: string, exp: string) => mkCCU(sn, 'MUD SKID', 2.11, 1.69, 6000, exp)
const GR  = (sn: string, exp: string) => mkCCU(sn, 'Gas Rack', 1.37, 1.1, 2670, exp)
const CB4 = (sn: string, exp: string) => mkCCU(sn, '4ft Cargo Basket', 1.22, 1.2, 4565, exp)

export const INIT_CONTAINERS: CCUContainer[] = [
  // Waste Skips (numeric series)
  WS('13162', '2026-06-03'),
  WS('13164', '2026-06-28'),
  WS('13174', '2026-06-03'),
  mkCCU('13177', 'Waste Skip', 3.79, 1.74, 9000, '2026-06-28'),
  WS('13181', '2026-07-13'),
  WS('13347', '2026-07-27'),

  // 23ft Half Height Baskets
  mkCCU('23830', '23ft Half Height Basket', 6.9, 2.44, 15350, '2026-06-15'),
  mkCCU('23846', '23ft Half Height Basket', 6.9, 2.44, 15350, '2026-07-01'),

  // 20ft Open Top Container
  OT20('30334', '2026-07-23'),

  // Mini Containers (numeric)
  MC('62212', '2026-06-27'),
  MC('62600', '2026-07-28'),

  // 8ft Cargo Baskets (numeric)
  mkCCU('64015',  '8ft Cargo Basket', 2.45, 1.66, 5570, '2026-07-15'),
  mkCCU('84019',  '8ft Cargo Basket', 2.45, 2.04, 6200, '2026-07-14'),

  // 15ft Half Height Basket
  mkCCU('158551', '15ft Half Height Basket', 4.45, 2.4, 12750, '2026-07-20'),

  // Mini Containers (690xxx–697xxx series)
  MC('690175', '2026-07-13'),
  MC('690186', '2026-08-23'),
  MC('690965', '2026-05-08'),
  MC('691120', '2026-06-28'),
  MC('691125', '2026-06-03'),
  MC('691126', '2026-05-27'),
  MC('691129', '2026-07-18'),
  MC('691130', '2026-10-03'),
  MC('691135', '2026-07-10'),
  MC('691136', '2026-08-01'),
  MC('691137', '2026-07-13'),
  MC('691138', '2026-06-27'),
  MC('691140', '2026-06-30'),
  MC('691143', '2026-09-11'),
  MC('691144', '2026-05-08'),
  MC('691145', '2026-04-12'),
  MC('691148', '2026-05-25'),
  MC('691150', '2026-08-05'),
  MC('691151', '2026-07-04'),
  MC('691152', '2026-07-18'),
  MC('691155', '2026-07-24'),
  MC('691158', '2026-07-18'),
  MC('691161', '2026-09-15'),
  MC('691163', '2026-07-03'),
  MC('691186', '2026-05-22'),
  MC('695045', '2026-06-30'),
  MC('695075', '2026-06-01'),
  MC('695337', '2026-06-20'),
  MC('695376', '2026-07-20'),
  MC('695421', '2026-07-10'),
  MC('695440', '2026-07-09'),
  MC('695472', '2026-07-18'),
  MC('695475', '2026-06-03'),
  MC('695919', '2026-06-23'),
  MC('695921', '2026-08-02'),
  MC('695922', '2026-07-09'),
  MC('695925', '2026-07-14'),
  MC('695927', '2026-07-03'),
  MC('695929', '2026-06-23'),
  MC('695932', '2026-07-11'),
  MC('695935', '2027-06-15'),
  MC('695936', '2026-06-03'),
  MC('695937', '2026-05-11'),
  MC('695942', '2026-06-15'),
  MC('695944', '2026-06-18'),
  MC('695945', '2026-07-04'),
  MC('695949', '2026-06-30'),
  MC('695950', '2026-07-28'),
  MC('695951', '2026-06-03'),
  MC('695952', '2026-06-03'),
  MC('695955', '2026-06-17'),
  MC('695956', '2026-07-21'),
  MC('695957', '2026-07-18'),
  MC('695963', '2026-06-09'),
  MC('695964', '2026-06-03'),
  MC('695966', '2026-06-24'),
  MC('695969', '2026-10-01'),
  MC('695971', '2026-06-24'),
  MC('695976', '2026-07-06'),
  MC('695978', '2026-08-20'),
  MC('695982', '2026-12-06'),
  MC('695985', '2026-07-16'),
  MC('695988', '2026-06-26'),
  MC('695989', '2026-08-12'),
  MC('695990', '2026-04-24'),
  MC('695993', '2026-10-02'),
  MC('695994', '2026-08-17'),
  MC('695995', '2026-07-10'),
  MC('695998', '2026-06-11'),
  MC('695999', '2026-07-01'),
  MC('696003', '2026-07-06'),
  MC('696004', '2026-07-12'),
  MC('696005', '2026-08-24'),
  MC('696006', '2026-07-28'),
  MC('696008', '2026-08-02'),
  MC('696011', '2026-07-09'),
  MC('696014', '2026-06-19'),
  MC('696017', '2026-06-13'),
  MC('696018', '2026-04-10'),
  MC('696062', '2026-10-03'),
  MC('696193', '2026-06-02'),
  MC('696195', '2026-09-07'),
  MC('696196', '2026-07-19'),
  MC('696197', '2026-08-19'),
  MC('696198', '2026-08-06'),
  MC('696199', '2026-07-13'),
  MC('696205', '2026-08-02'),
  MC('696208', '2026-07-17'),
  MC('696209', '2026-06-16'),
  MC('696211', '2026-07-14'),
  MC('696212', '2026-07-22'),
  MC('696213', '2026-07-10'),
  MC('696214', '2026-07-25'),
  MC('696215', '2026-06-24'),
  MC('696218', '2026-07-04'),
  MC('696221', '2026-07-18'),
  MC('696222', '2026-04-24'),
  MC('696223', '2026-06-23'),
  MC('696224', '2026-06-25'),
  MC('696225', '2026-10-05'),
  MC('696229', '2026-07-08'),
  MC('696232', '2026-07-11'),
  MC('696236', '2026-08-10'),
  MC('696238', '2026-07-12'),
  MC('696239', '2026-07-09'),
  MC('696240', '2026-06-28'),
  MC('696243', '2026-06-30'),
  MC('696244', '2026-07-13'),
  MC('696245', '2026-07-24'),
  MC('696248', '2026-06-24'),
  MC('696249', '2026-05-18'),
  MC('696250', '2026-07-18'),
  MC('696252', '2026-05-11'),
  MC('696254', '2026-07-20'),
  MC('696257', '2026-05-28'),
  MC('696259', '2026-07-12'),
  MC('696260', '2026-06-26'),
  MC('696262', '2026-06-04'),
  MC('696263', '2026-06-01'),
  MC('696267', '2026-06-02'),
  MC('696272', '2026-05-07'),
  MC('696277', '2026-09-06'),
  MC('696279', '2026-06-02'),
  MC('696280', '2026-05-19'),
  MC('696285', '2026-06-08'),
  MC('696286', '2026-06-19'),
  MC('696289', '2026-06-17'),
  MC('696296', '2026-06-16'),
  MC('696302', '2026-07-24'),
  MC('696303', '2026-06-09'),
  MC('696304', '2026-07-20'),
  MC('696309', '2026-06-16'),
  MC('696311', '2026-09-30'),
  MC('696312', '2026-07-12'),
  MC('696315', '2026-07-20'),
  MC('696317', '2026-10-05'),
  MC('696320', '2026-07-30'),
  MC('696321', '2026-06-13'),
  MC('696323', '2026-06-18'),
  MC('696329', '2026-05-18'),
  MC('696334', '2026-06-03'),
  MC('696336', '2026-06-17'),
  MC('696337', '2026-06-18'),
  MC('696342', '2026-06-24'),
  MC('696343', '2026-06-18'),
  MC('696345', '2026-08-11'),
  MC('696346', '2026-07-12'),
  MC('696347', '2026-07-18'),
  MC('696673', '2026-08-05'),
  MC('696675', '2026-07-05'),
  MC('696935', '2026-07-10'),
  MC('697417', '2026-06-20'),
  MC('697632', '2026-07-06'),

  // 8ft Cargo Baskets (864xxx)
  mkCCU('864140', '8ft Cargo Basket', 2.45, 1.66, 5570, '2026-07-18'),
  mkCCU('864141', '8ft Cargo Basket', 2.45, 1.66, 5570, '2026-09-11'),

  // 8ft Closed Top Container
  mkCCU('800074-3', '8ft Closed Top Container', 2.45, 2.45, 6200, '2026-09-11'),

  // Mini Containers (BO series)
  MC('BO-095',    '2026-04-24'),
  MC('BO-121-MM', '2026-07-18'),
  MC('BO-279-MM', '2026-07-18'),

  // LBCB series — 4ft and 8ft Cargo Baskets
  CB4('LBCB 002', '2026-08-07'),
  CB4('LBCB 006', '2026-05-28'),
  CB4('LBCB 007', '2026-08-04'),
  mkCCU('LBCB 008', '8ft Cargo Basket', 2.44, 1.83, 6100, '2026-05-20'),
  mkCCU('LBCB 010', '8ft Cargo Basket', 2.44, 1.83, 6100, '2026-09-10'),
  mkCCU('LBCB 011', '8ft Cargo Basket', 2.44, 1.83, 6100, '2026-06-04'),
  mkCCU('LBCB 012', '8ft Cargo Basket', 2.44, 1.83, 6100, '2023-07-07'),
  mkCCU('LBCB 013', '8ft Cargo Basket', 2.44, 1.83, 6100, '2023-12-16'),
  mkCCU('LBCB 015', '8ft Cargo Basket', 2.44, 1.83, 6100, '2023-02-03'),
  mkCCU('LBCB 016', '8ft Cargo Basket', 2.44, 1.83, 6100, '2026-09-23'),
  CB4('LBCB 051', '2026-05-18'),
  CB4('LBCB 052', '2026-05-28'),
  CB4('LBCB 054', '2026-05-20'),

  // LBHALFH series — 10ft and 20ft Half Height Baskets
  H10('LBHALFH045',  '2026-06-04'),
  H10('LBHALFH046',  '2026-05-10'),
  H10('LBHALFH050',  '2026-08-05'),
  H10('LBHALFH052',  '2026-07-10'),
  H10('LBHALFH209',  '2026-07-01'),
  H10('LBHALFH214',  '2026-09-02'),
  H10('LBHALFH218',  '2026-07-02'),
  H10('LBHALFH221',  '2026-07-10'),
  H20('LBHALFH223',  '2026-07-04'),
  H20('LBHALFH225',  '2026-07-15'),
  H20('LBHALFH227',  '2026-09-20'),
  H10('LBHALFH234',  '2026-06-03'),
  H20('LBHALFH237',  '2026-05-11'),
  H20('LBHALFH238',  '2026-06-03'),
  H20('LBHALF-H239', '2026-06-30'),
  H20('LBHALFH241',  '2026-06-23'),
  H20('LBHALFH242',  '2026-06-15'),
  H20('LBHALFH253',  '2026-07-08'),
  H20('LBHALF-H255', '2026-05-12'),
  H10('LBHH 108040', '2026-07-09'),
  H20('LBHH 208017', '2026-08-10'),

  // LBMINI series — Mini Containers
  MC('LBMINI-042', '2026-06-03'),
  MC('LBMINI-043', '2026-06-23'),
  MC('LBMINI-055', '2026-09-04'),
  MC('LBMINI-059', '2026-06-24'),
  MC('LBMINI-061', '2026-07-01'),
  MC('LBMINI-066', '2026-06-16'),
  MC('LBMINI-070', '2026-06-18'),
  MC('LBMINI-071', '2026-07-15'),
  MC('LBMINI-077', '2026-06-09'),
  MC('LBMINI-093', '2026-06-03'),
  MC('LBMINI-126', '2026-06-21'),
  MC('LBMINI-131', '2026-10-02'),
  MC('LBMINI-137', '2026-06-10'),
  MC('LBMINI-214', '2026-07-18'),
  MC('LBMINI-219', '2026-04-25'),
  MC('LBMINI-238', '2026-06-20'),
  MC('LBMINI-241', '2026-06-07'),
  MC('LBMINI-256', '2026-06-18'),
  MC('LBMINI-276', '2026-06-16'),
  MC('LBMINI-291', '2026-06-17'),
  MC('LBMINI-299', '2026-07-17'),
  MC('LBMINI-301', '2026-06-15'),
  MC('LBMINI-314', '2026-06-02'),
  MC('LBMINI-318', '2026-07-05'),
  MC('LBMINI-339', '2026-06-18'),
  MC('LBMINI-360', '2026-07-30'),
  MC('LBMINI-371', '2026-07-25'),
  MC('LBMINI-379', '2026-07-18'),

  // NDC20 — 20ft Closed Top Container
  CT20('NDC20-003', '2026-07-08'),

  // OEGU 10ft Closed Top Containers (102xxx, 103xxx, 120xxx)
  CT10('OEGU 102858-5', '2026-07-03'),
  CT10('OEGU 102893-9', '2026-06-04'),
  CT10('OEGU 102894-4', '2026-05-25'),
  CT10('OEGU 102895-0', '2026-07-18'),
  CT10('OEGU 103061-7', '2026-07-08'),
  CT10('OEGU 120114-0', '2026-08-20'),
  CT10('OEGU 120208-5', '2026-05-29'),
  CT10('OEGU 120347-7', '2026-06-20'),
  CT10('OEGU 120349-8', '2026-08-12'),
  CT10('OEGU 120455-4', '2026-08-10'),
  CT10('OEGU 120455-5', '2026-04-05'),
  CT10('OEGU 120456-0', '2026-07-10'),
  CT10('OEGU 120460-0', '2026-07-20'),
  CT10('OEGU 120470-3', '2026-07-17'),
  CT10('OEGU 120471-9', '2026-09-18'),
  CT10('OEGU 120714-8', '2026-07-19'),
  CT10('OEGU 120742-5', '2026-08-01'),

  // OEGU 10ft Half Height Baskets (143xxx, 144xxx)
  H10('OEGU 143555-4', '2026-04-04'),
  H10('OEGU 143639-7', '2026-08-11'),
  H10('OEGU 143691-0', '2026-07-08'),
  H10('OEGU 143770-5', '2026-07-05'),
  H10('OEGU 143773-1', '2026-08-22'),
  H10('OEGU 143785-5', '2026-06-24'),
  H10('OEGU 143957-0', '2026-07-10'),
  H10('OEGU 143960-5', '2026-07-26'),
  H10('OEGU 143963-1', '2026-08-13'),
  H10('OEGU 144015-0', '2026-07-24'),
  H10('OEGU 144016-5', '2026-07-30'),
  H10('OEGU 144017-0', '2026-07-17'),
  H10('OEGU 144018-6', '2026-07-17'),
  H10('OEGU 144028-9', '2026-07-23'),
  H10('OEGU 144030-8', '2026-08-27'),
  H10('OEGU 144033-4', '2026-06-15'),
  H10('OEGU 144034-0', '2026-06-22'),
  H10('OEGU 144040-0', '2026-07-03'),
  H10('OEGU 144041-6', '2026-07-23'),
  H10('OEGU 144042-1', '2026-06-17'),
  H10('OEGU 144043-7', '2026-06-20'),
  H10('OEGU 144044-2', '2026-06-16'),
  H10('OEGU 144047-9', '2026-07-23'),
  H10('OEGU 144056-6', '2026-07-14'),
  H10('OEGU 144058-7', '2026-06-15'),
  H10('OEGU 144060-6', '2026-08-13'),
  H10('OEGU 144062-7', '2026-06-19'),
  H10('OEGU 144078-2', '2026-05-28'),
  H10('OEGU 144092-5', '2026-08-01'),
  H10('OEGU 144093-0', '2026-07-30'),

  // OEGU 20ft Closed Top Containers (151xxx)
  CT20('OEGU 151117-1', '2026-07-10'),
  CT20('OEGU 151176-2', '2026-07-17'),
  CT20('OEGU 151203-3', '2026-09-02'),
  CT20('OEGU 151214-1', '2026-06-16'),
  CT20('OEGU 151229-1', '2026-07-18'),
  CT20('OEGU 151241-3', '2026-06-07'),
  CT20('OEGU 151367-8', '2026-07-18'),
  CT20('OEGU 151476-7', '2026-07-18'),
  CT20('OEGU 151659-5', '2026-07-19'),

  // OEGU 10ft Closed Top Container (197xxx)
  CT10('OEGU 197016-5', '2026-06-08'),

  // OEGU 20ft Open Top Containers (220xxx — MaxGW 19300)
  mkCCU('OEGU 220001-9', '20ft Open Top Container', 6.06, 2.44, 19300, '2026-07-01'),
  mkCCU('OEGU 220002-4', '20ft Open Top Container', 6.06, 2.44, 19300, '2026-07-15'),

  // OEGU 20ft Half Height Baskets (243xxx, 244xxx)
  H20('OEGU 243700-0', '2026-07-07'),
  H20('OEGU 243710-3', '2026-07-07'),
  H20('OEGU 243796-8', '2026-07-20'),
  H20('OEGU 244016-0', '2026-04-29'),
  H20('OEGU 244018-0', '2026-07-13'),
  H20('OEGU 244154-6', '2026-07-20'),
  H20('OEGU 244180-2', '2026-08-23'),
  H20('OEGU 244181-8', '2026-07-10'),
  H20('OEGU 244182-2', '2026-07-12'),
  H20('OEGU 244182-3', '2026-06-18'),
  H20('OEGU 244196-8', '2026-09-01'),
  H20('OEGU 244216-2', '2026-06-10'),
  H20('OEGU 244218-3', '2026-07-12'),
  H20('OEGU 244250-0', '2026-06-18'),
  H20('OEGU 244277-4', '2026-05-28'),
  H20('OEGU 244411-8', '2026-07-13'),
  H20('OEGU 244414-4', '2026-07-06'),
  H20('OEGU 244423-1', '2026-07-12'),
  H20('OEGU 244433-4', '2026-06-23'),
  H20('OEGU 244437-6', '2026-06-15'),
  H20('OEGU 244441-6', '2026-06-20'),
  H20('OEGU 244448-4', '2026-09-01'),
  H20('OEGU 244450-3', '2026-07-11'),
  H20('OEGU 244458-7', '2026-07-13'),
  H20('OEGU 244461-1', '2026-07-07'),

  // OEGU 20ft Open Top Containers (250xxx, 252xxx — MaxGW 19000)
  OT20('OEGU 250279-1', '2026-07-07'),
  OT20('OEGU 250317-0', '2026-06-07'),
  OT20('OEGU 250417-7', '2026-08-01'),
  OT20('OEGU 252508-2', '2026-09-10'),
  OT20('OEGU 252509-8', '2026-08-12'),

  // Gas Racks (TBR series)
  GR('TBR 560', '2026-07-08'),
  GR('TBR 577', '2026-07-09'),
  GR('TBR 622', '2026-07-18'),
  GR('TBR 625', '2026-07-18'),

  // Waste Skips (TTA series)
  WS('TTA 001', '2026-06-18'),
  WS('TTA 003', '2026-06-19'),
  WS('TTA 004', '2026-06-15'),
  WS('TTA 005', '2026-07-05'),
  WS('TTA 011', '2026-06-30'),
  WS('TTA 012', '2026-06-16'),
  WS('TTA 013', '2026-06-17'),
  WS('TTA 014', '2026-06-15'),
  WS('TTA 015', '2026-06-23'),
  WS('TTA 016', '2026-06-15'),
  WS('TTA 017', '2026-06-16'),
  WS('TTA 018', '2026-07-12'),
  WS('TTA 019', '2026-07-07'),
  WS('TTA 020', '2026-07-12'),
  WS('TTA 021', '2026-06-22'),
  WS('TTA 022', '2026-06-22'),
  WS('TTA 111', '2026-06-30'),
  WS('TTA 112', '2026-06-21'),
  WS('TTA 113', '2026-06-22'),
  WS('TTA 114', '2026-07-08'),
  WS('TTA 115', '2026-06-16'),
  WS('TTA 116', '2027-06-16'),
  WS('TTA 117', '2027-06-17'),
  WS('TTA 118', '2026-06-16'),
  WS('TTA 119', '2026-06-22'),
  WS('TTA 120', '2026-06-23'),
  WS('TTA 121', '2026-06-17'),
  WS('TTA 122', '2026-06-23'),
  WS('TTA 123', '2026-06-23'),
  WS('TTA 124', '2026-06-01'),
  WS('TTA 125', '2026-07-10'),
  WS('TTA 126', '2026-07-15'),
  WS('TTA 127', '2026-07-14'),
  WS('TTA 128', '2026-07-20'),

  // Chemical Tote Tanks (28-MZ-75-xx series)
  CTT('28-MZ-75-01', '2026-06-29'),
  CTT('28-MZ-75-02', '2026-07-03'),
  CTT('28-MZ-75-03', '2026-06-19'),
  CTT('28-MZ-75-04', '2026-07-24'),
  CTT('28-MZ-75-05', '2026-07-02'),
  CTT('28-MZ-75-06', '2026-07-06'),
  CTT('28-MZ-75-07', '2026-07-08'),
  CTT('28-MZ-75-08', '2026-07-16'),
  CTT('28-MZ-75-09', '2026-07-05'),
  CTT('28-MZ-75-10', '2026-07-12'),
  CTT('28-MZ-75-11', '2026-07-03'),
  CTT('28-MZ-75-12', '2026-07-06'),
  CTT('28-MZ-75-13', '2026-06-19'),
  CTT('28-MZ-75-14', '2026-07-03'),
  CTT('28-MZ-75-15', '2026-07-14'),
  CTT('28-MZ-75-16', '2026-07-05'),
  CTT('28-MZ-75-17', '2026-07-16'),
  CTT('28-MZ-75-18', '2026-06-30'),
  CTT('28-MZ-75-19', '2026-07-08'),
  CTT('28-MZ-75-20', '2026-07-02'),
  CTT('28-MZ-75-21', '2026-07-10'),
  CTT('28-MZ-75-22', '2026-07-16'),
  CTT('28-MZ-75-23', '2026-08-12'),
  CTT('28-MZ-75-24', '2026-06-28'),
  CTT('28-MZ-75-25', '2026-07-14'),
  CTT('28-MZ-75-26', '2026-07-05'),
  CTT('28-MZ-75-27', '2026-07-16'),
  CTT('28-MZ-75-28', '2026-07-07'),
  CTT('28-MZ-75-29', '2026-07-03'),
  CTT('28-MZ-75-30', '2026-07-19'),
  CTT('28-MZ-75-31', '2026-07-20'),
  CTT('28-MZ-75-32', '2026-06-19'),
  CTT('28-MZ-75-33', '2026-07-06'),
  CTT('28-MZ-75-34', '2026-07-03'),

  // Chemical Tote Tanks (NT series)
  CTT('NT1551', '2026-07-24'),
  CTT('NT1552', '2026-07-10'),
  CTT('NT1553', '2026-08-26'),
  CTT('NT1554', '2026-07-07'),

  // MUD SKIDs (TTA MUD SKID series)
  MUD('TTA 001 (MUD SKID)', '2026-08-28'),
  MUD('TTA 002 (MUD SKID)', '2026-07-17'),
  MUD('TTA 003 (MUD SKID)', '2026-07-12'),
  MUD('TTA 004 (MUD SKID)', '2026-06-18'),
  MUD('TTA 005 (MUD SKID)', '2026-07-04'),
  MUD('TTA 006 (MUD SKID)', '2026-06-19'),
]
