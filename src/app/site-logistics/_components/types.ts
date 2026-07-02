import type { DangerousGoodsClass } from '@/lib/mock-data'

export type DispositionAction = 'keep-at-base' | 'send-to-vendor' | 'reintegrate-stock' | 'scrap' | 'trash'

export type ReturnStatus =
  | 'initiated'
  | 'manifest-ready'
  | 'deckspace-requested'
  | 'in-transit'
  | 'arrived'
  | 'disposition-assigned'

export interface ReturnItem {
  id: string
  description: string
  qty: number
  unit: string
  weight?: number
  condition: 'good' | 'damaged' | 'scrap'
}

export interface ReturnOrder {
  id: string
  origin: 'vendor' | 'site'
  siteName?: string
  cargoClass: DangerousGoodsClass
  items: ReturnItem[]
  manifestNumber: string
  vesselId?: string
  vesselName?: string
  deckspaceSlots?: number
  status: ReturnStatus
  disposition?: DispositionAction
  initiatedBy: string
  initiatedAt: string
  receivedBy?: string
  receivedAt?: string
  dispositionNotes?: string
}

export const STATUS_BADGE: Record<ReturnStatus, { label: string; cls: string }> = {
  'initiated':             { label: 'Initiated',           cls: 'bg-gray-100 text-gray-600' },
  'manifest-ready':        { label: 'Manifest Ready',      cls: 'bg-amber-50 text-amber-700' },
  'deckspace-requested':   { label: 'Deckspace Requested', cls: 'bg-amber-50 text-amber-800' },
  'in-transit':            { label: 'In Transit',          cls: 'bg-amber-100 text-amber-800' },
  'arrived':               { label: 'Arrived',             cls: 'bg-green-50 text-green-700' },
  'disposition-assigned':  { label: 'Disposition Set',     cls: 'bg-green-100 text-green-800' },
}

export const DISPOSITION_LABEL: Record<DispositionAction, string> = {
  'keep-at-base':      'Keep at Base',
  'send-to-vendor':    'Send to Vendor',
  'reintegrate-stock': 'Reintegrate Stock',
  'scrap':             'Scrap',
  'trash':             'Trash',
}

export const MOCK_RETURNS: ReturnOrder[] = [
  {
    id: 'RTB-2026-001',
    origin: 'site',
    siteName: 'Bonga FPSO',
    cargoClass: 'normal',
    items: [
      { id: 'RI-001', description: 'Gate Valve 6" 900#', qty: 1, unit: 'Pcs', weight: 45, condition: 'damaged' },
      { id: 'RI-002', description: 'Pressure Gauge 0-3000 PSI', qty: 2, unit: 'Pcs', weight: 2, condition: 'good' },
    ],
    manifestNumber: 'MAN-2026-0441',
    vesselName: 'MV Eko Phoenix',
    status: 'in-transit',
    initiatedBy: 'Chukwudi Eze',
    initiatedAt: '2026-06-28T09:00:00Z',
  },
  {
    id: 'RTB-2026-002',
    origin: 'site',
    siteName: 'Agbami FPSO',
    cargoClass: 'dangerous',
    items: [
      { id: 'RI-003', description: 'Chemical drum 200L', qty: 4, unit: 'Drums', weight: 180, condition: 'good' },
    ],
    manifestNumber: 'MAN-2026-0442',
    status: 'manifest-ready',
    initiatedBy: 'Tunde Fashola',
    initiatedAt: '2026-06-30T14:00:00Z',
  },
  {
    id: 'RTB-2026-003',
    origin: 'vendor',
    cargoClass: 'normal',
    items: [
      { id: 'RI-004', description: 'Pump Assembly — Returned to Vendor', qty: 1, unit: 'Unit', weight: 320, condition: 'scrap' },
    ],
    manifestNumber: 'MAN-2026-0443',
    status: 'arrived',
    initiatedBy: 'Ngozi Okafor',
    initiatedAt: '2026-06-26T11:00:00Z',
    receivedBy: 'Emeka Okonkwo',
    receivedAt: '2026-06-30T16:00:00Z',
  },
]
