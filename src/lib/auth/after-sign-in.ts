'use client'

import { isRole, ROLE_ROUTE } from '@/lib/domain/roles'
import { setSessionRole, clearSessionRole } from '@/lib/session'
import { ApiError } from '@/lib/api/client'
import { clearCurrentUserCache, loadCurrentUser } from '@/hooks/useCurrentUser'

/**
 * Decides where a freshly signed-in user goes. The role comes from the API
 * (organization_members), never from the browser. The browser copy written by
 * setSessionRole only drives navigation chrome; every API call is re-authorised.
 */
export async function destinationAfterSignIn(): Promise<string> {
  clearCurrentUserCache()
  try {
    const me = await loadCurrentUser()

    if (me.role && isRole(me.role)) {
      if (me.role === 'org_admin') {
        clearSessionRole()
        const slug = me.memberships.find(m => m.organizationId === me.activeOrganizationId)?.organizationSlug
        return slug ? `/${slug}/admin` : '/auth/pending'
      }
      setSessionRole(me.role)
      return ROLE_ROUTE[me.role]
    }

    if (me.isSysadmin) {
      setSessionRole('sysadmin')
      return '/sysadmin'
    }
    if (me.memberships.length > 1) return '/auth/pending?reason=multiple'
    return '/auth/pending'
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      return /verify/i.test(err.message) ? '/auth/verify' : '/auth/pending'
    }
    throw err
  }
}
