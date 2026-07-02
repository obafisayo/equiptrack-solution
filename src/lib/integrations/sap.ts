import type { WorkOrder } from '@/lib/mock-data'

export interface SAPMaterial {
  materialNumber: string
  description: string
  uom: string
  plant: string
  valuationType: string
  movingAveragePrice: number
}

export interface SAPDocument {
  documentNumber: string
  fiscalYear: string
  timestamp: string
}

// OData endpoint base — configure via environment variable
const SAP_ODATA_BASE = process.env.SAP_ODATA_URL ?? ''
const INTEGRATION_ENABLED = Boolean(SAP_ODATA_BASE)

const MOCK_MATERIALS: SAPMaterial[] = [
  { materialNumber: '10003421', description: 'Gate Valve 6" 900# RTJ',       uom: 'PC', plant: '1001', valuationType: 'FIFO', movingAveragePrice: 4200  },
  { materialNumber: '10003422', description: 'Pressure Gauge 0-3000 PSI',    uom: 'PC', plant: '1001', valuationType: 'FIFO', movingAveragePrice: 185   },
  { materialNumber: '10003423', description: 'Centrifugal Pump 2"',           uom: 'EA', plant: '1001', valuationType: 'FIFO', movingAveragePrice: 12500 },
  { materialNumber: '10003424', description: 'Check Valve 4" 150# FF',        uom: 'PC', plant: '1001', valuationType: 'FIFO', movingAveragePrice: 870   },
  { materialNumber: '10003425', description: 'Spiral Wound Gasket 6"',        uom: 'PC', plant: '1001', valuationType: 'FIFO', movingAveragePrice: 95    },
]

export const SAPClient = {
  integrationEnabled: INTEGRATION_ENABLED,

  searchMaterials: async (query: string): Promise<SAPMaterial[]> => {
    if (!INTEGRATION_ENABLED) {
      const q = query.toLowerCase()
      return MOCK_MATERIALS.filter(m => m.description.toLowerCase().includes(q) || m.materialNumber.includes(q))
    }
    // OData query: GET /sap/opu/odata/sap/MM_MATERIAL_SRV/MaterialSet?$filter=contains(MaterialDescription, '<query>')
    // TODO: wire up with actual SAP OData credentials
    return []
  },

  postGoodsIssue: async (workOrder: WorkOrder): Promise<SAPDocument> => {
    if (!INTEGRATION_ENABLED) {
      return {
        documentNumber: `4900${Math.floor(Math.random() * 900000 + 100000)}`,
        fiscalYear: String(new Date().getFullYear()),
        timestamp: new Date().toISOString(),
      }
    }
    // POST to MIGO_GI BAPI via SAP OData
    // TODO: BAPI_GOODSMVT_CREATE equivalent via /sap/opu/odata/sap/MMIM_GR4GI_SRV/
    return { documentNumber: '', fiscalYear: '', timestamp: '' }
  },

  createTransferRequest: async (workOrder: WorkOrder): Promise<SAPDocument> => {
    if (!INTEGRATION_ENABLED) {
      return {
        documentNumber: `TR${Math.floor(Math.random() * 900000 + 100000)}`,
        fiscalYear: String(new Date().getFullYear()),
        timestamp: new Date().toISOString(),
      }
    }
    // POST to TR creation endpoint in SAP WM/EWM
    return { documentNumber: '', fiscalYear: '', timestamp: '' }
  },

  confirmDelivery: async (workOrder: WorkOrder): Promise<void> => {
    if (!INTEGRATION_ENABLED) {
      console.info(`[SAP Sim] Delivery confirmed for ${workOrder.id}`)
      return
    }
    // POST SES (Service Entry Sheet) confirmation
    // TODO: /sap/opu/odata/sap/MM_SRV/ServiceEntrySheetSet
  },
}
