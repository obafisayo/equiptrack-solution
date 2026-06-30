'use client'

interface LoadBarProps {
  pct: number
}

export function LoadBar({ pct }: LoadBarProps) {
  const color = pct > 80 ? '#EF4444' : pct > 60 ? '#F59E0B' : '#22C55E'
  return (
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  )
}
