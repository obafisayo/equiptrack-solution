'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface MaintenanceActionBarProps {
  onCreateWorkOrder: () => void
}

export function MaintenanceActionBar({ onCreateWorkOrder }: MaintenanceActionBarProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div/>
      <Button variant="brand" size="sm" icon={<Plus size={13}/>} onClick={onCreateWorkOrder}>
        Create Work Order
      </Button>
    </div>
  )
}
