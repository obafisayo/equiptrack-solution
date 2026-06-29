'use client'
import { redirect } from 'next/navigation'

// Role-specific login pages are consolidated into /login
export default function RoleLoginRedirect() {
  redirect('/login')
}
