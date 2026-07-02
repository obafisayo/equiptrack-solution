export interface Contractor {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  address: string
  containersOwned: string[]
  bankDetails?: string
}

export interface Payment {
  id: string
  contractorId: string
  date: string
  amountUSD: number
  reference: string
  notes?: string
  recordedBy: string
}

export const CONTRACTORS: Contractor[] = [
  {
    id: 'CONT-001',
    name: 'Apex Offshore Ltd',
    contactName: 'Mr. Emeka Dike',
    email: 'emeka.dike@apexoffshore.ng',
    phone: '+234 803 456 7890',
    address: '14 Industrial Avenue, Onne Free Zone, Rivers State',
    containersOwned: ['13162', '13164', '13174', '13177', '13181', '13347', '23830', '23846', 'WS-99-01'],
    bankDetails: 'Zenith Bank · 1234567890',
  },
  {
    id: 'CONT-002',
    name: 'Delta Marine Containers',
    contactName: 'Mrs. Funke Akinwale',
    email: 'funke@deltamarine.ng',
    phone: '+234 812 345 6789',
    address: '7 Port Road, Warri, Delta State',
    containersOwned: ['158551', 'HHB-55-01'],
    bankDetails: 'GTBank · 9876543210',
  },
  {
    id: 'CONT-003',
    name: 'Onne Container Services',
    contactName: 'Mr. Chukwudi Eze',
    email: 'c.eze@onnecontainers.ng',
    phone: '+234 701 234 5678',
    address: 'Plot 5, Eastern Port Road, Onne, Rivers State',
    containersOwned: ['28-MZ-75-01', '28-MZ-75-02', '28-MZ-75-03'],
    bankDetails: 'Access Bank · 5566778899',
  },
  {
    id: 'CONT-004',
    name: 'Gulf Stream Logistics',
    contactName: 'Mr. Adewale Balogun',
    email: 'a.balogun@gulfstreamng.com',
    phone: '+234 908 765 4321',
    address: '21 Creek Road, Apapa, Lagos State',
    containersOwned: ['40-BX-01', '40-BX-02'],
    bankDetails: 'First Bank · 1122334455',
  },
  {
    id: 'CONT-005',
    name: 'Weatherford Container Hire',
    contactName: 'Ms. Amaka Osei',
    email: 'amaka.osei@weatherford-ng.com',
    phone: '+234 814 987 6543',
    address: 'Block 9, Weatherford Compound, Victoria Island, Lagos',
    containersOwned: ['CT-44-A', 'CT-44-B'],
    bankDetails: 'UBA · 9988776655',
  },
]

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'PAY-001', contractorId: 'CONT-001', date: '2026-04-01', amountUSD: 15000, reference: 'INV-APX-2026-001', notes: 'Q1 payment', recordedBy: 'Femi Emmanuel' },
  { id: 'PAY-002', contractorId: 'CONT-001', date: '2026-05-15', amountUSD: 15000, reference: 'INV-APX-2026-002', notes: 'Q2 partial', recordedBy: 'Femi Emmanuel' },
  { id: 'PAY-003', contractorId: 'CONT-002', date: '2026-03-01', amountUSD: 8000,  reference: 'INV-DM-2026-001', notes: 'Q1 full',    recordedBy: 'Femi Emmanuel' },
  { id: 'PAY-004', contractorId: 'CONT-003', date: '2026-04-10', amountUSD: 5000,  reference: 'INV-OCS-2026-001', notes: 'Partial',   recordedBy: 'Femi Emmanuel' },
  { id: 'PAY-005', contractorId: 'CONT-004', date: '2026-05-01', amountUSD: 9000,  reference: 'INV-GSL-2026-001', notes: 'Full Q1',   recordedBy: 'Femi Emmanuel' },
  { id: 'PAY-006', contractorId: 'CONT-005', date: '2026-04-20', amountUSD: 12000, reference: 'INV-WFD-2026-001', notes: 'Q1+Q2',     recordedBy: 'Femi Emmanuel' },
]
