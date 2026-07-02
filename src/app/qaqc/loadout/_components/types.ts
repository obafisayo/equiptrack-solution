export type AnomalyType =
  | 'Dent'
  | 'Corrosion'
  | 'Seal Failure'
  | 'Missing Certificate'
  | 'Dimensional Non-conformance'
  | 'Color Code Mismatch'
  | 'Other'

export type AnomalySeverity = 'Minor' | 'Major' | 'Critical'

export type DeliveryStatus = 'Pending' | 'Inspecting' | 'Passed' | 'Rejected' | 'Quarantined'

export interface AnomalyRecord {
  id: string
  type: AnomalyType
  severity: AnomalySeverity
  description: string
  recordedAt: string
  recordedBy: string
}

export interface IncomingDelivery {
  id: string
  contractorId: string
  contractorName: string
  containerSerial: string
  containerType: string
  expectedArrival: string
  actualArrival?: string
  status: DeliveryStatus
  anomalies: AnomalyRecord[]
  inspectedBy?: string
  inspectedAt?: string
  notes?: string
  linkedRequestId?: string
}

export const ANOMALY_TYPES: AnomalyType[] = [
  'Dent',
  'Corrosion',
  'Seal Failure',
  'Missing Certificate',
  'Dimensional Non-conformance',
  'Color Code Mismatch',
  'Other',
]

export const DELIVERY_STATUS_BADGE: Record<DeliveryStatus, string> = {
  Pending:     'bg-slate-100   text-slate-700  border-slate-200',
  Inspecting:  'bg-amber-50    text-amber-700  border-amber-200',
  Passed:      'bg-green-50    text-green-700  border-green-200',
  Rejected:    'bg-red-50      text-red-700    border-red-200',
  Quarantined: 'bg-orange-50   text-orange-700 border-orange-200',
}

export const MOCK_DELIVERIES: IncomingDelivery[] = [
  {
    id: 'DEL-CCU-001',
    contractorId: 'CONT-001',
    contractorName: 'Apex Offshore Ltd',
    containerSerial: 'APX-WS-001',
    containerType: 'Waste Skip',
    expectedArrival: '2026-07-01',
    actualArrival: '2026-07-01',
    status: 'Pending',
    anomalies: [],
    linkedRequestId: 'REQ-CCU-001',
  },
  {
    id: 'DEL-CCU-002',
    contractorId: 'CONT-001',
    contractorName: 'Apex Offshore Ltd',
    containerSerial: 'APX-HHB-015',
    containerType: '15ft Half Height Basket',
    expectedArrival: '2026-07-01',
    actualArrival: '2026-07-01',
    status: 'Inspecting',
    anomalies: [],
    linkedRequestId: 'REQ-CCU-001',
  },
  {
    id: 'DEL-CCU-003',
    contractorId: 'CONT-002',
    contractorName: 'Delta Marine Containers',
    containerSerial: 'DMC-OTB-022',
    containerType: 'Open Top Basket',
    expectedArrival: '2026-07-02',
    status: 'Pending',
    anomalies: [],
    linkedRequestId: 'REQ-CCU-002',
  },
  {
    id: 'DEL-CCU-004',
    contractorId: 'CONT-003',
    contractorName: 'Onne Container Services',
    containerSerial: 'OCS-23HHB-007',
    containerType: '23ft Half Height Basket',
    expectedArrival: '2026-06-29',
    actualArrival: '2026-06-30',
    status: 'Passed',
    anomalies: [],
    inspectedBy: 'Femi Emmanuel',
    inspectedAt: '2026-06-30T10:24:00',
  },
  {
    id: 'DEL-CCU-005',
    contractorId: 'CONT-002',
    contractorName: 'Delta Marine Containers',
    containerSerial: 'DMC-CTB-011',
    containerType: 'Closed Top Basket',
    expectedArrival: '2026-06-28',
    actualArrival: '2026-06-28',
    status: 'Rejected',
    anomalies: [
      {
        id: 'ANM-001',
        type: 'Color Code Mismatch',
        severity: 'Critical',
        description: 'Container painted RED but current valid color code is GREEN. Container is expired.',
        recordedAt: '2026-06-28T14:05:00',
        recordedBy: 'Ngozi Okafor',
      },
      {
        id: 'ANM-002',
        type: 'Corrosion',
        severity: 'Major',
        description: 'Significant rust on base frame and corner castings.',
        recordedAt: '2026-06-28T14:10:00',
        recordedBy: 'Ngozi Okafor',
      },
    ],
    inspectedBy: 'Ngozi Okafor',
    inspectedAt: '2026-06-28T14:15:00',
  },
  {
    id: 'DEL-CCU-006',
    contractorId: 'CONT-004',
    contractorName: 'Gulf Stream Logistics',
    containerSerial: 'GSL-CTT-003',
    containerType: 'Chemical Tote Tank',
    expectedArrival: '2026-07-03',
    status: 'Pending',
    anomalies: [],
    linkedRequestId: 'REQ-CCU-003',
  },
]
