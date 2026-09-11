import type { DropdownOption } from '@/components/ui/Dropdown'
import type { UrgencyLevel } from '@/config/sla'
import { DESTINATIONS } from '@/lib/destinations'

export const DESTINATION_OPTIONS: DropdownOption[] = [
  ...DESTINATIONS.map(d => ({ value: d, label: d })),
  { value: 'Other', label: 'Other (specify below)' },
]

export const REQUEST_TYPES = [
  { value: 'SAP',       label: 'SAP Request',           hint: 'Standard stock item — routes to Warehouse' },
  { value: 'TR',        label: 'Temporary Requisition', hint: 'Requires Base Coordinator approval before routing to Warehouse' },
  { value: 'VENDOR',    label: 'Vendor Request',        hint: 'Direct vendor supply — routes straight to Dispatch Queue' },
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

export const ENTITY_OPTIONS: DropdownOption[] = [
  { value: 'FOPS',     label: 'FOPS',     hint: 'Field Operations' },
  { value: 'TECHLOG',  label: 'TECHLOG',  hint: 'Technical Logistics' },
  { value: 'ECP',      label: 'ECP',      hint: 'Engineering & Construction Projects' },
  { value: 'DRILLING', label: 'DRILLING', hint: 'Drilling Operations' },
  { value: 'PROJECT',  label: 'PROJECT',  hint: 'Project Management' },
]

export interface LineItem {
  description: string
  qty:         string
  unit:        string
  plant?:      string  // SAP plant code — shown for TR requests
  binLoc?:     string  // bin location — shown for TR requests
  prWoNumber?: string  // PR/WO number & remarks — shown for TR requests
}
