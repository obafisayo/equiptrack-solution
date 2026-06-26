import type { Stage } from '@/lib/lifecycle'

export const DISPATCH_STAGES: Stage[] = [
  'Dispatch Queue',
  'Dispatch Assigned',
  'Preload QAQC',
  'Containerization',
  'Post QAQC',
  'Waybill Pending Signature',
  'Waybill Done',
  'Awaiting Deckspace',
  'Shipped',
]
