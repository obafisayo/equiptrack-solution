'use client'

import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

interface SuccessScreenProps {
  deliveryNumber: string
  isTR: boolean
  onNewRequest: () => void
}

export function SuccessScreen({ deliveryNumber, isTR, onNewRequest }: SuccessScreenProps) {
  return (
    <AppShell
      role="requester"
      currentPath="/requester/new"
      title="Request Submitted"
      breadcrumb={[{ label: 'My Requests', href: '/requester' }, { label: 'Request Submitted' }]}
    >
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-white rounded-card shadow-card border border-border-default p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#10B981" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted</h2>
          <p className="text-sm text-gray-500 mb-6">Your request has been entered into the system and is awaiting processing.</p>

          <div className="bg-page-bg rounded-lg px-5 py-4 mb-6 text-left">
            <div className="text-xs text-gray-500 mb-1">Delivery Number</div>
            <div className="font-mono text-lg font-bold text-brand-500 tracking-wide">{deliveryNumber}</div>
          </div>

          {isTR && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5 text-left">
              <p className="text-xs font-semibold text-blue-700 mb-1">Pending Base Coordinator Approval</p>
              <p className="text-xs text-gray-600">Your TR has been emailed to the Base Coordinator. You will be notified once reviewed.</p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Link href="/requester" className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-button transition-colors">
              View My Requests
            </Link>
            <button
              type="button"
              onClick={onNewRequest}
              className="px-5 py-2.5 border border-border-default text-gray-700 text-sm font-medium rounded-button hover:bg-neutral-50 transition-colors"
            >
              New Request
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
