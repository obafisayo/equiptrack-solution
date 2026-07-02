import type { Stage, Role } from '@/lib/lifecycle'
import type { UrgencyLevel } from '@/config/sla'
import { STAGE_SLA_HOURS } from '@/config/sla'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RequestType = 'SAP' | 'TR' | 'VENDOR' | 'NON_STOCK'
export type DangerousGoodsClass = 'normal' | 'dangerous' | 'explosive' | 'radioactive' | 'refrigerated' | 'hazardous'

export interface StageHistoryEntry {
  stage: Stage
  personId: string | null
  personName: string | null
  startedAt: string
  endedAt?: string
  durationHours?: number
}

export interface OrderItem {
  description: string
  qty: number
  unit: string
  partNumber?: string
}

export interface WorkOrder {
  id: string
  workOrderNumber: string
  requestType: RequestType
  destination: string
  urgency: UrgencyLevel
  stage: Stage
  assignedTo: string | null
  assignedToName: string | null
  requestedBy?: string
  requestedByName?: string
  elapsedHours: number
  totalElapsedHours: number
  stageHistory: StageHistoryEntry[]
  items: OrderItem[]
  notes?: string
  createdAt: string
  expectedDeliveryDate: string | null
  rejectionReason?: string
  containerId?: string
  waybillNumber?: string
  status?: 'active' | 'rejected' | 'completed'
  cargoClass?: DangerousGoodsClass
}

export type PersonnelDept = 'warehouse' | 'dispatch' | 'qaqc'

export interface Personnel {
  id: string
  name: string
  dept: PersonnelDept
  role: string
  active: number
  capacity: number
  email?: string
}

export interface Container {
  id: string
  size: '20ft' | '40ft'
  status: 'available' | 'in-use' | 'inspection' | 'maintenance'
  yard: string
  lengthFt: number
  widthFt: number
  heightFt: number
  weightKg: number
  workOrderIds: string[]
  destination?: string
  lastInspected?: string
  notes?: string
}

// ─── Personnel ────────────────────────────────────────────────────────────────

export const PERSONNEL: Personnel[] = [
  { id: 'WH1', name: 'Emeka Okonkwo',   dept: 'warehouse', role: 'Senior Warehouse Officer', active: 12, capacity: 15, email: 'e.okonkwo@equiptrack.ng' },
  { id: 'WH2', name: 'Sarah Adebayo',   dept: 'warehouse', role: 'Warehouse Officer',         active: 2,  capacity: 15, email: 's.adebayo@equiptrack.ng' },
  { id: 'WH3', name: 'James Okeke',     dept: 'warehouse', role: 'Warehouse Officer',         active: 7,  capacity: 15, email: 'j.okeke@equiptrack.ng' },
  { id: 'WH4', name: 'Amaka Eze',       dept: 'warehouse', role: 'Warehouse Officer',         active: 5,  capacity: 15, email: 'a.eze@equiptrack.ng' },
  { id: 'WH5', name: 'Segun Afolabi',   dept: 'warehouse', role: 'Warehouse Officer',         active: 9,  capacity: 15, email: 's.afolabi@equiptrack.ng' },
  { id: 'DP1', name: 'Biodun Adekunle', dept: 'dispatch',  role: 'Senior Dispatch Officer',   active: 8,  capacity: 12, email: 'b.adekunle@equiptrack.ng' },
  { id: 'DP2', name: 'Chika Obi',       dept: 'dispatch',  role: 'Dispatch Officer',          active: 3,  capacity: 12, email: 'c.obi@equiptrack.ng' },
  { id: 'DP3', name: 'Kola Martins',    dept: 'dispatch',  role: 'Dispatch Officer',          active: 6,  capacity: 12, email: 'k.martins@equiptrack.ng' },
  { id: 'QA1', name: 'Femi Emmanuel',   dept: 'qaqc',      role: 'Senior QAQC Inspector',     active: 4,  capacity: 10, email: 'f.emmanuel@equiptrack.ng' },
  { id: 'QA2', name: 'Ngozi Okafor',    dept: 'qaqc',      role: 'QAQC Inspector',            active: 2,  capacity: 10, email: 'n.okafor@equiptrack.ng' },
]

// ─── Containers ───────────────────────────────────────────────────────────────

export const CONTAINERS: Container[] = [
  { id: 'CNT-001', size: '20ft', status: 'available',   yard: 'Yard A',   lengthFt: 20, widthFt: 8, heightFt: 8.6, weightKg: 2200, workOrderIds: [],                   lastInspected: '2026-06-20' },
  { id: 'CNT-002', size: '40ft', status: 'in-use',      yard: 'Yard B',   lengthFt: 40, widthFt: 8, heightFt: 8.6, weightKg: 3800, workOrderIds: ['DEL-24-1301'],      destination: 'Bonga FPSO',        lastInspected: '2026-06-18' },
  { id: 'CNT-003', size: '20ft', status: 'available',   yard: 'Yard A',   lengthFt: 20, widthFt: 8, heightFt: 8.6, weightKg: 2200, workOrderIds: [],                   lastInspected: '2026-06-22' },
  { id: 'CNT-004', size: '40ft', status: 'inspection',  yard: 'Workshop', lengthFt: 40, widthFt: 8, heightFt: 8.6, weightKg: 3750, workOrderIds: [],                   lastInspected: '2026-06-10', notes: 'Awaiting structural sign-off' },
  { id: 'CNT-005', size: '20ft', status: 'available',   yard: 'Yard C',   lengthFt: 20, widthFt: 8, heightFt: 8.6, weightKg: 2180, workOrderIds: [],                   lastInspected: '2026-06-21' },
  { id: 'CNT-006', size: '40ft', status: 'available',   yard: 'Yard C',   lengthFt: 40, widthFt: 8, heightFt: 8.6, weightKg: 3820, workOrderIds: [],                   lastInspected: '2026-06-19' },
  { id: 'CNT-007', size: '20ft', status: 'in-use',      yard: 'Yard B',   lengthFt: 20, widthFt: 8, heightFt: 8.6, weightKg: 2250, workOrderIds: ['DEL-24-1288'],      destination: 'Escravos Terminal', lastInspected: '2026-06-17' },
  { id: 'CNT-008', size: '40ft', status: 'maintenance', yard: 'Workshop', lengthFt: 40, widthFt: 8, heightFt: 8.6, weightKg: 3800, workOrderIds: [],                   lastInspected: '2026-06-05', notes: 'Floor panel replacement in progress' },
  { id: 'CNT-009', size: '20ft', status: 'available',   yard: 'Yard A',   lengthFt: 20, widthFt: 8, heightFt: 8.6, weightKg: 2200, workOrderIds: [],                   lastInspected: '2026-06-23' },
  { id: 'CNT-010', size: '40ft', status: 'in-use',      yard: 'Yard D',   lengthFt: 40, widthFt: 8, heightFt: 8.6, weightKg: 3900, workOrderIds: ['DEL-24-1275'],      destination: 'Agbami FPSO',       lastInspected: '2026-06-15' },
]

// ─── Work Orders ──────────────────────────────────────────────────────────────

export const WORK_ORDERS: WorkOrder[] = [
  // ── Pending BC Approval ──
  {
    id: 'DEL-24-1320',
    workOrderNumber: 'WO-24-441',
    requestType: 'TR',
    destination: 'Bonga FPSO',
    urgency: 'High',
    stage: 'Pending Base Coordinator Approval',
    assignedTo: null,
    assignedToName: null,
    requestedBy: 'REQ1',
    requestedByName: 'Kenneth Nwosu',
    elapsedHours: 9.5,
    totalElapsedHours: 9.5,
    stageHistory: [
      { stage: 'Pending Base Coordinator Approval', personId: null, personName: 'Base Coordinator', startedAt: '2024-06-25T08:00:00Z' },
    ],
    items: [
      { description: 'Gate Valve 6" 900# RTJ', qty: 2, unit: 'Pcs', partNumber: 'GV-6900-RTJ' },
      { description: 'Pressure Gauge 0-3000 PSI', qty: 4, unit: 'Pcs' },
    ],
    notes: 'Urgent replacement required — wellhead integrity issue.',
    createdAt: '2024-06-25T08:00:00Z',
    expectedDeliveryDate: '2024-06-28T08:00:00Z',
    status: 'active',
  },
  {
    id: 'DEL-24-1318',
    workOrderNumber: 'WO-24-440',
    requestType: 'TR',
    destination: 'Agbami FPSO',
    urgency: 'Medium',
    stage: 'Pending Base Coordinator Approval',
    assignedTo: null,
    assignedToName: null,
    requestedBy: 'REQ2',
    requestedByName: 'Tunde Fashola',
    elapsedHours: 3.2,
    totalElapsedHours: 3.2,
    stageHistory: [
      { stage: 'Pending Base Coordinator Approval', personId: null, personName: 'Base Coordinator', startedAt: '2024-06-25T14:00:00Z' },
    ],
    items: [
      { description: 'Choke Valve 2" Adjustable', qty: 1, unit: 'Pcs', partNumber: 'CV-2ADJ' },
    ],
    createdAt: '2024-06-25T14:00:00Z',
    expectedDeliveryDate: '2024-06-30T14:00:00Z',
    status: 'active',
  },

  // ── New Request (SAP — SLA breach) ──
  {
    id: 'DEL-24-1315',
    workOrderNumber: 'WO-24-438',
    requestType: 'SAP',
    destination: 'Forcados Terminal',
    urgency: 'Urgent',
    stage: 'New Request',
    assignedTo: null,
    assignedToName: null,
    requestedBy: 'REQ3',
    requestedByName: 'Aminu Kano',
    elapsedHours: 6.8,
    totalElapsedHours: 6.8,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-25T10:00:00Z' },
    ],
    items: [
      { description: 'Mud Pump Liner 7.5"', qty: 3, unit: 'Pcs', partNumber: 'MPL-75' },
      { description: 'Mud Pump Piston Assembly', qty: 3, unit: 'Sets' },
      { description: 'Swivel Joint 3" 5000 PSI', qty: 1, unit: 'Pcs' },
    ],
    notes: 'Critical — rig operations halted pending receipt.',
    createdAt: '2024-06-25T10:00:00Z',
    expectedDeliveryDate: null,
    status: 'active',
  },
  {
    id: 'DEL-24-1312',
    workOrderNumber: 'WO-24-436',
    requestType: 'SAP',
    destination: 'Bonny Terminal',
    urgency: 'High',
    stage: 'New Request',
    assignedTo: null,
    assignedToName: null,
    requestedBy: 'REQ4',
    requestedByName: 'Obinna Chukwu',
    elapsedHours: 2.1,
    totalElapsedHours: 2.1,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-25T15:00:00Z' },
    ],
    items: [
      { description: 'Safety Relief Valve 1.5" 1500 PSI', qty: 2, unit: 'Pcs', partNumber: 'SRV-15-1500' },
    ],
    createdAt: '2024-06-25T15:00:00Z',
    expectedDeliveryDate: '2024-06-28T15:00:00Z',
    status: 'active',
  },

  // ── Warehouse Assigned ──
  {
    id: 'DEL-24-1308',
    workOrderNumber: 'WO-24-433',
    requestType: 'SAP',
    destination: 'Erha FPSO',
    urgency: 'Medium',
    stage: 'Warehouse Assigned',
    assignedTo: 'WH3',
    assignedToName: 'James Okeke',
    elapsedHours: 2.5,
    totalElapsedHours: 5.5,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-25T09:00:00Z', endedAt: '2024-06-25T12:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-25T12:00:00Z' },
    ],
    items: [
      { description: 'Drillpipe 5" Grade S-135 R2', qty: 10, unit: 'Jts', partNumber: 'DP-5-S135' },
      { description: 'Drillpipe Protector', qty: 20, unit: 'Pcs' },
    ],
    createdAt: '2024-06-25T09:00:00Z',
    expectedDeliveryDate: '2024-06-30T09:00:00Z',
    status: 'active',
  },
  {
    id: 'DEL-24-1305',
    workOrderNumber: 'WO-24-431',
    requestType: 'SAP',
    destination: 'Escravos Terminal',
    urgency: 'Low',
    stage: 'Warehouse Assigned',
    assignedTo: 'WH4',
    assignedToName: 'Amaka Eze',
    elapsedHours: 1.2,
    totalElapsedHours: 4.8,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-25T07:00:00Z', endedAt: '2024-06-25T10:30:00Z', durationHours: 3.5 },
      { stage: 'Warehouse Assigned', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-25T10:30:00Z' },
    ],
    items: [
      { description: 'Casing Centralizer Bow-Spring 9-5/8"', qty: 30, unit: 'Pcs' },
      { description: 'Stop Collar 9-5/8"', qty: 30, unit: 'Pcs' },
    ],
    createdAt: '2024-06-25T07:00:00Z',
    expectedDeliveryDate: '2024-07-02T07:00:00Z',
    status: 'active',
  },

  // ── Processing ──
  {
    id: 'DEL-24-1301',
    workOrderNumber: 'WO-24-428',
    requestType: 'SAP',
    destination: 'Bonga FPSO',
    urgency: 'High',
    stage: 'Processing',
    assignedTo: 'WH1',
    assignedToName: 'Emeka Okonkwo',
    elapsedHours: 4.3,
    totalElapsedHours: 18.3,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-24T08:00:00Z', endedAt: '2024-06-24T10:00:00Z', durationHours: 2 },
      { stage: 'Warehouse Assigned', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-24T10:00:00Z', endedAt: '2024-06-24T12:00:00Z', durationHours: 2 },
      { stage: 'Processing', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-25T13:30:00Z' },
    ],
    items: [
      { description: 'BOP Ram Seal Assembly 13-5/8" 10K', qty: 1, unit: 'Set', partNumber: 'BOP-1358-10K' },
      { description: 'Annular Packing 13-5/8"', qty: 2, unit: 'Pcs' },
      { description: 'Hydraulic Hose Assembly 1/2" x 3m', qty: 5, unit: 'Pcs' },
    ],
    notes: 'Items located in Rack B-14. Cross-check serial numbers before picking.',
    createdAt: '2024-06-24T08:00:00Z',
    expectedDeliveryDate: '2024-06-27T08:00:00Z',
    status: 'active',
  },
  {
    id: 'DEL-24-1298',
    workOrderNumber: 'WO-24-426',
    requestType: 'TR',
    destination: 'Egina FPSO',
    urgency: 'Urgent',
    stage: 'Processing',
    assignedTo: 'WH5',
    assignedToName: 'Segun Afolabi',
    elapsedHours: 9.1,
    totalElapsedHours: 22.1,
    stageHistory: [
      { stage: 'Pending Base Coordinator Approval', personId: null, personName: 'Base Coordinator', startedAt: '2024-06-24T06:00:00Z', endedAt: '2024-06-24T08:00:00Z', durationHours: 2 },
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-24T08:00:00Z', endedAt: '2024-06-24T10:00:00Z', durationHours: 2 },
      { stage: 'Warehouse Assigned', personId: 'WH5', personName: 'Segun Afolabi', startedAt: '2024-06-24T10:00:00Z', endedAt: '2024-06-24T11:00:00Z', durationHours: 1 },
      { stage: 'Processing', personId: 'WH5', personName: 'Segun Afolabi', startedAt: '2024-06-24T11:00:00Z' },
    ],
    items: [
      { description: 'Subsea Tree Cap 10K 7-1/16"', qty: 1, unit: 'Pcs', partNumber: 'STC-716-10K' },
    ],
    notes: 'SLA BREACHED — Egina team waiting offshore. Escalate immediately.',
    createdAt: '2024-06-24T06:00:00Z',
    expectedDeliveryDate: null,
    status: 'active',
  },

  // ── GI Created ──
  {
    id: 'DEL-24-1292',
    workOrderNumber: 'WO-24-420',
    requestType: 'SAP',
    destination: 'Usan FPSO',
    urgency: 'Medium',
    stage: 'GI Created',
    assignedTo: 'WH2',
    assignedToName: 'Sarah Adebayo',
    elapsedHours: 1.5,
    totalElapsedHours: 14.5,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-24T05:00:00Z', endedAt: '2024-06-24T08:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH2', personName: 'Sarah Adebayo', startedAt: '2024-06-24T08:00:00Z', endedAt: '2024-06-24T09:30:00Z', durationHours: 1.5 },
      { stage: 'Processing', personId: 'WH2', personName: 'Sarah Adebayo', startedAt: '2024-06-24T09:30:00Z', endedAt: '2024-06-24T17:30:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH2', personName: 'Sarah Adebayo', startedAt: '2024-06-25T15:00:00Z' },
    ],
    items: [
      { description: 'Wellhead Adapter Flange 7-1/16" 10K', qty: 1, unit: 'Pcs' },
      { description: 'Ring Gasket BX-154', qty: 4, unit: 'Pcs' },
    ],
    createdAt: '2024-06-24T05:00:00Z',
    expectedDeliveryDate: '2024-06-29T05:00:00Z',
    status: 'active',
  },

  // ── Transferred to Dispatch ──
  {
    id: 'DEL-24-1288',
    workOrderNumber: 'WO-24-417',
    requestType: 'SAP',
    destination: 'Forcados Terminal',
    urgency: 'High',
    stage: 'Transferred to Dispatch',
    assignedTo: 'WH1',
    assignedToName: 'Emeka Okonkwo',
    elapsedHours: 0.7,
    totalElapsedHours: 26.7,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-24T01:00:00Z', endedAt: '2024-06-24T04:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-24T04:00:00Z', endedAt: '2024-06-24T05:00:00Z', durationHours: 1 },
      { stage: 'Processing', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-24T05:00:00Z', endedAt: '2024-06-24T14:00:00Z', durationHours: 9 },
      { stage: 'GI Created', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-24T14:00:00Z', endedAt: '2024-06-24T15:30:00Z', durationHours: 1.5 },
      { stage: 'Transferred to Dispatch', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-25T16:30:00Z' },
    ],
    items: [
      { description: 'Drill Bit PDC 12-1/4" M545', qty: 2, unit: 'Pcs', partNumber: 'DB-PDC-1225' },
      { description: 'Bit Sub 7-5/8" Reg Pin x Box', qty: 2, unit: 'Pcs' },
    ],
    createdAt: '2024-06-24T01:00:00Z',
    expectedDeliveryDate: '2024-06-27T01:00:00Z',
    containerId: 'CNT-007',
    status: 'active',
  },

  // ── Dispatch Queue ──
  {
    id: 'DEL-24-1282',
    workOrderNumber: 'WO-24-412',
    requestType: 'SAP',
    destination: 'Bonny Terminal',
    urgency: 'Medium',
    stage: 'Dispatch Queue',
    assignedTo: null,
    assignedToName: null,
    requestedBy: 'REQ5',
    requestedByName: 'Chidi Okafor',
    elapsedHours: 2.8,
    totalElapsedHours: 30.8,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-23T22:00:00Z', endedAt: '2024-06-23T24:00:00Z', durationHours: 2 },
      { stage: 'Warehouse Assigned', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-24T00:00:00Z', endedAt: '2024-06-24T01:30:00Z', durationHours: 1.5 },
      { stage: 'Processing', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-24T01:30:00Z', endedAt: '2024-06-24T09:30:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-24T09:30:00Z', endedAt: '2024-06-24T11:00:00Z', durationHours: 1.5 },
      { stage: 'Transferred to Dispatch', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-24T11:00:00Z', endedAt: '2024-06-24T12:00:00Z', durationHours: 1 },
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-25T14:00:00Z' },
    ],
    items: [
      { description: 'Riser Clamp Assembly 13-3/8"', qty: 5, unit: 'Pcs' },
      { description: 'Riser Handling Tool', qty: 1, unit: 'Pcs' },
    ],
    createdAt: '2024-06-23T22:00:00Z',
    expectedDeliveryDate: '2024-06-28T22:00:00Z',
    status: 'active',
  },
  {
    id: 'DEL-24-1278',
    workOrderNumber: 'WO-24-409',
    requestType: 'VENDOR',
    destination: 'Agbami FPSO',
    urgency: 'High',
    stage: 'Dispatch Queue',
    assignedTo: null,
    assignedToName: null,
    requestedBy: 'REQ6',
    requestedByName: 'Olu Adeyinka',
    elapsedHours: 3.1,
    totalElapsedHours: 3.1,
    stageHistory: [
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-25T14:00:00Z' },
    ],
    items: [
      { description: 'Subsea Chemical Injection Skid', qty: 1, unit: 'Unit', partNumber: 'CIS-SSX-200' },
    ],
    notes: 'Vendor delivery from Baker Hughes. Skip warehouse — direct to dispatch.',
    createdAt: '2024-06-25T14:00:00Z',
    expectedDeliveryDate: '2024-06-28T14:00:00Z',
    status: 'active',
  },

  // ── Dispatch Assigned ──
  {
    id: 'DEL-24-1272',
    workOrderNumber: 'WO-24-404',
    requestType: 'SAP',
    destination: 'Erha FPSO',
    urgency: 'Urgent',
    stage: 'Dispatch Assigned',
    assignedTo: 'DP1',
    assignedToName: 'Biodun Adekunle',
    elapsedHours: 5.2,
    totalElapsedHours: 42.2,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-23T10:00:00Z', endedAt: '2024-06-23T13:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-23T13:00:00Z', endedAt: '2024-06-23T14:30:00Z', durationHours: 1.5 },
      { stage: 'Processing', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-23T14:30:00Z', endedAt: '2024-06-23T22:30:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-23T22:30:00Z', endedAt: '2024-06-24T00:00:00Z', durationHours: 1.5 },
      { stage: 'Transferred to Dispatch', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-24T00:00:00Z', endedAt: '2024-06-24T01:00:00Z', durationHours: 1 },
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-24T01:00:00Z', endedAt: '2024-06-24T03:00:00Z', durationHours: 2 },
      { stage: 'Dispatch Assigned', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-25T12:00:00Z' },
    ],
    items: [
      { description: 'ROV Tether Assembly 500m', qty: 1, unit: 'Set', partNumber: 'ROV-TH-500' },
      { description: 'ROV Camera Housing 4K', qty: 2, unit: 'Pcs' },
    ],
    createdAt: '2024-06-23T10:00:00Z',
    expectedDeliveryDate: null,
    status: 'active',
  },
  {
    id: 'DEL-24-1268',
    workOrderNumber: 'WO-24-401',
    requestType: 'NON_STOCK',
    destination: 'Escravos Terminal',
    urgency: 'Medium',
    stage: 'Dispatch Assigned',
    assignedTo: 'DP2',
    assignedToName: 'Chika Obi',
    elapsedHours: 3.7,
    totalElapsedHours: 3.7,
    stageHistory: [
      { stage: 'Dispatch Assigned', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-25T13:30:00Z' },
    ],
    items: [
      { description: 'Temporary Scaffolding Set', qty: 1, unit: 'Set' },
      { description: 'Safety Harness Full Body', qty: 10, unit: 'Pcs' },
    ],
    createdAt: '2024-06-25T13:30:00Z',
    expectedDeliveryDate: '2024-06-30T13:30:00Z',
    status: 'active',
  },

  // ── Preload QAQC ──
  {
    id: 'DEL-24-1261',
    workOrderNumber: 'WO-24-395',
    requestType: 'SAP',
    destination: 'Bonga FPSO',
    urgency: 'High',
    stage: 'Preload QAQC',
    assignedTo: 'QA1',
    assignedToName: 'Femi Emmanuel',
    elapsedHours: 2.9,
    totalElapsedHours: 50.9,
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-23T06:00:00Z', endedAt: '2024-06-23T09:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH2', personName: 'Sarah Adebayo', startedAt: '2024-06-23T09:00:00Z', endedAt: '2024-06-23T10:30:00Z', durationHours: 1.5 },
      { stage: 'Processing', personId: 'WH2', personName: 'Sarah Adebayo', startedAt: '2024-06-23T10:30:00Z', endedAt: '2024-06-23T18:30:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH2', personName: 'Sarah Adebayo', startedAt: '2024-06-23T18:30:00Z', endedAt: '2024-06-23T20:00:00Z', durationHours: 1.5 },
      { stage: 'Transferred to Dispatch', personId: 'WH2', personName: 'Sarah Adebayo', startedAt: '2024-06-23T20:00:00Z', endedAt: '2024-06-23T21:00:00Z', durationHours: 1 },
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-23T21:00:00Z', endedAt: '2024-06-23T23:00:00Z', durationHours: 2 },
      { stage: 'Dispatch Assigned', personId: 'DP3', personName: 'Kola Martins', startedAt: '2024-06-23T23:00:00Z', endedAt: '2024-06-24T02:00:00Z', durationHours: 3 },
      { stage: 'Preload QAQC', personId: 'QA1', personName: 'Femi Emmanuel', startedAt: '2024-06-25T14:00:00Z' },
    ],
    items: [
      { description: 'High Pressure Flexible Hose 2" x 10m 5000 PSI', qty: 3, unit: 'Pcs' },
      { description: 'Hose End Fittings 2" NPT', qty: 6, unit: 'Pcs' },
    ],
    createdAt: '2024-06-23T06:00:00Z',
    expectedDeliveryDate: '2024-06-26T06:00:00Z',
    status: 'active',
  },

  // ── Containerization ──
  {
    id: 'DEL-24-1255',
    workOrderNumber: 'WO-24-390',
    requestType: 'SAP',
    destination: 'Agbami FPSO',
    urgency: 'Medium',
    stage: 'Containerization',
    assignedTo: 'DP1',
    assignedToName: 'Biodun Adekunle',
    elapsedHours: 1.8,
    totalElapsedHours: 58.8,
    containerId: 'CNT-002',
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-22T20:00:00Z', endedAt: '2024-06-22T23:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH5', personName: 'Segun Afolabi', startedAt: '2024-06-22T23:00:00Z', endedAt: '2024-06-23T00:30:00Z', durationHours: 1.5 },
      { stage: 'Processing', personId: 'WH5', personName: 'Segun Afolabi', startedAt: '2024-06-23T00:30:00Z', endedAt: '2024-06-23T08:30:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH5', personName: 'Segun Afolabi', startedAt: '2024-06-23T08:30:00Z', endedAt: '2024-06-23T10:00:00Z', durationHours: 1.5 },
      { stage: 'Transferred to Dispatch', personId: 'WH5', personName: 'Segun Afolabi', startedAt: '2024-06-23T10:00:00Z', endedAt: '2024-06-23T11:00:00Z', durationHours: 1 },
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-23T11:00:00Z', endedAt: '2024-06-23T13:00:00Z', durationHours: 2 },
      { stage: 'Dispatch Assigned', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-23T13:00:00Z', endedAt: '2024-06-24T00:00:00Z', durationHours: 11 },
      { stage: 'Preload QAQC', personId: 'QA2', personName: 'Ngozi Okafor', startedAt: '2024-06-24T00:00:00Z', endedAt: '2024-06-24T01:30:00Z', durationHours: 1.5 },
      { stage: 'Containerization', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-25T15:00:00Z' },
    ],
    items: [
      { description: 'Tubing Anchor Catcher 2-7/8"', qty: 2, unit: 'Pcs' },
      { description: 'Tubing Stop Collar', qty: 10, unit: 'Pcs' },
      { description: 'Wireline Rope Socket Assembly', qty: 1, unit: 'Set' },
    ],
    createdAt: '2024-06-22T20:00:00Z',
    expectedDeliveryDate: '2024-06-27T20:00:00Z',
    status: 'active',
  },

  // ── Post QAQC ──
  {
    id: 'DEL-24-1248',
    workOrderNumber: 'WO-24-383',
    requestType: 'SAP',
    destination: 'Forcados Terminal',
    urgency: 'High',
    stage: 'Post QAQC',
    assignedTo: 'QA1',
    assignedToName: 'Femi Emmanuel',
    elapsedHours: 0.9,
    totalElapsedHours: 64.9,
    containerId: 'CNT-010',
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-22T12:00:00Z', endedAt: '2024-06-22T15:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-22T15:00:00Z', endedAt: '2024-06-22T16:30:00Z', durationHours: 1.5 },
      { stage: 'Processing', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-22T16:30:00Z', endedAt: '2024-06-23T00:30:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-23T00:30:00Z', endedAt: '2024-06-23T02:00:00Z', durationHours: 1.5 },
      { stage: 'Transferred to Dispatch', personId: 'WH3', personName: 'James Okeke', startedAt: '2024-06-23T02:00:00Z', endedAt: '2024-06-23T03:00:00Z', durationHours: 1 },
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-23T03:00:00Z', endedAt: '2024-06-23T05:00:00Z', durationHours: 2 },
      { stage: 'Dispatch Assigned', personId: 'DP3', personName: 'Kola Martins', startedAt: '2024-06-23T05:00:00Z', endedAt: '2024-06-23T12:00:00Z', durationHours: 7 },
      { stage: 'Preload QAQC', personId: 'QA1', personName: 'Femi Emmanuel', startedAt: '2024-06-23T12:00:00Z', endedAt: '2024-06-23T14:00:00Z', durationHours: 2 },
      { stage: 'Containerization', personId: 'DP3', personName: 'Kola Martins', startedAt: '2024-06-23T14:00:00Z', endedAt: '2024-06-24T02:00:00Z', durationHours: 12 },
      { stage: 'Post QAQC', personId: 'QA1', personName: 'Femi Emmanuel', startedAt: '2024-06-25T16:00:00Z' },
    ],
    items: [
      { description: 'X-Mas Tree Assembly 7-1/16" 5000 PSI', qty: 1, unit: 'Set', partNumber: 'XMT-716-5K' },
    ],
    createdAt: '2024-06-22T12:00:00Z',
    expectedDeliveryDate: '2024-06-25T12:00:00Z',
    status: 'active',
  },

  // ── Waybill Pending Signature ──
  {
    id: 'DEL-24-1240',
    workOrderNumber: 'WO-24-376',
    requestType: 'SAP',
    destination: 'Egina FPSO',
    urgency: 'Medium',
    stage: 'Waybill Pending Signature',
    assignedTo: 'DP2',
    assignedToName: 'Chika Obi',
    elapsedHours: 3.5,
    totalElapsedHours: 74.5,
    containerId: 'CNT-006',
    waybillNumber: 'WB-24-0891',
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-22T06:00:00Z', endedAt: '2024-06-22T09:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-22T09:00:00Z', endedAt: '2024-06-22T10:00:00Z', durationHours: 1 },
      { stage: 'Processing', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-22T10:00:00Z', endedAt: '2024-06-22T18:00:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-22T18:00:00Z', endedAt: '2024-06-22T20:00:00Z', durationHours: 2 },
      { stage: 'Transferred to Dispatch', personId: 'WH4', personName: 'Amaka Eze', startedAt: '2024-06-22T20:00:00Z', endedAt: '2024-06-22T21:00:00Z', durationHours: 1 },
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-22T21:00:00Z', endedAt: '2024-06-22T23:00:00Z', durationHours: 2 },
      { stage: 'Dispatch Assigned', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-22T23:00:00Z', endedAt: '2024-06-23T06:00:00Z', durationHours: 7 },
      { stage: 'Preload QAQC', personId: 'QA2', personName: 'Ngozi Okafor', startedAt: '2024-06-23T06:00:00Z', endedAt: '2024-06-23T07:30:00Z', durationHours: 1.5 },
      { stage: 'Containerization', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-23T07:30:00Z', endedAt: '2024-06-23T17:00:00Z', durationHours: 9.5 },
      { stage: 'Post QAQC', personId: 'QA2', personName: 'Ngozi Okafor', startedAt: '2024-06-23T17:00:00Z', endedAt: '2024-06-23T18:30:00Z', durationHours: 1.5 },
      { stage: 'Waybill Pending Signature', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-25T13:00:00Z' },
    ],
    items: [
      { description: 'Downhole Safety Valve 3-1/2" 5000 PSI DHSV', qty: 1, unit: 'Pcs', partNumber: 'DHSV-35-5K' },
      { description: 'Control Line Connector Set', qty: 2, unit: 'Sets' },
    ],
    createdAt: '2024-06-22T06:00:00Z',
    expectedDeliveryDate: '2024-06-27T06:00:00Z',
    status: 'active',
  },

  // ── Waybill Done ──
  {
    id: 'DEL-24-1231',
    workOrderNumber: 'WO-24-368',
    requestType: 'SAP',
    destination: 'Bonny Terminal',
    urgency: 'Low',
    stage: 'Waybill Done',
    assignedTo: 'DP3',
    assignedToName: 'Kola Martins',
    elapsedHours: 0.5,
    totalElapsedHours: 80.5,
    waybillNumber: 'WB-24-0882',
    stageHistory: [
      { stage: 'Waybill Done', personId: 'DP3', personName: 'Kola Martins', startedAt: '2024-06-25T16:30:00Z' },
    ],
    items: [
      { description: 'Cement Retainer 7" 3000 PSI', qty: 2, unit: 'Pcs' },
      { description: 'Bridge Plug 7" 5000 PSI', qty: 1, unit: 'Pcs' },
    ],
    createdAt: '2024-06-22T00:00:00Z',
    expectedDeliveryDate: '2024-06-29T00:00:00Z',
    status: 'active',
  },

  // ── Awaiting Deckspace ──
  {
    id: 'DEL-24-1220',
    workOrderNumber: 'WO-24-358',
    requestType: 'SAP',
    destination: 'Erha FPSO',
    urgency: 'High',
    stage: 'Awaiting Deckspace',
    assignedTo: 'DP1',
    assignedToName: 'Biodun Adekunle',
    elapsedHours: 18.3,
    totalElapsedHours: 90.3,
    waybillNumber: 'WB-24-0871',
    stageHistory: [
      { stage: 'Awaiting Deckspace', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-24T23:00:00Z' },
    ],
    items: [
      { description: 'Completion Tool String 4-1/2"', qty: 1, unit: 'Set', partNumber: 'CTS-45' },
    ],
    createdAt: '2024-06-21T12:00:00Z',
    expectedDeliveryDate: '2024-06-24T12:00:00Z',
    status: 'active',
  },
  {
    id: 'DEL-24-1215',
    workOrderNumber: 'WO-24-354',
    requestType: 'VENDOR',
    destination: 'Bonga FPSO',
    urgency: 'Urgent',
    stage: 'Awaiting Deckspace',
    assignedTo: 'DP2',
    assignedToName: 'Chika Obi',
    elapsedHours: 26.5,
    totalElapsedHours: 50.5,
    waybillNumber: 'WB-24-0865',
    notes: 'SLA BREACHED — awaiting boat schedule from logistics.',
    stageHistory: [
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-24T10:00:00Z', endedAt: '2024-06-24T11:30:00Z', durationHours: 1.5 },
      { stage: 'Dispatch Assigned', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-24T11:30:00Z', endedAt: '2024-06-24T15:00:00Z', durationHours: 3.5 },
      { stage: 'Preload QAQC', personId: 'QA1', personName: 'Femi Emmanuel', startedAt: '2024-06-24T15:00:00Z', endedAt: '2024-06-24T16:30:00Z', durationHours: 1.5 },
      { stage: 'Containerization', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-24T16:30:00Z', endedAt: '2024-06-24T20:00:00Z', durationHours: 3.5 },
      { stage: 'Post QAQC', personId: 'QA1', personName: 'Femi Emmanuel', startedAt: '2024-06-24T20:00:00Z', endedAt: '2024-06-24T21:00:00Z', durationHours: 1 },
      { stage: 'Waybill Pending Signature', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-24T21:00:00Z', endedAt: '2024-06-24T22:30:00Z', durationHours: 1.5 },
      { stage: 'Waybill Done', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-24T22:30:00Z', endedAt: '2024-06-24T23:00:00Z', durationHours: 0.5 },
      { stage: 'Awaiting Deckspace', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-24T23:00:00Z' },
    ],
    items: [
      { description: 'Topside Chemical Injection Pump Skid', qty: 1, unit: 'Unit' },
    ],
    createdAt: '2024-06-24T10:00:00Z',
    expectedDeliveryDate: null,
    status: 'active',
  },

  // ── Shipped ──
  {
    id: 'DEL-24-1200',
    workOrderNumber: 'WO-24-340',
    requestType: 'SAP',
    destination: 'Agbami FPSO',
    urgency: 'Medium',
    stage: 'Shipped',
    assignedTo: 'DP3',
    assignedToName: 'Kola Martins',
    elapsedHours: 4.0,
    totalElapsedHours: 96.0,
    waybillNumber: 'WB-24-0848',
    stageHistory: [
      { stage: 'Shipped', personId: 'DP3', personName: 'Kola Martins', startedAt: '2024-06-25T13:00:00Z' },
    ],
    items: [
      { description: 'Downhole Gauge Mandrel 3-1/2"', qty: 2, unit: 'Pcs' },
      { description: 'Memory Gauge Assembly', qty: 2, unit: 'Pcs' },
    ],
    createdAt: '2024-06-21T05:00:00Z',
    expectedDeliveryDate: '2024-06-26T05:00:00Z',
    status: 'active',
  },

  // ── Completed ──
  {
    id: 'DEL-24-1185',
    workOrderNumber: 'WO-24-325',
    requestType: 'SAP',
    destination: 'Forcados Terminal',
    urgency: 'Low',
    stage: 'Completed',
    assignedTo: 'DP1',
    assignedToName: 'Biodun Adekunle',
    elapsedHours: 0,
    totalElapsedHours: 88.0,
    waybillNumber: 'WB-24-0830',
    stageHistory: [
      { stage: 'New Request', personId: null, personName: null, startedAt: '2024-06-21T00:00:00Z', endedAt: '2024-06-21T03:00:00Z', durationHours: 3 },
      { stage: 'Warehouse Assigned', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-21T03:00:00Z', endedAt: '2024-06-21T04:30:00Z', durationHours: 1.5 },
      { stage: 'Processing', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-21T04:30:00Z', endedAt: '2024-06-21T12:30:00Z', durationHours: 8 },
      { stage: 'GI Created', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-21T12:30:00Z', endedAt: '2024-06-21T14:00:00Z', durationHours: 1.5 },
      { stage: 'Transferred to Dispatch', personId: 'WH1', personName: 'Emeka Okonkwo', startedAt: '2024-06-21T14:00:00Z', endedAt: '2024-06-21T15:00:00Z', durationHours: 1 },
      { stage: 'Dispatch Queue', personId: null, personName: null, startedAt: '2024-06-21T15:00:00Z', endedAt: '2024-06-21T17:00:00Z', durationHours: 2 },
      { stage: 'Dispatch Assigned', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-21T17:00:00Z', endedAt: '2024-06-22T00:00:00Z', durationHours: 7 },
      { stage: 'Preload QAQC', personId: 'QA1', personName: 'Femi Emmanuel', startedAt: '2024-06-22T00:00:00Z', endedAt: '2024-06-22T02:00:00Z', durationHours: 2 },
      { stage: 'Containerization', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-22T02:00:00Z', endedAt: '2024-06-22T14:00:00Z', durationHours: 12 },
      { stage: 'Post QAQC', personId: 'QA1', personName: 'Femi Emmanuel', startedAt: '2024-06-22T14:00:00Z', endedAt: '2024-06-22T15:30:00Z', durationHours: 1.5 },
      { stage: 'Waybill Pending Signature', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-22T15:30:00Z', endedAt: '2024-06-22T18:00:00Z', durationHours: 2.5 },
      { stage: 'Waybill Done', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-22T18:00:00Z', endedAt: '2024-06-22T18:30:00Z', durationHours: 0.5 },
      { stage: 'Awaiting Deckspace', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-22T18:30:00Z', endedAt: '2024-06-24T12:00:00Z', durationHours: 17.5 },
      { stage: 'Shipped', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-24T12:00:00Z', endedAt: '2024-06-25T08:00:00Z', durationHours: 20 },
      { stage: 'Completed', personId: 'DP1', personName: 'Biodun Adekunle', startedAt: '2024-06-25T08:00:00Z', endedAt: '2024-06-25T08:00:00Z', durationHours: 0 },
    ],
    items: [
      { description: 'Production Packer 7" 5000 PSI', qty: 1, unit: 'Pcs' },
      { description: 'Polished Bore Receptacle 4-1/2"', qty: 1, unit: 'Pcs' },
    ],
    createdAt: '2024-06-21T00:00:00Z',
    expectedDeliveryDate: '2024-06-28T00:00:00Z',
    status: 'completed',
  },
  {
    id: 'DEL-24-1170',
    workOrderNumber: 'WO-24-310',
    requestType: 'TR',
    destination: 'Bonny Terminal',
    urgency: 'Medium',
    stage: 'Completed',
    assignedTo: 'DP2',
    assignedToName: 'Chika Obi',
    elapsedHours: 0,
    totalElapsedHours: 102.0,
    waybillNumber: 'WB-24-0810',
    stageHistory: [
      { stage: 'Pending Base Coordinator Approval', personId: null, personName: 'Base Coordinator', startedAt: '2024-06-20T10:00:00Z', endedAt: '2024-06-20T14:00:00Z', durationHours: 4 },
      { stage: 'Completed', personId: 'DP2', personName: 'Chika Obi', startedAt: '2024-06-25T16:00:00Z', endedAt: '2024-06-25T16:00:00Z', durationHours: 0 },
    ],
    items: [
      { description: 'Temporary Crane Hook Assembly 50T', qty: 1, unit: 'Set' },
    ],
    createdAt: '2024-06-20T10:00:00Z',
    expectedDeliveryDate: '2024-06-25T10:00:00Z',
    status: 'completed',
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

export function getOrdersForRole(role: Role): WorkOrder[] {
  switch (role) {
    case 'requester':
      return WORK_ORDERS.filter(o => o.requestedBy === 'REQ1')
    case 'wh_per':
      return WORK_ORDERS.filter(o => o.assignedTo === 'WH1')
    case 'dsp_per':
      return WORK_ORDERS.filter(o => o.assignedTo === 'DP1')
    case 'qaqc':
      return WORK_ORDERS.filter(o =>
        ['Preload QAQC', 'Containerization', 'Post QAQC'].includes(o.stage)
      )
    case 'dsp_sup':
      return WORK_ORDERS.filter(o =>
        ['Dispatch Queue', 'Dispatch Assigned', 'Preload QAQC', 'Containerization',
         'Post QAQC', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace'].includes(o.stage)
      )
    default:
      return WORK_ORDERS
  }
}

export function getPersonnelByDept(dept: PersonnelDept): Personnel[] {
  return PERSONNEL.filter(p => p.dept === dept)
}

export function getSlaBreachedOrders(): WorkOrder[] {
  return WORK_ORDERS.filter(o => {
    const slaH = STAGE_SLA_HOURS[o.stage]
    return slaH != null && o.elapsedHours > slaH
  })
}

export function sortNewestFirst(orders: WorkOrder[]): WorkOrder[] {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// ─── Vessel ───────────────────────────────────────────────────────────────────

export type VesselStatus = 'available' | 'loading' | 'full' | 'in-transit' | 'arrived'

export interface Vessel {
  id: string
  name: string
  status: VesselStatus
  port: string
  destination: string
  departure: string
  allocatedUnits: number
  capacityUnits: number
}

export const VESSELS: Vessel[] = [
  {
    id: 'VSL-001', name: 'MV SEPLAT PRIDE',
    status: 'loading', port: 'Warri Port', destination: 'Bonga FPSO',
    departure: '28 Jun 08:00', allocatedUnits: 306, capacityUnits: 479,
  },
  {
    id: 'VSL-002', name: 'MV DELTA EAGLE',
    status: 'available', port: 'Warri Port', destination: 'Agbami FPSO',
    departure: '30 Jun 06:00', allocatedUnits: 120, capacityUnits: 350,
  },
  {
    id: 'VSL-003', name: 'MV NIGER CROWN',
    status: 'available', port: 'Port Harcourt', destination: 'Forcados Terminal',
    departure: '03 Jul 09:00', allocatedUnits: 0, capacityUnits: 420,
  },
  {
    id: 'VSL-004', name: 'MV OGUN STAR',
    status: 'available', port: 'Warri Port', destination: 'Escravos Terminal',
    departure: '07 Jul 07:00', allocatedUnits: 88, capacityUnits: 310,
  },
  {
    id: 'VSL-005', name: 'MV ESCRAVOS STAR',
    status: 'in-transit', port: 'Warri Port', destination: 'Escravos Terminal',
    departure: '22 Jun 07:00', allocatedUnits: 479, capacityUnits: 479,
  },
]

// ─── Truck ────────────────────────────────────────────────────────────────────

export interface Truck {
  id: string
  plateNumber: string
  driver: string
  status: 'available' | 'in-use' | 'maintenance'
  yard: string
  destination?: string
  workOrderIds: string[]
  notes?: string
}

export const TRUCKS: Truck[] = [
  {
    id: 'TRK-001', plateNumber: 'LSD-445-XY', driver: 'Emeka Trucks Ltd',
    status: 'in-use', yard: 'Gate A', destination: 'Bonga FPSO',
    workOrderIds: ['WO-0042', 'WO-0058'],
  },
  {
    id: 'TRK-002', plateNumber: 'ABJ-221-QZ', driver: 'Delta Transport Co.',
    status: 'available', yard: 'Gate B',
    workOrderIds: [],
  },
  {
    id: 'TRK-003', plateNumber: 'PHC-887-KA', driver: 'Riverside Haulage',
    status: 'available', yard: 'Gate A',
    workOrderIds: [],
    notes: 'Available from 14:00',
  },
  {
    id: 'TRK-004', plateNumber: 'EKP-334-LB', driver: 'Chukwu Logistics',
    status: 'maintenance', yard: 'Workshop',
    workOrderIds: [],
    notes: 'Gearbox replacement — returns 01 Jul',
  },
]

// ─── OrgUser ──────────────────────────────────────────────────────────────────

export interface OrgUser {
  id: string
  name: string
  email: string
  role: string
  dept: string
  status: 'active' | 'invited' | 'suspended'
  joinedAt: string
}

export const ORG_USERS: OrgUser[] = [
  { id: 'U001', name: 'Yinka Adeyemi',    email: 'yinka.adeyemi@seplat.com',    role: 'Warehouse Supervisor', dept: 'warehouse', status: 'active',    joinedAt: '12 Jan 2026' },
  { id: 'U002', name: 'Emeka Okonkwo',    email: 'emeka.okonkwo@seplat.com',    role: 'Warehouse Personnel',  dept: 'warehouse', status: 'active',    joinedAt: '15 Jan 2026' },
  { id: 'U003', name: 'Chika Obi',        email: 'chika.obi@seplat.com',        role: 'Dispatch Supervisor',  dept: 'dispatch',  status: 'active',    joinedAt: '18 Jan 2026' },
  { id: 'U004', name: 'Biodun Adekunle',  email: 'biodun.adekunle@seplat.com',  role: 'Dispatch Personnel',   dept: 'dispatch',  status: 'active',    joinedAt: '20 Jan 2026' },
  { id: 'U005', name: 'Femi Emmanuel',    email: 'femi.emmanuel@seplat.com',    role: 'QAQC Officer',         dept: 'qaqc',      status: 'active',    joinedAt: '22 Jan 2026' },
  { id: 'U006', name: 'Danjuma Yusuf',    email: 'danjuma.yusuf@seplat.com',    role: 'Logistics Coordinator',dept: 'logistics', status: 'active',    joinedAt: '25 Jan 2026' },
  { id: 'U007', name: 'Kenneth Nwosu',    email: 'kenneth.nwosu@seplat.com',    role: 'Requester',            dept: 'operations',status: 'active',    joinedAt: '01 Feb 2026' },
  { id: 'U008', name: 'Grace Okonkwo',    email: 'grace.okonkwo@seplat.com',    role: 'Warehouse Personnel',  dept: 'warehouse', status: 'invited',   joinedAt: '10 Mar 2026' },
  { id: 'U009', name: 'Akin Babatunde',   email: 'akin.babatunde@seplat.com',   role: 'Requester',            dept: 'maintenance',status: 'invited',  joinedAt: '15 Mar 2026' },
  { id: 'U010', name: 'Ngozi Eze',        email: 'ngozi.eze@seplat.com',        role: 'Warehouse Supervisor', dept: 'warehouse', status: 'suspended', joinedAt: '05 Dec 2025' },
]
