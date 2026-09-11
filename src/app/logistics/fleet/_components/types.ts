'use client'

export type VesselFleetStatus = 'Active' | 'Idle' | 'Drydock' | 'Maintenance' | 'Standby'
export type VesselType =
  | 'Platform Supply Vessel'
  | 'Anchor Handling Vessel'
  | 'Fast Supply Vessel'
  | 'Crew Transfer Vessel'
  | 'Offshore Support Vessel'
  | 'Barge'

export interface VesselVoyage {
  voyageId: string
  origin: string
  destination: string
  departure: string
  arrival: string | null
  cargoRef: string
  captain: string
}

export interface VesselDocument {
  name: string
  docNumber: string
  issuedDate: string
  expiryDate: string
}

export interface FleetVessel {
  id: string
  name: string
  type: VesselType
  imoNumber: string
  status: VesselFleetStatus
  currentLocation: string
  owner: string
  yearBuilt: number
  grossTonnageMT: number
  deckAreaM2: number
  plugs?: number
  crewCapacity: number
  assignedOrders: number
  lastInspection: string
  nextInspection: string
  voyages: VesselVoyage[]
  documents: VesselDocument[]
}

export const TODAY = '2026-09-07'

export type DocExpiryState = 'expired' | 'critical' | 'warning' | 'ok'

export function diffDays(from: string, to: string): number {
  return Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000)
}

export function getDocExpiryState(expiry: string): DocExpiryState {
  const d = diffDays(TODAY, expiry)
  if (d < 0) return 'expired'
  if (d <= 14) return 'critical'
  if (d <= 60) return 'warning'
  return 'ok'
}

export const STATUS_BADGE: Record<VesselFleetStatus, string> = {
  Active:      'bg-green-50 text-green-700 border-green-200',
  Idle:        'bg-slate-50 text-slate-600 border-slate-200',
  Drydock:     'bg-amber-50 text-amber-700 border-amber-200',
  Maintenance: 'bg-orange-50 text-orange-700 border-orange-200',
  Standby:     'bg-blue-50 text-blue-700 border-blue-200',
}

export const TYPE_SHORT: Record<VesselType, string> = {
  'Platform Supply Vessel': 'PSV',
  'Anchor Handling Vessel': 'AHV',
  'Fast Supply Vessel':     'FSV',
  'Crew Transfer Vessel':   'CTV',
  'Offshore Support Vessel':'OSV',
  'Barge':                  'Barge',
}

function voyage(
  voyageId: string, origin: string, destination: string,
  departure: string, arrival: string | null, cargoRef: string, captain: string
): VesselVoyage { return { voyageId, origin, destination, departure, arrival, cargoRef, captain } }

function doc(name: string, docNumber: string, issuedDate: string, expiryDate: string): VesselDocument {
  return { name, docNumber, issuedDate, expiryDate }
}

const STANDARD_DOCS = (prefix: string): VesselDocument[] => [
  doc('Class Certificate',        `${prefix}-CLASS-001`, '2024-01-15', '2026-10-15'),
  doc('Load Line Certificate',    `${prefix}-LLC-002`,   '2024-03-01', '2027-03-01'),
  doc('Safety Equipment Cert',    `${prefix}-SEC-003`,   '2024-03-01', '2026-09-30'),
  doc('Radio Station Licence',    `${prefix}-RSL-004`,   '2025-01-10', '2026-12-31'),
  doc('MARPOL Certificate',       `${prefix}-MPC-005`,   '2024-06-01', '2027-06-01'),
]

export const FLEET_VESSELS: FleetVessel[] = [
  {
    id: 'V001', name: 'African Concept', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9234567', status: 'Active',
    currentLocation: 'Akpo', owner: 'Seacom Marine Ltd',
    yearBuilt: 2010, grossTonnageMT: 2850, deckAreaM2: 479, plugs: 8, crewCapacity: 24,
    assignedOrders: 3, lastInspection: '2026-06-01', nextInspection: '2026-12-01',
    voyages: [
      voyage('VYG-001', 'Onne', 'Akpo', '2026-09-01', null, 'CMR-2890', 'Capt. A. Ibe'),
      voyage('VYG-002', 'Akpo', 'Onne', '2026-08-15', '2026-08-18', 'CMR-2840', 'Capt. A. Ibe'),
    ],
    documents: STANDARD_DOCS('AFC'),
  },
  {
    id: 'V002', name: 'A70', type: 'Fast Supply Vessel',
    imoNumber: 'IMO9345678', status: 'Active',
    currentLocation: 'Egina', owner: 'Offshore Logistics NG',
    yearBuilt: 2015, grossTonnageMT: 980, deckAreaM2: 500, plugs: 8, crewCapacity: 12,
    assignedOrders: 2, lastInspection: '2026-07-15', nextInspection: '2027-01-15',
    voyages: [
      voyage('VYG-003', 'Onne', 'Egina', '2026-09-05', null, 'CMR-2891', 'Capt. B. Dada'),
    ],
    documents: STANDARD_DOCS('A70'),
  },
  {
    id: 'V003', name: 'AM PROSPERITY', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9456789', status: 'Active',
    currentLocation: 'AMQ', owner: 'Atlantic Marine',
    yearBuilt: 2012, grossTonnageMT: 3200, deckAreaM2: 500, plugs: 12, crewCapacity: 28,
    assignedOrders: 5, lastInspection: '2026-05-20', nextInspection: '2026-11-20',
    voyages: [
      voyage('VYG-004', 'Onne', 'AMQ', '2026-09-03', null, 'CMR-2892', 'Capt. C. Nwosu'),
      voyage('VYG-005', 'AMQ', 'Onne', '2026-08-20', '2026-08-23', 'CMR-2850', 'Capt. C. Nwosu'),
    ],
    documents: STANDARD_DOCS('AMP'),
  },
  {
    id: 'V004', name: 'Afrik Cougar', type: 'Anchor Handling Vessel',
    imoNumber: 'IMO9567890', status: 'Active',
    currentLocation: 'Odudu', owner: 'Afrik Offshore',
    yearBuilt: 2008, grossTonnageMT: 1900, deckAreaM2: 120, plugs: 7, crewCapacity: 20,
    assignedOrders: 1, lastInspection: '2026-04-10', nextInspection: '2026-10-10',
    voyages: [
      voyage('VYG-006', 'Onne', 'Odudu', '2026-09-04', null, 'CMR-2893', 'Capt. D. Amao'),
    ],
    documents: [
      ...STANDARD_DOCS('AFK'),
      doc('Bollard Pull Certificate', 'AFK-BPC-006', '2025-08-01', '2026-09-20'),
    ],
  },
  {
    id: 'V005', name: 'AM PLEASURE', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9678901', status: 'Idle',
    currentLocation: 'Onne Base', owner: 'Atlantic Marine',
    yearBuilt: 2011, grossTonnageMT: 2750, deckAreaM2: 500, plugs: 6, crewCapacity: 24,
    assignedOrders: 0, lastInspection: '2026-03-01', nextInspection: '2026-09-15',
    voyages: [
      voyage('VYG-007', 'Ofon', 'Onne', '2026-08-28', '2026-09-01', 'CMR-2830', 'Capt. E. Obi'),
    ],
    documents: STANDARD_DOCS('AMPL'),
  },
  {
    id: 'V006', name: 'ISLAND GIRL', type: 'Crew Transfer Vessel',
    imoNumber: 'IMO9789012', status: 'Active',
    currentLocation: 'Amenam', owner: 'Island Marine Services',
    yearBuilt: 2018, grossTonnageMT: 450, deckAreaM2: 413, plugs: 4, crewCapacity: 45,
    assignedOrders: 0, lastInspection: '2026-08-01', nextInspection: '2027-02-01',
    voyages: [
      voyage('VYG-008', 'Onne', 'Amenam', '2026-09-06', null, 'CMR-2894', 'Capt. F. Ogeh'),
    ],
    documents: STANDARD_DOCS('ISG'),
  },
  {
    id: 'V007', name: 'Aquaman', type: 'Offshore Support Vessel',
    imoNumber: 'IMO9890123', status: 'Maintenance',
    currentLocation: 'Onne Base', owner: 'Aqua Marine NG',
    yearBuilt: 2007, grossTonnageMT: 1650, deckAreaM2: 257, plugs: 6, crewCapacity: 16,
    assignedOrders: 0, lastInspection: '2026-02-15', nextInspection: '2026-10-01',
    voyages: [
      voyage('VYG-009', 'Akpo', 'Onne', '2026-08-10', '2026-08-13', 'CMR-2810', 'Capt. G. Lawal'),
    ],
    documents: STANDARD_DOCS('AQM'),
  },
  {
    id: 'V008', name: 'Ava J Mc Call', type: 'Fast Supply Vessel',
    imoNumber: 'IMO9901234', status: 'Active',
    currentLocation: 'Hosh-1', owner: 'Mc Call Shipping',
    yearBuilt: 2016, grossTonnageMT: 1100, deckAreaM2: 167, plugs: 5, crewCapacity: 14,
    assignedOrders: 2, lastInspection: '2026-07-01', nextInspection: '2027-01-01',
    voyages: [
      voyage('VYG-010', 'Onne', 'Hosh-1', '2026-09-02', null, 'CMR-2895', 'Capt. H. Eze'),
    ],
    documents: STANDARD_DOCS('AJM'),
  },
  {
    id: 'V009', name: 'BB Liberty 206', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9012345', status: 'Active',
    currentLocation: 'Egina', owner: 'Bourbon Offshore',
    yearBuilt: 2013, grossTonnageMT: 3100, deckAreaM2: 205, plugs: 4, crewCapacity: 26,
    assignedOrders: 4, lastInspection: '2026-06-15', nextInspection: '2026-12-15',
    voyages: [
      voyage('VYG-011', 'Onne', 'Egina', '2026-09-01', null, 'CMR-2896', 'Capt. I. Oluwole'),
      voyage('VYG-012', 'Egina', 'Onne', '2026-08-12', '2026-08-15', 'CMR-2820', 'Capt. I. Oluwole'),
    ],
    documents: STANDARD_DOCS('BBL'),
  },
  {
    id: 'V010', name: 'PISTOS - Levant', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9123456', status: 'Active',
    currentLocation: 'Akpo', owner: 'Pistos Maritime',
    yearBuilt: 2014, grossTonnageMT: 3400, deckAreaM2: 120, plugs: 4, crewCapacity: 28,
    assignedOrders: 3, lastInspection: '2026-05-01', nextInspection: '2026-11-01',
    voyages: [
      voyage('VYG-013', 'Onne', 'Akpo', '2026-09-03', null, 'CMR-2897', 'Capt. J. Nkemdirim'),
    ],
    documents: STANDARD_DOCS('PST'),
  },
  {
    id: 'V011', name: 'NIKAO - Libeccio', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9234568', status: 'Standby',
    currentLocation: 'Onne Base', owner: 'Nikao Shipping AS',
    yearBuilt: 2011, grossTonnageMT: 2950, deckAreaM2: 120, plugs: 4, crewCapacity: 24,
    assignedOrders: 1, lastInspection: '2026-08-20', nextInspection: '2027-02-20',
    voyages: [
      voyage('VYG-014', 'Ofon', 'Onne', '2026-09-01', '2026-09-04', 'CMR-2860', 'Capt. K. Martins'),
    ],
    documents: STANDARD_DOCS('NKO'),
  },
  {
    id: 'V012', name: 'Bourbon Liberty 234', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9345679', status: 'Active',
    currentLocation: 'Ofon', owner: 'Bourbon Offshore',
    yearBuilt: 2009, grossTonnageMT: 3050, deckAreaM2: 250, plugs: 4, crewCapacity: 26,
    assignedOrders: 5, lastInspection: '2026-04-20', nextInspection: '2026-10-20',
    voyages: [
      voyage('VYG-015', 'Onne', 'Ofon', '2026-09-05', null, 'CMR-2898', 'Capt. L. Adeyemi'),
      voyage('VYG-016', 'Ofon', 'Onne', '2026-08-18', '2026-08-21', 'CMR-2835', 'Capt. L. Adeyemi'),
    ],
    documents: STANDARD_DOCS('BLB'),
  },
  {
    id: 'V013', name: 'OSHE 3', type: 'Barge',
    imoNumber: 'IMO9456790', status: 'Active',
    currentLocation: 'Amadi-Base', owner: 'Oshe Marine NG',
    yearBuilt: 2005, grossTonnageMT: 4800, deckAreaM2: 126, plugs: 4, crewCapacity: 10,
    assignedOrders: 2, lastInspection: '2026-03-15', nextInspection: '2026-09-30',
    voyages: [
      voyage('VYG-017', 'Onne', 'Amadi-Base', '2026-09-01', null, 'CMR-2899', 'Capt. M. Udoh'),
    ],
    documents: STANDARD_DOCS('OSH'),
  },
  {
    id: 'V014', name: 'Dijama', type: 'Offshore Support Vessel',
    imoNumber: 'IMO9567891', status: 'Active',
    currentLocation: 'Amenam', owner: 'Dijama Offshore Services',
    yearBuilt: 2013, grossTonnageMT: 1750, deckAreaM2: 100, plugs: 4, crewCapacity: 18,
    assignedOrders: 2, lastInspection: '2026-07-10', nextInspection: '2027-01-10',
    voyages: [
      voyage('VYG-018', 'Onne', 'Amenam', '2026-09-04', null, 'CMR-2900', 'Capt. N. Aliyu'),
    ],
    documents: STANDARD_DOCS('DJM'),
  },
  {
    id: 'V015', name: 'HARVEY PIONEER', type: 'Anchor Handling Vessel',
    imoNumber: 'IMO9678902', status: 'Active',
    currentLocation: 'Egina', owner: 'Harvey Gulf International',
    yearBuilt: 2015, grossTonnageMT: 2100, deckAreaM2: 500, plugs: 6, crewCapacity: 22,
    assignedOrders: 3, lastInspection: '2026-06-01', nextInspection: '2026-12-01',
    voyages: [
      voyage('VYG-019', 'Onne', 'Egina', '2026-09-02', null, 'CMR-2901', 'Capt. O. James'),
    ],
    documents: [
      ...STANDARD_DOCS('HVP'),
      doc('Bollard Pull Certificate', 'HVP-BPC-006', '2025-06-01', '2026-12-31'),
    ],
  },
  {
    id: 'V016', name: 'MV KARIS', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9789013', status: 'Drydock',
    currentLocation: 'Onne Base', owner: 'Karis Shipping NG',
    yearBuilt: 2006, grossTonnageMT: 2600, deckAreaM2: 400, plugs: 16, crewCapacity: 22,
    assignedOrders: 0, lastInspection: '2025-12-01', nextInspection: '2026-09-10',
    voyages: [
      voyage('VYG-020', 'Akpo', 'Onne', '2026-07-20', '2026-07-23', 'CMR-2780', 'Capt. P. Omotunde'),
    ],
    documents: STANDARD_DOCS('KRS'),
  },
  {
    id: 'V017', name: 'VEGA BLESS', type: 'Fast Supply Vessel',
    imoNumber: 'IMO9890124', status: 'Active',
    currentLocation: 'AMQ', owner: 'Vega Shipping',
    yearBuilt: 2017, grossTonnageMT: 1050, deckAreaM2: 250, plugs: 4, crewCapacity: 12,
    assignedOrders: 2, lastInspection: '2026-08-01', nextInspection: '2027-02-01',
    voyages: [
      voyage('VYG-021', 'Onne', 'AMQ', '2026-09-06', null, 'CMR-2902', 'Capt. Q. Essien'),
    ],
    documents: STANDARD_DOCS('VGB'),
  },
  {
    id: 'V018', name: 'Ievoli Coral', type: 'Offshore Support Vessel',
    imoNumber: 'IMO9901235', status: 'Active',
    currentLocation: 'Odudu', owner: 'Ievoli Maritime',
    yearBuilt: 2012, grossTonnageMT: 1820, deckAreaM2: 220, plugs: 8, crewCapacity: 18,
    assignedOrders: 2, lastInspection: '2026-05-10', nextInspection: '2026-11-10',
    voyages: [
      voyage('VYG-022', 'Onne', 'Odudu', '2026-09-05', null, 'CMR-2903', 'Capt. R. Grasso'),
    ],
    documents: STANDARD_DOCS('IVC'),
  },
  {
    id: 'V019', name: 'LAMNALCO Malkoha', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9012346', status: 'Active',
    currentLocation: 'Hosh-1', owner: 'Lamnalco Ltd',
    yearBuilt: 2010, grossTonnageMT: 2900, deckAreaM2: 126, plugs: 6, crewCapacity: 24,
    assignedOrders: 3, lastInspection: '2026-06-20', nextInspection: '2026-12-20',
    voyages: [
      voyage('VYG-023', 'Onne', 'Hosh-1', '2026-09-01', null, 'CMR-2904', 'Capt. S. Al-Rashid'),
    ],
    documents: STANDARD_DOCS('LMN'),
  },
  {
    id: 'V020', name: 'Lahama', type: 'Fast Supply Vessel',
    imoNumber: 'IMO9123457', status: 'Idle',
    currentLocation: 'Onne Base', owner: 'Lahama Marine NG',
    yearBuilt: 2014, grossTonnageMT: 920, deckAreaM2: 500, plugs: 14, crewCapacity: 10,
    assignedOrders: 0, lastInspection: '2026-07-05', nextInspection: '2027-01-05',
    voyages: [
      voyage('VYG-024', 'Egina', 'Onne', '2026-08-25', '2026-08-28', 'CMR-2845', 'Capt. T. Okafor'),
    ],
    documents: STANDARD_DOCS('LHM'),
  },
  {
    id: 'V021', name: 'Maniviki Rover', type: 'Crew Transfer Vessel',
    imoNumber: 'IMO9234569', status: 'Active',
    currentLocation: 'Akpo', owner: 'Pacific Offshore Solutions',
    yearBuilt: 2019, grossTonnageMT: 520, deckAreaM2: 500, plugs: 8, crewCapacity: 50,
    assignedOrders: 0, lastInspection: '2026-08-15', nextInspection: '2027-02-15',
    voyages: [
      voyage('VYG-025', 'Onne', 'Akpo', '2026-09-07', null, 'CMR-2905', 'Capt. U. Vaka'),
    ],
    documents: STANDARD_DOCS('MNR'),
  },
  {
    id: 'V022', name: 'MV Bemigho', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9345680', status: 'Active',
    currentLocation: 'Amenam', owner: 'Bemigho Marine NG',
    yearBuilt: 2011, grossTonnageMT: 2700, deckAreaM2: 450, plugs: 8, crewCapacity: 22,
    assignedOrders: 4, lastInspection: '2026-04-01', nextInspection: '2026-10-01',
    voyages: [
      voyage('VYG-026', 'Onne', 'Amenam', '2026-09-03', null, 'CMR-2906', 'Capt. V. Edah'),
      voyage('VYG-027', 'Amenam', 'Onne', '2026-08-14', '2026-08-17', 'CMR-2825', 'Capt. V. Edah'),
    ],
    documents: STANDARD_DOCS('MVB'),
  },
  {
    id: 'V023', name: 'OOC Cougar', type: 'Anchor Handling Vessel',
    imoNumber: 'IMO9456791', status: 'Active',
    currentLocation: 'Egina', owner: 'Offshore Oil Carriers',
    yearBuilt: 2009, grossTonnageMT: 1980, deckAreaM2: 350, plugs: 4, crewCapacity: 20,
    assignedOrders: 2, lastInspection: '2026-05-15', nextInspection: '2026-11-15',
    voyages: [
      voyage('VYG-028', 'Onne', 'Egina', '2026-09-04', null, 'CMR-2907', 'Capt. W. Ikenna'),
    ],
    documents: [
      ...STANDARD_DOCS('OCC'),
      doc('Bollard Pull Certificate', 'OCC-BPC-006', '2025-05-01', '2026-11-30'),
    ],
  },
  {
    id: 'V024', name: 'OOC Emerald', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9567892', status: 'Active',
    currentLocation: 'Ofon', owner: 'Offshore Oil Carriers',
    yearBuilt: 2013, grossTonnageMT: 2800, deckAreaM2: 430, plugs: 30, crewCapacity: 24,
    assignedOrders: 3, lastInspection: '2026-07-20', nextInspection: '2027-01-20',
    voyages: [
      voyage('VYG-029', 'Onne', 'Ofon', '2026-09-02', null, 'CMR-2908', 'Capt. X. Agida'),
    ],
    documents: STANDARD_DOCS('OCE'),
  },
  {
    id: 'V025', name: 'Osanyamo', type: 'Fast Supply Vessel',
    imoNumber: 'IMO9678903', status: 'Standby',
    currentLocation: 'Onne Base', owner: 'Osanyamo Marine Svc',
    yearBuilt: 2016, grossTonnageMT: 970, deckAreaM2: 111, plugs: 4, crewCapacity: 12,
    assignedOrders: 1, lastInspection: '2026-08-10', nextInspection: '2027-02-10',
    voyages: [
      voyage('VYG-030', 'AMQ', 'Onne', '2026-09-05', '2026-09-07', 'CMR-2870', 'Capt. Y. Salami'),
    ],
    documents: STANDARD_DOCS('OSN'),
  },
  {
    id: 'V026', name: 'Osarugue', type: 'Offshore Support Vessel',
    imoNumber: 'IMO9789014', status: 'Active',
    currentLocation: 'AMQ', owner: 'Osarugue Offshore',
    yearBuilt: 2010, grossTonnageMT: 1700, deckAreaM2: 63, plugs: 6, crewCapacity: 16,
    assignedOrders: 2, lastInspection: '2026-06-10', nextInspection: '2026-12-10',
    voyages: [
      voyage('VYG-031', 'Onne', 'AMQ', '2026-09-06', null, 'CMR-2909', 'Capt. Z. Okeke'),
    ],
    documents: STANDARD_DOCS('OSR'),
  },
  {
    id: 'V027', name: 'PRINCE JOB 1', type: 'Barge',
    imoNumber: 'IMO9890125', status: 'Active',
    currentLocation: 'Amadi-Base', owner: 'Prince Job Marine',
    yearBuilt: 2003, grossTonnageMT: 5200, deckAreaM2: 220, plugs: 0, crewCapacity: 8,
    assignedOrders: 1, lastInspection: '2026-03-01', nextInspection: '2026-09-25',
    voyages: [
      voyage('VYG-032', 'Onne', 'Amadi-Base', '2026-08-25', '2026-08-27', 'CMR-2855', 'Capt. A. Job'),
    ],
    documents: STANDARD_DOCS('PJB'),
  },
  {
    id: 'V028', name: 'Siem Marlin', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9901236', status: 'Active',
    currentLocation: 'Akpo', owner: 'Siem Offshore AS',
    yearBuilt: 2012, grossTonnageMT: 3300, deckAreaM2: 450, plugs: 0, crewCapacity: 26,
    assignedOrders: 4, lastInspection: '2026-05-25', nextInspection: '2026-11-25',
    voyages: [
      voyage('VYG-033', 'Onne', 'Akpo', '2026-09-01', null, 'CMR-2910', 'Capt. B. Siem'),
      voyage('VYG-034', 'Akpo', 'Onne', '2026-08-08', '2026-08-11', 'CMR-2800', 'Capt. B. Siem'),
    ],
    documents: STANDARD_DOCS('SMM'),
  },
  {
    id: 'V029', name: 'TMC Providence', type: 'Anchor Handling Vessel',
    imoNumber: 'IMO9012347', status: 'Maintenance',
    currentLocation: 'Onne Base', owner: 'TMC Maritime',
    yearBuilt: 2008, grossTonnageMT: 2050, deckAreaM2: 450, plugs: 4, crewCapacity: 22,
    assignedOrders: 0, lastInspection: '2026-02-01', nextInspection: '2026-09-12',
    voyages: [
      voyage('VYG-035', 'Odudu', 'Onne', '2026-08-01', '2026-08-04', 'CMR-2790', 'Capt. C. Tmc'),
    ],
    documents: [
      ...STANDARD_DOCS('TMP'),
      doc('Bollard Pull Certificate', 'TMP-BPC-006', '2024-02-01', '2026-09-01'),
    ],
  },
  {
    id: 'V030', name: 'Topaz Seema', type: 'Platform Supply Vessel',
    imoNumber: 'IMO9123458', status: 'Active',
    currentLocation: 'Egina', owner: 'Topaz Energy & Marine',
    yearBuilt: 2014, grossTonnageMT: 3150, deckAreaM2: 450, plugs: 12, crewCapacity: 26,
    assignedOrders: 3, lastInspection: '2026-07-01', nextInspection: '2027-01-01',
    voyages: [
      voyage('VYG-036', 'Onne', 'Egina', '2026-09-05', null, 'CMR-2911', 'Capt. D. Topaz'),
      voyage('VYG-037', 'Egina', 'Onne', '2026-08-22', '2026-08-25', 'CMR-2862', 'Capt. D. Topaz'),
    ],
    documents: STANDARD_DOCS('TZS'),
  },
]
