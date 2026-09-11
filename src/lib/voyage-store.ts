export type LMTSDecision  = 'validated' | 'pending' | 'cancelled' | 'rejected'
export type VoyageEntity  = 'DRILL' | 'FOPS' | 'ECP' | 'PROJECT' | 'TECHLOG'
export type VoyagePriority = 'High' | 'Medium' | 'Low'

export interface CCUBooking {
  id: string
  sn: number
  responsible: string
  ccuId: string
  ccuType: string
  contractor: string
  entity: VoyageEntity
  weightTons: number
  deckSpaceM2: number
  destination: string
  priority: VoyagePriority
  eddOnSite: string
  lmtsDecision: LMTSDecision
  t1FWB: boolean
  loaded: boolean
  comments?: string
}

export interface Voyage {
  id: string
  vessel: string
  vesselCapacityM2: number
  vesselPlugs: number
  transitTo: string
  departureDate: string
  bookings: CCUBooking[]
}

// From the DATA sheet
export const VESSEL_SPECS: Record<string, { capacityM2: number; plugs: number }> = {
  'African Concept':     { capacityM2: 479, plugs: 8 },
  'A70':                 { capacityM2: 500, plugs: 8 },
  'AM PROSPERITY':       { capacityM2: 500, plugs: 12 },
  'Afrik Cougar':        { capacityM2: 120, plugs: 7 },
  'AM PLEASURE':         { capacityM2: 500, plugs: 6 },
  'ISLAND GIRL':         { capacityM2: 413, plugs: 4 },
  'Aquaman':             { capacityM2: 257, plugs: 6 },
  'Ava J Mc Call':       { capacityM2: 167, plugs: 5 },
  'BB Liberty 206':      { capacityM2: 205, plugs: 4 },
  'PISTOS-Levant':       { capacityM2: 120, plugs: 4 },
  'NIKAO-Libeccio':      { capacityM2: 120, plugs: 4 },
  'Bourbon Liberty 234': { capacityM2: 250, plugs: 4 },
  'OSHE 3':              { capacityM2: 126, plugs: 4 },
  'Dijama':              { capacityM2: 100, plugs: 4 },
  'HARVEY.PIONEER':      { capacityM2: 500, plugs: 6 },
  'MV KARIS':            { capacityM2: 400, plugs: 16 },
  'VEGA BLESS':          { capacityM2: 250, plugs: 4 },
  'Ievoli Coral':        { capacityM2: 220, plugs: 8 },
  'LAMNALCO Malkoha':    { capacityM2: 126, plugs: 6 },
  'Lahama':              { capacityM2: 500, plugs: 14 },
  'Maniviki Rover':      { capacityM2: 500, plugs: 8 },
  'MV Bemigho':          { capacityM2: 450, plugs: 8 },
  'OOC Cougar':          { capacityM2: 350, plugs: 4 },
  'OOC Emerald':         { capacityM2: 430, plugs: 30 },
  'Osanyamo':            { capacityM2: 111, plugs: 4 },
  'Osarugue':            { capacityM2: 63,  plugs: 6 },
  'PRINCE JOB 1':        { capacityM2: 220, plugs: 4 },
  'Siem Marlin':         { capacityM2: 450, plugs: 4 },
  'TMC Providence':      { capacityM2: 450, plugs: 4 },
  'Topaz Seema':         { capacityM2: 450, plugs: 12 },
}

// Standard CCU types from the DATA sheet with their deck footprint in m²
export const CCU_TYPES: { label: string; m2: number }[] = [
  { label: '10FT Container',        m2: 8.3   },
  { label: '10FT Dry',              m2: 8.3   },
  { label: '10FT Veg',              m2: 8.3   },
  { label: '10FT Frozen',           m2: 8.3   },
  { label: '10FT Basket',           m2: 7.25  },
  { label: '10FT HH Basket',        m2: 7.32  },
  { label: '20FT Container',        m2: 14.84 },
  { label: '20FT Basket',           m2: 14.8  },
  { label: '20FT Refer Container',  m2: 14.84 },
  { label: '4FT Basket',            m2: 2.4   },
  { label: 'Gas Rack',              m2: 1.37  },
  { label: 'Mini Container',        m2: 3.3   },
  { label: 'Nitrogen Rack',         m2: 1.2   },
  { label: 'Nitrogen Tank',         m2: 7.24  },
  { label: 'Skip',                  m2: 3.57  },
  { label: 'Tote Tank',             m2: 5.2   },
  { label: 'Waste Skip',            m2: 7.0   },
  { label: 'Mud Skip',              m2: 3.57  },
  { label: 'Tool Box',              m2: 2.26  },
  { label: 'Chemical Tank',         m2: 5.09  },
]

export const CCU_TYPE_M2: Record<string, number> = Object.fromEntries(CCU_TYPES.map(t => [t.label, t.m2]))

export const VOYAGE_DESTINATIONS = [
  'DW / JV ASSET', 'AKPO / EGINA', 'AKPO / ODUDU', 'AKPO FPSO',
  'AMENAM', 'AMENAM / BALTIC', 'AMENAM / ODUDU', 'AMENAM / OFON',
  'AMENAM / INAGHA', 'ODUDU / OFON', 'ODUDU', 'OFON', 'OFON / UNITY',
  'EGINA', 'LADOL', 'FSO UNITY', 'OIMR', 'OSHE / ODUDU',
  'OTTO 1 / OFON', 'Q7000', 'DS 10', 'WARIBOKO', 'INAGHA',
  'HOSH1', 'OML 102 OFON', 'OML 100 UNITY', 'OML102 OFON', 'AKPO', 'SL SANAA',
]

export const VOYAGE_ENTITIES: VoyageEntity[] = ['DRILL', 'FOPS', 'ECP', 'PROJECT', 'TECHLOG']

export const ENTITY_COLOR: Record<VoyageEntity, string> = {
  DRILL:   '#2563EB',
  FOPS:    '#059669',
  ECP:     '#7C3AED',
  PROJECT: '#D97706',
  TECHLOG: '#64748B',
}

export const LMTS_LABEL: Record<LMTSDecision, string> = {
  validated: 'Validated',
  pending:   'Pending',
  cancelled: 'Cancelled',
  rejected:  'Rejected',
}

export const LMTS_STYLE: Record<LMTSDecision, string> = {
  validated: 'bg-green-50 text-green-700 border-green-300',
  pending:   'bg-amber-50 text-amber-700 border-amber-300',
  cancelled: 'bg-gray-100 text-gray-400 border-gray-200',
  rejected:  'bg-red-50 text-red-600 border-red-200',
}

export function voyageBookedM2(voyage: Voyage): number {
  return voyage.bookings
    .filter(b => b.lmtsDecision !== 'cancelled' && b.lmtsDecision !== 'rejected')
    .reduce((s, b) => s + b.deckSpaceM2, 0)
}

export function voyageUtilizationPct(voyage: Voyage): number {
  return (voyageBookedM2(voyage) / voyage.vesselCapacityM2) * 100
}

// Mock voyages derived from the spreadsheet data
export const VOYAGES: Voyage[] = [
  {
    id: 'VOY-2026-041',
    vessel: 'MV KARIS',
    vesselCapacityM2: 400,
    vesselPlugs: 16,
    transitTo: 'DW / JV ASSET',
    departureDate: '2026-04-15',
    bookings: [
      { id: 'b1', sn: 1, responsible: 'Arnaud Luxey', ccuId: 'AGL/C/002',    ccuType: 'Nitrogen Tank',   contractor: 'SLB', entity: 'DRILL', weightTons: 17.1, deckSpaceM2: 7.21, destination: 'INAGHA', priority: 'High', eddOnSite: '2026-04-15', lmtsDecision: 'validated', t1FWB: true,  loaded: true  },
      { id: 'b2', sn: 2, responsible: 'Arnaud Luxey', ccuId: 'TPL/LN2T/001', ccuType: 'Nitrogen Tank',   contractor: 'SLB', entity: 'DRILL', weightTons: 11.4, deckSpaceM2: 7.24, destination: 'INAGHA', priority: 'High', eddOnSite: '2026-04-15', lmtsDecision: 'validated', t1FWB: true,  loaded: true  },
      { id: 'b3', sn: 3, responsible: 'Arnaud Luxey', ccuId: 'LBCHEM C 069', ccuType: 'Nitrogen Tank',   contractor: 'SLB', entity: 'DRILL', weightTons: 11.4, deckSpaceM2: 7.29, destination: 'INAGHA', priority: 'High', eddOnSite: '2026-04-15', lmtsDecision: 'validated', t1FWB: false, loaded: true  },
      { id: 'b4', sn: 4, responsible: 'Arnaud Luxey', ccuId: 'LBHALFH 235',  ccuType: '10FT HH Basket',  contractor: 'SLB', entity: 'DRILL', weightTons: 12.5, deckSpaceM2: 7.25, destination: 'INAGHA', priority: 'High', eddOnSite: '2026-04-15', lmtsDecision: 'validated', t1FWB: false, loaded: true  },
      { id: 'b5', sn: 5, responsible: 'Arnaud Luxey', ccuId: 'LBHALFH 248',  ccuType: '10FT HH Basket',  contractor: 'SLB', entity: 'DRILL', weightTons: 12.5, deckSpaceM2: 7.32, destination: 'INAGHA', priority: 'High', eddOnSite: '2026-04-15', lmtsDecision: 'pending',   t1FWB: false, loaded: false },
    ],
  },
  {
    id: 'VOY-2026-042',
    vessel: 'NIKAO-Libeccio',
    vesselCapacityM2: 120,
    vesselPlugs: 4,
    transitTo: 'ODUDU / OFON',
    departureDate: '2026-04-16',
    bookings: [
      { id: 'c1',  sn:  1, responsible: 'Camp Boss',    ccuId: 'WENL017',       ccuType: '20FT Refer Container', contractor: 'WHASSAN',  entity: 'FOPS', weightTons: 11.4, deckSpaceM2: 16.72, destination: 'HOSH1',         priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: true,  loaded: true  },
      { id: 'c2',  sn:  2, responsible: 'Camp Boss',    ccuId: 'WENL021',       ccuType: '20FT Container',       contractor: 'WHASSAN',  entity: 'FOPS', weightTons: 11.4, deckSpaceM2: 16.72, destination: 'HOSH1',         priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: true,  loaded: true  },
      { id: 'c3',  sn:  3, responsible: 'Camp Boss',    ccuId: 'WENL022',       ccuType: '20FT Container',       contractor: 'WHASSAN',  entity: 'FOPS', weightTons: 11.4, deckSpaceM2: 16.72, destination: 'HOSH1',         priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: false, loaded: false },
      { id: 'c4',  sn:  4, responsible: 'Fadi Khoury',  ccuId: 'FWRU016345/2', ccuType: '10FT Veg',             contractor: 'COURDEAU', entity: 'FOPS', weightTons: 10,   deckSpaceM2:  7.0,  destination: 'OML 102 OFON',  priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: true,  loaded: true  },
      { id: 'c5',  sn:  5, responsible: 'Fadi Khoury',  ccuId: 'CCNL 009',     ccuType: '10FT Dry',             contractor: 'COURDEAU', entity: 'FOPS', weightTons: 10,   deckSpaceM2:  8.0,  destination: 'OML 102 OFON',  priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: false, loaded: false },
      { id: 'c6',  sn:  6, responsible: 'Fadi Khoury',  ccuId: 'CWLU400507/0', ccuType: '10FT Dry',             contractor: 'COURDEAU', entity: 'FOPS', weightTons: 10,   deckSpaceM2:  8.0,  destination: 'OML 100 UNITY', priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: false, loaded: false },
      { id: 'c7',  sn:  7, responsible: 'Fadi Khoury',  ccuId: 'CWLU400633/3', ccuType: '10FT Veg',             contractor: 'COURDEAU', entity: 'FOPS', weightTons: 10,   deckSpaceM2:  8.0,  destination: 'OML 100 UNITY', priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: false, loaded: false },
      { id: 'c8',  sn:  8, responsible: 'Fadi Khoury',  ccuId: 'CCNL 002',     ccuType: '10FT Frozen',          contractor: 'COURDEAU', entity: 'FOPS', weightTons: 10,   deckSpaceM2:  8.0,  destination: 'OML 100 UNITY', priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'pending',   t1FWB: false, loaded: false },
      { id: 'c9',  sn:  9, responsible: 'Glory/Golden', ccuId: 'TTA 015',      ccuType: 'Waste Skip',           contractor: 'TOTAL',    entity: 'FOPS', weightTons:  1.4, deckSpaceM2:  7.0,  destination: 'OML102 OFON',   priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: true,  loaded: false },
      { id: 'c10', sn: 10, responsible: 'Glory/Golden', ccuId: 'TTA 114',      ccuType: 'Tote Tank',            contractor: 'TOTAL',    entity: 'FOPS', weightTons:  1.4, deckSpaceM2:  7.0,  destination: 'OML102 OFON',   priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'validated', t1FWB: false, loaded: false },
      { id: 'c11', sn: 11, responsible: 'Glory/Golden', ccuId: 'HCSU 390024-5',ccuType: '20FT Container',       contractor: 'TOTAL',    entity: 'FOPS', weightTons:  6,   deckSpaceM2: 15.3,  destination: 'OML102 OFON',   priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'pending',   t1FWB: false, loaded: false },
      { id: 'c12', sn: 12, responsible: 'Glory/Golden', ccuId: '28-MZ-7532',   ccuType: 'Tote Tank',            contractor: 'TOTAL',    entity: 'FOPS', weightTons:  8.5, deckSpaceM2:  5.13, destination: 'OML102 OFON',   priority: 'High', eddOnSite: '2026-04-16', lmtsDecision: 'rejected',  t1FWB: false, loaded: false, comments: 'Overweight — rebook on next voyage' },
    ],
  },
  {
    id: 'VOY-2026-043',
    vessel: 'Lahama',
    vesselCapacityM2: 500,
    vesselPlugs: 14,
    transitTo: 'DW / JV ASSET',
    departureDate: '2026-04-17',
    bookings: [
      { id: 'd1', sn: 1, responsible: 'Martin Deki', ccuId: 'OEGU 144093-0', ccuType: '10FT Basket',  contractor: 'TOTALENERGIES', entity: 'FOPS', weightTons: 2.1, deckSpaceM2: 7.20, destination: 'LADOL', priority: 'High', eddOnSite: '2026-04-12', lmtsDecision: 'validated', t1FWB: true,  loaded: true  },
      { id: 'd2', sn: 2, responsible: 'Martin Deki', ccuId: 'OEGU 144042-1', ccuType: '10FT Basket',  contractor: 'TOTALENERGIES', entity: 'FOPS', weightTons: 2.1, deckSpaceM2: 7.20, destination: 'LADOL', priority: 'High', eddOnSite: '2026-04-12', lmtsDecision: 'validated', t1FWB: false, loaded: true  },
      { id: 'd3', sn: 3, responsible: 'Martin Deki', ccuId: '696342',        ccuType: 'Mini Container',contractor: 'TOTALENERGIES', entity: 'FOPS', weightTons: 1.7, deckSpaceM2: 3.04, destination: 'LADOL', priority: 'High', eddOnSite: '2026-04-12', lmtsDecision: 'validated', t1FWB: false, loaded: true  },
      { id: 'd4', sn: 4, responsible: 'Martin Deki', ccuId: 'OEGU 144062-7', ccuType: '10FT Basket',  contractor: 'TOTALENERGIES', entity: 'FOPS', weightTons: 2.1, deckSpaceM2: 7.20, destination: 'LADOL', priority: 'High', eddOnSite: '2026-04-12', lmtsDecision: 'validated', t1FWB: false, loaded: true  },
    ],
  },
  {
    id: 'VOY-2026-045',
    vessel: 'AM PROSPERITY',
    vesselCapacityM2: 500,
    vesselPlugs: 12,
    transitTo: 'AKPO / EGINA',
    departureDate: '2026-09-14',
    bookings: [
      { id: 'e1', sn: 1, responsible: 'Kingsley Jackson', ccuId: 'KJ-F001', ccuType: '10FT Container', contractor: 'HALDEN',   entity: 'FOPS',    weightTons: 10,  deckSpaceM2: 8.3,  destination: 'EGINA', priority: 'High',   eddOnSite: '2026-09-14', lmtsDecision: 'pending',   t1FWB: false, loaded: false },
      { id: 'e2', sn: 2, responsible: 'Kingsley Jackson', ccuId: 'KJ-D002', ccuType: '20FT Basket',    contractor: 'HALDEN',   entity: 'DRILL',   weightTons:  8,  deckSpaceM2: 14.8, destination: 'AKPO',  priority: 'Medium', eddOnSite: '2026-09-14', lmtsDecision: 'pending',   t1FWB: false, loaded: false },
      { id: 'e3', sn: 3, responsible: 'Seun Adeyemi',     ccuId: 'SA-E003', ccuType: 'Waste Skip',     contractor: 'S J ABED', entity: 'ECP',     weightTons:  1.5, deckSpaceM2: 7.0, destination: 'EGINA', priority: 'Low',    eddOnSite: '2026-09-14', lmtsDecision: 'validated', t1FWB: false, loaded: false },
      { id: 'e4', sn: 4, responsible: 'Seun Adeyemi',     ccuId: 'SA-P004', ccuType: 'Chemical Tank',  contractor: 'S J ABED', entity: 'PROJECT', weightTons:  3,  deckSpaceM2: 5.09, destination: 'AKPO',  priority: 'High',   eddOnSite: '2026-09-14', lmtsDecision: 'cancelled', t1FWB: false, loaded: false, comments: 'Chemical clearance delayed — rescheduled' },
      { id: 'e5', sn: 5, responsible: 'Tayo Olawale',     ccuId: 'TL-T005', ccuType: 'Tool Box',       contractor: 'WHASSAN',  entity: 'TECHLOG', weightTons:  2,  deckSpaceM2: 2.26, destination: 'EGINA', priority: 'Low',    eddOnSite: '2026-09-14', lmtsDecision: 'validated', t1FWB: false, loaded: false },
    ],
  },
  {
    id: 'VOY-2026-046',
    vessel: 'ISLAND GIRL',
    vesselCapacityM2: 413,
    vesselPlugs: 4,
    transitTo: 'AMENAM / OFON',
    departureDate: '2026-09-18',
    bookings: [
      { id: 'f1', sn: 1, responsible: 'Bello Tanimu', ccuId: 'BT-001', ccuType: '10FT Container', contractor: 'COURDEAU', entity: 'FOPS',  weightTons: 10,  deckSpaceM2: 8.3, destination: 'AMENAM', priority: 'High', eddOnSite: '2026-09-18', lmtsDecision: 'pending', t1FWB: false, loaded: false },
      { id: 'f2', sn: 2, responsible: 'Bello Tanimu', ccuId: 'BT-002', ccuType: '10FT Frozen',    contractor: 'COURDEAU', entity: 'FOPS',  weightTons:  9,  deckSpaceM2: 8.3, destination: 'OFON',   priority: 'High', eddOnSite: '2026-09-18', lmtsDecision: 'pending', t1FWB: false, loaded: false },
      { id: 'f3', sn: 3, responsible: 'Emeka Nwosu',  ccuId: 'EN-003', ccuType: 'Waste Skip',     contractor: 'TOTAL',    entity: 'DRILL', weightTons:  1.5, deckSpaceM2: 7.0, destination: 'AMENAM', priority: 'Low',  eddOnSite: '2026-09-18', lmtsDecision: 'pending', t1FWB: false, loaded: false },
    ],
  },
]

export function addCCUBooking(voyageId: string, booking: Omit<CCUBooking, 'id' | 'sn'>): void {
  const voyage = VOYAGES.find(v => v.id === voyageId)
  if (!voyage) return
  voyage.bookings.push({ ...booking, id: `bk-${Date.now()}`, sn: voyage.bookings.length + 1 })
}

export function updateLMTSDecision(voyageId: string, bookingId: string, decision: LMTSDecision): void {
  const voyage = VOYAGES.find(v => v.id === voyageId)
  const booking = voyage?.bookings.find(b => b.id === bookingId)
  if (booking) booking.lmtsDecision = decision
}

export function updateBookingField(
  voyageId: string, bookingId: string, field: 'loaded' | 't1FWB', value: boolean
): void {
  const voyage = VOYAGES.find(v => v.id === voyageId)
  const booking = voyage?.bookings.find(b => b.id === bookingId)
  if (booking) booking[field] = value
}
