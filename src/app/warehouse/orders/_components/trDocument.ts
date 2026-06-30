import { type WorkOrder } from '@/lib/mock-data'
import { type TRDocumentData } from '@/components/domain/TRDocument'

export function makeTRData(order: WorkOrder): TRDocumentData {
  return {
    trNumber: order.waybillNumber ?? order.id.replace('DEL-',''),
    destination: order.destination,
    requestedBy: order.requestedByName ?? 'Kenneth Nwosu',
    department: 'Vendor',
    date: new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }).replace(',',''),
    approvedBy: 'Kenneth Omireh',
    approverTitle: 'Approved by the Onne Base Logistics Coordinator',
    company: 'TotalEnergies',
    items: order.items.map(it => ({
      quantity: it.qty,
      description: it.description,
      prWoNumber: order.id,
    })),
  }
}
