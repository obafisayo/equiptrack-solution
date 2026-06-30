'use client'

import { CheckCircle2, Save, Building2 } from 'lucide-react'
import { Input, Select, Textarea } from '@/components/ui/Form'

interface GeneralTabProps {
  saved: boolean
  onSave: () => void
}

export function GeneralTab({ saved, onSave }: GeneralTabProps) {
  return (
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
                <option>Oil &amp; Gas - Upstream</option>
                <option>Oil &amp; Gas - Midstream</option>
                <option>Oil &amp; Gas - Downstream</option>
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
              <Input type="text" defaultValue="Onne Port - Yard A" title="Primary yard" />
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
        <button type="button" onClick={onSave} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-5 rounded-button text-sm transition-colors shadow-sm flex items-center gap-2">
          <Save size={16} /> Save Profile
        </button>
      </div>
    </div>
  )
}
