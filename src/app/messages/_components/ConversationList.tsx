'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import type { Conversation } from './types'
import { Avatar } from '@/components/ui/Avatar'

interface Props {
  conversations: Conversation[]
  selectedId: string | null
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelect: (id: string) => void
}

function fmtTime(iso: string) {
  const d   = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60)    return `${diffMins}m ago`
  if (diffMins < 1440)  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const days = Math.floor(diffMins / 1440)
  if (days === 1)        return 'Yesterday'
  if (days < 7)         return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function ConversationList({ conversations, selectedId, searchQuery, onSearchChange, onSelect }: Props) {
  const filtered = conversations.filter(c =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border-default">
        <div className="flex items-center gap-2 bg-gray-50 border border-border-default rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search name, chat, etc"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Conversation items */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(conv => {
          const isActive = conv.id === selectedId
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={[
                'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                isActive ? 'bg-red-50 border-l-2 border-brand-500' : 'hover:bg-gray-50 border-l-2 border-transparent',
              ].join(' ')}
            >
              <div className="shrink-0 relative">
                <Avatar name={conv.participantName} size={40} />
                {conv.type === 'system' && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-400 border-2 border-white rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-bold text-gray-900 truncate">{conv.participantName}</span>
                  <span className={`text-[11px] shrink-0 ${conv.unreadCount > 0 ? 'text-brand-500 font-semibold' : 'text-gray-400'}`}>
                    {fmtTime(conv.lastTimestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-[12px] text-gray-500 truncate">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px] text-gray-400">No conversations found.</div>
        )}
      </div>
    </div>
  )
}
