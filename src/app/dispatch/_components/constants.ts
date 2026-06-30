import { type Stage } from '@/lib/lifecycle'

export const DISPATCH_STAGES: Stage[] = [
  'Dispatch Queue', 'Dispatch Assigned', 'Preload QAQC',
  'Containerization', 'Post QAQC', 'Waybill Pending Signature',
  'Waybill Done', 'Awaiting Deckspace',
]

export type MainTab = 'Queue' | 'Personnel Tasks'
export const QUEUE_SUBTABS = ['Dispatch Queue', 'Assigned', 'QAQC', 'Waybill', 'Deckspace'] as const
export type QueueSubTab = typeof QUEUE_SUBTABS[number]

export const QUEUE_STAGE_MAP: Record<QueueSubTab, Stage[]> = {
  'Dispatch Queue': ['Dispatch Queue'],
  'Assigned':       ['Dispatch Assigned'],
  'QAQC':           ['Preload QAQC', 'Containerization', 'Post QAQC'],
  'Waybill':        ['Waybill Pending Signature', 'Waybill Done'],
  'Deckspace':      ['Awaiting Deckspace'],
}

export const PERSONNEL_STAGES: Stage[] = ['Dispatch Assigned', 'Containerization', 'Waybill Pending Signature', 'Waybill Done', 'Awaiting Deckspace']
