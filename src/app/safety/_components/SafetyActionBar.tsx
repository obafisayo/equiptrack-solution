'use client'

import { Plus, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SafetyActionBarProps {
  onReportIncident: () => void
}

export function SafetyActionBar({ onReportIncident }: SafetyActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="brand" size="sm"
          icon={<Plus size={14}/>}
          onClick={onReportIncident}
        >
          Report Incident
        </Button>
        <Button variant="secondary" size="sm" icon={<FileText size={14}/>}>
          Export Log
        </Button>
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Clock size={13} className="shrink-0"/>
        <span>Last updated: Today 08:42</span>
      </div>
    </div>
  )
}
