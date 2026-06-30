import type { DropdownOption } from '@/components/ui/Dropdown'
import type { UrgencyLevel } from '@/config/sla'

export const DESTINATION_OPTIONS: DropdownOption[] = [
  { value: 'Bonny Terminal',         label: 'Bonny Terminal',          hint: 'Rivers State' },
  { value: 'Escravos Terminal',      label: 'Escravos Terminal',       hint: 'Delta State' },
  { value: 'Forcados Terminal',      label: 'Forcados Terminal',       hint: 'Delta State' },
  { value: 'Bonga FPSO',            label: 'Bonga FPSO',              hint: 'Offshore OML 118' },
  { value: 'Agbami FPSO',           label: 'Agbami FPSO',             hint: 'Offshore OML 127/128' },
  { value: 'Erha FPSO',             label: 'Erha FPSO',               hint: 'Offshore OML 133' },
  { value: 'Egina FPSO',            label: 'Egina FPSO',              hint: 'Offshore OML 130' },
  { value: 'Akpo FPSO',             label: 'Akpo FPSO',               hint: 'Offshore OML 130' },
  { value: 'Usan FPSO',             label: 'Usan FPSO',               hint: 'Offshore OML 138' },
  { value: 'Okwori FPSO',           label: 'Okwori FPSO',             hint: 'Offshore OML 119' },
  { value: 'Pennington Terminal',    label: 'Pennington Terminal',     hint: 'Delta State' },
  { value: 'Brass Terminal',        label: 'Brass Terminal',           hint: 'Bayelsa State' },
  { value: 'Ima Field',             label: 'Ima Field',                hint: 'Onshore' },
  { value: 'Abo FPSO',              label: 'Abo FPSO',                 hint: 'OML 125' },
  { value: 'Other',                 label: 'Other (specify below)' },
]

export const REQUEST_TYPES = [
  { value: 'SAP',       label: 'SAP Request',           hint: 'Standard stock item from SAP system' },
  { value: 'TR',        label: 'Temporary Requisition', hint: 'Requires Base Coordinator email approval first' },
  { value: 'NON_STOCK', label: 'Non-Stock Item',        hint: 'Goes directly to Dispatch — no warehouse staging' },
]

export const CARGO_TYPES: DropdownOption[] = [
  { value: 'drilling',    label: 'Drilling Equipment',       hint: 'Drill bits, BHA, drilling tools' },
  { value: 'production',  label: 'Production Equipment',     hint: 'Wellhead, flowlines, valves, separators' },
  { value: 'safety',      label: 'Safety & PPE',             hint: 'PPE, fire suppression, life safety' },
  { value: 'chemical',    label: 'Chemicals & Fluids',       hint: 'Drilling fluids, treatment chemicals' },
  { value: 'electrical',  label: 'Electrical & Instruments', hint: 'Sensors, panels, instrumentation' },
  { value: 'mechanical',  label: 'Mechanical Parts',         hint: 'Pumps, compressors, rotating equipment' },
  { value: 'consumable',  label: 'Consumables',              hint: 'Gaskets, bolts, general consumables' },
  { value: 'general',     label: 'General Cargo',            hint: 'Miscellaneous / other' },
]

export const WELL_FIELD_OPTIONS: DropdownOption[] = [
  { value: 'bonga_n1',       label: 'Bonga North-1' },
  { value: 'bonga_sw',       label: 'Bonga South-West' },
  { value: 'agbami_w12',     label: 'Agbami Well-12' },
  { value: 'erha_n_phase3',  label: 'Erha North Phase 3' },
  { value: 'egina_sp',       label: 'Egina South Phase' },
  { value: 'akpo_exp',       label: 'Akpo Expansion' },
  { value: 'ima_oml34',      label: 'Ima OML-34' },
  { value: 'escravos_gas',   label: 'Escravos Gas-to-Liquids' },
  { value: 'forcados_maint', label: 'Forcados Maintenance' },
  { value: 'general_ops',    label: 'General Operations' },
]

export const UNIT_OPTIONS: DropdownOption[] = [
  { value: 'Pieces',  label: 'Pieces' },
  { value: 'Sets',    label: 'Sets' },
  { value: 'Boxes',   label: 'Boxes' },
  { value: 'Bags',    label: 'Bags' },
  { value: 'Drums',   label: 'Drums' },
  { value: 'Litres',  label: 'Litres' },
  { value: 'Kg',      label: 'Kg' },
  { value: 'Metres',  label: 'Metres' },
  { value: 'Pairs',   label: 'Pairs' },
  { value: 'Units',   label: 'Units' },
  { value: 'Joints',  label: 'Joints' },
  { value: 'Spools',  label: 'Spools' },
]

export const URGENCY_STYLE: Record<UrgencyLevel, { active: string; dot: string; text: string }> = {
  Low:    { active: 'border-green-500 bg-green-50',   dot: 'bg-green-500',  text: 'text-green-700' },
  Medium: { active: 'border-amber-500 bg-amber-50',   dot: 'bg-amber-500',  text: 'text-amber-700' },
  High:   { active: 'border-orange-500 bg-orange-50', dot: 'bg-orange-500', text: 'text-orange-700' },
  Urgent: { active: 'border-red-500 bg-red-50',       dot: 'bg-red-500',    text: 'text-red-700' },
}

export interface LineItem {
  description: string
  qty:         string
  unit:        string
}
