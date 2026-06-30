import { Package } from 'lucide-react'
import type { CargoItem } from './types'

interface Props {
  cargo: CargoItem[]
}

export function CargoManifestTable({ cargo }: Props) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
        <Package size={12}/>
        Cargo Manifest
      </p>
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Item</th>
              <th className="text-right px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Qty</th>
              <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Unit</th>
              <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">PO / Ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {cargo.map((c, i) => (
              <tr key={i}>
                <td className="px-3 py-2 text-xs font-medium text-neutral-800">{c.description}</td>
                <td className="px-3 py-2 text-xs font-bold text-neutral-900 text-right">{c.qty}</td>
                <td className="px-3 py-2 text-xs text-neutral-500">{c.unit}</td>
                <td className="px-3 py-2">
                  <code className="font-mono text-[11px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{c.ref}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
