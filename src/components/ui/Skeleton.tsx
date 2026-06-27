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
      className="skeleton-shimmer rounded-sm"
      style={{ width, height, borderRadius: 4 }}
    />
  )
}

export function SkeletonBlock({ height = 80 }: { height?: number }) {
  return (
    <div className="skeleton-shimmer" style={{ height, borderRadius: 8 }} />
  )
}

export function StatCardSkeleton() {
  return (
    <div
      className="bg-white border border-border-default shadow-card"
      style={{ borderRadius: 8, padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <SkeletonLine width={72} height={11} />
          <div style={{ marginTop: 10 }}>
            <SkeletonLine width={56} height={28} />
          </div>
          <div style={{ marginTop: 10 }}>
            <SkeletonLine width={48} height={18} />
          </div>
        </div>
        <div className="skeleton-shimmer" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        gap: 16, padding: '0 16px', height: 48,
        borderBottom: '1px solid #F3F4F6',
      }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} style={{ flex: 1 }}>
          <SkeletonLine height={12} />
        </div>
      ))}
    </div>
  )
}

export function WorkOrderCardSkeleton() {
  return (
    <div
      className="bg-white border border-border-default shadow-card overflow-hidden"
      style={{ borderRadius: 10, padding: 16, minHeight: 120 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <SkeletonLine width={100} height={12} />
        <SkeletonLine width={64} height={20} />
      </div>
      <SkeletonLine width="65%" height={14} />
      <div style={{ marginTop: 10 }}>
        <SkeletonLine height={6} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
        <SkeletonLine width={48} height={20} />
        <SkeletonLine width={48} height={20} />
      </div>
    </div>
  )
}
