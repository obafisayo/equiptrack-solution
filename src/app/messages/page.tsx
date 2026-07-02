'use client'

import { useState } from 'react'
import { Plus, ArrowLeft, User } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { ConversationList } from './_components/ConversationList'
import { ChatView } from './_components/ChatView'
import { ContactProfile } from './_components/ContactProfile'
import { MOCK_CONVERSATIONS, type Conversation, type ChatMessage } from './_components/types'
import { useSessionRole } from '@/hooks/useSessionRole'

// Fallback role for direct navigation without a session
const DEFAULT_ROLE = 'exec' as const

export default function MessagesPage() {
  const { role: sessionRole } = useSessionRole()
  const shellRole = sessionRole ?? DEFAULT_ROLE

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [selectedId, setSelectedId]       = useState<string | null>(null)
  const [showProfile, setShowProfile]     = useState(false)
  const [searchQuery, setSearchQuery]     = useState('')

  // Mobile/tablet view state: 'list' | 'chat'
  const [mobileView, setMobileView]       = useState<'list' | 'chat'>('list')

  const selected = conversations.find(c => c.id === selectedId) ?? null

  function handleSelect(id: string) {
    setSelectedId(id)
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c))
    setMobileView('chat')
  }

  function handleSend(conversationId: string, body: string) {
    const newMsg: ChatMessage = {
      id:           `msg-${Date.now()}`,
      conversationId,
      senderId:     'ME',
      senderName:   'You',
      senderRole:   shellRole,
      body,
      timestamp:    new Date().toISOString(),
      status:       'sent',
    }
    setConversations(prev => prev.map(c =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: body, lastTimestamp: newMsg.timestamp }
        : c
    ))
  }

  return (
    <AppShell
      role={shellRole}
      currentPath="/messages"
      title="Messages"
      breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Messages' }]}
    >
      {/*
        Full-height three-column layout that adapts across breakpoints:
        Mobile  (< md): single column, toggle between list and chat
        Tablet  (md-lg): two columns — list (280px) + chat
        Desktop (≥ lg): three columns — list + chat + optional profile
      */}
      <div
        className="flex h-[calc(100vh-64px-40px)] -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 overflow-hidden border-t border-border-default bg-white rounded-b-xl"
      >

        {/* ── Column 1: Conversation list ── */}
        <div className={[
          'w-full md:w-[280px] md:shrink-0 border-r border-border-default flex flex-col',
          // On mobile: hide when viewing a chat
          mobileView === 'chat' ? 'hidden md:flex' : 'flex',
        ].join(' ')}>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-default shrink-0">
            <h2 className="text-[14px] font-bold text-gray-900">Messages</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 text-white text-[12px] font-semibold rounded-lg hover:bg-brand-600 transition-colors">
              <Plus size={13} />
              New
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelect={handleSelect}
            />
          </div>
        </div>

        {/* ── Column 2: Chat view ── */}
        <div className={[
          'flex-1 flex flex-col min-w-0',
          // On mobile: hide when viewing list
          mobileView === 'list' ? 'hidden md:flex' : 'flex',
        ].join(' ')}>
          {selected ? (
            <>
              {/* Mobile back button — appears above the chat header */}
              <div className="flex items-center md:hidden px-4 py-2 border-b border-border-default bg-white shrink-0">
                <button
                  onClick={() => setMobileView('list')}
                  className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                {/* Profile toggle on mobile */}
                <button
                  onClick={() => setShowProfile(p => !p)}
                  className="ml-auto flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <User size={15} />
                  Profile
                </button>
              </div>

              {/* Mobile profile overlay */}
              {showProfile && (
                <div className="absolute inset-0 z-50 bg-white md:hidden overflow-y-auto">
                  <ContactProfile conversation={selected} onClose={() => setShowProfile(false)} />
                </div>
              )}

              <ChatView conversation={selected} onSend={handleSend} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus size={22} className="text-gray-300" />
              </div>
              <p className="text-[13px]">Select a conversation or start a new message</p>
            </div>
          )}
        </div>

        {/* ── Column 3: Profile panel — desktop only via button toggle ── */}
        {selected && (
          <>
            {/* Desktop toggle button */}
            {!showProfile && (
              <button
                onClick={() => setShowProfile(true)}
                className="hidden lg:flex items-center self-start mt-4 mr-0 bg-white border border-border-default border-r-0 rounded-l-lg p-1.5 text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
                title="Show profile"
              >
                <User size={14} />
              </button>
            )}

            {showProfile && (
              <div className="hidden lg:flex w-[256px] shrink-0 border-l border-border-default overflow-y-auto flex-col">
                <ContactProfile conversation={selected} onClose={() => setShowProfile(false)} />
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
