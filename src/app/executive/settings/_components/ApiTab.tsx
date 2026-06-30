'use client'

import { Copy } from 'lucide-react'

interface ApiKeyRow {
  name: string
  tokenPreview: string
  lastUsed: string
}

const API_KEYS: ApiKeyRow[] = [
  { name: 'SAP Data Sync', tokenPreview: 'eq_prod_8f92...a1b2', lastUsed: 'Today, 14:32' },
  { name: 'Custom PowerBI Dashboard', tokenPreview: 'eq_prod_3c44...d5e6', lastUsed: 'Oct 12, 2023' },
]

export function ApiTab() {
  return (
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
            {API_KEYS.map(key => (
              <tr key={key.name} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-semibold text-neutral-900">{key.name}</td>
                <td className="px-6 py-4 text-neutral-500 font-mono text-xs flex items-center gap-2">
                  {key.tokenPreview}
                  <button className="text-neutral-400 hover:text-brand-500"><Copy size={14} /></button>
                </td>
                <td className="px-6 py-4 text-neutral-500 text-xs">{key.lastUsed}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-status-critical font-semibold text-xs hover:text-red-700">Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
