'use client'

import type { WorkOrder } from '@/lib/mock-data'
import { WaybillDocument } from './WaybillDocument'

interface WaybillDialogProps {
  order: WorkOrder
  onConfirm: () => void
  onClose: () => void
}

export function WaybillDialog({ order, onConfirm, onClose }: WaybillDialogProps) {
  return (
    <WaybillDocument
      order={order}
      mode="preview"
      onClose={onClose}
      onSubmit={onConfirm}
    />
  )
}
