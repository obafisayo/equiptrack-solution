import { type WorkOrder } from '@/lib/mock-data'
import { ORG_BRANDING } from '@/config/organization'
import { COORDINATOR_CONFIG } from '@/lib/coordinator-config'
import { type TRDocumentData } from '@/components/domain/TRDocument'

export function makeTRData(order: WorkOrder): TRDocumentData {
  return {
    trNumber: order.waybillNumber ?? order.id.replace('DEL-',''),
    destination: order.destination,
    requestedBy: order.requestedByName ?? 'Kenneth Nwosu',
    department: 'Vendor',
    date: new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }).replace(',',''),
    approvedBy: COORDINATOR_CONFIG.coordinators[0] ?? '',
    approverTitle: `Approved by the ${COORDINATOR_CONFIG.baseName} Logistics Coordinator`,
    company: ORG_BRANDING.legalName,
    items: order.items.map(it => ({
      quantity: it.qty,
      description: it.description,
      prWoNumber: order.id,
    })),
  }
}
