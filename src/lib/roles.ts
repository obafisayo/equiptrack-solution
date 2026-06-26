export interface RoleMeta {
  slug: string
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

export const ROLE_META: Record<string, RoleMeta> = {
  requester: {
    slug: 'requester',
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
  'warehouse-supervisor': {
    slug: 'warehouse-supervisor',
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
  'warehouse-personnel': {
    slug: 'warehouse-personnel',
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
  'dispatch-supervisor': {
    slug: 'dispatch-supervisor',
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
  'dispatch-personnel': {
    slug: 'dispatch-personnel',
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
  'qaqc-officer': {
    slug: 'qaqc-officer',
    label: 'QAQC Officer',
    shortLabel: 'QAQC',
    dept: 'Quality & Compliance',
    deptColor: '#F59E0B',
    description: 'Conduct quality inspections, manage container fleet, and enforce compliance standards.',
    capabilities: [
      'Pre-load and post-load QAQC inspections',
      'Manage container inventory and status',
      'Log inspection results and flags',
      'Non-compliance tracking and reporting',
    ],
    demoEmail: 'femi.emmanuel@demo.equiptrack.io',
    demoPassword: 'Qaqc#Demo2024',
    dashboardPath: '/qaqc',
  },
  executive: {
    slug: 'executive',
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
}

export const ROLE_LIST = Object.values(ROLE_META)
