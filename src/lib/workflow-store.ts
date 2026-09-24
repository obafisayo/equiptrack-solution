import { WORK_ORDERS, CONTAINERS, type WorkOrder, type Container, type RequestType, type EntityType, type DangerousGoodsClass } from './mock-data'
import type { Stage } from './lifecycle'
import type { UrgencyLevel } from '@/config/sla'
import { INIT_CONTAINERS, type CCUContainer } from '../app/qaqc/containers/_components/types'

// Single authoritative live store — all dashboard pages read from here.
// Initialized from static mock data; new submissions are prepended.
export const LIVE_ORDERS: WorkOrder[] = [...WORK_ORDERS]
export const LIVE_CONTAINERS: Container[] = CONTAINERS.map(c => ({ ...c }))
export const LIVE_CCU_FLEET: CCUContainer[] = INIT_CONTAINERS.map(c => ({ ...c }))

// ── Routing ───────────────────────────────────────────────────────────────────

function initialStage(requestType: RequestType): Stage {
  switch (requestType) {
    case 'TR':        return 'Pending Base Coordinator Approval'
    case 'VENDOR':
    case 'NON_STOCK': return 'Dispatch Queue'
    default:          return 'New Request'  // SAP
  }
}

// ── Create ────────────────────────────────────────────────────────────────────

let _orderSeq = 9000

export interface CreateOrderInput {
  requestType: RequestType
  destination: string
  urgency: UrgencyLevel
  requiredDate: string
  returnDate?: string
  cargoType?: string
  requestedByName: string
  notes?: string
  trDepartment?: string
  entity?: EntityType
  items: Array<{ description: string; qty: number; unit: string; plant?: string; binLoc?: string; partNumber?: string }>
}

export function createWorkOrder(input: CreateOrderInput): WorkOrder {
  const stage = initialStage(input.requestType)
  const now   = new Date().toISOString()
  const seq   = ++_orderSeq
  const id    = `DEL-26-${seq}`

  const order: WorkOrder = {
    id,
    workOrderNumber:  `WO-26-${seq}`,
    requestType:      input.requestType,
    destination:      input.destination,
    urgency:          input.urgency,
    stage,
    assignedTo:       null,
    assignedToName:   null,
    requestedByName:  input.requestedByName,
    elapsedHours:     0,
    totalElapsedHours: 0,
    stageHistory:     [{ stage, personId: null, personName: null, startedAt: now }],
    items:            input.items.map(i => ({
      description: i.description,
      qty:         i.qty,
      unit:        i.unit,
      partNumber:  i.partNumber,
      plant:       i.plant,
      binLoc:      i.binLoc,
    })),
    notes:                input.notes,
    trDepartment:         input.trDepartment,
    entity:               input.entity,
    createdAt:            now,
    expectedDeliveryDate: input.requiredDate || null,
    returnDate:           input.returnDate || undefined,
    status:               'active',
  }

  LIVE_ORDERS.unshift(order)
  return order
}

// ── Approve (TR: Pending BC Approval → New Request) ───────────────────────────

export function approveOrder(id: string): void {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order || order.stage !== 'Pending Base Coordinator Approval') return
  const now = new Date().toISOString()
  // close out current stage in history
  const current = order.stageHistory[order.stageHistory.length - 1]
  if (current && !current.endedAt) current.endedAt = now
  // advance to New Request
  order.stage = 'New Request'
  order.stageHistory.push({ stage: 'New Request', personId: null, personName: null, startedAt: now })
}

// ── Reject TR ────────────────────────────────────────────────────────────────

export function rejectOrder(id: string, reason: string): void {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order) return
  order.status          = 'rejected'
  order.rejectionReason = reason
}

// ── Waybill: generate (dispatch personnel → pending exec approval) ─────────────

let _waybillSeq = 2000

export function setWaybillPending(id: string, personnelId: string, personnelName: string): string {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order) return ''
  const now = new Date().toISOString()
  const cur = order.stageHistory[order.stageHistory.length - 1]
  if (cur && !cur.endedAt) { cur.endedAt = now; cur.durationHours = order.elapsedHours }
  const wb = `WB-26-${++_waybillSeq}`
  order.waybillNumber   = wb
  order.waybillApproved = false
  order.stageHistory.push({ stage: 'Waybill Pending Signature', personId: personnelId, personName: personnelName, startedAt: now })
  return wb
}

// ── Waybill: approve (executive → Waybill Done) ───────────────────────────────

export function approveWaybill(id: string): void {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order) return
  const now = new Date().toISOString()
  const cur = order.stageHistory[order.stageHistory.length - 1]
  if (cur && !cur.endedAt) cur.endedAt = now
  order.waybillApproved = true
  order.stage = 'Waybill Done'
  order.stageHistory.push({ stage: 'Waybill Done', personId: null, personName: null, startedAt: now })
}

// ── Waybill: reject (executive) ───────────────────────────────────────────────

export function rejectWaybill(id: string, reason: string): void {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order) return
  order.waybillNumber   = undefined
  order.waybillApproved = false
  order.rejectionReason = reason
}

// ── Deckspace: allocate (vessel coordinator) ──────────────────────────────────

export function allocateDeckspace(id: string, vesselName: string): void {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order) return
  order.allocatedVessel = vesselName
}

// ── Mark Shipped (dispatch personnel, after vessel allocated) ─────────────────

export function markShipped(id: string, personnelId: string, personnelName: string): void {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order) return
  const now = new Date().toISOString()
  const cur = order.stageHistory[order.stageHistory.length - 1]
  if (cur && !cur.endedAt) { cur.endedAt = now; cur.durationHours = order.elapsedHours }
  order.stage = 'Shipped'
  order.stageHistory.push({ stage: 'Shipped', personId: personnelId, personName: personnelName, startedAt: now })
}

// ── Mark Received (requester → Completed) ────────────────────────────────────

export function markReceived(id: string): void {
  const order = LIVE_ORDERS.find(o => o.id === id)
  if (!order) return
  const now = new Date().toISOString()
  const cur = order.stageHistory[order.stageHistory.length - 1]
  if (cur && !cur.endedAt) cur.endedAt = now
  order.stage  = 'Completed'
  order.status = 'completed'
  order.stageHistory.push({ stage: 'Completed', personId: null, personName: null, startedAt: now })
  // Update CCU location to the delivery destination on completion
  if (order.assignedCCUSerial) {
    const ccu = LIVE_CCU_FLEET.find(c => c.serialNumber === order.assignedCCUSerial)
    if (ccu) {
      ccu.location    = order.destination
      ccu.currentSite = order.destination
    }
  }
}

// ── Assign container to dispatch personnel (QAQC action) ─────────────────────

export function assignContainerToPersonnel(
  containerId: string,
  personnelId: string,
  personnelName: string,
): void {
  const c = LIVE_CONTAINERS.find(c => c.id === containerId)
  if (!c) return
  c.assignedToPersonnelId   = personnelId
  c.assignedToPersonnelName = personnelName
}

// ── Assign CCU from fleet to a dispatch personnel group (QAQC action) ─────────

export function assignCCUFromFleet(
  serialNumber: string,
  personnelId: string,
  destination: string,
): void {
  // Mark the CCU in the fleet as unavailable / in transit
  const ccu = LIVE_CCU_FLEET.find(c => c.serialNumber === serialNumber)
  if (ccu) {
    ccu.status    = 'In Transit'
    ccu.available = false
    ccu.location  = `In Transit to ${destination}`
    ccu.currentSite = `In Transit to ${destination}`
  }
  // Tag all orders assigned to this personnel with the chosen CCU serial
  for (const o of LIVE_ORDERS) {
    if (o.assignedTo === personnelId) {
      o.assignedCCUSerial = serialNumber
    }
  }
}

// ── Pack orders into container (dispatch personnel action) ────────────────────

export function packOrdersIntoContainer(
  orderIds: string[],
  containerId: string,
  cargoClass: DangerousGoodsClass,
  personnelId: string,
  personnelName: string,
): void {
  const now = new Date().toISOString()
  for (const id of orderIds) {
    const o = LIVE_ORDERS.find(o => o.id === id)
    if (!o) continue
    const cur = o.stageHistory[o.stageHistory.length - 1]
    if (cur && !cur.endedAt) {
      cur.endedAt = now
      cur.durationHours = o.elapsedHours
    }
    o.stage      = 'Containerization'
    o.containerId = containerId
    o.cargoClass  = cargoClass
    o.elapsedHours = 0
    o.stageHistory.push({
      stage:       'Containerization',
      personId:    personnelId,
      personName:  personnelName,
      startedAt:   now,
    })
  }
  const container = LIVE_CONTAINERS.find(c => c.id === containerId)
  if (container) {
    container.status = 'in-use'
    container.assignedToPersonnelId   = undefined
    container.assignedToPersonnelName = undefined
    container.workOrderIds = [...container.workOrderIds, ...orderIds]
    if (!container.destination && orderIds.length > 0) {
      const firstOrder = LIVE_ORDERS.find(o => o.id === orderIds[0])
      if (firstOrder) container.destination = firstOrder.destination
    }
  }
}
