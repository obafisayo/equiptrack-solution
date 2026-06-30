'use client'

interface MRRBarChartProps {
  data: { label: string; value: number }[]
}

/* Inline CSS bar chart - avoids ResponsiveContainer SSR issues */
export function MRRBarChart({ data }: MRRBarChartProps) {
  const max = Math.max(...data.map(d => d.value))
  const yTicks = [0, 2000, 4000, 6000]

  return (
    <div className="w-full" style={{ height: 180 }}>
      <div className="flex h-full gap-0">
        {/* Y-axis labels */}
        <div className="flex flex-col-reverse justify-between pb-6 pr-2 shrink-0" style={{ width: 36 }}>
          {yTicks.map(t => (
            <span key={t} style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1 }}>{t / 1000}k</span>
          ))}
        </div>

        {/* Bars area */}
        <div className="flex-1 flex flex-col">
          {/* Grid + bars */}
          <div className="flex-1 relative">
            {/* Horizontal grid lines */}
            {yTicks.slice(1).map(t => (
              <div key={t} className="absolute w-full border-t border-dashed border-neutral-100"
                style={{ bottom: `${(t / max) * 100}%` }} />
            ))}
            {/* Bar columns */}
            <div className="absolute inset-0 flex items-end gap-2 px-1">
              {data.map(d => {
                const pct = (d.value / max) * 100
                return (
                  <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full rounded-t-[4px] relative group"
                      style={{ height: `${pct}%`, background: '#F04A4A', minHeight: 4 }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        ${(d.value / 1000).toFixed(1)}K
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* X-axis labels */}
          <div className="flex gap-2 px-1 pt-1.5 shrink-0" style={{ height: 22 }}>
            {data.map(d => (
              <div key={d.label} className="flex-1 text-center" style={{ fontSize: 10.5, color: '#9CA3AF' }}>
                {d.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
