'use client'

import { X, ExternalLink, FileText, Image } from 'lucide-react'
import type { Conversation } from './types'
import { Avatar } from '@/components/ui/Avatar'

interface Props {
  conversation: Conversation
  onClose: () => void
}

const DEPT_BADGE: Record<string, { label: string; cls: string }> = {
  warehouse:  { label: 'Warehouse',  cls: 'bg-green-100 text-green-700'  },
  dispatch:   { label: 'Dispatch',   cls: 'bg-purple-100 text-purple-700' },
  qaqc:       { label: 'QAQC',       cls: 'bg-amber-100 text-amber-700'  },
  contractor: { label: 'Contractor', cls: 'bg-gray-100 text-gray-600'    },
  system:     { label: 'System',     cls: 'bg-gray-100 text-gray-600'    },
  exec:       { label: 'Executive',  cls: 'bg-red-100 text-red-700'      },
}

export function ContactProfile({ conversation, onClose }: Props) {
  const dept    = DEPT_BADGE[conversation.participantDept ?? 'system']
  const msgCount = conversation.messages.length
  const docs    = conversation.messages.filter(m => m.attachments && m.attachments.some(a => a.type === 'pdf' || a.type === 'doc')).flatMap(m => m.attachments ?? []).filter(a => a.type === 'pdf' || a.type === 'doc')
  const imgs    = conversation.messages.filter(m => m.attachments && m.attachments.some(a => a.type === 'image')).flatMap(m => m.attachments ?? []).filter(a => a.type === 'image')

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
        <h3 className="text-[14px] font-bold text-gray-800">Profile</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Avatar */}
        <div className="flex flex-col items-center py-7 px-5 border-b border-border-default">
          <Avatar name={conversation.participantName} size={72} />
          <h4 className="text-[15px] font-bold text-gray-900 mt-3">{conversation.participantName}</h4>
          {dept && (
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${dept.cls}`}>
              {dept.label}
            </span>
          )}
          <p className="text-[12px] text-gray-400 mt-1">{conversation.participantRole}</p>
        </div>

        {/* About */}
        <div className="px-5 py-4 border-b border-border-default">
          <h5 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">About</h5>
          <p className="text-[12px] text-gray-600 leading-relaxed">
            {conversation.type === 'contractor'
              ? 'CCU contractor supplying containers to TotalEnergies operations. All requests, responses, and billing are tracked in this thread.'
              : conversation.type === 'system'
              ? 'Automated system notifications for SLA breaches, order updates, and assignment alerts.'
              : `${conversation.participantRole} — part of the EquipTrack operations team. ${msgCount} message${msgCount !== 1 ? 's' : ''} in this thread.`
            }
          </p>
        </div>

        {/* Linked Records */}
        {(conversation.linkedOrderId || conversation.linkedRequestId) && (
          <div className="px-5 py-4 border-b border-border-default">
            <h5 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Linked Records</h5>
            <div className="space-y-2">
              {conversation.linkedOrderId && (
                <a href="/dispatch" className="flex items-center justify-between p-2.5 rounded-lg border border-border-default hover:border-brand-500 hover:bg-red-50 transition-colors group">
                  <div>
                    <p className="text-[12px] font-bold font-mono text-brand-500">{conversation.linkedOrderId}</p>
                    <p className="text-[11px] text-gray-400">Work Order</p>
                  </div>
                  <ExternalLink size={13} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                </a>
              )}
              {conversation.linkedRequestId && (
                <a href="/qaqc/ccu-requests" className="flex items-center justify-between p-2.5 rounded-lg border border-border-default hover:border-amber-500 hover:bg-amber-50 transition-colors group">
                  <div>
                    <p className="text-[12px] font-bold font-mono text-amber-700">{conversation.linkedRequestId}</p>
                    <p className="text-[11px] text-gray-400">CCU Request</p>
                  </div>
                  <ExternalLink size={13} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Media */}
        <div className="px-5 py-4 border-b border-border-default">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Media</h5>
            <div className="flex gap-1">
              {(['Image', 'Video', 'Audio'] as const).map((t, i) => (
                <button key={t} className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                  i === 0 ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100'
                }`}>
                  {t} {i === 0 ? `(${imgs.length})` : '(0)'}
                </button>
              ))}
            </div>
          </div>
          {imgs.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {imgs.map((img, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image size={20} className="text-gray-300" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-gray-400">No media shared yet.</p>
          )}
        </div>

        {/* Documents */}
        <div className="px-5 py-4 border-b border-border-default">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Documents</h5>
            {docs.length > 0 && <button className="text-[11px] text-brand-500 hover:underline">Show All</button>}
          </div>
          {docs.length > 0 ? (
            <div className="space-y-2">
              {docs.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-border-default">
                  <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                    <FileText size={14} className="text-brand-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-gray-800 truncate">{doc.name}</p>
                    <p className="text-[10px] text-gray-400">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-gray-400">No documents shared yet.</p>
          )}
        </div>

        {/* Links */}
        <div className="px-5 py-4">
          <h5 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">Quick Links</h5>
          <div className="space-y-2">
            {conversation.type === 'contractor' && (
              <>
                <a href="/qaqc/ccu-invoicing" className="flex items-center gap-2 text-[12px] text-brand-500 hover:underline">
                  <ExternalLink size={12} />
                  View Invoicing
                </a>
                <a href="/qaqc/ccu-requests" className="flex items-center gap-2 text-[12px] text-brand-500 hover:underline">
                  <ExternalLink size={12} />
                  View Requests
                </a>
              </>
            )}
            {conversation.type !== 'contractor' && conversation.type !== 'system' && (
              <a href="/warehouse/personnel" className="flex items-center gap-2 text-[12px] text-brand-500 hover:underline">
                <ExternalLink size={12} />
                View Personnel Load
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
