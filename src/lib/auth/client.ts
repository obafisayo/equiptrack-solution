'use client'

import { createAuthClient } from '@neon/auth/next'

/** Browser auth client. Talks to this app's /api/auth proxy (same origin), not to Neon directly. */
export const authClient = createAuthClient()
