'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { ReturnOrder, ReturnItem } from './types'
import type { DangerousGoodsClass } from '@/lib/mock-data'

const DG_OPTIONS: { value: DangerousGoodsClass; label: string; color: string }[] = [
  { value: 'normal',       label: 'Normal',       color: 'border-gray-200 text-gray-700'   },
  { value: 'dangerous',    label: 'Dangerous',     color: 'border-orange-400 text-orange-700' },
  { value: 'explosive',    label: 'Explosive',     color: 'border-red-500 text-red-700'    },
  { value: 'radioactive',  label: 'Radioactive',   color: 'border-red-700 text-red-900'    },
  { value: 'refrigerated', label: 'Refrigerated',  color: 'border-amber-400 text-amber-700' },
  { value: 'hazardous',    label: 'Hazardous',     color: 'border-red-400 text-red-600'    },
]

const SITES = ['Bonga FPSO', 'Agbami FPSO', 'Escravos Terminal', 'Egina FPSO', 'Usan FPSO', 'Forcados Terminal', 'Bonny Terminal']

interface Props {
  onClose: () => void
  onSubmit: (order: Omit<ReturnOrder, 'id' | 'manifestNumber'>) => void
}

export function ReturnToBaseForm({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1)
  const [origin, setOrigin]         = useState<'vendor' | 'site'>('site')
  const [siteName, setSiteName]     = useState('')
  const [cargoClass, setCargoClass] = useState<DangerousGoodsClass>('normal')
  const [items, setItems]           = useState<ReturnItem[]>([
    { id: 'new-1', description: '', qty: 1, unit: 'Pcs', condition: 'good' },
  ])

  function addItem() {
    setItems(prev => [...prev, { id: `new-${Date.now()}`, description: '', qty: 1, unit: 'Pcs', condition: 'good' }])
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateItem(id: string, patch: Partial<ReturnItem>) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }

  function handleSubmit() {
    onSubmit({
      origin,
      siteName: origin === 'site' ? siteName : undefined,
      cargoClass,
      items,
      status: 'initiated',
      initiatedBy: 'Current User',
      initiatedAt: new Date().toISOString(),
    })
  }

  const canProceedStep1 = origin === 'vendor' || (origin === 'site' && siteName.trim().length > 0)
  const canProceedStep2 = cargoClass !== undefined
  const canSubmit = items.every(i => i.description.trim().length > 0 && i.qty > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[540px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Return to Base</h2>
            <p className="text-[12px] text-gray-400">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step progress */}
        <div className="flex gap-0 border-b border-border-default">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 py-2 text-center text-[11px] font-semibold transition-colors ${
                s <= step ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-300'
              }`}
            >
              {s === 1 ? 'Origin' : s === 2 ? 'Cargo Class' : 'Item List'}
            </div>
          ))}
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[13px] text-gray-700 font-semibold mb-3">Where is this return coming from?</p>
              <div className="grid grid-cols-2 gap-3">
                {(['site', 'vendor'] as const).map(o => (
                  <button
                    key={o}
                    onClick={() => setOrigin(o)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      origin === o ? 'border-brand-500 bg-red-50' : 'border-border-default hover:border-gray-300'
                    }`}
                  >
                    <p className="text-[13px] font-bold capitalize">{o === 'site' ? 'TotalEnergies Site' : 'Vendor Return'}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {o === 'site' ? 'Equipment from an offshore or onshore site' : 'Equipment being returned to a vendor'}
                    </p>
                  </button>
                ))}
              </div>
              {origin === 'site' && (
                <div>
                  <label className="text-[12px] font-semibold text-gray-600 block mb-1">Origin Site</label>
                  <select
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className="w-full border border-border-default rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select site...</option>
                    {SITES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-[13px] text-gray-700 font-semibold mb-3">Cargo Classification</p>
              <div className="grid grid-cols-2 gap-3">
                {DG_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setCargoClass(opt.value)}
                    className={`p-3 border-2 rounded-lg text-left transition-colors ${
                      cargoClass === opt.value ? `${opt.color} bg-gray-50` : 'border-border-default text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-[13px] font-bold">{opt.label}</p>
                  </button>
                ))}
              </div>
              {cargoClass !== 'normal' && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-[12px] text-amber-800 font-semibold">Special handling required for {cargoClass} cargo. Ensure proper manifest documentation and vessel approval before dispatch.</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-[13px] text-gray-700 font-semibold mb-3">Items to Return</p>
              {items.map((item, idx) => (
                <div key={item.id} className="p-3 border border-border-default rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400">ITEM {idx + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <input
                    placeholder="Item description"
                    value={item.description}
                    onChange={e => updateItem(item.id, { description: e.target.value })}
                    className="w-full border border-border-default rounded-md px-3 py-1.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={e => updateItem(item.id, { qty: Number(e.target.value) })}
                        className="w-full border border-border-default rounded-md px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Unit</label>
                      <select
                        value={item.unit}
                        onChange={e => updateItem(item.id, { unit: e.target.value })}
                        className="w-full border border-border-default rounded-md px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {['Pcs', 'Units', 'Drums', 'Bags', 'Boxes', 'Meters'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 uppercase font-semibold">Condition</label>
                      <select
                        value={item.condition}
                        onChange={e => updateItem(item.id, { condition: e.target.value as ReturnItem['condition'] })}
                        className="w-full border border-border-default rounded-md px-2 py-1 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="good">Good</option>
                        <option value="damaged">Damaged</option>
                        <option value="scrap">Scrap</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addItem}
                className="w-full flex items-center justify-center gap-2 border border-dashed border-border-default rounded-lg py-2.5 text-[13px] text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                <Plus size={14} />
                Add Item
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-default">
          {step > 1
            ? <button onClick={() => setStep(s => s - 1)} className="text-[13px] text-gray-500 hover:text-gray-700">Back</button>
            : <button onClick={onClose} className="text-[13px] text-gray-500 hover:text-gray-700">Cancel</button>
          }
          {step < 3
            ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className="px-5 py-2 bg-brand-500 text-white text-[13px] font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            )
            : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="px-5 py-2 bg-brand-500 text-white text-[13px] font-semibold rounded-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Submit Return
              </button>
            )
          }
        </div>
      </div>
    </div>
  )
}
