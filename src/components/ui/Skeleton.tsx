'use client'

/* Shimmer class `.skeleton-shimmer` is defined in globals.css */

export function SkeletonLine({
  width = '100%',
  height = 14,
}: {
  width?: string | number
  height?: number
}) {
  return (
    <div
      className="skeleton-shimmer rounded"
      style={{ width, height }}
    />
  )
}

export function SkeletonBlock({ height = 80 }: { height?: number }) {
  return (
    <div className="skeleton-shimmer rounded-lg" style={{ height }} />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-border-default shadow-card rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <SkeletonLine width={72} height={11} />
          <div className="mt-2.5">
            <SkeletonLine width={56} height={28} />
          </div>
          <div className="mt-2.5">
            <SkeletonLine width={48} height={18} />
          </div>
        </div>
        <div className="skeleton-shimmer w-8 h-8 rounded-lg shrink-0" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 h-12 border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="flex-1">
          <SkeletonLine height={12} />
        </div>
      ))}
    </div>
  )
}

export function WorkOrderCardSkeleton() {
  return (
    <div className="bg-white border border-border-default shadow-card overflow-hidden rounded-xl p-4 min-h-30">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <SkeletonLine width={100} height={12} />
        <SkeletonLine width={64} height={20} />
      </div>
      <SkeletonLine width="65%" height={14} />
      <div className="mt-2.5">
        <SkeletonLine height={6} />
      </div>
      <div className="mt-3 flex gap-1.5">
        <SkeletonLine width={48} height={20} />
        <SkeletonLine width={48} height={20} />
      </div>
    </div>
  )
}
