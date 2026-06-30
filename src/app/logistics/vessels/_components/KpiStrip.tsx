import { Ship, Anchor, ArrowRight, AlertTriangle } from 'lucide-react'

interface Props {
  total: number
  inTransit: number
  atPort: number
  urgent: number
}

export function KpiStrip({ total, inTransit, atPort, urgent }: Props) {
  const kpis: { label: string; value: string | number; color: string; icon: React.ReactNode }[] = [
    { label: 'Total Vessels', value: total, color: '#3B82F6', icon: <Ship size={16}/> },
    { label: 'In Transit', value: inTransit, color: '#3B82F6', icon: <ArrowRight size={16}/> },
    { label: 'At Port', value: atPort, color: '#16A34A', icon: <Anchor size={16}/> },
    { label: 'Urgent Cargo', value: urgent, color: '#DC2626', icon: <AlertTriangle size={16}/> },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map(k => (
        <div key={k.label} className="bg-white border border-border-default rounded-card shadow-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${k.color}14`, color: k.color }}>
            {k.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 leading-none mb-0.5">{k.value}</p>
            <p className="text-xs text-neutral-500">{k.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
