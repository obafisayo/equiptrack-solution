'use client'

import { useState } from 'react'
import { Settings, Plus, Trash2, Check } from 'lucide-react'
import { COORDINATOR_CONFIG, setCoordinators, setBaseName } from '@/lib/coordinator-config'

export function CoordinatorSettings() {
  const [open,   setOpen]   = useState(false)
  const [base,   setBase]   = useState(COORDINATOR_CONFIG.baseName)
  const [names,  setNames]  = useState<string[]>([...COORDINATOR_CONFIG.coordinators])
  const [saved,  setSaved]  = useState(false)

  function addName()              { if (names.length < 2) setNames(n => [...n, '']) }
  function removeName(i: number)  { setNames(n => n.filter((_, idx) => idx !== i)) }
  function updateName(i: number, v: string) { setNames(n => n.map((x, idx) => idx === i ? v : x)) }

  function save() {
    setBaseName(base)
    setCoordinators(names)
    setSaved(true)
    setTimeout(() => { setSaved(false); setOpen(false) }, 1200)
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-button border border-border-default text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Settings size={12} />
        Coordinator Settings
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-40 bg-white border border-border-default rounded-card shadow-xl w-80 p-4 space-y-4">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">TR Approval Coordinator</p>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Base Name</label>
              <input
                value={base}
                onChange={e => setBase(e.target.value)}
                placeholder="e.g. Onne Base"
                className="input-base text-sm"
              />
              <p className="text-[10px] text-gray-400 mt-1">Used on TR document: "Approved by the [Base Name] Logistics Coordinator"</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Coordinator Name(s)</label>
                {names.length < 2 && (
                  <button type="button" onClick={addName} className="flex items-center gap-1 text-[10px] text-brand-500 font-semibold hover:text-brand-600">
                    <Plus size={10} /> Add second
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {names.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={name}
                      onChange={e => updateName(i, e.target.value)}
                      placeholder={`Coordinator ${i + 1} full name`}
                      className="input-base text-sm flex-1"
                    />
                    {names.length > 1 && (
                      <button type="button" onClick={() => removeName(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={save}
              className={`w-full h-9 rounded-button text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                saved ? 'bg-green-600' : 'bg-brand-500 hover:bg-brand-600'
              }`}
            >
              {saved ? <><Check size={12} /> Saved</> : 'Save Changes'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
