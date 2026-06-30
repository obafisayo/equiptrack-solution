'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Form'
import { Dropdown } from '@/components/ui/Dropdown'
import { UNIT_OPTIONS, type LineItem } from './constants'
import { SectionHeader, FieldError } from './FormHelpers'

interface EquipmentItemsSectionProps {
  items: LineItem[]
  errors: Record<string, string>
  onAddItem: () => void
  onRemoveItem: (index: number) => void
  onUpdateItem: (index: number, field: keyof LineItem, value: string) => void
}

export function EquipmentItemsSection({ items, errors, onAddItem, onRemoveItem, onUpdateItem }: EquipmentItemsSectionProps) {
  return (
    <div className="bg-white rounded-card shadow-card border border-border-default p-6 space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader step={4} title="Equipment Items" required noMb />
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>

      {/* Column headers */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_88px_120px_32px] gap-2 text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-1">
        <span>Description</span>
        <span>Qty</span>
        <span>Unit</span>
        <span />
      </div>

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_88px_120px_32px] gap-2 items-start">
            {/* Description */}
            <div>
              <Input
                placeholder={`Item ${i + 1} - equipment description`}
                value={item.description}
                onChange={e => onUpdateItem(i, 'description', e.target.value)}
                error={!!errors[`item_desc_${i}`]}
              />
              {errors[`item_desc_${i}`] && <FieldError msg={errors[`item_desc_${i}`]} />}
            </div>

            {/* Qty */}
            <div>
              <Input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.qty}
                onChange={e => onUpdateItem(i, 'qty', e.target.value)}
                error={!!errors[`item_qty_${i}`]}
                className="text-center"
              />
              {errors[`item_qty_${i}`] && <FieldError msg={errors[`item_qty_${i}`]} />}
            </div>

            {/* Unit */}
            <Dropdown
              options={UNIT_OPTIONS}
              value={item.unit}
              onChange={v => onUpdateItem(i, 'unit', v)}
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemoveItem(i)}
              disabled={items.length === 1}
              aria-label="Remove item"
              className="flex items-center justify-center w-8 h-12 text-neutral-300 hover:text-status-critical disabled:opacity-0 transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-1 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
        <span>{items.length} line item{items.length !== 1 ? 's' : ''}</span>
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1 font-semibold text-brand-500 hover:text-brand-600 transition-colors"
        >
          <Plus size={12} />
          Add another item
        </button>
      </div>
    </div>
  )
}
