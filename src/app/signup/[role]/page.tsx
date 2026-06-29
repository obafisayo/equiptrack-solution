'use client'
import { redirect } from 'next/navigation'

// Signup is now a waitlist application - redirect all role-specific paths
export default function SignupRedirect() {
  redirect('/waitlist')
}
