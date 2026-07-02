'use client'

import { useState, useRef, useEffect } from 'react'
import { Paperclip, Send, MoreHorizontal, Mail, MessageSquare } from 'lucide-react'
import type { Conversation, ChatMessage } from './types'
import { Avatar } from '@/components/ui/Avatar'

interface Props {
  conversation: Conversation
  onSend: (conversationId: string, body: string) => void
}

function MessageBubble({ msg, isSelf }: { msg: ChatMessage; isSelf: boolean }) {
  if (msg.isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-amber-50 border border-amber-100 text-amber-800 text-[11px] px-3 py-1.5 rounded-full max-w-[80%] text-center">
          {msg.body}
        </div>
      </div>
    )
  }

  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`flex gap-2 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isSelf && (
        <div className="shrink-0 mt-auto">
          <Avatar name={msg.senderName} size={30} />
        </div>
      )}
      <div className={`flex flex-col gap-0.5 max-w-[65%] ${isSelf ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
          isSelf
            ? 'bg-brand-500 text-white rounded-br-sm'
            : 'bg-white border border-border-default text-gray-800 rounded-bl-sm shadow-sm'
        }`}>
          {msg.body}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400">{time}</span>
          {isSelf && msg.status === 'read' && (
            <span className="text-[10px] text-brand-500">✓✓</span>
          )}
          {isSelf && msg.status === 'delivered' && (
            <span className="text-[10px] text-gray-400">✓✓</span>
          )}
          {isSelf && msg.status === 'sent' && (
            <span className="text-[10px] text-gray-400">✓</span>
          )}
        </div>
      </div>
    </div>
  )
}

function DateDivider({ date }: { date: string }) {
  const d = new Date(date)
  const label = d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-border-default" />
      <span className="text-[11px] text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 h-px bg-border-default" />
    </div>
  )
}

function groupByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = []
  for (const msg of messages) {
    const dateStr = new Date(msg.timestamp).toDateString()
    const last = groups[groups.length - 1]
    if (last && last.date === dateStr) {
      last.messages.push(msg)
    } else {
      groups.push({ date: dateStr, messages: [msg] })
    }
  }
  return groups
}

export function ChatView({ conversation, onSend }: Props) {
  const [input, setInput]   = useState('')
  const [showChannels, setShowChannels] = useState(false)
  const [channels, setChannels]         = useState({ email: false, whatsapp: false })
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages.length])

  function handleSend() {
    if (!input.trim()) return
    onSend(conversation.id, input.trim())
    setInput('')
  }

  const groups = groupByDate(conversation.messages)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default bg-white">
        <div className="flex items-center gap-3">
          <Avatar name={conversation.participantName} size={36} />
          <div>
            <p className="text-[14px] font-bold text-gray-900">{conversation.participantName}</p>
            <p className="text-[11px] text-gray-400">{conversation.participantRole}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conversation.linkedOrderId && (
            <a href={`/dispatch`} className="text-[11px] font-mono text-brand-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded hover:bg-red-100 transition-colors">
              {conversation.linkedOrderId}
            </a>
          )}
          {conversation.linkedRequestId && (
            <a href={`/qaqc/ccu-requests`} className="text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors">
              {conversation.linkedRequestId}
            </a>
          )}
          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50">
        {groups.map(group => (
          <div key={group.date}>
            <DateDivider date={group.messages[0].timestamp} />
            <div className="space-y-3">
              {group.messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} isSelf={msg.senderId === 'ME'} />
              ))}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Channel indicator */}
      {conversation.type === 'contractor' && (
        <div className="px-5 py-2 bg-amber-50 border-t border-amber-100 flex items-center gap-3">
          <span className="text-[11px] text-amber-700 font-semibold">Delivery channels:</span>
          <button
            onClick={() => setChannels(c => ({ ...c, email: !c.email }))}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
              channels.email ? 'bg-brand-500 text-white border-brand-500' : 'border-amber-300 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Mail size={11} />
            Email
          </button>
          <button
            onClick={() => setChannels(c => ({ ...c, whatsapp: !c.whatsapp }))}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
              channels.whatsapp ? 'bg-green-600 text-white border-green-600' : 'border-amber-300 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <MessageSquare size={11} />
            WhatsApp
          </button>
          {(channels.email || channels.whatsapp) && (
            <span className="text-[10px] text-amber-600 italic">Message will also be sent via selected channel(s)</span>
          )}
        </div>
      )}

      {/* Input */}
      {conversation.type !== 'system' && (
        <div className="px-4 py-3 border-t border-border-default bg-white flex items-end gap-3">
          <button className="text-gray-400 hover:text-gray-600 p-1.5 shrink-0 transition-colors">
            <Paperclip size={18} />
          </button>
          <div className="flex-1 bg-gray-50 border border-border-default rounded-xl px-4 py-2.5">
            <textarea
              rows={1}
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              className="w-full bg-transparent text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none resize-none max-h-28 overflow-y-auto"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 w-9 h-9 flex items-center justify-center bg-brand-500 text-white rounded-full hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
