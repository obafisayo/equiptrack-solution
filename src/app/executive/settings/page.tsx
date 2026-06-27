'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Settings as SettingsIcon, Globe, Shield, Key, Building2, Bell, CheckCircle2, ChevronRight, Copy, Save } from 'lucide-react'

export default function OrgSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'sso' | 'sla' | 'api'>('sso')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AppShell
      role="exec"
      currentPath="/executive/settings"
      title="Organization Settings"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Executive', href: '/executive' }, { label: 'Settings' }]}
    >
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        
        {/* SIDEBAR TABS */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-border-default rounded-card overflow-hidden shadow-sm">
            <nav className="flex flex-col">
              <button 
                onClick={() => setActiveTab('general')}
                className={['flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors', activeTab === 'general' ? 'bg-brand-50 text-brand-500 border-l-4 border-brand-500' : 'text-neutral-600 hover:bg-neutral-50 border-l-4 border-transparent'].join(' ')}
              >
                <Building2 size={16} />
                General
              </button>
              <button 
                onClick={() => setActiveTab('sso')}
                className={['flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors', activeTab === 'sso' ? 'bg-brand-50 text-brand-500 border-l-4 border-brand-500' : 'text-neutral-600 hover:bg-neutral-50 border-l-4 border-transparent'].join(' ')}
              >
                <Shield size={16} />
                Single Sign-On (SSO)
              </button>
              <button 
                onClick={() => setActiveTab('sla')}
                className={['flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors', activeTab === 'sla' ? 'bg-brand-50 text-brand-500 border-l-4 border-brand-500' : 'text-neutral-600 hover:bg-neutral-50 border-l-4 border-transparent'].join(' ')}
              >
                <Bell size={16} />
                SLA & Alerts
              </button>
              <button 
                onClick={() => setActiveTab('api')}
                className={['flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors', activeTab === 'api' ? 'bg-brand-50 text-brand-500 border-l-4 border-brand-500' : 'text-neutral-600 hover:bg-neutral-50 border-l-4 border-transparent'].join(' ')}
              >
                <Key size={16} />
                API & Integrations
              </button>
            </nav>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1">
          {activeTab === 'sso' && (
            <div className="bg-white border border-border-default rounded-card shadow-sm animate-fade-in">
              <div className="px-6 py-5 border-b border-border-default">
                <h2 className="text-lg font-bold text-neutral-900 m-0">Single Sign-On (SSO)</h2>
                <p className="text-sm text-neutral-500 mt-1 m-0">Configure Microsoft Entra ID (Office 365) to allow your employees to log in securely.</p>
              </div>
              <div className="p-6 space-y-6">
                
                <div className="bg-neutral-50 border border-border-default rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      <svg width="24" height="24" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#f3f3f3" d="M0 0h21v21H0z"/><path fill="#f35325" d="M1 1h9v9H1z"/><path fill="#81bc06" d="M11 1h9v9h-9z"/><path fill="#05a6f0" d="M1 11h9v9H1z"/><path fill="#ffba08" d="M11 11h9v9h-9z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900 text-sm">Microsoft Entra ID Connection</h3>
                      <p className="text-sm text-neutral-600 mt-1">Connect your Equiptrack organization to your Microsoft tenant. This enables automatic user provisioning and secure authentication.</p>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Tenant ID</label>
                          <input type="text" defaultValue="a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6" className="w-full px-3 py-2 bg-white border border-border-default rounded-md text-sm font-mono focus:outline-none focus:border-brand-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Client ID (Application ID)</label>
                          <input type="text" defaultValue="x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4" className="w-full px-3 py-2 bg-white border border-border-default rounded-md text-sm font-mono focus:outline-none focus:border-brand-500" />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Client Secret</label>
                        <input type="password" defaultValue="********" className="w-full max-w-md px-3 py-2 bg-white border border-border-default rounded-md text-sm font-mono focus:outline-none focus:border-brand-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="enforce" className="w-4 h-4 text-brand-500 border-border-default rounded focus:ring-brand-500" defaultChecked />
                  <label htmlFor="enforce" className="text-sm font-medium text-neutral-900">Enforce SSO login for all organization members</label>
                </div>

              </div>
              <div className="px-6 py-4 bg-neutral-50 border-t border-border-default flex justify-between items-center rounded-b-card">
                <span className="text-xs text-status-success font-semibold flex items-center gap-1.5">
                  {saved && <><CheckCircle2 size={14} /> Saved successfully</>}
                </span>
                <button onClick={handleSave} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-5 rounded-button text-sm transition-colors shadow-sm flex items-center gap-2">
                  <Save size={16} /> Save Configuration
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="bg-white border border-border-default rounded-card shadow-sm animate-fade-in">
              <div className="px-6 py-5 border-b border-border-default">
                <h2 className="text-lg font-bold text-neutral-900 m-0">SLA & Alerts</h2>
                <p className="text-sm text-neutral-500 mt-1 m-0">Configure target cycle times and escalation rules for your operational workflows.</p>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Overall Target Cycle Time (Hours)</label>
                  <input type="number" defaultValue="72" className="w-32 px-3 py-2 bg-white border border-border-default rounded-md text-sm focus:outline-none focus:border-brand-500" />
                  <p className="text-xs text-neutral-500 mt-1">Total time from Request Submission to Shipped status.</p>
                </div>

                <div className="h-px bg-border-default my-2" />

                <h3 className="font-bold text-neutral-900 text-sm">Department-Level SLA Targets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { dept: 'Warehouse (Processing to GI)', hours: 24 },
                    { dept: 'Dispatch (Queue to Preload)', hours: 12 },
                    { dept: 'QAQC (Preload to Post QAQC)', hours: 8 },
                    { dept: 'Final (Waybill to Shipped)', hours: 24 },
                  ].map(sla => (
                    <div key={sla.dept} className="bg-neutral-50 border border-border-default rounded-lg p-4 flex justify-between items-center">
                      <span className="text-sm font-semibold text-neutral-700">{sla.dept}</span>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={sla.hours} className="w-16 px-2 py-1 text-center bg-white border border-border-default rounded text-sm font-mono focus:outline-none focus:border-brand-500" />
                        <span className="text-xs text-neutral-500 font-bold">hrs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 bg-neutral-50 border-t border-border-default flex justify-end rounded-b-card">
                <button onClick={handleSave} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-5 rounded-button text-sm transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-white border border-border-default rounded-card shadow-sm animate-fade-in">
              <div className="px-6 py-5 border-b border-border-default flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 m-0">API & Integrations</h2>
                  <p className="text-sm text-neutral-500 mt-1 m-0">Manage API keys for integrating Equiptrack with internal ERP/SAP systems.</p>
                </div>
                <button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold py-2 px-4 rounded-button text-sm transition-colors border border-border-default shadow-sm">
                  Generate New Key
                </button>
              </div>
              <div className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-border-default">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Key Name</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Token Preview</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Used</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-semibold text-neutral-900">SAP Data Sync</td>
                      <td className="px-6 py-4 text-neutral-500 font-mono text-xs flex items-center gap-2">
                        eq_prod_8f92...a1b2
                        <button className="text-neutral-400 hover:text-brand-500"><Copy size={14} /></button>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 text-xs">Today, 14:32</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-status-critical font-semibold text-xs hover:text-red-700">Revoke</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-semibold text-neutral-900">Custom PowerBI Dashboard</td>
                      <td className="px-6 py-4 text-neutral-500 font-mono text-xs flex items-center gap-2">
                        eq_prod_3c44...d5e6
                        <button className="text-neutral-400 hover:text-brand-500"><Copy size={14} /></button>
                      </td>
                      <td className="px-6 py-4 text-neutral-500 text-xs">Oct 12, 2023</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-status-critical font-semibold text-xs hover:text-red-700">Revoke</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="bg-white border border-border-default rounded-card shadow-sm animate-fade-in p-12 text-center">
              <Building2 size={48} className="mx-auto text-neutral-300 mb-4" />
              <h3 className="text-lg font-bold text-neutral-900">General Profile</h3>
              <p className="text-sm text-neutral-500 max-w-md mx-auto mt-2">Update your company name, billing details, and branding. Contact your Sysadmin to process tier upgrades.</p>
              <button className="mt-6 border border-border-default bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-2 px-5 rounded-button text-sm transition-colors shadow-sm">
                Edit Profile
              </button>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}
