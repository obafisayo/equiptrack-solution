'use client'

import { SectionTitle } from '@/components/domain/OrderGrid'
import { Card } from '@/components/ui/Card'

interface StageTrend {
  stage: string
  change: number
  note: string
}

const STAGE_TRENDS: StageTrend[] = [
  { stage: 'Processing',          change: +1.2, note: 'Warehouse backlog building' },
  { stage: 'Post QAQC',           change: +2.1, note: 'Inspector throughput reduced' },
  { stage: 'Dispatch Queue',       change: -0.5, note: 'Improved assignment speed' },
  { stage: 'Containerization',     change: +0.8, note: 'Container shortage' },
  { stage: 'Waybill Pending Signature', change: -1.1, note: 'Faster approvals this week' },
  { stage: 'Preload QAQC',         change: +0.3, note: 'Minor increase, monitoring' },
]

export function StageTrendSection() {
  return (
    <section>
      <SectionTitle title="Stage Trend (vs Last Week)" />
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {STAGE_TRENDS.map(t => (
          <Card key={t.stage} className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-700 truncate flex-1">{t.stage}</p>
              <span className={`text-xs font-bold ml-2 flex-shrink-0 ${t.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {t.change > 0 ? '+' : ''}{t.change}h
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t.note}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
