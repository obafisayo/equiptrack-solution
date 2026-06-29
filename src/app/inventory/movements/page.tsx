'use client'
import { redirect } from 'next/navigation'
export default function InventoryMovementsRedirect() {
  redirect('/inventory?tab=movements')
}
