'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Shield, Key, Building2, Bell, CheckCircle2, Copy, Save } from 'lucide-react'
import { Input, Select, Textarea } from '@/components/ui/Form'

export default function OrgSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'sso' | 'sla' | 'api'>('general')
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
                          <Input type="text" defaultValue="a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6" size="sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Client ID (Application ID)</label>
                          <Input type="text" defaultValue="x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4" size="sm" />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Client Secret</label>
                        <Input type="password" defaultValue="********" size="sm" className="max-w-md" />
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
                  <Input type="number" defaultValue="72" size="sm" className="w-32" />
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
                        <Input type="number" defaultValue={sla.hours} size="sm" className="w-16 text-center" />
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
            <div className="bg-white border border-border-default rounded-card shadow-sm animate-fade-in">
              <div className="px-6 py-5 border-b border-border-default">
                <h2 className="text-lg font-bold text-neutral-900 m-0">Company Profile</h2>
                <p className="text-sm text-neutral-500 mt-1 m-0">Update your organization&apos;s details, contact information, and branding.</p>
              </div>
              <div className="p-6 space-y-6">

                {/* Logo / Identity */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-700 mb-3">Identity &amp; Branding</h3>
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-neutral-100 border border-border-default flex items-center justify-center shrink-0">
                      <Building2 size={28} className="text-neutral-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 mb-1">Company Logo</p>
                      <p className="text-xs text-neutral-500 mb-2">PNG or SVG, recommended 200&times;200px</p>
                      <button type="button" className="text-xs font-semibold text-brand-500 hover:text-brand-600 border border-brand-200 px-3 py-1.5 rounded transition-colors">
                        Upload Logo
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Company Name</label>
                      <Input type="text" defaultValue="Equiptrack Nigeria Ltd." title="Company name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Industry</label>
                      <Select title="Industry">
                        <option>Oil &amp; Gas — Upstream</option>
                        <option>Oil &amp; Gas — Midstream</option>
                        <option>Oil &amp; Gas — Downstream</option>
                        <option>Marine &amp; Offshore</option>
                        <option>Logistics &amp; Supply Chain</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">RC Number</label>
                      <Input type="text" defaultValue="RC-1082344" title="RC number" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Country of Operation</label>
                      <Input type="text" defaultValue="Nigeria" title="Country" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border-default" />

                {/* Contact */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-700 mb-3">Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Primary Contact Name</label>
                      <Input type="text" defaultValue="Chief Adeyemi Johnson" title="Primary contact name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Contact Email</label>
                      <Input type="email" defaultValue="ceo@equiptrack.ng" title="Contact email" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Phone Number</label>
                      <Input type="tel" defaultValue="+234 801 234 5678" title="Phone number" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Website</label>
                      <Input type="url" defaultValue="https://equiptrack.ng" title="Website" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Office Address</label>
                      <Textarea
                        title="Office address"
                        rows={2}
                        defaultValue="Plot 3, Onne Free Trade Zone, Rivers State, Nigeria"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border-default" />

                {/* Operations */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-700 mb-3">Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Primary Yard / Base</label>
                      <Input type="text" defaultValue="Onne Port — Yard A" title="Primary yard" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">Timezone</label>
                      <Select title="Timezone">
                        <option>Africa/Lagos (WAT, UTC+1)</option>
                        <option>UTC</option>
                        <option>Europe/London</option>
                      </Select>
                    </div>
                  </div>
                </div>

              </div>
              <div className="px-6 py-4 bg-neutral-50 border-t border-border-default flex justify-between items-center rounded-b-card">
                <span className="text-xs text-green-600 font-semibold flex items-center gap-1.5">
                  {saved && <><CheckCircle2 size={14} /> Saved successfully</>}
                </span>
                <button type="button" onClick={handleSave} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-5 rounded-button text-sm transition-colors shadow-sm flex items-center gap-2">
                  <Save size={16} /> Save Profile
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  )
}
