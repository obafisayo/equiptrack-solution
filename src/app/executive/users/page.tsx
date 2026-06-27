'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Plus, Users, Search, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { PERSONNEL } from '@/lib/mock-data'

export default function UserManagementPage() {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [search, setSearch] = useState('')

  const filteredPersonnel = PERSONNEL.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()))

  return (
    <AppShell
      role="exec"
      currentPath="/executive/users"
      title="User Management"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Executive', href: '/executive' }, { label: 'Users' }]}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900 m-0 tracking-tight">Organization Users</h1>
          <p className="text-sm text-neutral-500 mt-1 m-0">Manage roles, access, and onboarding for your team.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowInviteModal(true)}
            className="bg-[#0078D4] hover:bg-[#005A9E] text-white text-sm font-semibold px-4 py-2 rounded-button flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f3f3f3" d="M0 0h21v21H0z"/>
              <path fill="#f35325" d="M1 1h9v9H1z"/>
              <path fill="#81bc06" d="M11 1h9v9h-9z"/>
              <path fill="#05a6f0" d="M1 11h9v9H1z"/>
              <path fill="#ffba08" d="M11 11h9v9h-9z"/>
            </svg>
            Sync with Microsoft Entra
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-button flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Invite User
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white rounded-card border border-border-default shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input 
            type="text"
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-border-default rounded-md text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
        <select className="bg-neutral-50 border border-border-default rounded-md text-sm text-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20">
          <option value="all">All Departments</option>
          <option value="warehouse">Warehouse</option>
          <option value="dispatch">Dispatch</option>
          <option value="qaqc">QAQC</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-card border border-border-default shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-border-default">
            <tr>
              {['Name', 'Role / Department', 'Status', 'SSO Link', 'Actions'].map((h, i) => (
                <th key={i} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {filteredPersonnel.map((user, i) => (
              <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-brand-500">
                        {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{user.name}</div>
                      <div className="text-xs text-neutral-500">{user.name.toLowerCase().replace(' ', '.')}@equiptrack.io</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm font-medium text-neutral-900 capitalize">{user.role.replace('_', ' ')}</div>
                  <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-0.5">{user.dept}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="bg-status-success-bg text-status-success text-[10px] font-bold px-2 py-0.5 rounded-badge uppercase">
                    Active
                  </span>
                </td>
                <td className="px-5 py-4">
                  {i % 3 === 0 ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                      <Mail size={14} className="text-neutral-400" />
                      Email Invite
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#0078D4]">
                      <svg width="14" height="14" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#f3f3f3" d="M0 0h21v21H0z"/><path fill="#f35325" d="M1 1h9v9H1z"/><path fill="#81bc06" d="M11 1h9v9h-9z"/><path fill="#05a6f0" d="M1 11h9v9H1z"/><path fill="#ffba08" d="M11 11h9v9h-9z"/>
                      </svg>
                      Microsoft Entra
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right sm:text-left">
                  <button className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors">Edit</button>
                  <span className="mx-2 text-border-default">|</span>
                  <button className="text-xs font-semibold text-status-critical hover:text-red-700 transition-colors">Revoke</button>
                </td>
              </tr>
            ))}
            {filteredPersonnel.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-neutral-500 text-sm">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* INVITE MODAL MOCKUP */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-overlay max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-border-default flex justify-between items-center">
              <h3 className="font-bold text-neutral-900 text-lg m-0">Onboard Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">&times;</button>
            </div>
            
            <div className="p-5 space-y-4">
              <button className="w-full flex items-center justify-center gap-3 bg-white border border-[#0078D4] hover:bg-[#0078D4]/5 text-[#0078D4] font-semibold py-3 rounded-button transition-colors">
                <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#f3f3f3" d="M0 0h21v21H0z"/><path fill="#f35325" d="M1 1h9v9H1z"/><path fill="#81bc06" d="M11 1h9v9h-9z"/><path fill="#05a6f0" d="M1 11h9v9H1z"/><path fill="#ffba08" d="M11 11h9v9h-9z"/>
                </svg>
                Sync User from Microsoft Entra ID
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border-default" />
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Or invite via email</span>
                <div className="flex-1 h-px bg-border-default" />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input type="email" placeholder="jane.doe@company.com" className="w-full px-3 py-2 bg-neutral-50 border border-border-default rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Assign Role</label>
                <select className="w-full px-3 py-2 bg-neutral-50 border border-border-default rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                  <option>Warehouse Supervisor</option>
                  <option>Warehouse Personnel</option>
                  <option>Dispatch Supervisor</option>
                  <option>Dispatch Personnel</option>
                  <option>QAQC Officer</option>
                </select>
              </div>

              <div className="bg-status-info-bg border border-status-info/20 rounded-md p-3 flex gap-2.5 mt-2">
                <ShieldAlert className="text-status-info shrink-0" size={16} />
                <p className="text-xs text-status-info m-0">This user will be required to log in using the organization's SSO policy if enforced.</p>
              </div>
            </div>

            <div className="p-4 border-t border-border-default bg-neutral-50 flex justify-end gap-3">
              <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowInviteModal(false)} className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-button text-sm font-semibold transition-colors shadow-sm">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
