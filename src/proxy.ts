import { auth } from '@/lib/auth/server'

/**
 * Next.js 16 proxy (formerly middleware): workspace routes require a Neon Auth
 * session; anyone signed out is sent to /login. This only proves the visitor is
 * signed in — what they may see or do is decided by the API (roles in the DB).
 * Public pages (landing, waitlist, /login, /auth/*) are not matched at all.
 */
export default auth.middleware({ loginUrl: '/login' })

export const config = {
  matcher: [
    '/requester/:path*',
    '/warehouse/:path*',
    '/warehouse-personnel/:path*',
    '/dispatch/:path*',
    '/dispatch-personnel/:path*',
    '/qaqc/:path*',
    '/executive/:path*',
    '/safety/:path*',
    '/logistics/:path*',
    '/inventory/:path*',
    '/maintenance/:path*',
    '/site-logistics/:path*',
    '/site-return/:path*',
    '/sysadmin/:path*',
    '/messages/:path*',
    '/:orgSlug/admin/:path*',
  ],
}
