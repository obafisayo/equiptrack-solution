export type StockStatus = 'ok' | 'reorder' | 'critical'
export type MovType = 'Issue' | 'Receive' | 'Transfer' | 'Adjustment'

export interface StockItem {
  id: string; name: string; category: string
  qty: number; reorderAt: number; unit: string
  status: StockStatus; location: string; lastUpdated: string
  supplier?: string; leadDays?: number
}

export interface Movement {
  id: string; itemId: string; itemName: string
  type: MovType; qty: number; date: string; time: string
  by: string; reference?: string; note?: string
}

export type Tab = 'stock' | 'movements' | 'reorder'
