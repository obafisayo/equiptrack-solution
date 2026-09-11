// Shared module-level store for return requests.
// Both site-return and logistics/deckspace pages read/write from here.
// In production this would be an API + database; for the demo this is in-memory.

export type ReturnDisposition = 'send_to_base' | 'send_to_vendor' | 'reintegrate' | 'scrap' | 'trash'
export type ReturnItemCategory = 'normal' | 'dangerous' | 'refrigerated' | 'radioactive' | 'hazardous'
export type ReturnStatus = 'deckspace_requested' | 'approved' | 'rejected' | 'in_transit' | 'returned'

export const DISPOSITION_LABEL: Record<ReturnDisposition, string> = {
  send_to_base:  'Send to Base',
  send_to_vendor:'Send to Vendor',
  reintegrate:   'Reintegrate into Stock',
  scrap:         'Scrap',
  trash:         'Trash',
}

export const CATEGORY_LABEL: Record<ReturnItemCategory, string> = {
  normal:      'Normal',
  dangerous:   'Dangerous',
  refrigerated:'Refrigerated',
  radioactive: 'Radioactive',
  hazardous:   'Hazardous',
}

export const CATEGORY_COLOR: Record<ReturnItemCategory, string> = {
  normal:      'bg-slate-50 text-slate-600 border-slate-200',
  dangerous:   'bg-orange-50 text-orange-700 border-orange-200',
  refrigerated:'bg-blue-50 text-blue-700 border-blue-200',
  radioactive: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  hazardous:   'bg-red-50 text-red-700 border-red-200',
}

export const DISPOSITION_COLOR: Record<ReturnDisposition, string> = {
  send_to_base:  'bg-blue-50 text-blue-700 border-blue-200',
  send_to_vendor:'bg-violet-50 text-violet-700 border-violet-200',
  reintegrate:   'bg-green-50 text-green-700 border-green-200',
  scrap:         'bg-amber-50 text-amber-700 border-amber-200',
  trash:         'bg-red-50 text-red-700 border-red-200',
}

export const STATUS_STYLE: Record<ReturnStatus, string> = {
  deckspace_requested: 'bg-amber-50 text-amber-700 border-amber-200',
  approved:            'bg-teal-50 text-teal-700 border-teal-200',
  rejected:            'bg-red-50 text-red-700 border-red-200',
  in_transit:          'bg-blue-50 text-blue-700 border-blue-200',
  returned:            'bg-green-50 text-green-700 border-green-200',
}

export const STATUS_LABEL: Record<ReturnStatus, string> = {
  deckspace_requested: 'Awaiting Deckspace',
  approved:            'Deckspace Approved',
  rejected:            'Request Rejected',
  in_transit:          'In Transit',
  returned:            'Returned',
}

export interface ReturnLineItem {
  description: string
  qty: number
  unit: string
  partNumber?: string
  disposition: ReturnDisposition
  category: ReturnItemCategory
}

export interface ReturnRequest {
  id: string
  orderId: string
  workOrderNumber: string
  site: string
  submittedAt: string
  submittedBy: string
  status: ReturnStatus
  items: ReturnLineItem[]
  notes: string
  // Set by Vessel Coordinator on approval
  vessel: string | null
  allocatedDate: string | null
  // Set on rejection
  rejectionReason: string | null
}

// Pre-populate with one approved and one pending request to show the full workflow
export const RETURN_REQUESTS: ReturnRequest[] = [
  {
    id: 'RTN-2024-001',
    orderId: 'DEL-24-1185',
    workOrderNumber: 'WO-24-325',
    site: 'Egina',
    submittedAt: '2024-06-26T09:00:00Z',
    submittedBy: 'Tunde Oghenekaro',
    status: 'approved',
    items: [
      { description: 'Production Packer 7" 5000 PSI', qty: 1, unit: 'Pcs', disposition: 'send_to_vendor', category: 'normal' },
      { description: 'Polished Bore Receptacle 4-1/2"', qty: 1, unit: 'Pcs', disposition: 'reintegrate', category: 'normal' },
    ],
    notes: 'PBR uninstalled — reusable. Packer returned to vendor for credit.',
    vessel: 'BB Liberty 206',
    allocatedDate: '2024-06-28',
    rejectionReason: null,
  },
  {
    id: 'RTN-2024-002',
    orderId: 'DEL-24-1170',
    workOrderNumber: 'WO-24-310',
    site: 'Egina',
    submittedAt: '2024-06-27T11:30:00Z',
    submittedBy: 'Tunde Oghenekaro',
    status: 'deckspace_requested',
    items: [
      { description: 'Temporary Crane Hook Assembly 50T', qty: 1, unit: 'Set', disposition: 'send_to_base', category: 'normal' },
    ],
    notes: 'Crane hook used for installation — returning to Onne base for re-use.',
    vessel: null,
    allocatedDate: null,
    rejectionReason: null,
  },
]

let nextId = 3

export function submitReturnRequest(request: Omit<ReturnRequest, 'id'>): ReturnRequest {
  const newReq: ReturnRequest = { ...request, id: `RTN-2024-00${nextId++}` }
  RETURN_REQUESTS.push(newReq)
  return newReq
}

export function updateReturnRequest(id: string, updates: Partial<ReturnRequest>): void {
  const idx = RETURN_REQUESTS.findIndex(r => r.id === id)
  if (idx !== -1) Object.assign(RETURN_REQUESTS[idx], updates)
}
