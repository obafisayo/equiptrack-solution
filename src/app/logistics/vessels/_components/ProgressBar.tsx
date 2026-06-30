interface Props {
  pct: number
  color: string
}

export function ProgressBar({ pct, color }: Props) {
  return (
    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }}/>
    </div>
  )
}
