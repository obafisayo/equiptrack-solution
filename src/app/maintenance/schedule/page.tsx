'use client'
import { redirect } from 'next/navigation'
export default function MaintenanceScheduleRedirect() {
  redirect('/maintenance?tab=schedule')
}
