import type { WorkOrder } from '@/lib/mock-data'

export interface OodleItem {
  id: string
  partNumber: string
  description: string
  uom: string
  stockLevel: number
  unitPrice: number
  category: string
}

export interface OodleGIResult {
  giNumber: string
  timestamp: string
  status: 'posted' | 'failed'
}

const MOCK_CATALOGUE: OodleItem[] = [
  { id: 'ODL-001', partNumber: 'GV-6900-RTJ',  description: 'Gate Valve 6" 900# RTJ',       uom: 'Pcs', stockLevel: 8,  unitPrice: 4200,  category: 'Valves'       },
  { id: 'ODL-002', partNumber: 'PG-3000-SS',   description: 'Pressure Gauge 0-3000 PSI SS', uom: 'Pcs', stockLevel: 22, unitPrice: 185,   category: 'Instruments'  },
  { id: 'ODL-003', partNumber: 'PMP-CNTF-2',   description: 'Centrifugal Pump 2"',           uom: 'Unit', stockLevel: 3, unitPrice: 12500, category: 'Rotating Equipment' },
  { id: 'ODL-004', partNumber: 'CK-4-150',     description: 'Check Valve 4" 150# FF',        uom: 'Pcs', stockLevel: 14, unitPrice: 870,   category: 'Valves'       },
  { id: 'ODL-005', partNumber: 'GSK-SPI-6',    description: 'Spiral Wound Gasket 6"',        uom: 'Pcs', stockLevel: 60, unitPrice: 95,    category: 'Gaskets'      },
]

// Integration status — set to false until API credentials are configured
const INTEGRATION_ENABLED = false

export const OodleClient = {
  integrationEnabled: INTEGRATION_ENABLED,

  searchItems: async (query: string): Promise<OodleItem[]> => {
    if (!INTEGRATION_ENABLED) {
      // Return mock results filtered by query
      const q = query.toLowerCase()
      return MOCK_CATALOGUE.filter(
        i => i.description.toLowerCase().includes(q) || i.partNumber.toLowerCase().includes(q)
      )
    }
    // TODO: Replace with actual Ooddle REST API call when credentials are configured
    // const res = await fetch(`${process.env.OODDLE_API_URL}/items?q=${encodeURIComponent(query)}`, {
    //   headers: { Authorization: `Bearer ${process.env.OODDLE_API_KEY}` },
    // })
    // return res.json()
    return []
  },

  createGI: async (workOrder: WorkOrder): Promise<OodleGIResult> => {
    if (!INTEGRATION_ENABLED) {
      return {
        giNumber: `GI-SIM-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'posted',
      }
    }
    // TODO: POST to Ooddle GI endpoint
    return { giNumber: '', timestamp: '', status: 'failed' }
  },

  updateStock: async (itemId: string, delta: number): Promise<void> => {
    if (!INTEGRATION_ENABLED) {
      console.info(`[Ooddle Sim] Stock update: item=${itemId} delta=${delta}`)
      return
    }
    // TODO: PATCH Ooddle stock endpoint
  },
}
