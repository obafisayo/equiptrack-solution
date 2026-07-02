import type { CCUType } from '@/app/qaqc/containers/_components/types'

export type RequestStatus =
  | 'Draft'
  | 'Sent'
  | 'Awaiting Response'
  | 'Partially Accepted'
  | 'Completed'
  | 'Rejected'

export interface RequestLineItem {
  type: CCUType
  quantity: number
  responses: ContractorResponseItem[]
}

export interface ContractorResponseItem {
  serial: string
  accepted: boolean | null
  rejectionReason?: string
}

export interface ContainerRequest {
  id: string
  contractorId: string
  contractorName: string
  lineItems: RequestLineItem[]
  composedMessage: string
  status: RequestStatus
  createdBy: string
  createdAt: string
  sentAt?: string
  responseRecordedAt?: string
  notes?: string
  auditLog: AuditEntry[]
}

export interface AuditEntry {
  timestamp: string
  action: string
  performedBy: string
}

export function composeContractorMessage(
  contractorName: string,
  contactName: string,
  lineItems: Array<{ type: CCUType; quantity: number }>,
): string {
  const itemLines = lineItems.map(i => `  - ${i.quantity}× ${i.type}`).join('\n')
  return `Dear ${contactName},

We at TotalEnergies wish to request the following CCU containers for our operations:

${itemLines}

Kindly confirm availability and provide the serial numbers for each unit you can supply.

Please note that all containers must bear the current valid inspection color code and hold a valid certification prior to acceptance.

We look forward to your prompt response.

Regards,
Operations Team
TotalEnergies E&P Nigeria`
}

export const REQUEST_STATUS_BADGE: Record<RequestStatus, string> = {
  Draft:               'bg-slate-100   text-slate-700  border-slate-200',
  Sent:                'bg-amber-50    text-amber-700  border-amber-200',
  'Awaiting Response': 'bg-amber-50    text-amber-700  border-amber-200',
  'Partially Accepted':'bg-orange-50   text-orange-700 border-orange-200',
  Completed:           'bg-green-50    text-green-700  border-green-200',
  Rejected:            'bg-red-50      text-red-700    border-red-200',
}

export const MOCK_REQUESTS: ContainerRequest[] = [
  {
    id: 'REQ-CCU-001',
    contractorId: 'CONT-001',
    contractorName: 'Apex Offshore Ltd',
    lineItems: [
      {
        type: 'Waste Skip',
        quantity: 2,
        responses: [
          { serial: 'APX-WS-001', accepted: null },
          { serial: 'APX-WS-002', accepted: null },
        ],
      },
      {
        type: '15ft Half Height Basket',
        quantity: 1,
        responses: [{ serial: 'APX-HHB-015', accepted: null }],
      },
    ],
    composedMessage: composeContractorMessage('Apex Offshore Ltd', 'Mr. Emeka Dike', [{ type: 'Waste Skip', quantity: 2 }, { type: '15ft Half Height Basket', quantity: 1 }]),
    status: 'Awaiting Response',
    createdBy: 'Femi Emmanuel',
    createdAt: '2026-06-28T09:00:00',
    sentAt: '2026-06-28T09:15:00',
    auditLog: [
      { timestamp: '2026-06-28T09:00:00', action: 'Request created', performedBy: 'Femi Emmanuel' },
      { timestamp: '2026-06-28T09:15:00', action: 'Request sent to contractor', performedBy: 'Femi Emmanuel' },
    ],
  },
  {
    id: 'REQ-CCU-002',
    contractorId: 'CONT-002',
    contractorName: 'Delta Marine Containers',
    lineItems: [
      {
        type: 'Open Top Basket',
        quantity: 1,
        responses: [{ serial: 'DMC-OTB-022', accepted: null }],
      },
    ],
    composedMessage: composeContractorMessage('Delta Marine Containers', 'Mrs. Funke Akinwale', [{ type: 'Open Top Basket', quantity: 1 }]),
    status: 'Awaiting Response',
    createdBy: 'Ngozi Okafor',
    createdAt: '2026-06-29T14:00:00',
    sentAt: '2026-06-29T14:10:00',
    auditLog: [
      { timestamp: '2026-06-29T14:00:00', action: 'Request created', performedBy: 'Ngozi Okafor' },
      { timestamp: '2026-06-29T14:10:00', action: 'Request sent to contractor', performedBy: 'Ngozi Okafor' },
    ],
  },
  {
    id: 'REQ-CCU-003',
    contractorId: 'CONT-004',
    contractorName: 'Gulf Stream Logistics',
    lineItems: [
      {
        type: 'Chemical Tote Tank',
        quantity: 1,
        responses: [{ serial: 'GSL-CTT-003', accepted: null }],
      },
    ],
    composedMessage: composeContractorMessage('Gulf Stream Logistics', 'Mr. Adewale Balogun', [{ type: 'Chemical Tote Tank', quantity: 1 }]),
    status: 'Sent',
    createdBy: 'Femi Emmanuel',
    createdAt: '2026-06-30T11:00:00',
    sentAt: '2026-06-30T11:05:00',
    auditLog: [
      { timestamp: '2026-06-30T11:00:00', action: 'Request created', performedBy: 'Femi Emmanuel' },
      { timestamp: '2026-06-30T11:05:00', action: 'Request sent to contractor', performedBy: 'Femi Emmanuel' },
    ],
  },
  {
    id: 'REQ-CCU-004',
    contractorId: 'CONT-003',
    contractorName: 'Onne Container Services',
    lineItems: [
      {
        type: '23ft Half Height Basket',
        quantity: 1,
        responses: [{ serial: 'OCS-23HHB-007', accepted: true }],
      },
    ],
    composedMessage: composeContractorMessage('Onne Container Services', 'Mr. Chukwudi Eze', [{ type: '23ft Half Height Basket', quantity: 1 }]),
    status: 'Completed',
    createdBy: 'Femi Emmanuel',
    createdAt: '2026-06-25T08:30:00',
    sentAt: '2026-06-25T08:45:00',
    responseRecordedAt: '2026-06-26T10:00:00',
    auditLog: [
      { timestamp: '2026-06-25T08:30:00', action: 'Request created', performedBy: 'Femi Emmanuel' },
      { timestamp: '2026-06-25T08:45:00', action: 'Request sent to contractor', performedBy: 'Femi Emmanuel' },
      { timestamp: '2026-06-26T10:00:00', action: 'Contractor response recorded', performedBy: 'Femi Emmanuel' },
      { timestamp: '2026-06-26T10:05:00', action: 'Serial OCS-23HHB-007 accepted — added to fleet as Pending Inspection', performedBy: 'Femi Emmanuel' },
    ],
  },
]
