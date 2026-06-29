'use client'

import { use } from 'react'
import { Check, Minus } from 'lucide-react'
import type { OrgRole, Permission } from '@/lib/types'
import { getDefaultPermissions } from '@/lib/permissions'

/* ── Config ───────────────────────────────────────────────────────────────── */

const ROLES: { role: OrgRole; label: string; dept: string; color: string }[] = [
  { role: 'org_admin',             label: 'Org Admin',        dept: 'Admin',      color: '#F04A4A' },
  { role: 'requester',             label: 'Requester',        dept: 'Field',      color: '#3B82F6' },
  { role: 'wh_supervisor',         label: 'WH Supervisor',    dept: 'Warehouse',  color: '#3B82F6' },
  { role: 'wh_personnel',          label: 'WH Personnel',     dept: 'Warehouse',  color: '#3B82F6' },
  { role: 'dsp_supervisor',        label: 'DSP Supervisor',   dept: 'Dispatch',   color: '#8B5CF6' },
  { role: 'dsp_personnel',         label: 'DSP Personnel',    dept: 'Dispatch',   color: '#8B5CF6' },
  { role: 'qaqc_officer',          label: 'QAQC Officer',     dept: 'QAQC',       color: '#F59E0B' },
  { role: 'exec_viewer',           label: 'Exec Viewer',      dept: 'Executive',  color: '#10B981' },
  { role: 'safety_officer',        label: 'Safety Officer',   dept: 'Safety',     color: '#EF4444' },
  { role: 'logistics_coordinator', label: 'Logistics Coord.', dept: 'Logistics',  color: '#F97316' },
  { role: 'inventory_manager',     label: 'Inventory Mgr',    dept: 'Inventory',  color: '#06B6D4' },
]

interface PermGroup {
  label: string
  permissions: { key: Permission; label: string }[]
}

const PERM_GROUPS: PermGroup[] = [
  {
    label: 'Work Orders',
    permissions: [
      { key: 'workorders:read',    label: 'View work orders'   },
      { key: 'workorders:write',   label: 'Create / edit'      },
      { key: 'workorders:approve', label: 'Approve orders'     },
      { key: 'workorders:close',   label: 'Close orders'       },
    ],
  },
  {
    label: 'Users',
    permissions: [
      { key: 'users:read',    label: 'View team'       },
      { key: 'users:invite',  label: 'Invite members'  },
      { key: 'users:suspend', label: 'Suspend members' },
    ],
  },
  {
    label: 'Organisation',
    permissions: [
      { key: 'org:read',  label: 'View org settings'  },
      { key: 'org:write', label: 'Edit org settings'  },
    ],
  },
  {
    label: 'Reports & Billing',
    permissions: [
      { key: 'reports:read',   label: 'View reports'   },
      { key: 'reports:export', label: 'Export reports' },
      { key: 'billing:read',   label: 'View billing'   },
    ],
  },
  {
    label: 'Configuration',
    permissions: [
      { key: 'sla:configure', label: 'Configure SLA'  },
      { key: 'sso:configure', label: 'Configure SSO'  },
      { key: 'audit:read',    label: 'View audit log' },
    ],
  },
]

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function RolesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  use(params)

  const rolePerms: Record<OrgRole, Set<Permission>> = {} as Record<OrgRole, Set<Permission>>
  for (const { role } of ROLES) {
    rolePerms[role] = new Set(getDefaultPermissions(role) as Permission[])
  }

  const DEPT_COLORS: Record<string, string> = {
    Admin: '#F04A4A', Field: '#3B82F6', Warehouse: '#3B82F6',
    Dispatch: '#8B5CF6', QAQC: '#F59E0B', Executive: '#10B981',
    Safety: '#EF4444', Logistics: '#F97316', Inventory: '#06B6D4',
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="bg-white rounded-card border border-border-default p-4"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
          This matrix shows the default permissions for each role. Permissions are read-only —
          contact your Equiptrack account manager to request custom role configurations.
        </p>
      </div>

      {/* Matrix */}
      <div className="bg-white rounded-card border border-border-default overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {/* overflow-x-auto only — vertical scroll comes from the page shell */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ fontSize: 12, borderCollapse: 'collapse', minWidth: 960, width: '100%', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: 200 }} />
              {ROLES.map(r => <col key={r.role} style={{ width: 90 }} />)}
            </colgroup>

            {/* ── Sticky header row ── */}
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E2E8F0' }}>
                {/* Corner cell — sticky both left and top */}
                <th style={{
                  padding: '12px 16px', textAlign: 'left',
                  position: 'sticky', left: 0, top: 0, zIndex: 30,
                  background: '#F9FAFB',
                  fontSize: 11, fontWeight: 700, color: '#6B7280',
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  borderRight: '1px solid #E2E8F0',
                  boxShadow: '1px 0 0 #E2E8F0',
                }}>
                  Permission
                </th>
                {ROLES.map(r => (
                  <th key={r.role} style={{
                    padding: '10px 8px', textAlign: 'center',
                    position: 'sticky', top: 0, zIndex: 20,
                    background: '#F9FAFB',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 9999,
                        background: DEPT_COLORS[r.dept] + '18',
                        color: DEPT_COLORS[r.dept],
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        whiteSpace: 'nowrap',
                      }}>
                        {r.dept}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#111827' }}>{r.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {PERM_GROUPS.map((group, gi) => (
                <>
                  {/* Group header — first cell is sticky-left, rest are empty filler */}
                  <tr key={`group-${gi}`} style={{ background: '#F1F5F9' }}>
                    <td style={{
                      padding: '7px 16px',
                      position: 'sticky', left: 0, zIndex: 10,
                      background: '#F1F5F9',
                      fontSize: 11, fontWeight: 700, color: '#64748B',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0',
                      boxShadow: '1px 0 0 #E2E8F0',
                    }}>
                      {group.label}
                    </td>
                    {ROLES.map(r => (
                      <td key={r.role} style={{
                        borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0',
                        background: '#F1F5F9',
                      }} />
                    ))}
                  </tr>

                  {/* Permission rows */}
                  {group.permissions.map((perm) => (
                    <tr
                      key={perm.key}
                      style={{ borderBottom: '1px solid #F3F4F6' }}
                      onMouseEnter={e => {
                        const row = e.currentTarget as HTMLElement
                        row.style.background = '#F9FAFB'
                        const stickyCell = row.querySelector('td[data-sticky]') as HTMLElement | null
                        if (stickyCell) stickyCell.style.background = '#F9FAFB'
                      }}
                      onMouseLeave={e => {
                        const row = e.currentTarget as HTMLElement
                        row.style.background = ''
                        const stickyCell = row.querySelector('td[data-sticky]') as HTMLElement | null
                        if (stickyCell) stickyCell.style.background = '#fff'
                      }}
                    >
                      <td data-sticky="true" style={{
                        padding: '10px 16px',
                        position: 'sticky', left: 0, zIndex: 5,
                        background: '#fff',
                        borderRight: '1px solid #E2E8F0',
                        boxShadow: '1px 0 0 #E2E8F0',
                        fontSize: 12, color: '#374151', fontWeight: 500,
                      }}>
                        {perm.label}
                        <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 1 }}>
                          {perm.key}
                        </div>
                      </td>
                      {ROLES.map(r => {
                        const has = rolePerms[r.role].has(perm.key)
                        return (
                          <td key={r.role} style={{ padding: '10px 8px', textAlign: 'center' }}>
                            {has ? (
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 20, height: 20, borderRadius: '50%',
                                background: '#F0FDF4',
                              }}>
                                <Check size={11} color="#16A34A" strokeWidth={2.5} />
                              </div>
                            ) : (
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: 20, height: 20, borderRadius: '50%',
                                background: '#F9FAFB',
                              }}>
                                <Minus size={11} color="#D1D5DB" />
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%', background: '#F0FDF4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Check size={10} color="#16A34A" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 12, color: '#374151' }}>Permitted</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%', background: '#F9FAFB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Minus size={10} color="#D1D5DB" />
          </div>
          <span style={{ fontSize: 12, color: '#374151' }}>Not permitted</span>
        </div>
      </div>
    </div>
  )
}
