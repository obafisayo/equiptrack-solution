'use client'

import type { VesselStatus } from '@/lib/mock-data'

export type EventType = 'Departure' | 'Arrival'
export type CalView = 'Day' | 'Week' | 'Month'

export interface VesselEvent {
  id: string
  vesselId: string
  vesselName: string
  type: EventType
  date: string
  time: string
  port: string
  destination: string
  capacitySqM: number
  bookedSqM: number
  distribution: { dept: string; units: number }[]
  status: VesselStatus
  pic: string
  notes?: string
}
