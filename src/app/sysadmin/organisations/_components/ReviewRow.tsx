'use client'

interface ReviewRowProps {
  label: string
  value: string
}

export function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-neutral-500">{label}</span>
      <span className="text-xs font-semibold text-neutral-900">{value}</span>
    </div>
  )
}
