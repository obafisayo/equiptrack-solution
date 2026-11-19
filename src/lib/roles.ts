import type { WorkspaceRole } from '@/lib/domain/roles'

/** Demo-login metadata per role. Keyed by the canonical role code. */
export interface RoleMeta {
  role: WorkspaceRole
  label: string
  shortLabel: string
  dept: string
  deptColor: string
  description: string
  capabilities: [string, string, string, string]
  demoEmail: string
  demoPassword: string
  dashboardPath: string
}

export const ROLE_META: Partial<Record<WorkspaceRole, RoleMeta>> = {
  requester: {
    role: 'requester',
    label: 'Requester',
    shortLabel: 'REQ',
    dept: 'Operations',
    deptColor: '#6366F1',
    description: 'Submit equipment requests and track their full lifecycle from creation to offshore delivery.',
    capabilities: [
      'Submit SAP, TR, and vendor requests',
      'Track real-time stage and SLA status',
      'View expected delivery timelines',
      'Access complete request history',
    ],
    demoEmail: 'amara.chukwu@demo.equiptrack.io',
    demoPassword: 'Req#Demo2024',
    dashboardPath: '/requester',
  },
  wh_sup: {
    role: 'wh_sup',
    label: 'Warehouse Supervisor',
    shortLabel: 'WH-SUP',
    dept: 'Warehouse',
    deptColor: '#3B82F6',
    description: 'Oversee all warehouse operations, assign personnel, and maintain SLA compliance.',
    capabilities: [
      'Assign orders to warehouse personnel',
      'Monitor team load and capacity',
      'Reverse incorrect stage transitions',
      'Full warehouse pipeline visibility',
    ],
    demoEmail: 'yinka.adeyemi@demo.equiptrack.io',
    demoPassword: 'WhSup#Demo2024',
    dashboardPath: '/warehouse',
  },
  wh_per: {
    role: 'wh_per',
    label: 'Warehouse Personnel',
    shortLabel: 'WH-PER',
    dept: 'Warehouse',
    deptColor: '#60A5FA',
    description: 'Execute warehouse tasks, advance orders through processing stages, and hand off to dispatch.',
    capabilities: [
      'View and action assigned orders',
      'Process picks and GI creation',
      'Advance orders through stages',
      'Track personal task history',
    ],
    demoEmail: 'emeka.okonkwo@demo.equiptrack.io',
    demoPassword: 'WhPer#Demo2024',
    dashboardPath: '/warehouse-personnel',
  },
  dsp_sup: {
    role: 'dsp_sup',
    label: 'Dispatch Supervisor',
    shortLabel: 'DSP-SUP',
    dept: 'Dispatch',
    deptColor: '#8B5CF6',
    description: 'Coordinate dispatch operations, manage QAQC queues, and oversee vessel loading.',
    capabilities: [
      'Manage dispatch queue and assignments',
      'Monitor QAQC and containerization',
      'Track waybill and deckspace status',
      'SLA breach alerts and escalation',
    ],
    demoEmail: 'chika.obi@demo.equiptrack.io',
    demoPassword: 'DspSup#Demo2024',
    dashboardPath: '/dispatch',
  },
  dsp_per: {
    role: 'dsp_per',
    label: 'Dispatch Personnel',
    shortLabel: 'DSP-PER',
    dept: 'Dispatch',
    deptColor: '#A78BFA',
    description: 'Handle container loading, waybill documentation, and final dispatch execution.',
    capabilities: [
      'Process assigned dispatch orders',
      'Complete containerization tasks',
      'Manage waybill documentation',
      'Advance to deckspace and shipping',
    ],
    demoEmail: 'tunde.bello@demo.equiptrack.io',
    demoPassword: 'DspPer#Demo2024',
    dashboardPath: '/dispatch-personnel',
  },
  qaqc: {
    role: 'qaqc',
    label: 'QAQC Officer',
    shortLabel: 'QAQC',
    dept: 'Quality & Compliance',
    deptColor: '#F59E0B',
    description: 'Conduct quality inspections, manage container fleet, inspect incoming deliveries, and enforce compliance standards.',
    capabilities: [
      'Pre-load and post-load QAQC inspections',
      'Inspect incoming vendor deliveries and record anomalies',
      'Manage container inventory and status',
      'Non-compliance tracking and reporting',
    ],
    demoEmail: 'femi.emmanuel@demo.equiptrack.io',
    demoPassword: 'Qaqc#Demo2024',
    dashboardPath: '/qaqc',
  },
  exec: {
    role: 'exec',
    label: 'Executive',
    shortLabel: 'EXEC',
    dept: 'Leadership',
    deptColor: '#10B981',
    description: 'Access strategic KPIs, bottleneck analysis, and performance dashboards across all operations.',
    capabilities: [
      'Executive KPI overview and trends',
      'Department bottleneck heatmap',
      'Supervisor performance analysis',
      'Cycle time and SLA compliance metrics',
    ],
    demoEmail: 'director.ops@demo.equiptrack.io',
    demoPassword: 'Exec#Demo2024',
    dashboardPath: '/executive',
  },
  site_return: {
    role: 'site_return',
    label: 'Site Return',
    shortLabel: 'RTN',
    dept: 'Offshore Operations',
    deptColor: '#14B8A6',
    description: 'Process and return completed equipment from site back to base, vendors, or other destinations.',
    capabilities: [
      'View completed orders delivered to site',
      'Categorize items by disposition and hazard class',
      'Group items into return containers',
      'Submit and track deckspace requests',
    ],
    demoEmail: 'tunde.site@demo.equiptrack.io',
    demoPassword: 'SiteRtn#Demo2024',
    dashboardPath: '/site-return',
  },
  logistics: {
    role: 'logistics',
    label: 'Vessel Coordinator',
    shortLabel: 'LOG',
    dept: 'Logistics',
    deptColor: '#0EA5E9',
    description: 'Coordinate vessel schedules, track offshore shipments, and manage port logistics operations.',
    capabilities: [
      'Monitor dispatch queue and vessel loads',
      'Coordinate offshore shipment timing',
      'Track deckspace allocation',
      'Manage port documentation',
    ],
    demoEmail: 'danjuma.yusuf@demo.equiptrack.io',
    demoPassword: 'Log#Demo2024',
    dashboardPath: '/logistics',
  },
  inventory: {
    role: 'inventory',
    label: 'Inventory Manager',
    shortLabel: 'INV',
    dept: 'Supply Chain',
    deptColor: '#F59E0B',
    description: 'Manage equipment stock levels, track reorder points, and oversee the full equipment catalog.',
    capabilities: [
      'Monitor stock levels and reorder alerts',
      'Manage equipment catalog and specs',
      'Track incoming and outgoing equipment',
      'Generate inventory utilisation reports',
    ],
    demoEmail: 'ngozi.eze@demo.equiptrack.io',
    demoPassword: 'Inv#Demo2024',
    dashboardPath: '/inventory',
  },
  maintenance: {
    role: 'maintenance',
    label: 'Maintenance Technician',
    shortLabel: 'MAINT',
    dept: 'Maintenance',
    deptColor: '#8B5CF6',
    description: 'Execute equipment maintenance tasks, log repair history, and report equipment condition status.',
    capabilities: [
      'View assigned maintenance tasks',
      'Log repair work and parts used',
      'Report equipment condition findings',
      'Track maintenance history per unit',
    ],
    demoEmail: 'segun.folarin@demo.equiptrack.io',
    demoPassword: 'Maint#Demo2024',
    dashboardPath: '/maintenance',
  },
  site_logistics: {
    role: 'site_logistics',
    label: 'Site Logistics',
    shortLabel: 'SITE-LOG',
    dept: 'Offshore Operations',
    deptColor: '#10B981',
    description: 'Manage return-to-base operations from offshore sites — raise manifests, request deckspace, and dispatch cargo.',
    capabilities: [
      'Initiate equipment returns to base',
      'Select cargo classification for DG goods',
      'Generate and approve return manifests',
      'Request vessel deckspace',
    ],
    demoEmail: 'chukwudi.eze@demo.equiptrack.io',
    demoPassword: 'SiteLog#Demo2024',
    dashboardPath: '/site-logistics',
  },
}

export const ROLE_LIST = Object.values(ROLE_META) as RoleMeta[]
