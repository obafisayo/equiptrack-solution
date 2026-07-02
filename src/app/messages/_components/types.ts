export type MessageStatus = 'sent' | 'delivered' | 'read'
export type NotificationChannel = 'in-app' | 'email' | 'whatsapp'
export type ConversationType = 'direct' | 'contractor' | 'system' | 'group'

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: string
  body: string
  timestamp: string
  status: MessageStatus
  attachments?: { name: string; size: string; type: 'pdf' | 'image' | 'doc' }[]
  isSystem?: boolean
}

export interface Conversation {
  id: string
  type: ConversationType
  participantId: string
  participantName: string
  participantRole: string
  participantDept?: string
  lastMessage: string
  lastTimestamp: string
  unreadCount: number
  messages: ChatMessage[]
  avatarInitials?: string
  avatarColor?: string
  linkedOrderId?: string
  linkedRequestId?: string
}

export interface AppNotification {
  id: string
  type: 'order_update' | 'sla_breach' | 'new_message' | 'contractor_response' | 'assignment' | 'system'
  title: string
  body: string
  timestamp: string
  read: boolean
  href?: string
  channels: NotificationChannel[]
  emailSent?: boolean
  whatsappSent?: boolean
}

export const AVATAR_COLORS: Record<string, string> = {
  warehouse: '#10B981',
  dispatch:  '#8B5CF6',
  qaqc:      '#F59E0B',
  exec:      '#F04A4A',
  contractor: '#94A3B8',
  system:    '#64748B',
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

const NOW = new Date('2026-07-01T09:00:00Z')
function ago(mins: number) { return new Date(NOW.getTime() - mins * 60000).toISOString() }

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    type: 'direct',
    participantId: 'WH1',
    participantName: 'Emeka Okonkwo',
    participantRole: 'Senior Warehouse Officer',
    participantDept: 'warehouse',
    lastMessage: 'The GI for DEL-24-1301 has been created.',
    lastTimestamp: ago(5),
    unreadCount: 2,
    avatarInitials: 'EO',
    avatarColor: '#10B981',
    messages: [
      { id: 'm1', conversationId: 'conv-001', senderId: 'WH1', senderName: 'Emeka Okonkwo', senderRole: 'Warehouse', body: 'Morning — can you confirm the priority on DEL-24-1301?', timestamp: ago(25), status: 'read' },
      { id: 'm2', conversationId: 'conv-001', senderId: 'ME',  senderName: 'You',            senderRole: 'Exec', body: 'High priority — Bonga FPSO is waiting on that valve. Please fast-track.', timestamp: ago(20), status: 'read' },
      { id: 'm3', conversationId: 'conv-001', senderId: 'WH1', senderName: 'Emeka Okonkwo', senderRole: 'Warehouse', body: 'Understood. Moving it to the front of the picking queue now.', timestamp: ago(15), status: 'read' },
      { id: 'm4', conversationId: 'conv-001', senderId: 'WH1', senderName: 'Emeka Okonkwo', senderRole: 'Warehouse', body: 'The GI for DEL-24-1301 has been created.', timestamp: ago(5), status: 'delivered' },
    ],
  },
  {
    id: 'conv-002',
    type: 'contractor',
    participantId: 'CONT-001',
    participantName: 'Apex Offshore Ltd',
    participantRole: 'CCU Contractor',
    participantDept: 'contractor',
    lastMessage: 'We can provide 3× Dry Cargo Baskets. Serials: AO-7841, AO-7842, AO-7843.',
    lastTimestamp: ago(38),
    unreadCount: 1,
    avatarInitials: 'AO',
    avatarColor: '#94A3B8',
    linkedRequestId: 'REQ-CCU-2026-002',
    messages: [
      { id: 'm5', conversationId: 'conv-002', senderId: 'ME', senderName: 'You', senderRole: 'QAQC Officer', body: 'Dear Apex Offshore Ltd,\n\nWe at TotalEnergies require the following CCU containers:\n- 3× Dry Cargo Basket\n\nPlease confirm availability and provide serial numbers for each unit.\n\nRegards,\nOperations Team', timestamp: ago(120), status: 'read', isSystem: false },
      { id: 'm6', conversationId: 'conv-002', senderId: 'CONT-001', senderName: 'Apex Offshore Ltd', senderRole: 'Contractor', body: 'We can provide 3× Dry Cargo Baskets. Serials: AO-7841, AO-7842, AO-7843.', timestamp: ago(38), status: 'delivered' },
    ],
  },
  {
    id: 'conv-003',
    type: 'direct',
    participantId: 'DP1',
    participantName: 'Biodun Adekunle',
    participantRole: 'Senior Dispatch Officer',
    participantDept: 'dispatch',
    lastMessage: 'Waybill signed for CNT-002. Ready to request deckspace.',
    lastTimestamp: ago(62),
    unreadCount: 0,
    avatarInitials: 'BA',
    avatarColor: '#8B5CF6',
    linkedOrderId: 'DEL-24-1301',
    messages: [
      { id: 'm7', conversationId: 'conv-003', senderId: 'DP1', senderName: 'Biodun Adekunle', senderRole: 'Dispatch', body: 'Container CNT-002 is containerized. Preload QAQC cleared.', timestamp: ago(90), status: 'read' },
      { id: 'm8', conversationId: 'conv-003', senderId: 'ME', senderName: 'You', senderRole: 'Exec', body: 'Proceed with waybill and get deckspace booked ASAP.', timestamp: ago(75), status: 'read' },
      { id: 'm9', conversationId: 'conv-003', senderId: 'DP1', senderName: 'Biodun Adekunle', senderRole: 'Dispatch', body: 'Waybill signed for CNT-002. Ready to request deckspace.', timestamp: ago(62), status: 'read' },
    ],
  },
  {
    id: 'conv-004',
    type: 'system',
    participantId: 'SYSTEM',
    participantName: 'System Notifications',
    participantRole: 'Automated',
    participantDept: 'system',
    lastMessage: 'SLA breach: DEL-24-1288 has been in Dispatch Assigned for 19h (SLA: 12h).',
    lastTimestamp: ago(10),
    unreadCount: 3,
    avatarInitials: 'SN',
    avatarColor: '#64748B',
    messages: [
      { id: 'm10', conversationId: 'conv-004', senderId: 'SYSTEM', senderName: 'System', senderRole: 'Automated', body: 'New work order DEL-24-1320 submitted — High urgency, Bonga FPSO.', timestamp: ago(180), status: 'read', isSystem: true },
      { id: 'm11', conversationId: 'conv-004', senderId: 'SYSTEM', senderName: 'System', senderRole: 'Automated', body: 'SLA warning: DEL-24-1315 is at 85% of stage SLA.', timestamp: ago(45), status: 'read', isSystem: true },
      { id: 'm12', conversationId: 'conv-004', senderId: 'SYSTEM', senderName: 'System', senderRole: 'Automated', body: 'SLA breach: DEL-24-1288 has been in Dispatch Assigned for 19h (SLA: 12h).', timestamp: ago(10), status: 'delivered', isSystem: true },
    ],
  },
  {
    id: 'conv-005',
    type: 'contractor',
    participantId: 'CONT-002',
    participantName: 'Delta Marine Containers',
    participantRole: 'CCU Contractor',
    participantDept: 'contractor',
    lastMessage: 'Can you resend the payment reference for invoice INV-2026-0041?',
    lastTimestamp: ago(1440),
    unreadCount: 1,
    avatarInitials: 'DM',
    avatarColor: '#94A3B8',
    messages: [
      { id: 'm13', conversationId: 'conv-005', senderId: 'CONT-002', senderName: 'Delta Marine', senderRole: 'Contractor', body: 'Can you resend the payment reference for invoice INV-2026-0041?', timestamp: ago(1440), status: 'delivered' },
    ],
  },
  {
    id: 'conv-006',
    type: 'direct',
    participantId: 'QA1',
    participantName: 'Femi Emmanuel',
    participantRole: 'Senior QAQC Inspector',
    participantDept: 'qaqc',
    lastMessage: 'Container AO-7841 passed inspection. Billing started.',
    lastTimestamp: ago(2160),
    unreadCount: 0,
    avatarInitials: 'FE',
    avatarColor: '#F59E0B',
    messages: [
      { id: 'm14', conversationId: 'conv-006', senderId: 'QA1', senderName: 'Femi Emmanuel', senderRole: 'QAQC', body: 'Container AO-7841 passed inspection. Billing started.', timestamp: ago(2160), status: 'read' },
    ],
  },
]

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'notif-001', type: 'sla_breach', title: 'SLA Breach', body: 'DEL-24-1288 has exceeded dispatch SLA by 7h', timestamp: ago(10), read: false, href: '/dispatch', channels: ['in-app', 'email', 'whatsapp'], emailSent: true, whatsappSent: true },
  { id: 'notif-002', type: 'contractor_response', title: 'Contractor Response', body: 'Apex Offshore Ltd responded to CCU request REQ-CCU-2026-002', timestamp: ago(38), read: false, href: '/qaqc/ccu-requests', channels: ['in-app', 'email'], emailSent: true, whatsappSent: false },
  { id: 'notif-003', type: 'new_message', title: 'New Message', body: 'Emeka Okonkwo: "The GI for DEL-24-1301 has been created."', timestamp: ago(5), read: false, href: '/messages', channels: ['in-app'], emailSent: false, whatsappSent: false },
  { id: 'notif-004', type: 'order_update', title: 'Order Shipped', body: 'DEL-24-1275 departed on MV Eko Phoenix — ETA 14h', timestamp: ago(120), read: true, href: '/dispatch', channels: ['in-app', 'whatsapp'], emailSent: false, whatsappSent: true },
  { id: 'notif-005', type: 'assignment', title: 'Task Assigned', body: 'You have been assigned DEL-24-1312 for inspection', timestamp: ago(240), read: true, href: '/qaqc', channels: ['in-app', 'email'], emailSent: true, whatsappSent: false },
]
