import type { VesselStatus } from '@/lib/mock-data'
import type { EventType } from './types'

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
export const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
export const DAYS_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export const DEPT_CFG: Record<string, { bar: string; text: string }> = {
  DRILL:   { bar: 'bg-yellow-500', text: 'text-yellow-700' },
  FOPS:    { bar: 'bg-green-500',  text: 'text-green-700'  },
  ECP:     { bar: 'bg-blue-500',   text: 'text-blue-700'   },
  PROJECT: { bar: 'bg-teal-500',   text: 'text-teal-700'   },
  TECHLOG: { bar: 'bg-pink-500',   text: 'text-pink-700'   },
}

export const VST_CFG: Record<VesselStatus, { label: string; badge: string; bar: string }> = {
  available:    { label: 'Available',  badge: 'bg-green-50 text-green-700 border border-green-200', bar: 'bg-green-500' },
  loading:      { label: 'Loading',    badge: 'bg-amber-50 text-amber-700 border border-amber-200', bar: 'bg-amber-500' },
  full:         { label: 'Full',       badge: 'bg-red-50 text-red-700 border border-red-200',       bar: 'bg-red-500'   },
  'in-transit': { label: 'In Transit', badge: 'bg-blue-50 text-blue-700 border border-blue-200',    bar: 'bg-blue-500'  },
  arrived:      { label: 'Arrived',    badge: 'bg-gray-50 text-gray-600 border border-gray-200',    bar: 'bg-gray-400'  },
}

export const EVT_CHIP: Record<EventType, string> = {
  Departure: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  Arrival:   'bg-blue-100  text-blue-800  hover:bg-blue-200',
}

export const COMMON_PORTS = [
  'Warri Port','Port Harcourt','Escravos Terminal','Bonga FPSO',
  'Agbami FPSO','Erha FPSO','Forcados Terminal','Lagos Apapa',
].map(v => ({ value: v, label: v }))

export const TODAY_ISO = '2026-06-28'
export const TODAY     = new Date('2026-06-28T00:00:00')
