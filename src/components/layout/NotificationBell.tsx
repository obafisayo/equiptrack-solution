'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, X, AlertTriangle, MessageSquare, Package, CheckCircle, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { MOCK_NOTIFICATIONS, type AppNotification } from '@/app/messages/_components/types'

const TYPE_ICON: Record<AppNotification['type'], React.ElementType> = {
  sla_breach:           AlertTriangle,
  new_message:          MessageSquare,
  contractor_response:  Package,
  order_update:         Package,
  assignment:           CheckCircle,
  system:               Bell,
}

const TYPE_COLOR: Record<AppNotification['type'], string> = {
  sla_breach:           'text-red-600 bg-red-50',
  new_message:          'text-brand-500 bg-red-50',
  contractor_response:  'text-amber-700 bg-amber-50',
  order_update:         'text-green-700 bg-green-50',
  assignment:           'text-purple-700 bg-purple-50',
  system:               'text-gray-600 bg-gray-100',
}

function relTime(iso: string) {
  const diffMs = new Date().getTime() - new Date(iso).getTime()
  const m = Math.floor(diffMs / 60000)
  if (m < 60)    return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)   return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS)
  const [open, setOpen]                   = useState(false)
  const ref                               = useRef<HTMLDivElement>(null)

  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function markAll() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function dismiss(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-brand-500 text-white text-[9px] font-bold px-0.5 border-2 border-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-white border border-border-default rounded-xl shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-gray-900">Notifications</h3>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full">{unread}</span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAll} className="text-[11px] text-brand-500 font-semibold hover:underline">
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-border-default">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-[13px] text-gray-400">All caught up.</div>
            ) : (
              notifications.map(n => {
                const Icon    = TYPE_ICON[n.type]
                const colors  = TYPE_COLOR[n.type]
                const content = (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 transition-colors ${n.read ? 'bg-white' : 'bg-red-50/40'} hover:bg-gray-50`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colors}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] font-bold text-gray-900">{n.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {n.emailSent     && <span title="Email sent"><Mail size={10} className="text-gray-300" /></span>}
                          {n.whatsappSent  && <span title="WhatsApp sent"><MessageCircle size={10} className="text-green-400" /></span>}
                          <span className="text-[10px] text-gray-400">{relTime(n.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                      {!n.read && <span className="inline-block mt-1 w-1.5 h-1.5 rounded-full bg-brand-500" />}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); e.preventDefault(); dismiss(n.id) }}
                      className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-0.5"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )

                return n.href ? (
                  <Link key={n.id} href={n.href} onClick={() => {
                    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
                    setOpen(false)
                  }} className="block no-underline">
                    {content}
                  </Link>
                ) : <div key={n.id}>{content}</div>
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border-default flex items-center justify-between">
            <Link
              href="/messages"
              onClick={() => setOpen(false)}
              className="text-[12px] font-semibold text-brand-500 hover:underline no-underline"
            >
              View all messages
            </Link>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span className="flex items-center gap-1"><Mail size={10} /> Email: On</span>
              <span className="flex items-center gap-1"><MessageCircle size={10} className="text-green-400" /> WhatsApp: On</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
