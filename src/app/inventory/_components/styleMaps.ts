import { ArrowDown, ArrowUp, ArrowRightLeft, ClipboardList } from 'lucide-react'
import type { StockStatus, MovType } from './types'

export const STATUS_CFG: Record<StockStatus, { badge: string; bar: string; label: string }> = {
  ok:       { badge:'bg-green-50  text-green-700  border-green-200',  bar:'bg-green-500',  label:'In Stock'  },
  reorder:  { badge:'bg-amber-50  text-amber-700  border-amber-200',  bar:'bg-amber-500',  label:'Reorder'   },
  critical: { badge:'bg-red-50    text-red-700    border-red-200',    bar:'bg-red-500',    label:'Critical'  },
}

export const MOV_CFG: Record<MovType, { icon: typeof ArrowDown; badge: string; label: string }> = {
  Issue:      { icon: ArrowUp,          badge:'bg-red-50    text-red-700    border-red-200',    label:'Issue'      },
  Receive:    { icon: ArrowDown,        badge:'bg-green-50  text-green-700  border-green-200',  label:'Receive'    },
  Transfer:   { icon: ArrowRightLeft,   badge:'bg-blue-50   text-blue-700   border-blue-200',   label:'Transfer'   },
  Adjustment: { icon: ClipboardList,    badge:'bg-neutral-50 text-neutral-600 border-neutral-200',label:'Adjustment'},
}

export const CATEGORIES = ['All','Drilling','Well Control','Safety','Piping','Power']
export const UNIT_OPTIONS = ['joints','kits','sacks','units','pieces','lengths','sets','pallets'].map(v=>({value:v,label:v}))
export const CAT_OPTIONS  = ['Drilling','Well Control','Safety','Piping','Power','Other'].map(v=>({value:v,label:v}))
