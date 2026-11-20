import { auth } from '@/lib/auth/server'

// Same-origin proxy to Neon Auth: sign-up, sign-in, OTP, sessions, social login.
export const { GET, POST, PUT, PATCH, DELETE } = auth.handler()
